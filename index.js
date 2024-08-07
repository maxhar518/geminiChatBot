const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require('readline')
const prompt = require('prompt-sync')();


// Check if the API key is set
if (!process.env.API_KEY) {
  console.error('API_KEY environment variable is not set.');
  process.exit(1);
}

// Initialize the GoogleGenerativeAI instance with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  try {
    // Retrieve the Gemini 1.5 model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const name = prompt('Enter Any prompt');


    // Define your prompt
    const prompt1 = `${name}`

    // Generate content based on the prompt
    const result = await model.generateContent(prompt1);

    // Await the response and get the text
    const response = await result.response;
    const text = await response.text();  // Ensure you await the text method

    // Output the generated text
    console.log(text);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Execute the run function
run()