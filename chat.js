        // DOM elements
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const voiceButton = document.getElementById('voiceButton');
        const voiceFeedback = document.getElementById('voiceFeedback');
        const typingIndicator = document.getElementById('typingIndicator');
        const emptyState = document.getElementById('emptyState');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const newChatBtn = document.getElementById('newChatBtn');
        const chatHistory = document.getElementById('chatHistory');
        const chatHistoryEmpty = document.getElementById('chatHistoryEmpty');

        // Chat data storage
        let currentChatId = null;
        let chatData = {};
        let chatCounter = 0;
        
        // Voice recognition
        let recognition = null;
        let isRecording = false;

        // Initialize
        init();

        function init() {
            setupEventListeners();
            setupVoiceRecognition();
            sendButton.disabled = true;
            updateVoiceButtonState();
        }

        function setupEventListeners() {
            // Auto-resize textarea
            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 200) + 'px';
                sendButton.disabled = !this.value.trim();
            });

            // Send message on Enter (but allow Shift+Enter for new lines)
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Send button click
            sendButton.addEventListener('click', sendMessage);

            // Voice button click
            voiceButton.addEventListener('click', toggleVoiceRecognition);

            // Sidebar toggle for mobile
            sidebarToggle.addEventListener('click', toggleSidebar);
            sidebarOverlay.addEventListener('click', closeSidebar);

            // New chat button
            newChatBtn.addEventListener('click', startNewChat);

            // Chat history items
            chatHistory.addEventListener('click', function(e) {
                const historyItem = e.target.closest('.chat-history-item');
                if (historyItem) {
                    const chatId = historyItem.dataset.chatId;
                    loadChat(chatId);
                }
            });
        }
function showVoiceError() {
    voiceFeedback.textContent = "Voice recognition failed. Please try again.";
    voiceFeedback.classList.add('error', 'show');
    setTimeout(() => voiceFeedback.classList.remove('show', 'error'), 3000);
}

        function setupVoiceRecognition() {
            if ('webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = function() {
                    isRecording = true;
                    voiceButton.classList.add('recording');
                    voiceFeedback.classList.add('show');
                };

                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    messageInput.value = transcript;
                    messageInput.dispatchEvent(new Event('input'));
                };

                recognition.onerror = function(event) {
                    console.error('Speech recognition error:', event.error);
                    showVoiceError();
                };

                recognition.onend = function() {
                    isRecording = false;
                    voiceButton.classList.remove('recording');
                    voiceFeedback.classList.remove('show');
}
            }
        }