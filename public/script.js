document.addEventListener("DOMContentLoaded", () => {
    const socket = io(); // Connect to Socket.io server
  
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const chatArea = document.getElementById("chat-area");
  
    sendButton.addEventListener("click", () => {
      const message = messageInput.value.trim();
      if (message) {
        socket.emit("message", message);
        messageInput.value = "";
      }
    });
  
    socket.on("message", message => {
      const chatBubble = document.createElement("div");
      chatBubble.classList.add("chat", "chat-start");
      chatBubble.innerHTML = `
        <div class="chat-image avatar">
          <div class="w-10 rounded-full">
            <img src="userimg.png" />
          </div>
        </div>
        <div class="chat-header">
          You
        </div>
        <div class="chat-bubble">${message}</div>
      `;
      chatArea.appendChild(chatBubble);
      chatArea.scrollTop = chatArea.scrollHeight;
    });
  });
  