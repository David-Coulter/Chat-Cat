const knowledgeBase = require('./knowledgeBase');

function processMessage(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();

    // Simple keyword matching
    if (lowerMessage.includes('course') && lowerMessage.includes('list')) {
        return "Here's a list of our core courses: Programming Fundamentals, Data Structures, Algorithms, Database Systems, Software Engineering.";
    } else if (lowerMessage.includes('admission') && lowerMessage.includes('requirements')) {
        return "Admission requirements include a high school diploma, SAT/ACT scores, and a personal statement. Check our website for more details.";
    } else if (lowerMessage.includes('program') && lowerMessage.includes('duration')) {
        return "Our software engineering program typically takes 4 years to complete for full-time students.";
    }

    // Default response
    return "I'm sorry, I don't have information about that. Can you try rephrasing your question?";
}

module.exports = { processMessage };