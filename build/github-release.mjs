import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function extractReleaseNotes(changelog, version) {
  const text = changelog.replaceAll('\r\n', '\n');
  const headings = [...text.matchAll(/^#{2,3} \[([^\]]+)\][^\n]*(?:\n|$)/gm)];
  const matches = headings.filter((heading) => heading[1] === version);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one CHANGELOG.md entry for ${version}.`);
  }
  const heading = matches[0];
  const next = headings[headings.indexOf(heading) + 1];
  const notes = text.slice(heading.index + heading[0].length, next?.index).trim();
  if (!notes) {
    throw new Error(`CHANGELOG.md entry for ${version} is empty.`);
  }
  return notes;
}

export async function publishGithubRelease({ tag, repository, token, cwd = process.cwd(), fetch = globalThis.fetch }) {
  const { version } = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  if (tag !== `v${version}`) {
    throw new Error(`Release tag ${tag} does not match package.json version ${version}.`);
  }
  const body = extractReleaseNotes(readFileSync(join(cwd, 'CHANGELOG.md'), 'utf8'), version);
  if (!token || !/^[\w.-]+\/[\w.-]+$/.test(repository ?? '')) {
    throw new Error('A GitHub token and owner/repository are required.');
  }

  async function request(path, method = 'GET', data) {
    const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: data && JSON.stringify(data),
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      throw new Error(`GitHub ${method} ${path} failed (${response.status}).`);
    }
    return response.json();
  }

  // GitHub would create a missing tag when creating a release.
  await request(`/git/ref/tags/${encodeURIComponent(tag)}`);
  let existing;
  for (let page = 1; ; page++) {
    // Listing includes drafts for authenticated users with write access.
    const releases = await request(`/releases?per_page=100&page=${page}`);
    existing = releases.find((release) => release.tag_name === tag);
    if (existing || releases.length < 100) break;
  }
  const prerelease = version.split('+')[0].includes('-');
  const data = { body, draft: false, prerelease, make_latest: prerelease ? 'false' : 'legacy' };
  return existing
    ? request(`/releases/${existing.id}`, 'PATCH', data)
    : request('/releases', 'POST', { tag_name: tag, name: tag, ...data });
}

if (import.meta.main) {
  const release = await publishGithubRelease({
    tag: process.env.GITHUB_REF_NAME,
    repository: process.env.GITHUB_REPOSITORY,
    token: process.env.GITHUB_TOKEN,
  });
  console.log(`Published release notes: ${release.html_url}`);
}
