<link rel="stylesheet" href="https://cdn.digital.arizona.edu/lib/arizona-bootstrap/2.0.27/css/arizona-bootstrap.min.css" crossorigin="anonymous"></link>

document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const userInput = document.getElementById('user-input').value;
    const chatMessages = document.getElementById('chat-messages');

    // Add user message to the chat
    chatMessages.innerHTML += `<div>You: ${userInput}</div>`;

    // Fetch the knowledge base JSON files from the new endpoints
    Promise.all([
        fetch('/knowledge_base/faq').then(response => {
            if (!response.ok) {
                throw new Error('Failed to load FAQ data');
            }
            return response.json();
        }),
        fetch('/knowledge_base/course_catalog')
            .then(response => response.json())
            .then(courses => {
                if (Array.isArray(courses)) {  // Check if the response is an array
                    courses.forEach(course => {
                        // Process each course here
                        console.log(course.title);  // Example: log the course title
                    });
                } else {
                    console.error('Expected courses to be an array, but got:', courses);
                }
            })
            .catch(error => {
                console.error('Error fetching knowledge base:', error);
            }),
        fetch('/knowledge_base/program_info').then(response => {
            if (!response.ok) {
                throw new Error('Failed to load program info');
            }
            return response.json();
        })
    ])    
    .then(data => {
        const faqs = data[0].faqs; // Access the faqs array directly
        const courseCatalog = data[1].courses; // Adjust based on your actual JSON structure
        const programInfo = data[2].programs; // Adjust based on your actual JSON structure
    
        const answer = getAnswer(userInput, faqs, courseCatalog, programInfo);
        if (answer) {
            chatMessages.innerHTML += `<div>ChatCat: ${answer}</div>`;
        } else {
            chatMessages.innerHTML += `<div>ChatCat: Sorry, I couldn't find an answer!</div>`;
        }
    })
    .catch(error => {
        console.error('Error fetching knowledge base:', error);
        chatMessages.innerHTML += `<div>ChatCat: Sorry, something went wrong!</div>`;
    });

    // Clear the input
    document.getElementById('user-input').value = '';
});

// Function to find the answer based on the user input
function getAnswer(userInput, faqs, courseCatalog, programInfo) {
    const normalizedInput = userInput.toLowerCase();

    // Check FAQs
    for (const faq of faqs) {
        if (normalizedInput.includes(faq.question.toLowerCase())) {
            return faq.answer;
        }
    }

    // Check Course Catalog
    for (const course of courseCatalog) {
        if (normalizedInput.includes(course.title.toLowerCase())) {
            return course.description; // Adjust based on your course structure
        }
    }

    // Check Program Info
    for (const program of programInfo) {
        if (normalizedInput.includes(program.name.toLowerCase())) {
            return program.details; // Adjust based on your program structure
        }
    }

    return null; // No answer found
}
