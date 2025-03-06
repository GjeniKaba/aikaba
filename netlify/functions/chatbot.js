import fetch from 'node-fetch';

exports.handler = async function (event) {
    try {
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

        // Log the response status code
        console.log("OpenAI API status code:", response.status);

        // Check if response is ok (status 200)
        if (!response.ok) {
            throw new Error(`OpenAI API responded with status ${response.status}`);
        }

        // Log the response body to ensure it's not empty
        const responseBody = await response.text();  // Use text() to capture raw response
        console.log("Raw API response:", responseBody);

        // Check if the response body is valid JSON
        let data = {};
        try {
            data = JSON.parse(responseBody);
        } catch (e) {
            throw new Error("Failed to parse response as JSON");
        }

        console.log("Parsed API response:", data);

        // Check if response data is valid
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