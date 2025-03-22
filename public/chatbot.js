async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const message = userInput.value.trim();

    if (message === "") return;

    // Add User Message to Chat UI
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerText = message;
    chatBox.appendChild(userMessage);

    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Send message to Python backend
    try {
        const response = await fetch("http://127.0.0.1:8080/chat", {    
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message }),
        });

        const data = await response.json();
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.innerText = data.reply;
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
    }
}


