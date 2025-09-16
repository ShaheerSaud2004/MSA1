// MSA Admin Panel JavaScript
class MSAAdmin {
    constructor() {
        this.data = {
            events: [],
            photos: {},
            featuredEvent: null,
            settings: {
                lastUpdated: new Date().toISOString(),
                adminKey: 'msa_admin_2025_secure_key'
            }
        };
        
        this.init();
    }

    init() {
        // Check authentication
        if (!this.checkAuth()) {
            this.showAuthPrompt();
            return;
        }

        this.loadData();
        this.setupEventListeners();
        this.loadEvents();
        this.loadPhotos();
        this.loadFeaturedEvent();
        this.updateSystemInfo();
    }

    checkAuth() {
        // Simple URL-based authentication
        const urlParams = new URLSearchParams(window.location.search);
        const adminKey = urlParams.get('key');
        const expectedKey = 'msa_admin_2025_secure_key';
        
        if (adminKey === expectedKey) {
            // Store auth in sessionStorage for this session
            sessionStorage.setItem('msa_admin_auth', 'true');
            return true;
        }
        
        // Check if already authenticated in this session
        return sessionStorage.getItem('msa_admin_auth') === 'true';
    }

    showAuthPrompt() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    max-width: 400px;
                    width: 90%;
                ">
                    <h1 style="color: #1f2937; margin-bottom: 20px;">
                        <i class="fas fa-lock"></i> Admin Access Required
                    </h1>
                    <p style="color: #6b7280; margin-bottom: 30px;">
                        Please contact the website administrator for access to the MSA admin panel.
                    </p>
                    <div style="
                        background: #f3f4f6;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    ">
                        <p style="font-size: 0.9rem; color: #374151; margin: 0;">
                            Access URL: <code>rutgersmsa.org/admin.html?key=msa_admin_2025_secure_key</code>
                        </p>
                    </div>
                    <a href="index.html" style="
                        display: inline-block;
                        background: #3b82f6;
                        color: white;
                        padding: 12px 25px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 600;
                        transition: background 0.3s ease;
                    " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
                        <i class="fas fa-home"></i> Back to Website
                    </a>
                </div>
            </div>
        `;
    }

    loadData() {
        const savedData = localStorage.getItem('msa_admin_data');
        if (savedData) {
            try {
                this.data = { ...this.data, ...JSON.parse(savedData) };
                // Force update to Chai and Chats as featured event
                this.updateToChaiAndChats();
            } catch (e) {
                console.error('Error loading saved data:', e);
                this.showAlert('Error loading saved data. Starting fresh.', 'error');
                this.addDefaultEvents();
            }
        } else {
            // Add default events if no data exists
            this.addDefaultEvents();
        }
    }

    updateToChaiAndChats() {
        // Update or add Chai and Chats event
        const chaiAndChatsEvent = {
            id: 'chai-and-chats-2025',
            title: 'Chai and Chats',
            date: '2025-09-18',
            time: '6:00 PM',
            location: 'Voorhees Mall',
            type: 'general',
            description: 'A talk on prophet characteristics - Join us for a meaningful discussion about the noble characteristics of our beloved Prophet (peace be upon him) over warm chai and good company.',
            link: '',
            poster: null,
            createdAt: new Date().toISOString()
        };

        // Remove existing Chai and Chats if it exists and add the updated one
        this.data.events = this.data.events.filter(e => e.id !== 'chai-and-chats-2025');
        this.data.events.unshift(chaiAndChatsEvent); // Add to beginning

        // Update Freshman Orientation to past date if it exists
        const freshmanEvent = this.data.events.find(e => e.id === 'freshman-orientation-2025');
        if (freshmanEvent) {
            freshmanEvent.date = '2024-09-09'; // Set to past date
        }

        // Set Chai and Chats as featured event
        this.data.featuredEvent = {
            eventId: 'chai-and-chats-2025',
            title: 'Chai and Chats',
            description: 'A talk on prophet characteristics - Join us for a meaningful discussion about the noble characteristics of our beloved Prophet (peace be upon him) over warm chai and good company.',
            poster: null,
            updatedAt: new Date().toISOString()
        };

        this.saveData();
    }

    addDefaultEvents() {
        // Add Chai and Chats event
        const chaiAndChatsEvent = {
            id: 'chai-and-chats-2025',
            title: 'Chai and Chats',
            date: '2025-09-18',
            time: '6:00 PM',
            location: 'Voorhees Mall',
            type: 'general',
            description: 'A talk on prophet characteristics - Join us for a meaningful discussion about the noble characteristics of our beloved Prophet (peace be upon him) over warm chai and good company.',
            link: '',
            poster: null,
            createdAt: new Date().toISOString()
        };

        // Add other sample events
        const sampleEvents = [
            chaiAndChatsEvent,
            {
                id: 'freshman-orientation-2025',
                title: 'Freshman Orientation',
                date: '2024-09-09', // Changed to past date
                time: '6:30 PM',
                location: 'Trayes Hall on Cook/Doug',
                type: 'ladders',
                description: 'Welcome new students to the MSA family! Learn about our community, meet your fellow students, and enjoy FREE boba from @trulyyogurtnj',
                link: 'https://www.instagram.com/p/DOPSzv6DVWV/',
                poster: null,
                createdAt: new Date().toISOString()
            },
            {
                id: 'scavenger-hunt-2025',
                title: 'Scavenger Hunt',
                date: '2025-09-11',
                time: '4:30 PM',
                location: 'CA MPR',
                type: 'general',
                description: 'Team up with friends for an exciting scavenger hunt around campus!',
                link: '',
                poster: null,
                createdAt: new Date().toISOString()
            }
        ];

        this.data.events = sampleEvents;
        
        // Add sample photos for Freshman Orientation (past event)
        this.data.photos = {
            'freshman-orientation-2025': {
                'general': [
                    {
                        id: 'photo-1',
                        url: 'images/gallery/Photos/487219155_1073545171477509_1858677282454781252_n.jpg',
                        filename: 'freshman-orientation-1.jpg',
                        uploadedAt: new Date().toISOString()
                    },
                    {
                        id: 'photo-2',
                        url: 'images/gallery/Photos/486757109_1070247085140651_6001288308616007056_n.jpg',
                        filename: 'freshman-orientation-2.jpg',
                        uploadedAt: new Date().toISOString()
                    }
                ],
                'brothers': [
                    {
                        id: 'photo-3',
                        url: 'images/gallery/Photos/486812992_1070247221807304_3832815687186870024_n.jpg',
                        filename: 'freshman-orientation-brothers-1.jpg',
                        uploadedAt: new Date().toISOString()
                    }
                ],
                'sisters': [
                    {
                        id: 'photo-4',
                        url: 'images/gallery/Photos/487424456_1073545334810826_6230589184875073630_n.jpg',
                        filename: 'freshman-orientation-sisters-1.jpg',
                        uploadedAt: new Date().toISOString()
                    }
                ]
            }
        };
        
        // Set Chai and Chats as featured event
        this.data.featuredEvent = {
            eventId: 'chai-and-chats-2025',
            title: 'Chai and Chats',
            description: 'A talk on prophet characteristics - Join us for a meaningful discussion about the noble characteristics of our beloved Prophet (peace be upon him) over warm chai and good company.',
            poster: null,
            updatedAt: new Date().toISOString()
        };

        this.saveData();
    }

    saveData() {
        this.data.settings.lastUpdated = new Date().toISOString();
        localStorage.setItem('msa_admin_data', JSON.stringify(this.data));
        this.updateSystemInfo();
        
        // Auto-refresh preview if it's currently visible
        const previewSection = document.getElementById('preview-section');
        if (previewSection && previewSection.classList.contains('active')) {
            setTimeout(() => {
                this.refreshPreview();
            }, 500);
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Event form
        document.getElementById('event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEvent();
        });

        // Photo form
        document.getElementById('photo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPhotos();
        });

        // Featured form
        document.getElementById('featured-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.setFeaturedEvent();
        });

        // File uploads
        this.setupFileUploads();

        // Live preview for events
        this.setupLivePreview();

        // Settings
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-btn').addEventListener('click', () => {
            this.importData();
        });

        document.getElementById('clear-data').addEventListener('click', () => {
            this.clearAllData();
        });

        // Live Preview
        document.getElementById('refresh-preview').addEventListener('click', () => {
            this.refreshPreview();
        });

        document.getElementById('open-main-site').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });
    }

    setupFileUploads() {
        // Event poster upload
        const eventPoster = document.getElementById('event-poster');
        eventPoster.addEventListener('change', (e) => {
            this.previewImage(e.target.files[0], 'poster-preview');
        });

        // Featured poster upload
        const featuredPoster = document.getElementById('featured-poster');
        featuredPoster.addEventListener('change', (e) => {
            this.previewImage(e.target.files[0], 'featured-poster-preview');
        });

        // Photo upload
        const photoUpload = document.getElementById('photo-upload');
        const photoFiles = document.getElementById('photo-files');

        photoUpload.addEventListener('click', () => {
            photoFiles.click();
        });

        photoUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            photoUpload.classList.add('dragover');
        });

        photoUpload.addEventListener('dragleave', () => {
            photoUpload.classList.remove('dragover');
        });

        photoUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            photoUpload.classList.remove('dragover');
            photoFiles.files = e.dataTransfer.files;
            this.previewPhotos(photoFiles.files);
        });

        photoFiles.addEventListener('change', (e) => {
            this.previewPhotos(e.target.files);
        });
    }

    setupLivePreview() {
        // Add event listeners to all form inputs for live preview
        const inputs = [
            'event-title', 'event-date', 'event-time', 'event-location', 
            'event-type', 'event-description', 'event-link'
        ];

        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateEventPreview();
                });
                input.addEventListener('change', () => {
                    this.updateEventPreview();
                });
            }
        });

        // Initial preview update
        this.updateEventPreview();
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Load section-specific data
        switch(sectionName) {
            case 'events':
                this.loadEvents();
                break;
            case 'photos':
                this.loadPhotos();
                break;
            case 'featured':
                this.loadFeaturedEvent();
                break;
            case 'settings':
                this.updateSystemInfo();
                break;
            case 'preview':
                this.refreshPreview();
                break;
        }
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    showLoading(elementId) {
        document.getElementById(elementId).classList.add('show');
    }

    hideLoading(elementId) {
        document.getElementById(elementId).classList.remove('show');
    }

    // Event Management
    addEvent() {
        const form = document.getElementById('event-form');
        const formData = new FormData(form);
        
        const event = {
            id: Date.now().toString(),
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            type: formData.get('type'),
            description: formData.get('description'),
            link: formData.get('link'),
            poster: null,
            createdAt: new Date().toISOString()
        };

        // Handle poster upload
        const posterFile = formData.get('poster');
        if (posterFile && posterFile.size > 0) {
            event.poster = this.saveImageFile(posterFile, 'posters');
        }

        this.data.events.push(event);
        this.saveData();
        this.loadEvents();
        form.reset();
        document.getElementById('poster-preview').innerHTML = '';
        
        this.showAlert('Event added successfully!', 'success');
    }

    loadEvents() {
        this.showLoading('events-loading');
        
        setTimeout(() => {
            const eventsList = document.getElementById('events-list');
            const photoEventSelect = document.getElementById('photo-event');
            const featuredEventSelect = document.getElementById('featured-event');
            
            // Clear existing options
            photoEventSelect.innerHTML = '<option value="">Choose an event...</option>';
            featuredEventSelect.innerHTML = '<option value="">Choose an event to feature...</option>';
            
            if (this.data.events.length === 0) {
                eventsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No events found. Add your first event above!</p>';
                this.hideLoading('events-loading');
                return;
            }

            // Sort events by date
            const sortedEvents = [...this.data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            let eventsHTML = '<table class="data-table"><thead><tr><th>Title</th><th>Date</th><th>Time</th><th>Type</th><th>Actions</th></tr></thead><tbody>';
            
            sortedEvents.forEach(event => {
                const eventDate = new Date(event.date);
                const isPast = eventDate < new Date();
                
                eventsHTML += `
                    <tr class="${isPast ? 'past-event' : ''}">
                        <td>
                            <strong>${event.title}</strong>
                            ${event.poster ? '<br><small style="color: #6b7280;">Has poster</small>' : ''}
                        </td>
                        <td>${eventDate.toLocaleDateString()}</td>
                        <td>${event.time}</td>
                        <td><span class="status-badge status-${isPast ? 'inactive' : 'active'}">${event.type.toUpperCase()}</span></td>
                        <td>
                            <button class="btn btn-secondary" onclick="admin.editEvent('${event.id}')" style="margin-right: 5px;">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger" onclick="admin.deleteEvent('${event.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                
                // Add to select options
                const option = `<option value="${event.id}">${event.title} (${eventDate.toLocaleDateString()})</option>`;
                photoEventSelect.innerHTML += option;
                featuredEventSelect.innerHTML += option;
            });
            
            eventsHTML += '</tbody></table>';
            eventsList.innerHTML = eventsHTML;
            this.hideLoading('events-loading');
        }, 500);
    }

    editEvent(eventId) {
        const event = this.data.events.find(e => e.id === eventId);
        if (!event) return;

        // Populate form with event data
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-location').value = event.location;
        document.getElementById('event-type').value = event.type;
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-link').value = event.link || '';

        // Show poster if exists
        if (event.poster) {
            document.getElementById('poster-preview').innerHTML = `
                <img src="${event.poster}" class="preview-image" alt="Current poster">
            `;
        }

        // Scroll to form
        document.getElementById('event-form').scrollIntoView({ behavior: 'smooth' });
        
        this.showAlert('Event loaded for editing. Make changes and submit to update.', 'info');
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.data.events = this.data.events.filter(e => e.id !== eventId);
            this.saveData();
            this.loadEvents();
            this.showAlert('Event deleted successfully!', 'success');
        }
    }

    // Photo Management
    addPhotos() {
        const form = document.getElementById('photo-form');
        const formData = new FormData(form);
        
        const eventId = formData.get('event');
        const category = formData.get('category');
        const files = formData.get('photos');
        
        if (!eventId || !files || files.length === 0) {
            this.showAlert('Please select an event and upload photos.', 'error');
            return;
        }

        if (!this.data.photos[eventId]) {
            this.data.photos[eventId] = {};
        }
        
        if (!this.data.photos[eventId][category]) {
            this.data.photos[eventId][category] = [];
        }

        // Process each file
        Array.from(files).forEach(file => {
            const photoUrl = this.saveImageFile(file, 'photos');
            this.data.photos[eventId][category].push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                url: photoUrl,
                filename: file.name,
                uploadedAt: new Date().toISOString()
            });
        });

        this.saveData();
        this.loadPhotos();
        form.reset();
        document.getElementById('photo-preview').innerHTML = '';
        
        this.showAlert(`${files.length} photo(s) uploaded successfully!`, 'success');
    }

    loadPhotos() {
        this.showLoading('photos-loading');
        
        setTimeout(() => {
            const photosList = document.getElementById('photos-list');
            
            if (Object.keys(this.data.photos).length === 0) {
                photosList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No photos found. Upload photos above!</p>';
                this.hideLoading('photos-loading');
                return;
            }

            let photosHTML = '';
            
            Object.keys(this.data.photos).forEach(eventId => {
                const event = this.data.events.find(e => e.id === eventId);
                const eventName = event ? event.title : 'Unknown Event';
                
                photosHTML += `
                    <div class="card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <h4 class="card-title">${eventName}</h4>
                        </div>
                `;
                
                Object.keys(this.data.photos[eventId]).forEach(category => {
                    const photos = this.data.photos[eventId][category];
                    photosHTML += `
                        <div style="margin-bottom: 15px;">
                            <h5 style="margin-bottom: 10px; color: #374151;">${category.charAt(0).toUpperCase() + category.slice(1)} (${photos.length} photos)</h5>
                            <div class="photo-grid">
                    `;
                    
                    photos.forEach(photo => {
                        photosHTML += `
                            <div class="photo-item">
                                <img src="${photo.url}" alt="${photo.filename}">
                                <div class="photo-actions">
                                    <button onclick="admin.deletePhoto('${eventId}', '${category}', '${photo.id}')" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    
                    photosHTML += '</div></div>';
                });
                
                photosHTML += '</div>';
            });
            
            photosList.innerHTML = photosHTML;
            this.hideLoading('photos-loading');
        }, 500);
    }

    deletePhoto(eventId, category, photoId) {
        if (confirm('Are you sure you want to delete this photo?')) {
            this.data.photos[eventId][category] = this.data.photos[eventId][category].filter(p => p.id !== photoId);
            
            // Clean up empty categories
            if (this.data.photos[eventId][category].length === 0) {
                delete this.data.photos[eventId][category];
            }
            
            // Clean up empty events
            if (Object.keys(this.data.photos[eventId]).length === 0) {
                delete this.data.photos[eventId];
            }
            
            this.saveData();
            this.loadPhotos();
            this.showAlert('Photo deleted successfully!', 'success');
        }
    }

    // Featured Event Management
    setFeaturedEvent() {
        const form = document.getElementById('featured-form');
        const formData = new FormData(form);
        
        const eventId = formData.get('event');
        const customTitle = formData.get('title');
        const customDescription = formData.get('description');
        const customPoster = formData.get('poster');
        
        if (!eventId) {
            this.showAlert('Please select an event to feature.', 'error');
            return;
        }

        const event = this.data.events.find(e => e.id === eventId);
        if (!event) {
            this.showAlert('Selected event not found.', 'error');
            return;
        }

        this.data.featuredEvent = {
            eventId: eventId,
            title: customTitle || event.title,
            description: customDescription || event.description,
            poster: event.poster,
            updatedAt: new Date().toISOString()
        };

        // Handle custom poster
        if (customPoster && customPoster.size > 0) {
            this.data.featuredEvent.poster = this.saveImageFile(customPoster, 'featured');
        }

        this.saveData();
        this.loadFeaturedEvent();
        form.reset();
        document.getElementById('featured-poster-preview').innerHTML = '';
        
        this.showAlert('Featured event updated successfully!', 'success');
    }

    loadFeaturedEvent() {
        this.showLoading('featured-loading');
        
        setTimeout(() => {
            const featuredDisplay = document.getElementById('featured-display');
            
            if (!this.data.featuredEvent) {
                featuredDisplay.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No featured event set.</p>';
                this.hideLoading('featured-loading');
                return;
            }

            const event = this.data.events.find(e => e.id === this.data.featuredEvent.eventId);
            if (!event) {
                featuredDisplay.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 20px;">Featured event not found in events list.</p>';
                this.hideLoading('featured-loading');
                return;
            }

            const eventDate = new Date(event.date);
            
            featuredDisplay.innerHTML = `
                <div class="featured-event-card">
                    <div class="card-header">
                        <h4 class="card-title">${this.data.featuredEvent.title}</h4>
                        <span class="status-badge status-active">FEATURED</span>
                    </div>
                    ${this.data.featuredEvent.poster ? `
                        <img src="${this.data.featuredEvent.poster}" class="event-poster-preview" alt="Featured event poster">
                    ` : ''}
                    <div style="margin-top: 15px;">
                        <p><strong>Date:</strong> ${eventDate.toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${event.time}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>Type:</strong> ${event.type.toUpperCase()}</p>
                        ${this.data.featuredEvent.description ? `<p><strong>Description:</strong> ${this.data.featuredEvent.description}</p>` : ''}
                        <p><strong>Updated:</strong> ${new Date(this.data.featuredEvent.updatedAt).toLocaleString()}</p>
                    </div>
                    <div style="margin-top: 15px;">
                        <button class="btn btn-danger" onclick="admin.removeFeaturedEvent()">
                            <i class="fas fa-star"></i>
                            Remove Featured
                        </button>
                    </div>
                </div>
            `;
            
            this.hideLoading('featured-loading');
        }, 500);
    }

    removeFeaturedEvent() {
        if (confirm('Are you sure you want to remove the featured event?')) {
            this.data.featuredEvent = null;
            this.saveData();
            this.loadFeaturedEvent();
            this.showAlert('Featured event removed successfully!', 'success');
        }
    }

    // Utility Functions
    saveImageFile(file, category) {
        // In a real implementation, you would upload to a server
        // For now, we'll use a data URL (base64)
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    previewImage(file, containerId) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById(containerId).innerHTML = `
                <img src="${e.target.result}" class="preview-image" alt="Preview">
            `;
        };
        reader.readAsDataURL(file);
    }

    previewPhotos(files) {
        const container = document.getElementById('photo-preview');
        container.innerHTML = '';
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';
                img.alt = file.name;
                container.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    updateSystemInfo() {
        document.getElementById('last-updated').textContent = 
            this.data.settings.lastUpdated ? new Date(this.data.settings.lastUpdated).toLocaleString() : 'Never';
        document.getElementById('total-events').textContent = this.data.events.length;
        
        const totalPhotos = Object.values(this.data.photos).reduce((total, eventPhotos) => {
            return total + Object.values(eventPhotos).reduce((eventTotal, categoryPhotos) => {
                return eventTotal + categoryPhotos.length;
            }, 0);
        }, 0);
        
        document.getElementById('total-photos').textContent = totalPhotos;
        document.getElementById('featured-status').textContent = 
            this.data.featuredEvent ? 'Set' : 'None';
    }

    // Data Management
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `msa_admin_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showAlert('Data exported successfully!', 'success');
    }

    importData() {
        const fileInput = document.getElementById('import-data');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showAlert('Please select a file to import.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = { ...this.data, ...importedData };
                this.saveData();
                this.loadEvents();
                this.loadPhotos();
                this.loadFeaturedEvent();
                this.updateSystemInfo();
                this.showAlert('Data imported successfully!', 'success');
            } catch (error) {
                this.showAlert('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
            if (confirm('This will delete all events, photos, and featured content. Are you absolutely sure?')) {
                this.data = {
                    events: [],
                    photos: {},
                    featuredEvent: null,
                    settings: {
                        lastUpdated: new Date().toISOString(),
                        adminKey: 'msa_admin_2025_secure_key'
                    }
                };
                this.saveData();
                this.loadEvents();
                this.loadPhotos();
                this.loadFeaturedEvent();
                this.updateSystemInfo();
                this.showAlert('All data cleared successfully!', 'success');
            }
        }
    }

    // Live Preview Methods
    refreshPreview() {
        const iframe = document.getElementById('preview-iframe');
        if (iframe) {
            // Force refresh the iframe
            iframe.src = iframe.src;
            
            // Show loading indicator
            const refreshBtn = document.getElementById('refresh-preview');
            const originalText = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            refreshBtn.disabled = true;
            
            // Reset button after a short delay
            setTimeout(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 2000);
        }
    }

    updateEventPreview() {
        const previewContainer = document.getElementById('event-preview');
        if (!previewContainer) return;

        // Get current form values
        const title = document.getElementById('event-title').value || 'Event Title';
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const location = document.getElementById('event-location').value || 'Location';
        const type = document.getElementById('event-type').value;
        const description = document.getElementById('event-description').value;
        const link = document.getElementById('event-link').value;

        // Format date
        let formattedDate = '';
        let monthName = '';
        let dayNumber = '';
        if (date) {
            const eventDate = new Date(date);
            formattedDate = eventDate.toLocaleDateString();
            monthName = eventDate.toLocaleDateString('en-US', { month: 'long' });
            dayNumber = eventDate.getDate();
        }

        // Get poster preview
        const posterPreview = document.getElementById('poster-preview');
        const posterImg = posterPreview.querySelector('img');
        const posterSrc = posterImg ? posterImg.src : '';

        // Check if event is in the past
        const isPast = date ? new Date(date) < new Date() : false;

        // Create preview HTML that matches the main website styling
        let previewHTML = `
            <div style="
                background: #f8f9fa;
                padding: 20px;
                border-radius: 15px;
                font-family: 'Inter', sans-serif;
            ">
                <h3 style="
                    color: #1f2937;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0 0 20px 0;
                    text-align: center;
                ">Featured Upcoming Events</h3>
                
                <div style="
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
                    border: 2px solid #3b82f6;
                    position: relative;
                ">
        `;

        // Add featured badge
        previewHTML += `
            <div style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
                box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
            ">
                <i class="fas fa-star"></i> FEATURED
            </div>
        `;

        // Add poster if available
        if (posterSrc) {
            previewHTML += `
                <div style="margin-bottom: 20px; text-align: center;">
                    <img src="${posterSrc}" style="
                        width: 100%; 
                        max-width: 400px; 
                        border-radius: 12px; 
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    " alt="Event poster">
                </div>
            `;
        }

        // Event content
        previewHTML += `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <h4 style="
                        margin: 0; 
                        color: #1f2937; 
                        font-size: 1.4rem; 
                        font-weight: 700;
                    ">${title}</h4>
                    <div style="
                        background: #eff6ff;
                        color: #1e40af;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 0.8rem;
                        font-weight: 600;
                    ">
                        ${type.toUpperCase()}
                    </div>
                </div>
                
                <div style="color: #374151; font-size: 0.95rem; line-height: 1.6;">
        `;

        if (formattedDate) {
            previewHTML += `<p style="margin: 8px 0;"><i class="fas fa-calendar-alt" style="color: #6b7280; margin-right: 10px; width: 16px;"></i>${formattedDate}</p>`;
        }
        
        if (time) {
            previewHTML += `<p style="margin: 8px 0;"><i class="fas fa-clock" style="color: #6b7280; margin-right: 10px; width: 16px;"></i>${time}</p>`;
        }
        
        previewHTML += `<p style="margin: 8px 0;"><i class="fas fa-map-marker-alt" style="color: #6b7280; margin-right: 10px; width: 16px;"></i>${location}</p>`;
        
        if (description) {
            previewHTML += `<p style="margin: 15px 0 8px 0;"><i class="fas fa-info-circle" style="color: #6b7280; margin-right: 10px; width: 16px;"></i>${description}</p>`;
        }

        previewHTML += `
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        `;

        if (link) {
            previewHTML += `
                <a href="${link}" target="_blank" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                ">
                    <i class="fas fa-info-circle"></i>
                    Learn More
                </a>
            `;
        }

        previewHTML += `
                <button style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
                ">
                    <i class="fas fa-bell"></i>
                    Remind Me
                </button>
            </div>
        `;

        // Add mini events preview
        previewHTML += `
            </div>
            
            <div style="margin-top: 30px;">
                <h5 style="
                    color: #1f2937;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0 0 15px 0;
                ">Other Upcoming Events</h5>
                
                <div style="
                    background: white;
                    border-radius: 10px;
                    padding: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        padding: 12px;
                        border-radius: 8px;
                        background: #f9fafb;
                        margin-bottom: 10px;
                    ">
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            color: white;
                            padding: 8px 12px;
                            border-radius: 8px;
                            text-align: center;
                            min-width: 60px;
                        ">
                            <div style="font-size: 1.1rem; font-weight: 700;">${dayNumber || '--'}</div>
                            <div style="font-size: 0.7rem; font-weight: 600;">${monthName ? monthName.substring(0, 3).toUpperCase() : '---'}</div>
                        </div>
                        <div style="flex: 1;">
                            <h6 style="margin: 0 0 5px 0; color: #1f2937; font-size: 0.95rem; font-weight: 600;">${title}</h6>
                            <p style="margin: 2px 0; color: #6b7280; font-size: 0.8rem;"><i class="fas fa-clock" style="margin-right: 5px;"></i>${time || '--:--'}</p>
                            <p style="margin: 2px 0; color: #6b7280; font-size: 0.8rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>${location}</p>
                            <span style="
                                background: #eff6ff;
                                color: #1e40af;
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 0.7rem;
                                font-weight: 600;
                            ">${type.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Update preview container
        previewContainer.innerHTML = previewHTML;
    }
}

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new MSAAdmin();
});
