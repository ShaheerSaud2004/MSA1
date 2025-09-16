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
                            Access URL: <code>rutgersmsa.org/admin/admin?key=msa_admin_2025_secure_key</code>
                        </p>
                    </div>
                    <a href="../index.html" style="
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
            } catch (e) {
                console.error('Error loading saved data:', e);
                this.showAlert('Error loading saved data. Starting fresh.', 'error');
            }
        }
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
            window.open('../index.html', '_blank');
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
}

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new MSAAdmin();
});
