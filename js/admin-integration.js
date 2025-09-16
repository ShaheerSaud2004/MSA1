// MSA Admin Integration - Loads admin data and updates main website
class MSAAdminIntegration {
    constructor() {
        this.data = {
            events: [],
            photos: {},
            featuredEvent: null
        };
        
        this.init();
    }

    init() {
        this.loadAdminData();
        this.updateEventsSection();
        this.updateFeaturedEvents();
        this.updateGallerySection();
    }

    loadAdminData() {
        const savedData = localStorage.getItem('msa_admin_data');
        if (savedData) {
            try {
                const adminData = JSON.parse(savedData);
                this.data = {
                    events: adminData.events || [],
                    photos: adminData.photos || {},
                    featuredEvent: adminData.featuredEvent || null
                };
            } catch (e) {
                console.error('Error loading admin data:', e);
            }
        }
    }

    updateEventsSection() {
        if (this.data.events.length === 0) return;

        // Update calendar with admin events
        this.updateCalendar();
        
        // Update events list
        this.updateEventsList();
    }

    updateCalendar() {
        const calendarGrid = document.getElementById('calendar');
        if (!calendarGrid) return;

        // Clear existing event indicators
        calendarGrid.querySelectorAll('.has-event').forEach(cell => {
            cell.classList.remove('has-event');
            cell.removeAttribute('data-event-id');
        });

        // Add event indicators to calendar
        this.data.events.forEach(event => {
            const eventDate = new Date(event.date);
            const dayElement = calendarGrid.querySelector(`[data-date="${eventDate.getDate()}"]`);
            
            if (dayElement) {
                dayElement.classList.add('has-event');
                dayElement.setAttribute('data-event-id', event.id);
                dayElement.setAttribute('data-event-type', event.type);
                
                // Add event tooltip
                dayElement.title = `${event.title} - ${event.time}`;
            }
        });
    }

    updateEventsList() {
        const featuredEventsGrid = document.querySelector('.featured-events-grid');
        if (!featuredEventsGrid) return;

        // Clear existing events (keep the structure)
        const mainEvent = featuredEventsGrid.querySelector('.main-event');
        const sidebar = featuredEventsGrid.querySelector('.upcoming-events-sidebar');
        
        if (sidebar) {
            const otherEvents = sidebar.querySelector('.mini-event-card');
            if (otherEvents) {
                otherEvents.parentNode.innerHTML = '<h5>Other Upcoming Events</h5>';
            }
        }

        // Add upcoming events
        const upcomingEvents = this.data.events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5); // Show next 5 events

