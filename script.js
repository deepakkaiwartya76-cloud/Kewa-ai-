const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
        messageDiv.textContent = text;
    } else {
        messageDiv.classList.add('ai-message');
        messageDiv.textContent = text;
    }
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll down
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = userInput.value.trim();
    if (!messageText) return;

    // Display user message
    appendMessage(messageText, 'user');
    userInput.value = '';

    // Temporary loading indicator
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.classList.add('message', 'ai-message');
    loadingDiv.textContent = 'Kewa AI is thinking...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        });

        const data = await response.json();
        
        // Remove loading indicator
        document.getElementById(loadingId).remove();

        if (data.success) {
            appendMessage(data.reply, 'ai');
        } else {
            appendMessage('Error: ' + (data.error || 'Failed to get response'), 'ai');
        }
    } catch (error) {
        document.getElementById(loadingId).remove();
        console.error('Network Error:', error);
        appendMessage('Error: Could not connect to the server.', 'ai');
    }
});
