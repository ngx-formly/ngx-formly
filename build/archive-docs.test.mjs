import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { archiveDocs } from './archive-docs.mjs';

const templatePath = 'demo/src/app/app.component.html';
const template = readFileSync(new URL(`../${templatePath}`, import.meta.url), 'utf8');

function repository(t, { docsBuild = true, html = template } = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'formly-archive-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const cwd = join(directory, 'source');
  const remote = join(directory, 'remote.git');
  mkdirSync(cwd);
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
  git('init', '--initial-branch=main');
  git('config', 'user.name', 'Archive test');
  git('config', 'user.email', 'archive@example.invalid');
  git('config', 'core.hooksPath', '/dev/null');
  git('init', '--bare', remote);
  git('remote', 'add', 'origin', remote);
  mkdirSync(join(cwd, 'demo/src/app'), { recursive: true });
  writeFileSync(join(cwd, templatePath), html);
  writeFileSync(join(cwd, '.node-version'), '24.21.0\n');
  function release(version) {
    writeFileSync(
      join(cwd, 'package.json'),
      JSON.stringify({
        version,
        packageManager: 'npm@11.19.0',
        scripts: docsBuild ? { 'docs:build': 'ng build app' } : {},
      }),
    );
    git('add', '.');
    git('commit', '-m', version);
    git('tag', '-a', `v${version}`, '-m', version);
  }
  release('11.2.0');
  release('11.10.0');
  release('11.11.0-next.0');
  release('12.0.0');
  git('checkout', '-b', 'unrelated', 'v11.10.0');
  release('11.99.0');
  git('checkout', 'main');
  git('push', 'origin', 'main', '--tags');
  return { cwd, git, remoteHead: () => git('ls-remote', '--heads', 'origin', 'refs/heads/v11').split(/\s/)[0] };
}

function netlify(repo, { states = ['building', 'ready'], context = 'branch-deploy', httpStatus = 200 } = {}) {
  const site = {
    branch_deploy_custom_domain: 'formly.dev',
    build_settings: {
      repo_path: 'ngx-formly/ngx-formly',
      repo_branch: 'main',
      allowed_branches: ['next', 'v9', 'v10'],
      cmd: 'existing production command',
    },
  };
  const calls = [];
  const fetch = async (url, options) => {
    calls.push({ url, options });
    if (url === 'https://v11.formly.dev/') {
      assert.equal(options.headers, undefined, 'never send the API token to the public site');
      assert.equal(options.redirect, 'error');
      return new Response('Archive', { status: httpStatus });
    }
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.equal(new URL(url).origin, 'https://api.netlify.com');
    const path = new URL(url).pathname;
    if (path === '/api/v1/sites/test-site') {
      if (options.method === 'PATCH') {
        const body = JSON.parse(options.body);
        assert.deepEqual(body, { repo: { allowed_branches: ['next', 'v9', 'v10', 'v11'] } });
        site.build_settings.allowed_branches = body.repo.allowed_branches;
      }
      return Response.json(site);
    }
    if (path === '/api/v1/sites/test-site/builds') {
      assert.equal(options.method, 'POST');
      assert.equal(new URL(url).search, '?branch=v11');
      assert.ok(repo.remoteHead(), 'push the archive before triggering its build');
      assert.ok(
        site.build_settings.allowed_branches.includes('v11') || site.build_settings.allowed_branches.includes('*'),
      );
      return Response.json({ deploy_id: 'archive-deploy' });
    }
    assert.equal(path, '/api/v1/deploys/archive-deploy');
    return Response.json({
      state: states.length > 1 ? states.shift() : states[0],
      branch: 'v11',
      commit_ref: repo.remoteHead(),
      context,
    });
  };
  return {
    site,
    calls,
    options: { tag: 'v12.0.0', cwd: repo.cwd, token: 'test-token', siteId: 'test-site', fetch, sleep: async () => {} },
  };
}

test('archives the highest reachable stable tag, preserving release files and Netlify settings', async (t) => {
  const repo = repository(t);
  const service = netlify(repo);
  const head = repo.git('rev-parse', 'HEAD');
  writeFileSync(join(repo.cwd, 'local.txt'), 'Keep local work');
  const result = await archiveDocs(service.options);
  assert.equal(result.previousTag, 'v11.10.0');
  assert.equal(result.commit, repo.remoteHead());
  assert.equal(repo.git('rev-parse', `${result.commit}^`), repo.git('rev-parse', 'v11.10.0^{commit}'));
  assert.equal(repo.git('diff', '--name-only', 'v11.10.0', result.commit), `${templatePath}\nnetlify.toml`);
  const html = repo.git('show', `${result.commit}:${templatePath}`);
  const menu = html.slice(html.indexOf('<ng-template #version>'));
  assert.match(menu, /v12 \(latest\)[\s\S]*v11 \(current\)[\s\S]*>v10<\/a>[\s\S]*Migration guides/);
  assert.match(menu, /href="https:\/\/v11.formly.dev\/" disabled mat-menu-item/);
  assert.match(menu, /href="https:\/\/formly.dev\/guide\/migration"/);
  assert.match(repo.git('show', `${result.commit}:netlify.toml`), /command = "npm run docs:build"/);
  assert.match(repo.git('show', `${result.commit}:netlify.toml`), /NPM_VERSION = "11.19.0"/);
  assert.match(repo.git('show', `${result.commit}:netlify.toml`), /to = "\/index.html"\n  status = 200/);
  assert.equal(repo.git('rev-parse', 'HEAD'), head);
  assert.equal(repo.git('status', '--porcelain'), '?? local.txt');
  assert.equal(repo.git('worktree', 'list', '--porcelain').match(/^worktree /gm).length, 1);
  assert.equal(service.site.build_settings.repo_branch, 'main');
  assert.equal(service.site.build_settings.cmd, 'existing production command');

  const second = await archiveDocs(service.options);
  assert.equal(second.commit, result.commit, 'reruns preserve the existing archive commit');
  assert.equal(service.calls.filter(({ options }) => options.method === 'PATCH').length, 1);
});