        upcomingEvents.forEach((event, index) => {
            if (index === 0 && mainEvent) {
                // Update main featured event
                this.updateMainEventCard(mainEvent, event);
            } else if (sidebar) {
                // Add to sidebar
                this.addSidebarEvent(sidebar, event);
            }
        });
    }

    updateMainEventCard(mainEventElement, event) {
        const eventDate = new Date(event.date);
        
        // Update event content
        const eventContent = mainEventElement.querySelector('.event-content');
        if (eventContent) {
            const header = eventContent.querySelector('.event-header h4');
            if (header) header.textContent = event.title;

            const typeBadge = eventContent.querySelector('.event-type-badge');
            if (typeBadge) {
                typeBadge.textContent = event.type.toUpperCase();
                typeBadge.className = `event-type-badge ${event.type}`;
            }

            const eventInfo = eventContent.querySelector('.event-info');
            if (eventInfo) {
                eventInfo.innerHTML = `
                    <p><i class="fas fa-calendar-alt"></i> ${eventDate.toLocaleDateString()}</p>
                    <p><i class="fas fa-clock"></i> ${event.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    ${event.description ? `<p><i class="fas fa-info-circle"></i> ${event.description}</p>` : ''}
                `;
            }

            // Update poster if exists
            if (event.poster) {
                const posterImg = mainEventElement.querySelector('.event-poster img');
                if (posterImg) {
                    posterImg.src = event.poster;
                    posterImg.alt = event.title;
                }
            }

            // Update learn more link
            const learnMoreBtn = eventContent.querySelector('.learn-more-btn');
            if (learnMoreBtn && event.link) {
                learnMoreBtn.href = event.link;
            }
        }
    }

    addSidebarEvent(sidebarElement, event) {
        const eventDate = new Date(event.date);
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                           'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        const miniEventCard = document.createElement('div');
        miniEventCard.className = 'mini-event-card';
        miniEventCard.innerHTML = `
            <div class="mini-event-date">
                <span class="day">${eventDate.getDate()}</span>
                <span class="month">${monthNames[eventDate.getMonth()]}</span>
            </div>
            <div class="mini-event-info">
                <h6>${event.title}</h6>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <span class="mini-event-type ${event.type}">${event.type.toUpperCase()}</span>
            </div>
        `;

        // Find the container for other events
        const otherEventsContainer = sidebarElement.querySelector('h5').nextElementSibling;
        if (otherEventsContainer) {
            otherEventsContainer.appendChild(miniEventCard);
        } else {
            sidebarElement.appendChild(miniEventCard);
        }
    }

    updateFeaturedEvents() {
        if (!this.data.featuredEvent) return;

        const event = this.data.events.find(e => e.id === this.data.featuredEvent.eventId);
        if (!event) return;

        // Update featured event display
        const featuredEventsGrid = document.querySelector('.featured-events-grid');
        if (featuredEventsGrid) {
            const mainEvent = featuredEventsGrid.querySelector('.main-event');
            if (mainEvent) {
                this.updateMainEventCard(mainEvent, event);
                
                // Update with custom featured content if available
                if (this.data.featuredEvent.title !== event.title) {
                    const header = mainEvent.querySelector('.event-header h4');
                    if (header) header.textContent = this.data.featuredEvent.title;
                }

                if (this.data.featuredEvent.description && this.data.featuredEvent.description !== event.description) {
                    const eventInfo = mainEvent.querySelector('.event-info');
                    if (eventInfo) {
                        const descriptionP = eventInfo.querySelector('p:last-child');
                        if (descriptionP) {
                            descriptionP.innerHTML = `<i class="fas fa-info-circle"></i> ${this.data.featuredEvent.description}`;
                        }
                    }
                }

                if (this.data.featuredEvent.poster && this.data.featuredEvent.poster !== event.poster) {
                    const posterImg = mainEvent.querySelector('.event-poster img');
                    if (posterImg) {
                        posterImg.src = this.data.featuredEvent.poster;
                    }
                }
            }
        }
    }

    updateGallerySection() {
        if (Object.keys(this.data.photos).length === 0) return;

        const eventsGalleryGrid = document.querySelector('.events-gallery-grid');
        if (!eventsGalleryGrid) return;

        // Clear existing event tiles (keep the structure)
        const existingTiles = eventsGalleryGrid.querySelectorAll('.event-tile');
        existingTiles.forEach(tile => {
            if (!tile.classList.contains('freshman-orientation-tile')) {
                tile.remove();
            }
        });

        // Add event tiles for events with photos
        Object.keys(this.data.photos).forEach(eventId => {
            const event = this.data.events.find(e => e.id === eventId);
            if (!event) return;

            const totalPhotos = Object.values(this.data.photos[eventId]).reduce((total, categoryPhotos) => {
                return total + categoryPhotos.length;
            }, 0);

            if (totalPhotos === 0) return;

            const eventTile = document.createElement('div');
            eventTile.className = 'event-tile';
            eventTile.setAttribute('data-event', eventId);
            
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();
            
            eventTile.innerHTML = `
                <div class="event-poster">
                    ${event.poster ? `<img src="${event.poster}" alt="${event.title}">` : ''}
                    <div class="event-overlay">
                        <div class="event-info">
                            <h3>${event.title}</h3>
                            <p>${totalPhotos} photos • ${Object.keys(this.data.photos[eventId]).join(' & ')}</p>
                            <button class="view-event-btn" ${isPast ? '' : 'disabled'}>
                                ${isPast ? 'View Photos' : 'Coming Soon'}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Insert before the freshman orientation tile
            const freshmanTile = eventsGalleryGrid.querySelector('.freshman-orientation-tile');
            if (freshmanTile) {
                eventsGalleryGrid.insertBefore(eventTile, freshmanTile);
            } else {
                eventsGalleryGrid.appendChild(eventTile);
            }
        });
    }

    // Method to refresh data (can be called from admin panel)
    refreshData() {
        this.loadAdminData();
        this.updateEventsSection();
        this.updateFeaturedEvents();
        this.updateGallerySection();
    }
}

// Initialize integration when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.msaAdminIntegration = new MSAAdminIntegration();
});

// Listen for storage changes to update in real-time
window.addEventListener('storage', (e) => {
    if (e.key === 'msa_admin_data' && window.msaAdminIntegration) {
        window.msaAdminIntegration.refreshData();
    }
});


