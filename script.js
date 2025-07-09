document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatContainer = document.getElementById('chat-container');
    const closeChatBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    const webhookUrl = 'https://primary-production-9e0f.up.railway.app/webhook/481ea581-172f-47f2-943f-44f75ab0f979/chat';
    let sessionId = sessionStorage.getItem('chatSessionId') || `session_${Date.now()}`;
    sessionStorage.setItem('chatSessionId', sessionId);

    chatToggleBtn.addEventListener('click', () => {
        toggleChat(true);
    });

    closeChatBtn.addEventListener('click', () => {
        toggleChat(false);
    });

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function toggleChat(show) {
        if (show) {
            chatContainer.style.display = 'flex';
            chatToggleBtn.style.display = 'none';
            addMessage('bot', "Hello! How can I help you today?");
        } else {
            chatContainer.style.display = 'none';
            chatToggleBtn.style.display = 'flex';
        }
    }

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        addMessage('user', messageText);
        chatInput.value = '';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: messageText,
                    sessionId: sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data && data.text) {
                addMessage('bot', data.text);
            } else {
                addMessage('bot', 'Sorry, I did not understand that.');
            }

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('bot', 'Sorry, something went wrong. Please try again later.');
        }
    }
    
    const featureItems = document.querySelectorAll('.feature-item');

    featureItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close any other open items
            featureItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle the clicked item
            item.classList.toggle('active');
        });
    });
});
