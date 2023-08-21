document.addEventListener("DOMContentLoaded", () => {
  const socket = io(); // Connect to Socket.io server

  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const chatArea = document.getElementById("chat-area");

  let username = prompt("Enter your username:");

  if (!username) {
    alert("Username is required to join the chat.");
    return;
  }

  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit("message", { sender: username, text: message });
      messageInput.value = "";
    }
  });

  socket.on("message", message => {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat");

    if (message.sender === username) {
      chatBubble.classList.add("chat-end");
    } else {
      chatBubble.classList.add("chat-start");
    }

    chatBubble.innerHTML = `
      <div class="chat-image avatar">
        <div class="w-10 rounded-full">
          <img src="userimg.png" />
        </div>
      </div>
      <div class="chat-header">
        ${message.sender}
      </div>
      <div class="chat-bubble">${message.text}</div>
    `;
    chatArea.appendChild(chatBubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  });
});
