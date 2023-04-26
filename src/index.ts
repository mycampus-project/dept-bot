import * as core from '@actions/core'
import { Octokit } from '@octokit/action';
import { Audit } from './audit';
import { Outdated } from './outdated';
import { pullRequest } from './pullRequest';
import { Update } from './update';
import { registerRepo } from './register';
import { postUpdate } from './postUpdate';
import { postRun } from './postRun';

async function run(): Promise<void> {
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "a/b").split("/");
const pjson = require('../package.json');
let minorsUpdated = 0;
let majorsAvailable = false;
  try {

    
    console.log(pjson);
    console.log(JSON.stringify(pjson));
    core.info("pjson")
    core.info(pjson)
    core.info("stringified")
    core.info(JSON.stringify(pjson))
      postUpdate(owner, repo, "running", JSON.stringify(pjson));

        const update = new Update()
        update.run('true')
        core.info(update.stdout)
        core.setOutput('npm_update', update.stdout)

        if(update.didUpdate()) {
          core.debug('Create a PR')
          await pullRequest();
        }
        // run `npm outdated`
        const outdated = new Outdated()
        outdated.run('true')
        core.info(outdated.stdout)
        core.setOutput('npm_outdated', outdated.stdout)
    
        if (outdated.foundOutdated()) {
          // outdated versions are found
            majorsAvailable = true;
          core.debug('open an issue')
     
          // remove control characters and create a code block
          const issueBody = outdated.strippedStdout()
          
          const octokit = new Octokit();
          const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
            owner,
            repo,
            title: "Manual action required",
            body: issueBody
          });
          
          console.log("Issue created: %s", data.html_url);
          core.debug(owner + "/" + repo)
          core.debug(data.html_url);
          postUpdate(owner, repo, "majors", null);
          postRun("ok", "Updated minor versions, major upgrades available.")
          core.setFailed('This repo has outdated packages')
        } else {
          postUpdate(owner, repo, "success", null);
          postRun("ok", "All dependencies up to date")
        }
      }
      catch (e: unknown) {
        if (e instanceof Error) {
          postUpdate(owner, repo, "failed", null);
          postRun("fail", "Failed to update.")
          core.setFailed(e.message)
        }
      }
}
run()