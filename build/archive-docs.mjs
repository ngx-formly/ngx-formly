import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';

const templatePath = 'demo/src/app/app.component.html';

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function createArchive(cwd, tag, major, branch) {
  const directory = mkdtempSync(join(tmpdir(), 'formly-archive-'));
  const worktree = join(directory, 'checkout');
  git(cwd, 'worktree', 'add', '--detach', worktree, tag);
  try {
    const pkg = JSON.parse(readFileSync(join(worktree, 'package.json'), 'utf8'));
    if (`v${pkg.version}` !== tag || !/^npm@\d+\.\d+\.\d+$/.test(pkg.packageManager)) {
      throw new Error(`Check the version and packageManager in ${tag}/package.json.`);
    }
    const template = readFileSync(join(worktree, templatePath), 'utf8');
    const menu = /<ng-template #version>[\s\S]*?<\/ng-template>/g;
    if ([...template.matchAll(menu)].length !== 1) {
      throw new Error(`Expected one version menu in ${tag}/${templatePath}.`);
    }
    writeFileSync(
      join(worktree, templatePath),
      template.replace(
        menu,
        `<ng-template #version>
  <button mat-button [matMenuTriggerFor]="menu">
    ${branch}
    <mat-icon>arrow_drop_down</mat-icon>
  </button>
  <mat-menu #menu="matMenu" yPosition="below" xPosition="before">
    <a href="https://formly.dev/" mat-menu-item>v${major} (latest)</a>
    <a href="https://${branch}.formly.dev/" disabled mat-menu-item>${branch} (current)</a>
    <a href="https://v${major - 2}.formly.dev/" mat-menu-item>v${major - 2}</a>
    <a href="https://formly.dev/guide/migration" mat-menu-item>Migration guides</a>
  </mat-menu>
</ng-template>`,
      ),
    );
    writeFileSync(
      join(worktree, 'netlify.toml'),
      `[build]
  base = "."
  command = "${pkg.scripts?.['docs:build'] ? 'npm run docs:build' : 'npx ng build app --configuration production'}"
  publish = "demo/dist"

[build.environment]
  NPM_VERSION = "${pkg.packageManager.slice(4)}"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
    );
    git(worktree, 'add', '--', 'netlify.toml', templatePath);
    git(
      worktree,
      '-c',
      'user.name=github-actions[bot]',
      '-c',
      'user.email=41898282+github-actions[bot]@users.noreply.github.com',
      '-c',
      'core.hooksPath=/dev/null',
      'commit',
      '-m',
      `build(demo): archive ${branch} documentation from ${tag}`,
    );
    // An empty lease only permits creating the branch, even if another run races this one.
    const commit = git(worktree, 'rev-parse', 'HEAD');
    git(cwd, 'push', `--force-with-lease=refs/heads/${branch}:`, 'origin', `${commit}:refs/heads/${branch}`);
    return commit;
  } finally {
    git(cwd, 'worktree', 'remove', '--force', worktree);
    rmSync(directory, { recursive: true, force: true });
  }
}

export async function archiveDocs({
  tag,
  cwd = process.cwd(),
  token,
  siteId,
  fetch = globalThis.fetch,
  sleep = setTimeout,
}) {
  const match = /^v([1-9]\d*)\.0\.0$/.exec(tag ?? '');
  if (!match) return null;
  const major = Number(match[1]);
  const branch = `v${major - 1}`;
  if (!token || !siteId) throw new Error('Set NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID before archiving documentation.');

  const previousTag = git(cwd, 'tag', '--merged', tag, '--list', `${branch}.*`, '--sort=-version:refname')
    .split('\n')
    .find((value) => new RegExp(`^${branch}\\.\\d+\\.\\d+$`).test(value));
  if (!previousTag) throw new Error(`No stable ${branch} release tag is reachable from ${tag}.`);

  async function api(path, method = 'GET', body) {
    const response = await fetch(`https://api.netlify.com/api/v1${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`Netlify ${method} ${path} failed with HTTP ${response.status}.`);
    return response.json();
  }

  const sitePath = `/sites/${encodeURIComponent(siteId)}`;
  const site = await api(sitePath);
  const settings = site.build_settings;
  if (
    settings?.repo_path !== 'ngx-formly/ngx-formly' ||
    !settings.repo_branch ||
    settings.repo_branch === branch ||
    settings.stop_builds
  ) {
    throw new Error('Netlify must use the ngx-formly repository with builds enabled and a separate production branch.');
  }
  if (site.branch_deploy_custom_domain !== 'formly.dev') {
    throw new Error('Configure automatic branch deploy subdomains on formly.dev in Netlify Domain management.');
  }
  if (!Array.isArray(settings.allowed_branches)) throw new Error('Netlify returned no branch deploy allowlist.');

  let commit = git(cwd, 'ls-remote', '--heads', 'origin', `refs/heads/${branch}`).split(/\s/)[0];
  if (commit) {
    git(cwd, 'fetch', '--no-tags', 'origin', `refs/heads/${branch}`);
    const pkg = JSON.parse(git(cwd, 'show', `${commit}:package.json`));
    if (`v${pkg.version.split('.')[0]}` !== branch) throw new Error(`${branch} contains the wrong package version.`);
    git(cwd, 'cat-file', '-e', `${commit}:netlify.toml`);
    console.log(`Keeping existing archive ${branch} at ${commit}.`);
  } else {
    commit = createArchive(cwd, previousTag, major, branch);
    console.log(`Created ${branch} from ${previousTag} at ${commit}.`);
  }

  if (!settings.allowed_branches.includes('*') && !settings.allowed_branches.includes(branch)) {
    await api(sitePath, 'PATCH', { repo: { allowed_branches: [...settings.allowed_branches, branch] } });
  }
  // Explicitly start the build; do not depend on a webhook from a GITHUB_TOKEN push.
  const build = await api(`${sitePath}/builds?branch=${branch}`, 'POST');
  if (!build.deploy_id) throw new Error('Netlify did not return a deploy ID for the archive build.');
  const url = `https://${branch}.formly.dev/`;
  for (let attempt = 0; attempt < 90; attempt++) {
    const deploy = await api(`/deploys/${encodeURIComponent(build.deploy_id)}`);
    if (['error', 'failed', 'canceled', 'rejected'].includes(deploy.state)) {
      throw new Error(`Netlify archive deploy ${build.deploy_id} ended with state ${deploy.state}.`);
    }
    if (deploy.state === 'ready') {
      if (deploy.context !== 'branch-deploy' || deploy.branch !== branch || deploy.commit_ref !== commit) {
        throw new Error('Netlify deployed a different branch or commit than the requested archive.');
      }
      const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}.`);
      console.log(`Archive ready: ${url}`);
      return { branch, previousTag, commit, url };
    }
    await sleep(10_000);
  }
  throw new Error(`Timed out waiting for Netlify archive deploy ${build.deploy_id}.`);
}

if (import.meta.main) {
  const archive = await archiveDocs({
    tag: process.env.GITHUB_REF_NAME,
    token: process.env.NETLIFY_AUTH_TOKEN,
    siteId: process.env.NETLIFY_SITE_ID,
  });
  if (archive && process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `Archived ${archive.branch} at [${archive.url}](${archive.url}).\n`,
    );
  }
}