test('supports older tags without docs:build and keeps all-branch deploy settings', async (t) => {
  const repo = repository(t, { docsBuild: false });
  const service = netlify(repo);
  service.site.build_settings.allowed_branches = ['*'];
  const result = await archiveDocs(service.options);
  assert.match(
    repo.git('show', `${result.commit}:netlify.toml`),
    /command = "npx ng build app --configuration production"/,
  );
  assert.equal(service.calls.filter(({ options }) => options.method === 'PATCH').length, 0);
});

test('minor, patch, prerelease, and malformed tags have no side effects or credential requirement', async () => {
  for (const tag of ['v12.1.0', 'v12.0.1', 'v12.0.0-next.0', 'v12.0.0+build', 'v012.0.0', '--all', undefined]) {
    assert.equal(await archiveDocs({ tag, cwd: '/missing' }), null);
  }
  await assert.rejects(archiveDocs({ tag: 'v12.0.0' }), /Set NETLIFY_AUTH_TOKEN/);
});

test('fails before pushing if there is no previous stable release or the menu cannot be updated', async (t) => {
  const repo = repository(t, { html: '<p>No version menu</p>' });
  const service = netlify(repo);
  await assert.rejects(archiveDocs(service.options), /Expected one version menu/);
  assert.equal(repo.remoteHead(), '');
  assert.equal(repo.git('worktree', 'list', '--porcelain').match(/^worktree /gm).length, 1);
  repo.git('tag', '-d', 'v11.2.0', 'v11.10.0');
  await assert.rejects(archiveDocs(service.options), /No stable v11 release tag/);
});

test('rejects unsafe Netlify configuration before changing the remote repository', async (t) => {
  const repo = repository(t);
  for (const override of [
    { repo_path: 'someone/else' },
    { repo_branch: 'v11' },
    { stop_builds: true },
    { allowed_branches: undefined },
  ]) {
    const service = netlify(repo);
    Object.assign(service.site.build_settings, override);
    await assert.rejects(archiveDocs(service.options), /Netlify/);
    assert.equal(repo.remoteHead(), '');
  }
  const service = netlify(repo);
  service.site.branch_deploy_custom_domain = null;
  await assert.rejects(archiveDocs(service.options), /automatic branch deploy subdomains/);
  assert.equal(repo.remoteHead(), '');
});

test('reports API failures without exposing response bodies or credentials', async (t) => {
  const repo = repository(t);
  const service = netlify(repo);
  service.options.fetch = async () => new Response('sensitive response', { status: 401 });
  await assert.rejects(archiveDocs(service.options), (error) => {
    assert.match(error.message, /HTTP 401/);
    assert.doesNotMatch(error.message, /sensitive response|test-token/);
    return true;
  });
  assert.equal(repo.remoteHead(), '');
});

test('a failed deploy can be retried without replacing the archive', async (t) => {
  const repo = repository(t);
  const service = netlify(repo, { states: ['error'] });
  await assert.rejects(archiveDocs(service.options), /ended with state error/);
  const commit = repo.remoteHead();
  const retry = await archiveDocs(netlify(repo).options);
  assert.equal(retry.commit, commit);
});

test('does not report success for production deploys, broken subdomains, or stalled builds', async (t) => {
  const repo = repository(t);
  await assert.rejects(archiveDocs(netlify(repo, { context: 'production' }).options), /different branch or commit/);
  await assert.rejects(archiveDocs(netlify(repo, { httpStatus: 404 }).options), /returned HTTP 404/);
  await assert.rejects(archiveDocs(netlify(repo, { states: ['building'] }).options), /Timed out/);
});

test('refuses to repurpose an existing branch with the wrong library version', async (t) => {
  const repo = repository(t);
  repo.git('push', 'origin', 'HEAD:refs/heads/v11');
  await assert.rejects(archiveDocs(netlify(repo).options), /wrong package version/);
  assert.equal(repo.remoteHead(), repo.git('rev-parse', 'HEAD'));
});
