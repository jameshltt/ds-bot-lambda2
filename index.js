const axios = require('axios').default;
require('dotenv').config();
const { ask } = require("./ai.js"); //import the "ask" function

exports.handler = async (event) => {
    let answer = async function(event){
        const jsonBody = JSON.parse(event.body);
        var question = JSON.stringify(jsonBody.data.options[0].value);
        var resp = await ask(question);
        return resp;
    }

    const response = {
        tts: false,
        content: await answer(event),
        embeds: [],
        allowed_mentions: [],
    };

    const jsonBody = JSON.parse(event.body);
    const token = jsonBody.token;
    const id = process.env.APP_ID;
    console.log('Event body token: '+token);

    if (token && await sendResponse(response, token, id)) {
        console.log('Responded successfully!');
    } else {
        console.log('Failed to send response!');
    }
    return '200';
};

async function sendResponse(response, interactionToken, id) {
    const authConfig = {
        headers: {
            'Authorization': `Bot ${process.env.BOT_TOKEN}`
        }
    };

    try {
        const url = `https://discord.com/api/v8/webhooks/${id}/${interactionToken}`;
        return (await axios.post(url, response, authConfig)).status == 200;
    } catch (exception) {
        console.log(`There was an error posting a response: ${exception}`);
        return false;
    }
}