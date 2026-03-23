const path = require('path');
const { execFileSync } = require('child_process');
const { runCommand } = require('../utils/runCommand');

function getRepoRoot(repoRoot) {
  if (repoRoot) return repoRoot;

  return process.env.AVIEW_REPO_PATH || path.join(__dirname, '..', '..');
}

function getCurrentBranch(repoRoot) {
  const cwd = getRepoRoot(repoRoot);

  try {
    const branch = execFileSync(
      'git',
      ['rev-parse', '--abbrev-ref', 'HEAD'],
      {
        cwd,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
      }
    ).trim();

    if (branch === 'HEAD') {
      const short = execFileSync(
        'git',
        ['rev-parse', '--short', 'HEAD'],
        {
          cwd,
          encoding: 'utf8',
          maxBuffer: 1024 * 1024,
        }
      ).trim();

      return `detached @ ${short}`;
    }

    return branch;
  } catch {
    return 'unknown';
  }
}

async function switchAndPullBranch(branch) {
  const repoPath = getRepoRoot();

  const switchResult = await runCommand('git', ['switch', branch], {
    cwd: repoPath,
  });

  if (switchResult.code !== 0) {
    return {
      ok: false,
      step: 'switch',
      message: 'git switch failed.',
      stdout: switchResult.stdout,
      stderr: switchResult.stderr,
    };
  }

  const pullResult = await runCommand('git', ['pull', '-r'], {
    cwd: repoPath,
  });

  if (pullResult.code !== 0) {
    return {
      ok: false,
      step: 'pull',
      message: 'git pull -r failed.',
      stdout: pullResult.stdout,
      stderr: pullResult.stderr,
    };
  }

  return {
    ok: true,
    message: 'Switch & Pull completed successfully.',
    branch,
    currentBranch: getCurrentBranch(repoPath),
    switch: {
      stdout: switchResult.stdout,
      stderr: switchResult.stderr,
    },
    pull: {
      stdout: pullResult.stdout,
      stderr: pullResult.stderr,
    },
  };
}

module.exports = {
  getRepoRoot,
  getCurrentBranch,
  switchAndPullBranch,
};