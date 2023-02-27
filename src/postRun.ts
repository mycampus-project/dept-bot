import axios from 'axios';
import * as core from '@actions/core'



export const postRun = async (result: string, message: string) => {
    const apiUrl = core.getInput("API_URL");
    const res = await axios.post(apiUrl + '/repo/run', {
        result: result,
        message: message
    });
    return res;
}