import { getBooleanInput, getInput, info, setFailed, setSecret } from '@actions/core';
import { exec, getExecOutput } from '@actions/exec';

const validateBranchName = ({ branchName }) => /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);
const validateDirectoryName = ({ dirName }) => /^[a-zA-Z0-9_\-\/]+$/.test(dirName);

async function run() {
  const baseBranch = getInput('base-branch');
  const targetBranch = getInput('target-branch');
  const ghToken = getInput('gh-token');
  const workingDir = getInput('working-directory');
  const debug = getBooleanInput('debug');

  setSecret(ghToken);

  if (!validateBranchName({ branchName: baseBranch })) {
    setFailed('Invalid base-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots, and forward slashes.');
    return;
  }
  
  if (!validateBranchName({ branchName: targetBranch })) {
    setFailed('Invalid target-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots, and forward slashes.');
    return;
  }

  if (!validateDirectoryName({ dirName: workingDir })) {
    setFailed('Invalid working directory name. Directory names should include only characters, numbers, hyphens, underscores, and forward slashes.');
    return;
  }

  info(`[js-dependency-update] : base branch is ${baseBranch}`);
  info(`[js-dependency-update] : target branch is ${targetBranch}`);
  info(`[js-dependency-update] : working directory is ${workingDir}`);

  await exec('npm update', [], {
    cwd: workingDir
  });

  const gitStatus = await getExecOutput('git status -s package*.json', [], {
    cwd: workingDir
  });

  if (gitStatus.stdout.length > 0) {
    info('[js-dependency-update] : There are updates available!')
  } else {
    info('[js-dependency-update] : No updates at this point in time.')
  }

  /*
  [DONE] 1. Parse inputs:
    1. base-branch from which to check for updates
    2. target-branch to use to create the PR
    3. Github Token for authentication purposes (to create PRs)
    4. Working directory for which to check for dependencies
  [DONE] 2. Execute npm update command within the working directory
  [DONE] 3. Check whether there are modified package*.json files
  4. If there are modified files
    1. Add and commit files to the target-branch
    2. Create a PR to the base-branch using the octokit API
  5. Otherwise, conclude the custom action
  */
  info('I am a custom JS action');
}
 
run();