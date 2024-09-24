const express = require('express');
const cors = require('cors');
const chatcat = require('./chatcat');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    const botResponse = chatcat.processMessage(userMessage);
    res.json({ response: botResponse });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));