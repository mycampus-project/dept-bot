import * as core from '@actions/core'
import { Octokit } from '@octokit/action';
import { Audit } from './audit';

async function run(): Promise<void> {

  try {

    // run `npm audit`
    const audit = new Audit()
    audit.run('info', 'true', 'true')
    core.info(audit.stdout)
    core.setOutput('npm_audit', audit.stdout)

    if (audit.foundVulnerability()) {
      // vulnerabilities are found

      core.debug('open an issue')

      // remove control characters and create a code block
      const issueBody = audit.strippedStdout()

      const octokit = new Octokit();
      const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "a/b").split("/");
      const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        title: "Vulnerabilities found",
        body: issueBody
      });
      console.log("Issue created: %s", data.html_url);
      core.debug(owner + "/" + repo)
      core.debug(data.html_url);

      core.setFailed('This repo has some vulnerabilities')
    }
  }
  catch (e: unknown) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
  }
}
run()