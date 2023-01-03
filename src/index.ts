import * as core from '@actions/core'
import { Octokit } from '@octokit/action';

async function run(): Promise<void> {
 
    try {
      const octokit = new Octokit();
      const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "a/b").split("/");
      const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        title: "Hello World",
      });
      console.log("Issue created: %s", data.html_url);
      core.setOutput('message', 'Hello World!')
    } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
    }
  }
  
  run()