import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body);
    console.log("Received message:", message);

    // Call OpenAI's chat completion API
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',  // Use the appropriate model
      messages: [{ role: 'user', content: message }],
    });

    console.log("OpenAI API response:", chatCompletion);

    if (!chatCompletion.choices || !chatCompletion.choices[0]) {
      throw new Error("No valid response from OpenAI.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ response: chatCompletion.choices[0].message.content }),
    };
  } catch (error) {
    console.error("Error:", error);  // Log the error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Fehler bei der AI-Antwort", message: error.message }),
    };
  }
};
