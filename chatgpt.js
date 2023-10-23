const { exec } = require("child_process");

// Use exec to run the npm install command
exec("npm install axios --save", (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
const axios = require("axios");

const apiKey = "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"; // Replace with your OpenAI API key
const prompt = "Who is PM of India?"; // Replace with your prompt text

const endpoint = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
};

const data = {
    prompt: prompt,
    max_tokens: 50, // You can adjust this to limit the response length
};

axios
    .post(endpoint, data, { headers })
    .then((response) => {
        console.log("chatgpt response: " + response.data.choices[0].text);
    })
    .catch((error) => {
        if (error.response) {
            console.error("Error:", error.response.data);
        } else if (error.request) {
            console.error("No response received. Check your network connection.");
        } else {
            console.error("Error:", error.message);
        }
    });
