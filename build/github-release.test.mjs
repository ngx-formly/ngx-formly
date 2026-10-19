import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { extractReleaseNotes, publishGithubRelease } from './github-release.mjs';

const notes = '### Breaking changes\n\n* Upgrade Angular.\n\n### Features\n\n* Add a feature.';
const changelog = `# Changelog\n\n## [11.0.0](compare) (2026-10-19)\n\n${notes}\n\n### [10.0.1](compare)\n\nOld notes.\n`;

test('extracts only the requested release, preserving every subsection and supporting older patch headings', () => {
  assert.equal(extractReleaseNotes(changelog, '11.0.0'), notes);
  assert.equal(extractReleaseNotes(changelog.replaceAll('\n', '\r\n'), '10.0.1'), 'Old notes.');
});

test('rejects missing, empty, and duplicate entries', () => {
  assert.throws(() => extractReleaseNotes(changelog, '12.0.0'), /exactly one/);
  assert.throws(() => extractReleaseNotes('## [11.0.0](compare)\n\n', '11.0.0'), /empty/);
  assert.throws(() => extractReleaseNotes(changelog + changelog, '11.0.0'), /exactly one/);
});

function fixture(t, { version = '11.0.0', releases = [], tagStatus = 200, listStatus = 200, writeStatus = 200 } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), 'formly-release-test-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ version }));
  writeFileSync(join(cwd, 'CHANGELOG.md'), changelog.replace('11.0.0', version));
  const calls = [];
  const fetch = async (url, options) => {
    assert.equal(new URL(url).origin, 'https://api.github.com');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.equal(options.redirect, 'error');
    const path = new URL(url).pathname.replace('/repos/ngx-formly/ngx-formly', '');
    const body = options.body && JSON.parse(options.body);
    calls.push({ path, method: options.method, body });
    if (path === `/git/ref/tags/v${version}`) {
      return Response.json({ ref: `refs/tags/v${version}` }, { status: tagStatus });
    }
    if (options.method === 'GET' && path === '/releases') {
      const page = Number(new URL(url).searchParams.get('page'));
      return Response.json(releases.slice((page - 1) * 100, page * 100), { status: listStatus });
    }
    assert.ok(['POST', 'PATCH'].includes(options.method), `Unexpected request: ${path}`);
    return Response.json(
      { id: 42, html_url: `https://github.com/ngx-formly/ngx-formly/releases/tag/v${version}`, ...body },
      {
        status: writeStatus,
      },
    );
  };
  return {
    calls,
    options: { cwd, tag: `v${version}`, repository: 'ngx-formly/ngx-formly', token: 'test-token', fetch },
  };
}

test('creates a published release from the changelog only after verifying the existing tag', async (t) => {
  const { options, calls } = fixture(t);
  await publishGithubRelease(options);
  assert.deepEqual(
    calls.map(({ method, path }) => [method, path]),
    [
      ['GET', '/git/ref/tags/v11.0.0'],
      ['GET', '/releases'],
      ['POST', '/releases'],
    ],
  );
  assert.deepEqual(calls.at(-1).body, {
    tag_name: 'v11.0.0',
    name: 'v11.0.0',
    body: notes,
    draft: false,
    prerelease: false,
    make_latest: 'legacy',
  });
});

test('updates an existing release, including drafts, without replacing its title or assets', async (t) => {
  for (const draft of [false, true]) {
    const releases = Array.from({ length: 100 }, (_, id) => ({ id, tag_name: `other-${id}` }));
    releases.push({ id: 123, tag_name: 'v11.0.0', draft, name: 'Custom title', assets: [{ id: 9 }] });
    const { options, calls } = fixture(t, { releases });
    await publishGithubRelease(options);
    assert.deepEqual(calls.at(-1), {
      path: '/releases/123',
      method: 'PATCH',
      body: { body: notes, draft: false, prerelease: false, make_latest: 'legacy' },
    });
    assert.equal(calls.filter(({ method }) => method === 'POST').length, 0);
  }
});

test('marks prerelease versions as prereleases', async (t) => {
  const { options, calls } = fixture(t, { version: '12.0.0-next.0' });
  await publishGithubRelease(options);
  assert.equal(calls.at(-1).body.prerelease, true);
  assert.equal(calls.at(-1).body.make_latest, 'false');
});

test('rejects mismatched tags, missing notes, and missing authentication before making requests', async (t) => {
  const { options, calls } = fixture(t);
  await assert.rejects(publishGithubRelease({ ...options, tag: 'v12.0.0' }), /package.json/);
  await assert.rejects(publishGithubRelease({ ...options, token: '' }), /token/);
  writeFileSync(join(options.cwd, 'CHANGELOG.md'), '# Changelog\n');
  await assert.rejects(publishGithubRelease(options), /exactly one/);
  assert.equal(calls.length, 0);
});

test('fails on missing tags and API errors instead of silently succeeding or creating a duplicate', async (t) => {
  for (const failure of [{ tagStatus: 404 }, { listStatus: 403 }, { writeStatus: 422 }]) {
    const { options, calls } = fixture(t, failure);
    await assert.rejects(publishGithubRelease(options), /GitHub .* failed/);
    assert.equal(calls.filter(({ method }) => method !== 'GET').length, failure.writeStatus ? 1 : 0);
  }
});
