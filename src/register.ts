import axios from 'axios';
import * as core from '@actions/core'



export const registerRepo = async (owner: string, repo: string) => {
    const apiUrl = core.getInput("API_URL");
    const res = await axios.post(apiUrl + '/repo/register', {
        owner: owner,
        repo: repo
    });
    return res;
}