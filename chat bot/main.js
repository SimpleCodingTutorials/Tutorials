let enterPressEnabled = true;
async function queryOllama(prompt) {
    let fullResponse = '';

    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "tinyllama",
            prompt: prompt
        });

        if (response.data) {
            const responseData = response.data.split('\n'); // Split the response into chunks
            responseData.forEach(chunk => {
                if (chunk) {
                    const parsedChunk = JSON.parse(chunk);
                    fullResponse += parsedChunk.response;
                    if (parsedChunk.done) {
                        console.log("Full Response:", fullResponse);
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error:", error.message);
        fullResponse = "Sorry, I couldn't understand that.";
    }

    return fullResponse || "Sorry, I couldn't understand that.";
}

function sendQuery() {
    const userInput = document.getElementById("userInput").value;
    document.getElementById("userInput").value ="";

    toggleChat(false);

    if (userInput.toLowerCase() === 'exit') {
        const chatbox = document.getElementById("chatbox");
        chatbox.innerHTML += "<p class='message botMessage'><strong>Chatbot:</strong> Goodbye!</p>";
        document.getElementById("userInput").value = '';
        return;
    }

    const chatbox = document.getElementById("chatbox");
    const userMessage = document.createElement("p");
    userMessage.className = "message userMessage";
    userMessage.innerHTML = `${userInput}` ;
    chatbox.appendChild(userMessage);

    queryOllama(userInput).then(botResponse => {
        const botMessage = document.createElement("p");
        botMessage.className = "message botMessage";
        botMessage.innerHTML = "";
        chatbox.appendChild(botMessage);
        typeWriterEffect(botMessage, botResponse,() => toggleChat(true));
        chatbox.scrollTop = chatbox.scrollHeight;
        document.getElementById("userInput").value = '';
    }).catch(error => {
        console.error("Error handling query:", error);
        const botMessage = document.createElement("p");
        botMessage.className = "message botMessage";
        botMessage.innerHTML = "Sorry, I couldn't understand that.";
        chatbox.appendChild(botMessage);
    });
}

function toggleChat(enable) {
    submitButton.disabled = !enable;
    submitButton.classList.toggle("disabled", !enable);
    enterPressEnabled = enable;
}

function typeWriterEffect(element, text, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 20);
            scrollToBottom();
        } else if (callback) {
            callback(); // Call the callback function if provided
        }
    }
    type();
}

function scrollToBottom() {
    const chatContainer = document.getElementById("chatbox-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && enterPressEnabled) {
        event.preventDefault();
        sendQuery();
        scrollToBottom();
    }
});