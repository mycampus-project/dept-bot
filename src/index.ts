import * as core from '@actions/core'
import { Octokit } from '@octokit/action';
import { Audit } from './audit';
import { Outdated } from './outdated';
import { pullRequest } from './pullRequest';
import { Update } from './update';
import { registerRepo } from './register';
import { postUpdate } from './postUpdate';

async function run(): Promise<void> {
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "a/b").split("/");
  try {

    
    
      postUpdate(owner, repo, "running");

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
          postUpdate(owner, repo, "majors");
          core.setFailed('This repo has outdated packages')
        } else {
          postUpdate(owner, repo, "success");

        }
      }
      catch (e: unknown) {
        if (e instanceof Error) {
          postUpdate(owner, repo, "failed");
          core.setFailed(e.message)
        }
      }
}
run()