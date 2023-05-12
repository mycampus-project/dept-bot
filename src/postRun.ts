import axios from 'axios';
import * as core from '@actions/core'



export const postRun = async (result: string, message: string, repo: String, owner: String) => {
    const apiUrl = core.getInput("API_URL");
    const res = await axios.post(apiUrl + '/repo/run', {
        result: result,
        message: message,
        repo: repo,
        owner: owner,
    });
    return res;
}