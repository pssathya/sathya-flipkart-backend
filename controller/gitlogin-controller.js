import requestInfo from 'request';
import superagent from 'superagent';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../config.js';

export const redirectToGitLogin = async (request, response) => {
    try {
        response.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`);
    } catch (error) {
        response.status(500).json('Error: ', error.message);
    }
}

export const invokeGitOAuth = async (request, response) => {
    try {
        const code = request.query.code;
        if (!code) {
            response.send({
                success: false,
                message: 'Error While Login'
            })
        }

        superagent
            .post('https://github.com/login/oauth/access_token')
            .send({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code
            })
            .set('Accept', 'application/json')
            .end((err, result) => {
                if (err) throw err;
                let access_token = result.body.access_token;
                let option = {
                    uri: 'https://api.github.com/user',
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `token ${access_token}`,
                        'User-Agent': 'mycode'
                    }
                }
                requestInfo(option, (err, response1, body) => {
                    response.send(body)
                })
            })
    } catch (error) {
        response.status(500).json('Error: ', error.message);
    }
}