import { Octokit } from '@octokit/action';
const { createPullRequest } = require("octokit-plugin-create-pull-request");

export async function pullRequest() {

    const mOctokit = Octokit.plugin(createPullRequest);
    const octokit = new mOctokit();
    octokit
        .createPullRequest({
            owner: "mycampus-project",
            repo: "mycampus-main-news",
            title: "Update dependencies",
            body: "Updated dependencies",
            head: "depts",
            //base: "main" /* optional: defaults to default branch */,
            update: true /* optional: set to `true` to enable updating existing pull requests */,
            forceFork: false /* optional: force creating fork even when user has write rights */,
            changes: [
                {
                    /* optional: if `files` is not passed, an empty commit is created instead */
                    files: {
                        "package.json": ({exists, encoding, content}:
                             {exists: any, encoding: any, content: any}) => {
                            if(exists){}
                            return Buffer.from(content, 'base64').toString('utf-8')
                        },
                        "package-lock.json": ({exists, encoding, content}:
                            {exists: any, encoding: any, content: any}) => {
                           if(exists){}
                           return Buffer.from(content, 'base64').toString('utf-8')
                       },
                        /*
                        "path/to/file2.png": {
                          content: "_base64_encoded_content_",
                          encoding: "base64",
                        },
                        // deletes file if it exists,
                        "path/to/file3.txt": null,
                        // updates file based on current content
                        "path/to/file4.txt": ({ exists, encoding, content }) => {
                          // do not create the file if it does not exist
                          if (!exists) return null;
              
                          return Buffer.from(content, encoding)
                            .toString("utf-8")
                            .toUpperCase();
                        },
                        "path/to/file5.sh": {
                          content: "echo Hello World",
                          encoding: "utf-8",
                          // one of the modes supported by the git tree object
                          // https://developer.github.com/v3/git/trees/#tree-object
                          mode: "100755",
                        },
                        */
                    },
                    commit:
                        "update dependencies",
                    /* optional: if not passed, will be the authenticated user and the current date */
                    author: {
                        name: "dept-bot",
                        email: "none@nokia.com",
                        date: new Date().toISOString(), // must be ISO date string
                    },
                    /*
                    //optional: if not passed, will use the information set in author 
                    committer: {
                      name: "Committer LastName",
                      email: "Committer.LastName@acme.com",
                      date: new Date().toISOString(), // must be ISO date string
                    },
                    */
                },
            ],
        })
        .then((pr: any) => console.log(pr.data.number));

}