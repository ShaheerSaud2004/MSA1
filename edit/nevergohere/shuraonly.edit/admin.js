// MSA Admin Panel - Demo Chat Interface
class MSAAdminChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.previewPanel = document.getElementById('previewPanel');
        this.previewContent = document.getElementById('previewContent');
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // File upload handling
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // Demo responses
        this.demoResponses = {
            'add event': this.handleAddEvent,
            'add new event': this.handleAddEvent,
            'calendar': this.handleCalendar,
            'show calendar': this.handleCalendar,
            'view calendar': this.handleCalendar,
            'add photos': this.handleAddPhotos,
            'gallery': this.handleGallery,
            'upload poster': this.handleUploadPoster,
            'poster': this.handleUploadPoster,
            'featured': this.handleFeaturedEvents,
            'featured events': this.handleFeaturedEvents
        };
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message after delay
        setTimeout(() => {
            this.hideTypingIndicator();
            this.processMessage(message);
        }, 1500);
    }

    sendQuickMessage(message) {
        this.chatInput.value = message;
        this.sendMessage();
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = text;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        
        content.appendChild(messageText);
        content.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-message';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        content.appendChild(typingIndicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let handled = false;

        // Check for specific commands
        for (const [keyword, handler] of Object.entries(this.demoResponses)) {
            if (lowerMessage.includes(keyword)) {
                handler.call(this, message);
                handled = true;
                break;
            }
        }

        // Default response if no specific handler
        if (!handled) {
            this.addMessage(`
                I understand you want to: "${message}"<br><br>
                <strong>Here's what I can help you with:</strong><br>
                📅 <strong>Calendar Events:</strong> "Add event 'Spring Kickoff' on March 15th at 6 PM"<br>
                ⭐ <strong>Featured Events:</strong> "Make 'MSA Olympics' a featured event"<br>
                📸 <strong>Gallery:</strong> "Add photos from 'Art Night' event"<br>
                🖼️ <strong>Posters:</strong> "Upload poster for 'Spring Kickoff'"<br><br>
                <em>Try being more specific about what you'd like to do!</em>
            `, 'assistant');
        }
    }

    handleAddEvent(message) {
        this.addMessage(`
            <strong>🎉 Great! I can help you add a new event!</strong><br><br>
            <strong>Demo Preview:</strong><br>
            I would parse your message and extract:<br>
            • Event name<br>
            • Date and time<br>
            • Location<br>
            • Event type<br><br>
            <strong>Next steps would be:</strong><br>
            1. Upload event poster (if you have one)<br>
            2. Add to calendar<br>
            3. Add to featured events (if requested)<br>
            4. Update the website automatically<br><br>
            <em>In the real version, I'd ask for more details and handle the file upload!</em>
        `, 'assistant');
        
        this.showFileUpload();
    }

    handleCalendar(message) {
        this.addMessage(`
            <strong>📅 Here's your current calendar view:</strong><br><br>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin: 10px 0;">
                <strong>Upcoming Events:</strong><br>
                • MSA Olympics - Oct 2, 2025<br>
                • Breaking Barriers - Oct 9, 2025<br>
                • Cultures of the World - Oct 16, 2025<br>
                • Charity Week - Oct 20-23, 2025<br>
            </div><br>
            <strong>What would you like to do?</strong><br>
            • "Add new event"<br>
            • "Edit existing event"<br>
            • "Remove event"<br>
            • "Change event date"
        `, 'assistant');
    }

    handleAddPhotos(message) {
        this.addMessage(`
            <strong>📸 Perfect! Let's add photos to your gallery!</strong><br><br>
            <strong>Demo Preview:</strong><br>
            I would help you:<br>
            • Select which event the photos are for<br>
            • Upload multiple photos at once<br>
            • Automatically resize and optimize images<br>
            • Update the photo count in the gallery<br>
            • Create thumbnails for faster loading<br><br>
            <strong>Available Events:</strong><br>
            • Fall Kickoff 2025<br>
            • Freshman Orientation<br>
            • Art Night<br>
            • Scavenger Hunt<br>
            • Or create new event album<br><br>
            <em>Ready to upload? I'll show the file upload area!</em>
        `, 'assistant');
        
        this.showFileUpload();
    }

    handleGallery(message) {
        this.addMessage(`
            <strong>🖼️ Gallery Management</strong><br><br>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin: 10px 0;">
                <strong>Current Gallery Events:</strong><br>
                • Fall Kickoff 2025 (424 photos)<br>
                • Freshman Orientation (11 photos)<br>
                • Chai and Chats (67 photos)<br>
                • Scavenger Hunt (177 photos)<br>
                • Art Night (136 photos)<br>
                • Snacks and Suhbah (205 photos)<br>
            </div><br>
            <strong>What would you like to do?</strong><br>
            • "Add photos to [event name]"<br>
            • "Update photo count for [event]"<br>
            • "Create new gallery for [event]"<br>
            • "Remove gallery for [event]"
        `, 'assistant');
    }

    handleUploadPoster(message) {
        this.addMessage(`
            <strong>🖼️ Poster Upload Ready!</strong><br><br>
            <strong>Demo Preview:</strong><br>
            I would help you:<br>
            • Upload the poster image<br>
            • Automatically resize to optimal dimensions<br>
            • Add to the featured events section<br>
            • Update the event information<br>
            • Generate preview of how it looks<br><br>
            <strong>Supported formats:</strong> PNG, JPG, JPEG<br>
            <strong>Recommended size:</strong> 800x600 pixels<br><br>
            <em>Let me show you the upload area!</em>
        `, 'assistant');
        
        this.showFileUpload();
    }

    handleFeaturedEvents(message) {
        this.addMessage(`
            <strong>⭐ Featured Events Management</strong><br><br>
            <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 10px 0;">
                <strong>Currently Featured:</strong><br>
                • MSA Olympics (Upcoming)<br>
                • Breaking Barriers (Upcoming)<br>
                • Cultures of the World (Upcoming)<br>
            </div><br>
            <strong>What would you like to do?</strong><br>
            • "Make '[event name]' featured"<br>
            • "Remove '[event name]' from featured"<br>
            • "Update featured event description"<br>
            • "Reorder featured events"
        `, 'assistant');
    }

    showFileUpload() {
        this.fileUploadArea.style.display = 'block';
        this.fileUploadArea.scrollIntoView({ behavior: 'smooth' });
    }

    handleFileUpload(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.addMessage(`
                <strong>📁 Files Selected!</strong><br><br>
                <strong>Demo Preview:</strong><br>
                I would process ${files.length} file(s):<br>
                ${Array.from(files).map(file => `• ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`).join('<br>')}<br><br>
                <strong>Next steps would be:</strong><br>
                1. Optimize and resize images<br>
                2. Generate thumbnails<br>
                3. Update website files<br>
                4. Show preview of changes<br><br>
                <em>In the real version, I'd handle all the technical work automatically!</em>
            `, 'assistant');
            
            this.showPreview();
        }
    }

    showPreview() {
        this.previewContent.innerHTML = `
            <h4>🎯 Preview of Changes</h4>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin: 10px 0;">
                <strong>✅ What would be updated:</strong><br>
                • Event added to calendar<br>
                • Featured events section updated<br>
                • Gallery photos uploaded<br>
                • Poster images optimized<br>
                • Website automatically refreshed<br>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 10px 0;">
                <strong>⚠️ Demo Mode:</strong><br>
                No actual changes are being made to your website.<br>
                In the real version, all changes would be live immediately!
            </div>
        `;
        this.previewPanel.style.display = 'block';
        this.previewPanel.scrollIntoView({ behavior: 'smooth' });
    }

    closePreview() {
        this.previewPanel.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MSAAdminChat();
});

// Global functions for quick actions
function sendQuickMessage(message) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = message;
    document.getElementById('sendButton').click();
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput.value.trim()) {
        // This will be handled by the MSAAdminChat class
        const event = new Event('click');
        document.getElementById('sendButton').dispatchEvent(event);
    }
}

function closePreview() {
    document.getElementById('previewPanel').style.display = 'none';
}
