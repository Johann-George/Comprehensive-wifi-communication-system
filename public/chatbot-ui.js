document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.getElementById('clear-chat');
    
    // Auto-resize the textarea as the user types
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Simple responses for the chatbot
    const botResponses = {
        "hello": "Hello! How can I assist you today?",
        "hi": "Hi there! How can I help you with your project?",
        "how are you": "I'm just a chatbot simulation, but I'm functioning well! How can I assist you with your project?",
        "chatgpt": "This is a ChatGPT-style UI implementation. How do you like it?",
        "features": "This implementation includes a dark theme, expandable text input, and a design inspired by ChatGPT.",
        "help": "I can demonstrate the UI functionality of this ChatGPT-style interface. Try sending messages to see the chat in action.",
        "bye": "Goodbye! Feel free to refresh the page if you want to start a new conversation.",
        "thanks": "You're welcome! Is there anything else you'd like to know about this UI implementation?"
    };
    
    // Default response if no match is found
    const defaultResponse = "I'm a simple demo of a ChatGPT-style interface. This showcases the UI functionality with predefined responses.";
    
    // Function to get bot response
    function getBotResponse(userMessage) {
        const userMessageLower = userMessage.toLowerCase();
        
        for (const key in botResponses) {
            if (userMessageLower.includes(key)) {
                return botResponses[key];
            }
        }
        
        return defaultResponse;
    }
    
    // Function to add a message to the chat
    function addMessage(text, isUser) {
        const messageRow = document.createElement('div');
        messageRow.classList.add('message-row');
        messageRow.classList.add(isUser ? 'user-row' : 'bot-row');
        
        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.classList.add(isUser ? 'user-avatar' : 'bot-avatar');
        avatar.textContent = isUser ? 'U' : 'AI';
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;
        
        messageRow.appendChild(avatar);
        messageRow.appendChild(messageContent);
        chatContainer.appendChild(messageRow);
        
        // Scroll to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Function to handle sending a message
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            
            // Clear input and reset height
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Simulate typing delay
            setTimeout(async () => {
                // Get bot response
                try {
                    const response = await fetch("http://127.0.0.1:8080/chat", {    
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: message }),
                    });
            
                    const data = await response.json();
                    addMessage(data.reply, false);
                } catch (error) {
                    console.error("Error:", error);
                }
            }, 1000);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Clear chat functionality
    clearChatButton.addEventListener('click', function() {
        // Remove all messages except the first greeting
        while (chatContainer.children.length > 1) {
            chatContainer.removeChild(chatContainer.lastChild);
        }
    });
});