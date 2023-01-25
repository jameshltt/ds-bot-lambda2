const axios = require('axios').default;
require('dotenv').config();
const { ask } = require("./ai.js"); //import the "ask" function

exports.handler = async (event) => {
    let answer = async function(event){
        console.log('Event in answer function: ' + JSON.stringify(event));
        const jsonBody = JSON.parse(event.body);
        console.log('json body data: '+JSON.stringify(jsonBody.data.options[0].value));
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
    console.log('Answer from AI: '+response.content)
    const jsonBody = JSON.parse(event.body);
    const token = jsonBody.token;
    const id = process.env.APP_ID;
    console.log('Event body token: '+token);

    if (token && await sendResponse(response, token)) {
        console.log('Responded successfully!');
    } else {
        console.log('Failed to send response!');
    }
    return '200';
};

async function sendResponse(response, interactionToken) {
    const authConfig = {
        headers: {
            'Authorization': `Bot ${process.env.BOT_TOKEN}`
        }
    };

    try {
        const url = `https://discord.com/api/v8/webhooks/1067092957309710366/${interactionToken}`;
        console.log('Discord URL: '+url);
        return (await axios.post(url, response, authConfig)).status == 200;
    } catch (exception) {
        console.log(`There was an error posting a response: ${exception}`);
        return false;
    }
}