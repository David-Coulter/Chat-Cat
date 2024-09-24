// script.js
document.getElementById("chat-form").onsubmit = function (e) {
    e.preventDefault();

    let userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    // Display user message in chat
    addMessageToChat("You", userInput);

    // Send query to Flask backend
    fetch('http://127.0.0.1:5000/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        // Display bot response in chat
        addMessageToChat("ChatCat", data.response);
    })
    .catch(error => {
        console.error('Error:', error);
        addMessageToChat("ChatCat", "Sorry, something went wrong!");
    });

    // Clear the input field
    document.getElementById("user-input").value = "";
};

// Function to add messages to chat
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById("chat-messages");

    let messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Differentiate user and bot messages
    if (sender === "You") {
        messageElement.classList.add("user-message");
    } else {
        messageElement.classList.add("bot-message");
    }

    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);

    // Auto scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
