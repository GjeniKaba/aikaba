import fetch from 'node-fetch';

exports.handler = async function (event) {
    try {
        // Log incoming message
        const { message } = JSON.parse(event.body);
        console.log("Received message:", message);

        // Make API request to OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: message }]
            })
        });

        // Log the response from the OpenAI API
        const data = await response.json();
        console.log("OpenAI API response:", data);

        // Check if response is valid
        if (!data.choices || !data.choices[0]) {
            throw new Error("No valid response from OpenAI.");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ response: data.choices[0].message.content })
        };

    } catch (error) {
        console.error("Error:", error); // Log the error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Fehler bei der AI-Antwort", message: error.message })
        };
    }
};
