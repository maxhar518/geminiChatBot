const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors');

const port = 3002

const app = express()
app.use(express.json())
app.use(bodyparser.json())
app.use(cors());

if (!process.env.API_KEY || process.env.API_KEY.trim() === '') {
  console.error('API_KEY environment variable is not set or is empty.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generte = async (prompt) => {
  try {
    if (!model) {
      throw new Error('Model not available');
    }
    // const prompt = "HTMl stand for?"
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    console.log(response);
    return response  
  } catch (error) {
    console.error('Error occurred:', error);
  }
}
app.post('/api/content', async (req, res) => {
  try {
    const data = req.body.question
    const result = await generte(data)
    res.send({
      "result": result
    })
  } catch (error) {
    res.send('error' + error)
  }
});


app.listen(port, () => {
  console.log(`App is listening at ${port}`);
})