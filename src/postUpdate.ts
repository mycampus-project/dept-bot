import axios from 'axios';
import * as core from '@actions/core'



export const postUpdate = async (owner: string, repo: string, status: string, depts: string | null, outdated: string | null) => {
    const apiUrl = core.getInput("API_URL");
    const res = await axios.post(apiUrl + '/repo/update', {
        owner: owner,
        repo: repo,
        status: status,
        depts: depts,
        outdated: outdated,
    });
    return res;
}