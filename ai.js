require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
async function ask(prompt) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.8,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const answer = response.data.choices[0].text;
    return answer;
}
//Export the "ask" function
module.exports = {
    ask,
};