const express = require('express');
const util = require('node:util')
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chatgpt', async (req, res) => {
  try {
    const modelsData = await axios.get('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            })
    const models = modelsData.data.data
    const modelId = 'gpt-4o'
    const gpt4oExists = models.find(({ id }) => id === modelId)
    if(gpt4oExists){
     const response = await axios.post(
          `https://api.openai.com/v1/chat/completions`,
          {
            model: modelId,
            messages: [{"role": "user", "content": req.body.prompt }],
          },
          {
              headers: {
                  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              },
          }
      );
      res.json({
        message: response.data.choices[0].message.content
      });
    } else {
      res.json({ error: 'gpt-4o model wasnt\'t found.'})
    }
 
  } catch (error) {
      console.error(util.inspect(error, true, 6));
      res.status(500).send('Error querying OpenAI API');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});