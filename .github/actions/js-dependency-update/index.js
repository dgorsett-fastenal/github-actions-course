import { info } from '@actions/core';
 
async function run() {
  /*
  1. Parse inputs:
    1. base-branch from which to check for updates
    2. target-branch to use to create the PR
    3. Github Token for authentication purposes (to create PRs)
    4. Working directory for which to check for dependencies
  2. Execute npm update command within the working directory
  3. Check whether there are modified package*.json files
  4. If there are modified files
    1. Add and commit files to the target-branch
    2. Create a PR to the base-branch using the octokit API
  5. Otherwise, conclude the custom action
  */
  info('I am a custom JS action');
}
 
run();