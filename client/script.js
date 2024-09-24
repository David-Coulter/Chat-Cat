// Selecting DOM elements
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Server URL - replace with your actual server URL when deployed
const SERVER_URL = 'http://localhost:8000';

// Function to add a message to the chat interface
function addMessageToChat(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    
    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send message to server and get response
async function sendMessageToServer(message) {
    try {
        const response = await fetch(`${SERVER_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error processing your request.';
    }
}

// Event listener for form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userMessage = userInput.value.trim();
    if (userMessage) {
        // Add user message to chat
        addMessageToChat(userMessage, true);
        
        // Clear input field
        userInput.value = '';
        
        // Get bot response
        const botResponse = await sendMessageToServer(userMessage);
        
        // Add bot response to chat
        addMessageToChat(botResponse);
    }
});

function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.id = 'typing-indicator';
    typingElement.textContent = 'Bot is typing...';
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

// In the form submit event listener:
showTypingIndicator();
const botResponse = await sendMessageToServer(userMessage);
removeTypingIndicator();
addMessageToChat(botResponse);

// Initial greeting
addMessageToChat('Hello! How can I assist you with information about our software engineering program?');