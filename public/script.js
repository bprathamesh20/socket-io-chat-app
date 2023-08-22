document.addEventListener("DOMContentLoaded", () => {
  const socket = io(); // Connect to Socket.io server

  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const chatArea = document.getElementById("chat-area");
  const onlineUsersList = document.getElementById("online-users-list");

  let username = prompt("Enter your username:");

  if (!username) {
    alert("Username is required to join the chat.");
    return;
  }

  // Emoji conversion map
  const emojiMap = {
    react: "⚛️",
    woah: "😲",
    hey: "👋",
    lol: "😂",
    like: "🤍",
    congratulations: "🎉",
    // Add more mappings here
  };

  sendButton.addEventListener("click", () => {
    let message = messageInput.value.trim();
    const words = message.split(" ");

    // Convert /commands
    if (words[0].startsWith("/")) {
      const command = words[0].toLowerCase();
      if (command === "/commands") {
        showCommands();
        return;
      } else if (command === "/emojis") {
        showEmojis();
        return;
      }
    }

    // Convert words to emojis using the emojiMap
    words.forEach((word, index) => {
      if (emojiMap[word.toLowerCase()]) {
        words[index] = emojiMap[word.toLowerCase()];
      }
    });

    message = words.join(" ");

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
  socket.on("onlineUsers", users => {
    onlineUsersList.innerHTML = ""; // Clear existing user list

    users.forEach(user => {
      const userItem = document.createElement("li");
      userItem.classList.add("text-gray-400", "hover:text-white", "cursor-pointer");
      userItem.textContent = user;
      onlineUsersList.appendChild(userItem);
    });
  });


  function showCommands() {
    const commandsMessage = `
      Available commands:
      /commands - Show available commands
      /emojis - Show available emojis
    `;
    const systemMessage = { sender: "System", text: commandsMessage };
    appendSystemMessage(systemMessage);
  }

  function showEmojis() {
    const emojiList = Object.keys(emojiMap).join(", ");
    const emojisMessage = `Available emojis: ${emojiList}`;
    const systemMessage = { sender: "System", text: emojisMessage };
    appendSystemMessage(systemMessage);
  }

  function appendSystemMessage(message) {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat", "chat-start");
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
  }
});
