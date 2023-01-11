import * as core from '@actions/core'

export type GetIssuesFunc = (options: {
  owner: string
  repo: string
  state: 'open' | 'closed' | 'all' | undefined
}) => Promise<{data: {title: string; number: number}[]}>

export async function getExistingIssueNumber(
  getIssues: GetIssuesFunc,
  repo: {
    owner: string
    repo: string
  }
): Promise<number | null> {
  const {data: issues} = await getIssues({
    ...repo,
    state: 'open'
  })

  const iss = issues
    .filter(i => i.title === core.getInput('issue_title'))
    .shift()

  return iss === undefined ? null : iss.number
}