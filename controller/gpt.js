const asyncHandler = require('express-async-handler');

exports.gptPostData = asyncHandler(async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Use GPT-4
                messages: [{ role: 'user', content: message }],
            }),
        });

        const data = await response.json();

        // Check if 'choices' exists and has the expected structure
        if (response.ok && data?.choices && data.choices.length > 0) {
            const chatResponse = data.choices[0]?.message?.content || 'No response from GPT-4';
            res.json({ response: chatResponse });
        } else {
            // Handle unexpected or missing data in the response
            console.error('OpenAI API Error: Unexpected response structure', data);
            res.status(500).json({ error: 'Unexpected response from OpenAI', details: data });
        }
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        res.status(500).json({ error: 'Error communicating with OpenAI API', details: error.message });
    }
});