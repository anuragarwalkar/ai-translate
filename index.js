const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/v1/translate", async (req, res, next) => {
  let text = "";
  const pattern = "/-/";

  if(req.body.json) {
    const rowArray = Object.values(req.body.json);
    text = rowArray.join(pattern)
  }else if(req.body.text) {
    text = req.body.text;
  }

  const data = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Translate the text into ${req.body.language}: ${text}`,
    temperature: 0.3,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  const translated = data.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, "").split(pattern);
  const translatedJson = {};

  let index = 0;
  for (const key in req.body.json) {
    translatedJson[key] = translated[index];
    index++;
  }

  res.json(translatedJson);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
