import axios from 'axios';


export const registerRepo = async (owner: string, repo: string) => {
    const apiUrl = process.env.API_URL;
    const res = await axios.post(apiUrl + '/repo/register', {
        owner: owner,
        repo: repo
    });
    return res;
}