require('dotenv').config();
const express = require('express');
const axios = require('axios');

// const OpenAI = require("openai");

const {HfInference} = require('@huggingface/inference')


const app = express();
app.use(express.json());


// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const inference = new HfInference(process.env.HF_API_KEY);


app.post('/api/chat', async (req, res) => {
  try {
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     { role: "system", content: "You are a helpful assistant." },
    //     {
    //       role: "user",
    //       content: "Write a haiku about recursion in programming.",
    //     },
    //   ],
    // });
    // res.status(200).json({ message: completion.choices[0].message });

    const out = await inference.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [{ role: "user", content: req.body.query }],
      max_tokens: 512
    });

    res.status(200).json({ message: out.choices[0].message });
    
  } catch (e) {
    console.log({ e });
    res.status(500).json({ error: e.message });
  }

});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 3333}`);
});