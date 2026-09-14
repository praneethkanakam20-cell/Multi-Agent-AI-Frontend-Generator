const openai = require("openai");
const groqclient = new openai({
    apiKey : process.env.GROQ_API_KEY,
    baseURL : "https://api.groq.com/openai/v1"
});
module.exports = groqclient; 