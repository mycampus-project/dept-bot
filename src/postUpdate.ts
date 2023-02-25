import axios from 'axios';
import * as core from '@actions/core'



export const postUpdate = async (owner: string, repo: string, status: string) => {
    const apiUrl = core.getInput("API_URL");
    const res = await axios.post(apiUrl + '/repo/update', {
        owner: owner,
        repo: repo,
        status: status
    });
    return res;
}