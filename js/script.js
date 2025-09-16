// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Calendar Implementation
class EventCalendar {
    constructor() {
        this.currentDate = new Date();
        // Restrict calendar navigation to Sep 2025 through May 2026
        this.minDate = new Date(2025, 8, 1); // September 2025 (month is 0-indexed)
        this.maxDate = new Date(2026, 4, 1); // May 2026
        if (this.currentDate < this.minDate) this.currentDate = new Date(this.minDate);
        if (this.currentDate > this.maxDate) this.currentDate = new Date(this.maxDate);
        this.events = {
            // Fall 2025 Events
            '2025-09-04': [{ title: 'Fall Kickoff', location: 'LSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-09-09': [{ title: 'Freshman Orientation', location: 'Trayes Hall', type: 'Ladders', time: '4:30 PM - 11:45 PM' }],
            '2025-09-11': [{ title: 'Scavenger Hunt', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-09-16': [
                { title: 'Sisters\' Social', location: 'BSC MPR', type: 'Sisters Social', time: '4:30 PM - 11:45 PM' },
                { title: 'Brothers\' Social', location: 'Gathering Lounge', type: 'Brothers Social', time: '4:30 PM - 11:45 PM' }
            ],
            '2025-09-18': [{ title: 'Shama\'il', location: 'Voorhees Mall', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-09-23': [{ title: 'Submissions Event', location: 'CA MPR', type: 'Submissions', time: '4:30 PM - 11:45 PM' }],
            '2025-09-25': [{ title: 'Speed-Friending', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-09-30': [{ title: 'MSA General Meeting', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-10-02': [{ title: 'MSA Olympics', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-10-09': [{ title: 'Racism/Classism Discussion', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-10-14': [{ title: 'Ladders Event', location: 'Gathering Lounge', type: 'Ladders', time: '4:30 PM - 11:45 PM' }],
            '2025-10-16': [{ title: 'Cultures of the World', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-10-20': [{ title: 'Charity Week Day 1', location: 'TBD', type: 'HOPE', time: 'TBD' }],
            '2025-10-21': [{ title: 'Charity Week Day 2', location: 'TBD', type: 'HOPE', time: 'TBD' }],
            '2025-10-22': [{ title: 'Charity Week Day 3', location: 'TBD', type: 'HOPE', time: 'TBD' }],
            '2025-10-23': [{ title: 'Charity Week Finale', location: 'LSC MPR', type: 'HOPE', time: '4:30 PM - 11:45 PM' }],
            '2025-10-28': [
                { title: 'Sisters\' Social', location: 'Glass Room', type: 'Sisters Social', time: '4:30 PM - 11:45 PM' },
                { title: 'Brothers\' Social', location: 'Gathering Lounge', type: 'Brothers Social', time: '4:30 PM - 11:45 PM' }
            ],
            '2025-10-30': [{ title: 'Taboo Topics', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-11-04': [{ title: 'Pre-IAW Event', location: 'LSC MPR', type: 'IAW', time: '4:30 PM - 11:45 PM' }],
            '2025-11-06': [{ title: 'Qur\'an Night', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-11-09': [{ title: 'Art Gala', location: 'BSC MPR, Cove, Center Hall, Int. Lounge', type: 'Submissions', time: '11:00 AM - 11:45 PM' }],
            '2025-11-11': [{ title: 'Special MSA Event', location: 'Coffee House, 202 ABC, BSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-11-13': [{ title: 'MSA Misc. Event', location: 'LSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-11-18': [{ title: 'Pre-R2R Event', location: 'BSC MPR', type: 'R2R', time: '4:30 PM - 11:45 PM' }],
            '2025-11-20': [{ title: 'Death, Resurrection, & Afterlife', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2025-11-25': [
                { title: 'Sisters\' Social', location: 'CA MPR', type: 'Sisters Social', time: '4:30 PM - 11:45 PM' },
                { title: 'Brothers\' Social', location: 'BSC MPR', type: 'Brothers Social', time: '4:30 PM - 11:45 PM' }
            ],
            '2025-12-02': [{ title: 'Submissions Event', location: 'Center Hall', type: 'Submissions', time: '4:30 PM - 11:45 PM' }],
            '2025-12-04': [{ title: 'End of Semester Event', location: 'CA MPR + Lounge', type: 'General', time: '4:30 PM - 11:45 PM' }],
            
            // Spring 2026 Events
            '2026-01-20': [{ title: 'HOPE Event', location: 'CA MPR & LSC MPR', type: 'HOPE', time: 'TBD' }],
            '2026-01-22': [{ title: 'Spring Kickoff', location: 'CA MPR + Lounge', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-01-27': [
                { title: 'WHW Event', location: 'Gathering Lounge', type: 'Sisters Social', time: '4:30 PM - 11:45 PM' },
                { title: 'Brothers\' Social', location: 'LSC MPR', type: 'Brothers Social', time: '4:30 PM - 11:45 PM' }
            ],
            '2026-01-29': [{ title: 'Islamic Identity (WHW)', location: 'CA MPR + Lounge', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-01-30': [{ title: 'R2R Setup', location: 'CA 108, 109', type: 'R2R', time: '5:00 PM - 11:45 PM' }],
            '2026-01-31': [{ title: 'R2R Conference', location: 'CA MPR + Lounge, 411 ABC, 108, 109, Cap & Skull', type: 'R2R', time: '9:00 AM - 11:45 PM' }],
            '2026-02-03': [{ title: 'Submissions Event', location: 'LSC MPR', type: 'Submissions', time: '4:30 PM - 11:45 PM' }],
            '2026-02-05': [{ title: 'Mental Health Workshop', location: 'BSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-02-10': [{ title: 'Pre-IAW Event', location: 'Trayes Hall, Gathering Lounge, Glass Room', type: 'IAW', time: '12:00 PM - 11:45 PM' }],
            '2026-02-12': [{ title: 'Brainrot / Pre-Ramadan', location: 'CA MPR + Lounge', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-02-14': [{ title: 'Alumni Gala Setup', location: 'CA MPR + Lounge', type: 'Ladders', time: '6:00 PM - 11:45 PM' }],
            '2026-02-15': [{ title: 'Alumni Gala', location: 'CA MPR + Lounge', type: 'Ladders', time: '9:00 AM - 11:45 PM' }],
            '2026-02-17': [{ title: 'Ramadan Begins', location: 'Community Wide', type: 'General', time: 'All Month' }],
            '2026-02-19': [{ title: 'Iftar #1', location: 'BSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-02-24': [
                { title: 'Sisters Social Iftar', location: 'BSC MPR', type: 'Sisters Social', time: '4:30 PM - 11:45 PM' },
                { title: 'Brothers Social Iftar', location: 'Gathering Lounge', type: 'Brothers Social', time: '4:30 PM - 11:45 PM' }
            ],
            '2026-02-26': [{ title: 'Iftar #2', location: 'BSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-03-03': [{ title: 'R2R Iftar', location: 'CA MPR', type: 'R2R', time: '4:30 PM - 10:30 PM' }],
            '2026-03-05': [{ title: 'Iftar #3', location: 'BSC MPR & CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-03-12': [{ title: 'Last 10 Nights', location: 'CA MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-03-19': [{ title: 'Ramadan Ends', location: 'Community Wide', type: 'General', time: 'All Day' }],
            '2026-03-24': [{ title: 'Dawah Workshop', location: 'LSC MPR & Gathering Lounge', type: 'IAW', time: '4:30 PM - 11:45 PM' }],
            '2026-03-26': [{ title: '50(ish) Years of MSA', location: 'Trayes Hall', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-03-31': [{ title: 'Ladders Event', location: 'Center Hall, Glass Room, Gathering Lounge', type: 'Ladders', time: '4:30 PM - 11:45 PM' }],
            '2026-04-02': [{ title: 'Elections', location: 'BSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-04-07': [{ title: 'HOPE Event', location: 'CSC MPR & Cove', type: 'HOPE', time: '4:30 PM - 11:45 PM' }],
            '2026-04-09': [{ title: 'End of Semester Event', location: 'LSC MPR', type: 'General', time: '4:30 PM - 11:45 PM' }],
            '2026-04-14': [{ title: 'Submissions Event', location: 'BSC MPR', type: 'Submissions', time: '4:30 PM - 11:45 PM' }],
            '2026-04-17': [{ title: 'Eid Bazaar', location: 'President\'s Tent', type: 'General', time: '11:00 AM - 7:00 PM' }],
            '2026-04-20': [{ title: 'IAW Day 1', location: 'Morell Street', type: 'IAW', time: '8:00 AM - 11:45 PM' }],
            '2026-04-21': [{ title: 'IAW Day 2', location: 'Morell Street', type: 'IAW', time: '8:00 AM - 11:45 PM' }],
            '2026-04-22': [{ title: 'IAW Day 3', location: 'Morell Street', type: 'IAW', time: '10:00 AM - 4:00 AM' }],
            '2026-04-23': [{ title: 'IAW Day 4', location: 'Morell Street', type: 'IAW', time: '10:00 AM - 10:30 PM' }]
        };
        this.init();
    }

    init() {
        this.renderCalendar();
        this.bindEvents();
    }

    bindEvents() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!this.isAtMinMonth()) {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
                }
        });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!this.isAtMaxMonth()) {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
                }
        });
        }
    }

    renderCalendar() {
        // Ensure currentDate is within allowed bounds
        this.clampCurrentDateToBounds();
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

        // Clear calendar
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = `
                background: #2c5530;
                color: white;
                font-weight: 600;
                padding: 15px 5px;
                text-align: center;
            `;
            calendar.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = daysInPrevMonth - i;
            calendar.appendChild(day);
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if this day has passed (only for actual past events, not future calendar dates)
            const currentDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
            currentDate.setHours(0, 0, 0, 0);
            
            // Only mark as past if it's actually a past date AND has an event that already happened
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEvent = this.events[dateString];
            const isPastDay = currentDate < today && hasEvent;

            // Check if this day has an event
            if (this.events[dateString]) {
                const events = this.events[dateString];
                dayElement.classList.add('has-event');

                // Use the isPastDay variable we already calculated

                // Clear the day number text temporarily
                const dayNumber = dayElement.textContent;
                dayElement.innerHTML = '';

                // If multiple events on the same day, create a grid layout
                if (events.length > 1) {
                    dayElement.classList.add('multiple-events');
                    
                    // Create container for logos/colors
                    const eventContainer = document.createElement('div');
                    eventContainer.className = 'event-container';
                    
                    events.forEach((event, index) => {
                        const eventElement = document.createElement('div');
                        eventElement.className = 'event-element';
                        
                        const logo = this.getEventTypeLogo(event.type);
                        if (logo) {
                            const img = document.createElement('img');
                            img.src = logo;
                            img.alt = event.type;
                            img.className = 'event-logo';
                            
                            // Add specific class for Ladders logo positioning
                            if (event.type.toLowerCase() === 'ladders') {
                                img.classList.add('ladders-logo');
                            }
                            
                            eventElement.appendChild(img);
                } else {
                            // Use color background
                            const color = this.getEventTypeColor(event.type);
                            eventElement.style.background = color;
                            eventElement.classList.add('event-color-only');
                        }
                        eventContainer.appendChild(eventElement);
                    });
                    
                    dayElement.appendChild(eventContainer);
                    
                    // Add day number overlay
                    const dayNumberElement = document.createElement('div');
                    dayNumberElement.className = 'day-number-overlay';
                    dayNumberElement.textContent = dayNumber;
                    dayElement.appendChild(dayNumberElement);
                } else {
                    // Single event - use logo if available, otherwise color
                    const event = events[0];
                    const logo = this.getEventTypeLogo(event.type);
                    
                    if (logo) {
                        // Use logo as background
                        const img = document.createElement('img');
                        img.src = logo;
                        img.alt = event.type;
                        img.className = 'event-logo-single';
                        
                        // Add specific class for Ladders logo positioning
                        if (event.type.toLowerCase() === 'ladders') {
                            img.classList.add('ladders-logo');
                        }
                        
                        dayElement.appendChild(img);
                        
                        // Add day number overlay
                        const dayNumberElement = document.createElement('div');
                        dayNumberElement.className = 'day-number-overlay';
                        dayNumberElement.textContent = dayNumber;
                        dayElement.appendChild(dayNumberElement);
                    } else {
                        // Use color background (existing behavior)
                        const primaryType = event.type.toLowerCase().replace(/\s/g, '-');
                    dayElement.classList.add(`event-${primaryType}`);
                        dayElement.textContent = dayNumber;
                    }
                }

                // Add past event styling
                if (isPastDay) {
                    dayElement.classList.add('past-event');
                }

                // Create tooltip with all events
                let tooltip = '';
                events.forEach((event, index) => {
                    if (index > 0) tooltip += '\n\n';
                    tooltip += `${event.title}\n📍 ${event.location}\n🕐 ${event.time}`;
                });
                dayElement.title = tooltip;

                // Add event indicator
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                dayElement.appendChild(eventDot);

                // Add X mark for past events
                if (isPastDay) {
                    const xMark = document.createElement('div');
                    xMark.className = 'past-event-x';
                    xMark.innerHTML = '✕';
                    dayElement.appendChild(xMark);
                }

                // Add click event listener
                dayElement.addEventListener('click', () => {
                    this.showEventModal(dateString, events);
                });

                // Add cursor pointer
                dayElement.style.cursor = 'pointer';
            }

            // Only add X mark for past days that have events (already handled above)

            // Highlight today
            const todayCheck = new Date();
            if (year === todayCheck.getFullYear() && month === todayCheck.getMonth() && day === todayCheck.getDate()) {
                dayElement.style.background = '#4a7c59';
                dayElement.style.color = 'white';
                dayElement.style.fontWeight = 'bold';
            }

            calendar.appendChild(dayElement);
        }

        // Add next month's leading days
        const totalCells = calendar.children.length;
        const remainingCells = 42 - totalCells + 7; // 6 rows * 7 days + 7 headers
        for (let day = 1; day <= remainingCells && totalCells < 49; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        }

        // Update navigation buttons state based on bounds
        this.updateNavButtons();
    }

    // Helpers to enforce min/max month bounds
    isAtMinMonth() {
        return (
            this.currentDate.getFullYear() === this.minDate.getFullYear() &&
            this.currentDate.getMonth() === this.minDate.getMonth()
        );
    }

    isAtMaxMonth() {
        return (
            this.currentDate.getFullYear() === this.maxDate.getFullYear() &&
            this.currentDate.getMonth() === this.maxDate.getMonth()
        );
    }

    clampCurrentDateToBounds() {
        if (this.currentDate < this.minDate) this.currentDate = new Date(this.minDate);
        if (this.currentDate > this.maxDate) this.currentDate = new Date(this.maxDate);
    }

    updateNavButtons() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        if (prevBtn) {
            prevBtn.disabled = this.isAtMinMonth();
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '';
            prevBtn.style.cursor = prevBtn.disabled ? 'not-allowed' : '';
        }
        if (nextBtn) {
            nextBtn.disabled = this.isAtMaxMonth();
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '';
            nextBtn.style.cursor = nextBtn.disabled ? 'not-allowed' : '';
        }
    }

    // Return the color used for each event type (kept in sync with CSS)
    getEventTypeColor(type) {
        const key = String(type || '').toLowerCase();
        const map = {
            'general': '#2c5530',        // Dark green to match MSA logo
            'ladders': '#2e4f63',        // Dark blue to match Ladders logo
            'sisters social': '#DDA0DD',
            'brothers social': '#87CEEB',
            'hope': '#f4e4bc',           // Cream/beige to match Hope logo
            'iaw': '#B0C4DE',
            'r2r': '#F0E68C',
            'submissions': '#1a1a2e'     // Dark navy to match Submissions logo
        };
        return map[key] || '#2c5530';
    }

    getEventTypeLogo(type) {
        const key = String(type || '').toLowerCase();
        const logoMap = {
            'general': 'images/logos/MSA.png', // Use MSA logo for general events
            'ladders': 'images/team/Lad.jpg',
            'sisters social': 'images/team/SS.jpg',
            'brothers social': 'images/team/BS.jpg',
            'hope': 'images/team/hope.jpg',
            'iaw': 'images/team/IAW.jpg',
            'r2r': 'images/team/RR.jpg',
            'submissions': 'images/team/Sub.jpg'
        };
        return logoMap[key] || null;
    }

    showEventModal(dateString, events) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('eventModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'eventModal';
            modal.className = 'event-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalDate"></h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body" id="modalEvents"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add close functionality
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            modal.querySelector('.modal-overlay').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Format date
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('modalDate').textContent = date.toLocaleDateString('en-US', options);

        // Populate events
        const modalEvents = document.getElementById('modalEvents');
        modalEvents.innerHTML = '';
        
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `modal-event event-${event.type.toLowerCase().replace(/\s/g, '-')}`;
            eventDiv.innerHTML = `
                <div class="modal-event-header">
                    <h4>${event.title}</h4>
                    <span class="modal-event-type">${event.type}</span>
                </div>
                <div class="modal-event-details">
                    <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    <p><i class="fas fa-clock"></i> ${event.time}</p>
                </div>
            `;
            modalEvents.appendChild(eventDiv);
        });

        // Show modal
        modal.style.display = 'flex';
    }
}

// Event Gallery Manager
class EventGallery {
    constructor() {
        this.events = this.initializeEvents();
        this.currentEvent = null;
        this.currentAlbum = null;
        this.rotationInterval = null;
        this.init();
    }

    initializeEvents() {
        return {
            'fall-kickoff': {
                name: 'MSA Fall Kickoff 2025',
                poster: 'images/posters/KickoffPoster.png',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 244,
                        photos: this.generateBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters', 
                        count: 180,
                        photos: this.generateSistersPhotos()
                    }
                }
            }
            // Future events can be easily added here
        };
    }

    generateBrothersPhotos() {
        const brothersFiles = [
            '1-IMG_6431.jpg', '10-IMG_6443.jpg', '100-IMG_6543.jpg', '101-IMG_6544.jpg', '102-IMG_6545.jpg',
            '103-IMG_6546.jpg', '104-IMG_6547.jpg', '105-IMG_6548.jpg', '106-IMG_6549.jpg', '107-IMG_6550.jpg',
            '108-IMG_6551.jpg', '109-IMG_6553.jpg', '11-IMG_6444.jpg', '110-IMG_6554.jpg', '111-IMG_6555.jpg',
            '112-IMG_6556.jpg', '113-IMG_6557.jpg', '114-IMG_6558.jpg', '115-IMG_6559.jpg', '116-IMG_6561.jpg',
            '117-IMG_6562.jpg', '118-IMG_6563.jpg', '119-IMG_6564.jpg', '12-IMG_6445.jpg', '120-IMG_6565.jpg',
            '121-IMG_6566.jpg', '122-IMG_6567.jpg', '123-IMG_6568.jpg', '124-IMG_6569.jpg', '125-IMG_6570.jpg',
            '126-IMG_6571.jpg', '127-IMG_6572.jpg', '128-IMG_6573.jpg', '129-IMG_6574.jpg', '13-IMG_6446.jpg',
            '130-IMG_6575.jpg', '131-IMG_6576.jpg', '132-IMG_6577.jpg', '133-IMG_6578.jpg', '134-IMG_6579.jpg',
            '135-IMG_6580.jpg', '136-IMG_6581.jpg', '137-IMG_6582.jpg', '138-IMG_6583.jpg', '139-IMG_6584.jpg',
            '14-IMG_6447.jpg', '140-IMG_6585.jpg', '141-IMG_6586.jpg', '142-IMG_6587.jpg', '143-IMG_6588.jpg',
            '144-IMG_6589.jpg', '145-IMG_6590.jpg', '146-IMG_6591.jpg', '147-IMG_6592.jpg', '148-IMG_6593.jpg',
            '149-IMG_6594.jpg', '15-IMG_6448.jpg', '150-IMG_6595.jpg', '151-IMG_6596.jpg', '152-IMG_6597.jpg',
            '153-IMG_6598.jpg', '154-IMG_6599.jpg', '155-IMG_6600.jpg', '156-IMG_6601.jpg', '157-IMG_6602.jpg',
            '158-IMG_6603.jpg', '159-IMG_6604.jpg', '16-IMG_6449.jpg', '160-IMG_6605.jpg', '161-IMG_6606.jpg',
            '162-IMG_6607.jpg', '163-IMG_6608.jpg', '164-IMG_6609.jpg', '165-IMG_6610.jpg', '166-IMG_6611.jpg',
            '167-IMG_6612.jpg', '168-IMG_6613.jpg', '169-IMG_6614.jpg', '17-IMG_6450.jpg', '170-IMG_6615.jpg',
            '171-IMG_6616.jpg', '172-IMG_6617.jpg', '173-IMG_6618.jpg', '174-IMG_6619.jpg', '175-IMG_6620.jpg',
            '176-IMG_6621.jpg', '177-IMG_6622.jpg', '178-IMG_6623.jpg', '179-IMG_6624.jpg', '18-IMG_6451.jpg',
            '180-IMG_6625.jpg', '181-IMG_6626.jpg', '182-IMG_6627.jpg', '183-IMG_6628.jpg', '184-IMG_6629.jpg',
            '185-IMG_6630.jpg', '186-IMG_6631.jpg', '187-IMG_6632.jpg', '188-IMG_6633.jpg', '189-IMG_6634.jpg',
            '19-IMG_6452.jpg', '190-IMG_6635.jpg', '191-IMG_6636.jpg', '192-IMG_6637.jpg', '193-IMG_6638.jpg',
            '194-IMG_6639.jpg', '195-IMG_6640.jpg', '196-IMG_6641.jpg', '197-IMG_6642.jpg', '198-IMG_6643.jpg',
            '199-IMG_6644.jpg', '2-IMG_6433.jpg', '20-IMG_6453.jpg', '200-IMG_6645.jpg', '201-IMG_6646.jpg',
            '202-IMG_6647.jpg', '203-IMG_6648.jpg', '204-IMG_6649.jpg', '205-IMG_6650.jpg', '206-IMG_6651.jpg',
            '207-IMG_6652.jpg', '208-IMG_6653.jpg', '209-IMG_6654.jpg', '21-IMG_6454.jpg', '210-IMG_6655.jpg',
            '211-IMG_6656.jpg', '212-IMG_6657.jpg', '213-IMG_6658.jpg', '214-IMG_6659.jpg', '215-IMG_6660.jpg',
            '216-IMG_6661.jpg', '217-IMG_6662.jpg', '218-IMG_6663.jpg', '219-IMG_6664.jpg', '22-IMG_6455.jpg',
            '220-IMG_6665.jpg', '221-IMG_6666.jpg', '222-IMG_6667.jpg', '223-IMG_6668.jpg', '224-IMG_6669.jpg',
            '225-IMG_6670.jpg', '226-IMG_6671.jpg', '227-IMG_6672.jpg', '228-IMG_6675.jpg', '229-IMG_6676.jpg',
            '23-IMG_6456.jpg', '230-IMG_6677.jpg', '231-IMG_6678.jpg', '232-IMG_6680.jpg', '233-IMG_6681.jpg',
            '234-IMG_6682.jpg', '235-IMG_6683.jpg', '236-IMG_6684.jpg', '237-IMG_6685.jpg', '238-IMG_6686.jpg',
            '239-IMG_6687.jpg', '24-IMG_6457.jpg', '240-IMG_6688.jpg', '241-IMG_6689.jpg', '242-IMG_6690.jpg',
            '243-IMG_6691.jpg', '244-IMG_6692.jpg', '25-IMG_6458.jpg', '26-IMG_6459.jpg', '27-IMG_6460.jpg',
            '28-IMG_6461.jpg', '29-IMG_6462.jpg', '3-IMG_6434.jpg', '30-IMG_6463.jpg', '31-IMG_6464.jpg',
            '32-IMG_6465.jpg', '33-IMG_6466.jpg', '34-IMG_6467.jpg', '35-IMG_6468.jpg', '36-IMG_6469.jpg',
            '37-IMG_6470.jpg', '38-IMG_6471.jpg', '39-IMG_6472.jpg', '4-IMG_6435.jpg', '40-IMG_6473.jpg',
            '41-IMG_6474.jpg', '42-IMG_6475.jpg', '43-IMG_6476.jpg', '44-IMG_6477.jpg', '45-IMG_6478.jpg',
            '46-IMG_6479.jpg', '47-IMG_6480.jpg', '48-IMG_6481.jpg', '49-IMG_6482.jpg', '5-IMG_6436.jpg',
            '50-IMG_6483.jpg', '51-IMG_6484.jpg', '52-IMG_6485.jpg', '53-IMG_6486.jpg', '54-IMG_6487.jpg',
            '55-IMG_6488.jpg', '56-IMG_6489.jpg', '57-IMG_6490.jpg', '58-IMG_6491.jpg', '59-IMG_6492.jpg',
            '6-IMG_6438.jpg', '60-IMG_6493.jpg', '61-IMG_6496.jpg', '62-IMG_6497.jpg', '63-IMG_6498.jpg',
            '64-IMG_6499.jpg', '65-IMG_6500.jpg', '66-IMG_6501.jpg', '67-IMG_6505.jpg', '68-IMG_6506.jpg',
            '69-IMG_6508.jpg', '7-IMG_6439.jpg', '70-IMG_6509.jpg', '71-IMG_6510.jpg', '72-IMG_6511.jpg',
            '73-IMG_6512.jpg', '74-IMG_6515.jpg', '75-IMG_6516.jpg', '76-IMG_6517.jpg', '77-IMG_6518.jpg',
            '78-IMG_6519.jpg', '79-IMG_6520.jpg', '8-IMG_6440.jpg', '80-IMG_6521.jpg', '81-IMG_6522.jpg',
            '82-IMG_6523.jpg', '83-IMG_6524.jpg', '84-IMG_6527.jpg', '85-IMG_6528.jpg', '86-IMG_6529.jpg',
            '87-IMG_6530.jpg', '88-IMG_6531.jpg', '89-IMG_6532.jpg', '9-IMG_6442.jpg', '90-IMG_6533.jpg',
            '91-IMG_6534.jpg', '92-IMG_6535.jpg', '93-IMG_6536.jpg', '94-IMG_6537.jpg', '95-IMG_6538.jpg',
            '96-IMG_6539.jpg', '97-IMG_6540.jpg', '98-IMG_6541.jpg', '99-IMG_6542.jpg'
        ];
        
        return brothersFiles.map(file => `images/gallery/Photos/Fall Kickoff/Brothers/${file}`);
    }

    generateSistersPhotos() {
        const sistersFiles = [
            '1-IMG_4264.jpg', '10-IMG_4267.jpg', '100-IMG_4307.jpg', '101-IMG_4218.jpg', '102-IMG_4308.jpg',
            '103-IMG_4309.jpg', '104-IMG_4310.jpg', '105-IMG_4219.jpg', '106-IMG_4220.jpg', '107-IMG_4221.jpg',
            '108-IMG_4222.jpg', '109-IMG_4232.jpg', '11-IMG_4268.jpg', '110-IMG_4233.jpg', '111-IMG_4234.jpg',
            '112-IMG_4235.jpg', '113-IMG_4236.jpg', '114-IMG_4237.jpg', '115-IMG_4238.jpg', '116-IMG_4239.jpg',
            '117-IMG_4240.jpg', '118-IMG_4241.jpg', '119-IMG_4242.jpg', '12-IMG_4224.jpg', '120-IMG_4243.jpg',
            '121-IMG_4244.jpg', '122-IMG_4311.jpg', '123-IMG_4312.jpg', '124-IMG_4313.jpg', '125-IMG_4314.jpg',
            '126-IMG_4315.jpg', '127-IMG_4316.jpg', '128-IMG_4317.jpg', '129-IMG_4245.jpg', '13-IMG_4225.jpg',
            '130-IMG_4246.jpg', '131-IMG_4247.jpg', '132-IMG_4248.jpg', '133-IMG_4280.jpg', '134-IMG_4281.jpg',
            '135-IMG_4282.jpg', '136-IMG_4318.jpg', '137-IMG_4319.jpg', '138-IMG_4320.jpg', '139-IMG_4321.jpg',
            '14-IMG_4180.jpg', '140-IMG_4322.jpg', '141-IMG_4323.jpg', '142-IMG_4324.jpg', '143-IMG_4325.jpg',
            '144-IMG_4326.jpg', '145-IMG_4327.jpg', '146-IMG_4328.jpg', '147-IMG_4329.jpg', '148-IMG_4330.jpg',
            '149-IMG_4283.jpg', '15-IMG_4249.jpg', '150-IMG_4284.jpg', '151-IMG_4334.jpg', '152-IMG_4335.jpg',
            '153-IMG_4336.jpg', '154-IMG_4337.jpg', '155-IMG_4338.jpg', '156-IMG_4339.jpg', '157-IMG_4340.jpg',
            '158-IMG_4341.jpg', '159-IMG_4342.jpg', '16-IMG_4269.jpg', '160-IMG_4343.jpg', '161-IMG_4344.jpg',
            '162-IMG_4345.jpg', '163-IMG_4346.jpg', '164-IMG_4347.jpg', '165-IMG_4348.jpg', '166-IMG_4349.jpg',
            '167-IMG_4350.jpg', '168-IMG_4351.jpg', '169-IMG_4352.jpg', '17-IMG_4250.jpg', '170-IMG_4353.jpg',
            '171-IMG_6674.jpg', '172-IMG_6675.jpg', '173-IMG_6676.jpg', '174-IMG_6677.jpg', '175-IMG_6678.jpg',
            '176-IMG_6680.jpg', '177-IMG_6689.jpg', '178-IMG_6690.jpg', '179-IMG_6691.jpg', '18-IMG_4270.jpg',
            '180-IMG_6692.jpg', '19-IMG_4181.jpg', '2-IMG_4265.jpg', '20-IMG_4271.jpg', '21-IMG_4272.jpg',
            '22-IMG_4288.jpg', '23-IMG_4289.jpg', '24-IMG_4251.jpg', '25-IMG_4226.jpg', '26-IMG_4227.jpg',
            '27-IMG_4273.jpg', '28-IMG_4274.jpg', '29-IMG_4290.jpg', '3-IMG_4223.jpg', '30-IMG_4291.jpg',
            '31-IMG_4292.jpg', '32-IMG_4182.jpg', '33-IMG_4252.jpg', '34-IMG_4253.jpg', '35-IMG_4275.jpg',
            '36-IMG_4228.jpg', '37-IMG_4254.jpg', '38-IMG_4229.jpg', '39-IMG_4230.jpg', '4-IMG_4266.jpg',
            '40-IMG_4255.jpg', '41-IMG_4183.jpg', '42-IMG_4294.jpg', '43-IMG_4184.jpg', '44-IMG_4185.jpg',
            '45-IMG_4186.jpg', '46-IMG_4187.jpg', '47-IMG_4256.jpg', '48-IMG_4257.jpg', '49-IMG_4258.jpg',
            '5-IMG_4285.jpg', '50-IMG_4259.jpg', '51-IMG_4188.jpg', '52-IMG_4260.jpg', '53-IMG_4261.jpg',
            '54-IMG_4262.jpg', '55-IMG_4263.jpg', '56-IMG_4295.jpg', '57-IMG_4189.jpg', '58-IMG_4190.jpg',
            '59-IMG_4191.jpg', '6-IMG_4178.jpg', '60-IMG_4192.jpg', '61-IMG_4193.jpg', '62-IMG_4194.jpg',
            '63-IMG_4195.jpg', '64-IMG_4196.jpg', '65-IMG_4197.jpg', '66-IMG_4198.jpg', '67-IMG_4199.jpg',
            '68-IMG_4296.jpg', '69-IMG_4276.jpg', '7-IMG_4286.jpg', '70-IMG_4201.jpg', '71-IMG_4297.jpg',
            '72-IMG_4202.jpg', '73-IMG_4298.jpg', '74-IMG_4277.jpg', '75-IMG_4203.jpg', '76-IMG_4204.jpg',
            '77-IMG_4299.jpg', '78-IMG_4300.jpg', '79-IMG_4205.jpg', '8-IMG_4287.jpg', '80-IMG_4206.jpg',
            '81-IMG_4301.jpg', '82-IMG_4302.jpg', '83-IMG_4303.jpg', '84-IMG_4304.jpg', '85-IMG_4207.jpg',
            '86-IMG_4208.jpg', '87-IMG_4209.jpg', '88-IMG_4210.jpg', '89-IMG_4278.jpg', '9-IMG_4179.jpg',
            '90-IMG_4279.jpg', '91-IMG_4211.jpg', '92-IMG_4212.jpg', '93-IMG_4213.jpg', '94-IMG_4214.jpg',
            '95-IMG_4215.jpg', '96-IMG_4216.jpg', '97-IMG_4305.jpg', '98-IMG_4306.jpg', '99-IMG_4217.jpg'
        ];
        
        return sistersFiles.map(file => `images/gallery/Photos/Fall Kickoff/Sisters/${file}`);
    }

    // Diagnostic function to test image loading
    testImagePath(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = imagePath;
        });
    }
    
    // Test a few image paths when initializing
    async testImageLoading() {
        const testPaths = [
            'images/gallery/Photos/Fall Kickoff/Brothers/1-IMG_6431.jpg',
            'images/gallery/Photos/Fall Kickoff/Sisters/1-IMG_4264.jpg',
            'images/gallery/Photos/Fall Kickoff/Thumbnails/Brothers/1-IMG_6431.jpg'
        ];
        
        console.log('Testing image paths...');
        for (const path of testPaths) {
            try {
                await this.testImagePath(path);
                console.log('✅ Successfully loaded:', path);
            } catch {
                console.error('❌ Failed to load:', path);
            }
        }
    }

    init() {
        this.bindEventTileClicks();
        this.bindModalEvents();
    }

    bindEventTileClicks() {
        document.querySelectorAll('.event-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                const eventId = tile.getAttribute('data-event');
                const button = tile.querySelector('.view-event-btn');
                
                // Don't open modal for disabled events
                if (button && button.disabled) {
                    return;
                }
                
                this.showEventModal(eventId);
            });
        });
    }

    bindModalEvents() {
        // Close modal events
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeAllModals();
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Navigation events
        // Back to event button removed from UI

        document.querySelector('.back-to-preview-btn')?.addEventListener('click', () => {
            this.showAlbumPreview(this.currentEvent, this.currentAlbum);
        });

        // Album action events
        document.querySelector('.view-full-album-btn')?.addEventListener('click', () => {
            this.showFullAlbum(this.currentEvent, this.currentAlbum);
        });

        document.querySelector('.download-album-btn')?.addEventListener('click', () => {
            this.downloadAlbum(this.currentEvent, this.currentAlbum);
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    showEventModal(eventId) {
        this.currentEvent = eventId;
        const event = this.events[eventId];
        if (!event) return;

        // Update modal content
        document.getElementById('event-title').textContent = event.name;
        
        // Create album choices
        const albumsSelection = document.querySelector('.albums-selection');
        albumsSelection.innerHTML = '';

        Object.entries(event.albums).forEach(([albumId, album]) => {
            const choice = document.createElement('div');
            choice.className = `album-choice album-choice-${albumId}`;
            
            // Get preview images for this album with lazy loading
            const previewImages = album.photos.slice(0, 3);
            const previewHtml = previewImages.map((photo, index) => 
                `<img data-src="${photo}" alt="Preview" class="album-preview-thumb lazy-thumb" loading="lazy">`
            ).join('');
            
            choice.innerHTML = `
                <div class="album-preview-thumbs">
                    ${previewHtml}
                    <div class="album-overlay-count">+${album.count - 3}</div>
                </div>
                <div class="album-choice-content">
                    <h4>${album.name}</h4>
                    <p>${album.count} photos from Fall Kickoff</p>
                    <button class="choose-album-btn">
                        <i class="fas fa-images"></i>
                        View Album
                    </button>
                </div>
            `;
            
            choice.addEventListener('click', () => {
                this.showAlbumPreview(eventId, albumId);
            });
            
            albumsSelection.appendChild(choice);
            
            // Initialize lazy loading for preview thumbnails
            choice.querySelectorAll('.lazy-thumb').forEach(img => {
                this.loadThumbnail(img);
            });
        });

        // Show modal
        document.getElementById('event-modal').style.display = 'flex';
    }

    showAlbumPreview(eventId, albumId) {
        this.currentEvent = eventId;
        this.currentAlbum = albumId;
        
        const event = this.events[eventId];
        const album = event.albums[albumId];
        
        // Update modal content
        document.getElementById('album-modal-title').textContent = `${event.name} | ${album.name}`;
        document.getElementById('album-modal-count').textContent = `${album.count} photos`;
        
        // Start rotating preview
        this.startRotatingPreview(album.photos);
        
        // Hide event modal, show album preview modal
        document.getElementById('event-modal').style.display = 'none';
        document.getElementById('album-preview-modal').style.display = 'flex';
    }

    startRotatingPreview(photos) {
        const previewContainer = document.getElementById('rotating-preview');
        let currentStartIndex = 0;
        
        // Reset full album view flag
        this.isFullAlbumView = false;
        
        // Create carousel container and track
        previewContainer.innerHTML = `
            <div class="preview-carousel-container">
                <div class="preview-carousel-track" id="preview-carousel-track">
                    <!-- Photos will be populated here -->
                </div>
            </div>
        `;
        
        const carouselTrack = document.getElementById('preview-carousel-track');
        
        // Load all photos into carousel (show 5 at a time)
        const loadCarouselPhotos = () => {
            carouselTrack.innerHTML = '';
            
            // Load 10 photos for smooth scrolling (current 5 + next 5)
            for (let i = 0; i < 10; i++) {
                const photoIndex = (currentStartIndex + i) % photos.length;
                const photo = photos[photoIndex];
                // Use original high-quality photos for preview instead of thumbnails
                
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-carousel-item';
                
                previewItem.innerHTML = `
                    <img src="${photo}" alt="Preview ${i + 1}" style="width: 100%; height: 100%; object-fit: cover;">
                `;
                
                const img = previewItem.querySelector('img');
                
                previewItem.addEventListener('click', () => {
                    this.openLightbox(photo, `Preview ${i + 1}`);
                });
                
                carouselTrack.appendChild(previewItem);
            }
        };
        
        // Smooth slide function
        const slideToNext = () => {
            const itemWidth = carouselTrack.children[0].offsetWidth;
            const currentTransform = carouselTrack.style.transform || 'translateX(0px)';
            const currentX = parseInt(currentTransform.match(/translateX\((-?\d+)px\)/) || [0, 0])[1];
            const newX = currentX - itemWidth;
            
            carouselTrack.style.transform = `translateX(${newX}px)`;
            
            // After transition, update photos if needed
            setTimeout(() => {
                if (Math.abs(newX) >= itemWidth * 5) {
                    currentStartIndex = (currentStartIndex + 1) % photos.length;
                    carouselTrack.style.transition = 'none';
                    carouselTrack.style.transform = 'translateX(0px)';
                    loadCarouselPhotos();
                    setTimeout(() => {
                        carouselTrack.style.transition = 'transform 2s ease-in-out';
                    }, 50);
                }
            }, 2000);
        };
        
        // Initial load
        loadCarouselPhotos();
        carouselTrack.style.transition = 'transform 2s ease-in-out';
        
        // Start smooth rotation every 4 seconds
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        this.rotationInterval = setInterval(slideToNext, 4000);
    }

    showFullAlbum(eventId, albumId) {
        const event = this.events[eventId];
        const album = event.albums[albumId];
        
        // Update modal content
        document.getElementById('full-album-title').textContent = `${event.name} | ${album.name}`;
        document.getElementById('full-album-count').textContent = `${album.count} photos`;
        
        // Store current album data
        this.currentAlbumPhotos = album.photos;
        this.currentAlbumName = album.name;
        
        // Hide album preview first
        document.getElementById('album-preview-modal').style.display = 'none';
        
        // Show full album modal
        const fullAlbumModal = document.getElementById('full-album-modal');
        fullAlbumModal.style.display = 'flex';
        
        // Wait for modal to be visible before initializing grid view only
        setTimeout(() => {
            // Initialize grid view only
            this.setupGridView();
        }, 100);
        
        // Stop rotation
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }

    setupGridView() {
        const fullGrid = document.getElementById('full-album-grid');
        fullGrid.innerHTML = '';
        
        // Set flag for full album view to use thumbnails for better performance
        this.isFullAlbumView = true;
        
        console.log(`Loading all ${this.currentAlbumPhotos.length} photos immediately...`);
        this.loadAllPhotosSimple(fullGrid, this.currentAlbumName);
    }

    setupCarouselView() {
        const carouselTrack = document.getElementById('carousel-track');
        const carouselCounter = document.getElementById('carousel-counter');
        
        carouselTrack.innerHTML = '';
        
        // Create carousel slides (load first 10 for performance)
        const slidesToLoad = Math.min(10, this.currentAlbumPhotos.length);
        for (let i = 0; i < slidesToLoad; i++) {
            const photo = this.currentAlbumPhotos[i];
            const thumbnailPath = this.getThumbnailPath(photo);
            
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <img src="${thumbnailPath}" alt="${this.currentAlbumName} Photo ${i + 1}" loading="lazy">
                <button class="download-overlay" title="Download Photo">
                    <i class="fas fa-download"></i>
                </button>
            `;
            
            // Add download functionality
            slide.querySelector('.download-overlay').addEventListener('click', (e) => {
                e.stopPropagation();
                this.downloadSinglePhoto(photo, `${this.currentAlbumName}_Photo_${i + 1}`);
            });
            
            carouselTrack.appendChild(slide);
        }
        
        // Initialize carousel state
        this.currentSlide = 0;
        this.totalSlides = slidesToLoad;
        this.updateCarouselCounter();
        
        // Add navigation event listeners
        this.setupCarouselNavigation();
    }

    setupCarouselNavigation() {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        // Clear any existing listeners
        if (this.carouselNavListeners) {
            this.carouselNavListeners.forEach(cleanup => cleanup());
        }
        this.carouselNavListeners = [];
        
        // Previous button handler
        const prevHandler = (e) => {
            e.preventDefault();
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.updateCarouselPosition();
            }
        };
        
        // Next button handler  
        const nextHandler = (e) => {
            e.preventDefault();
            if (this.currentSlide < this.totalSlides - 1) {
                // Load more slides if needed
                if (this.currentSlide >= this.totalSlides - 2 && this.totalSlides < this.currentAlbumPhotos.length) {
                    this.loadMoreCarouselSlides();
                }
                this.currentSlide++;
                this.updateCarouselPosition();
            }
        };
        
        // Keyboard navigation handler
        const keyHandler = (e) => {
            const carouselView = document.getElementById('album-carousel');
            if (carouselView && carouselView.style.display !== 'none') {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevHandler(e);
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextHandler(e);
                }
            }
        };
        
        // Add event listeners
        prevBtn.addEventListener('click', prevHandler);
        nextBtn.addEventListener('click', nextHandler);
        document.addEventListener('keydown', keyHandler);
        
        // Store cleanup functions
        this.carouselNavListeners.push(
            () => prevBtn.removeEventListener('click', prevHandler),
            () => nextBtn.removeEventListener('click', nextHandler),
            () => document.removeEventListener('keydown', keyHandler)
        );
    }

    loadMoreCarouselSlides() {
        const carouselTrack = document.getElementById('carousel-track');
        const slidesToAdd = Math.min(5, this.currentAlbumPhotos.length - this.totalSlides);
        
        for (let i = 0; i < slidesToAdd; i++) {
            const photoIndex = this.totalSlides + i;
            const photo = this.currentAlbumPhotos[photoIndex];
            const thumbnailPath = this.getThumbnailPath(photo);
            
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <img src="${thumbnailPath}" alt="${this.currentAlbumName} Photo ${photoIndex + 1}" loading="lazy">
                <button class="download-overlay" title="Download Photo">
                    <i class="fas fa-download"></i>
                </button>
            `;
            
            slide.querySelector('.download-overlay').addEventListener('click', (e) => {
                e.stopPropagation();
                this.downloadSinglePhoto(photo, `${this.currentAlbumName}_Photo_${photoIndex + 1}`);
            });
            
            carouselTrack.appendChild(slide);
        }
        
        this.totalSlides += slidesToAdd;
    }

    updateCarouselPosition() {
        const carouselTrack = document.getElementById('carousel-track');
        const translateX = -this.currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        this.updateCarouselCounter();
    }

    updateCarouselCounter() {
        const carouselCounter = document.getElementById('carousel-counter');
        carouselCounter.textContent = `${this.currentSlide + 1} / ${this.currentAlbumPhotos.length}`;
    }

    setupViewToggle() {
        const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
        const gridView = document.getElementById('full-album-grid');
        const carouselView = document.getElementById('album-carousel');
        
        // Clear existing listeners
        if (this.viewToggleListeners) {
            this.viewToggleListeners.forEach(cleanup => cleanup());
        }
        this.viewToggleListeners = [];
        
        // Reset to grid view
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.view-toggle-btn[data-view="grid"]')?.classList.add('active');
        gridView.style.display = 'block';
        carouselView.style.display = 'none';
        
        viewToggleBtns.forEach(btn => {
            const handler = (e) => {
                e.preventDefault();
                const view = btn.getAttribute('data-view');
                
                // Update active button
                viewToggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Toggle views
                if (view === 'grid') {
                    gridView.style.display = 'block';
                    carouselView.style.display = 'none';
            } else {
                    gridView.style.display = 'none';
                    carouselView.style.display = 'block';
                }
            };
            
            btn.addEventListener('click', handler);
            this.viewToggleListeners.push(() => btn.removeEventListener('click', handler));
        });
    }

    loadPhotosBatchImmediate(container, albumName) {
        const startIndex = this.currentBatch * this.batchSize;
        const endIndex = Math.min(startIndex + this.batchSize, this.currentAlbumPhotos.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const photo = this.currentAlbumPhotos[i];
            const thumbnailPath = this.getThumbnailPath(photo);
            const item = document.createElement('div');
            item.className = 'full-album-item';
            
            // Create image directly without placeholder for immediate display
            item.innerHTML = `
                <img src="${thumbnailPath}" data-full="${photo}" alt="${albumName} Photo ${i + 1}" class="loaded">
                <button class="download-overlay" title="Download Photo">
                    <i class="fas fa-download"></i>
                </button>
            `;
            
            const img = item.querySelector('img');
            
            // Image loaded successfully
            img.onload = () => {
                // Image is already visible with 'loaded' class
            };
            
            // Add error handling for failed image loads
            img.onerror = () => {
                console.error('Failed to load image:', thumbnailPath);
                console.log('Trying original path:', photo);
                // Try loading the original photo path instead of thumbnail
                img.src = photo;
                img.onerror = () => {
                    console.error('Also failed to load original:', photo);
                    // Show placeholder error image or text
                    item.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666;">Image not found</div>`;
                };
            };
            
            // Click to open lightbox (use full-size image)
            img.addEventListener('click', () => {
                this.openLightbox(photo, `${albumName} Photo ${i + 1}`);
            });
            
            // Click download button (use full-size image)
            item.querySelector('.download-overlay').addEventListener('click', (e) => {
                e.stopPropagation();
                this.downloadSinglePhoto(photo, `${albumName}_Photo_${i + 1}`);
            });
            
            container.appendChild(item);
        }
        
        this.currentBatch++;
    }

    loadPhotosBatch(container, albumName) {
        const startIndex = this.currentBatch * this.batchSize;
        const endIndex = Math.min(startIndex + this.batchSize, this.currentAlbumPhotos.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const photo = this.currentAlbumPhotos[i];
            const thumbnailPath = this.getThumbnailPath(photo);
            const item = document.createElement('div');
            item.className = 'full-album-item';
            
            // Create simple placeholder without animation
            item.innerHTML = `
                <div class="photo-placeholder" style="animation: none; opacity: 0.5;">
                    <i class="fas fa-image"></i>
                </div>
                <img data-src="${thumbnailPath}" data-full="${photo}" alt="${albumName} Photo ${i + 1}" class="lazy-load" style="display: none;">
                <button class="download-overlay" title="Download Photo">
                    <i class="fas fa-download"></i>
                </button>
            `;
            
            const img = item.querySelector('img');
            const placeholder = item.querySelector('.photo-placeholder');
            
            // Set up intersection observer for lazy loading
            this.setupLazyLoad(img, placeholder);
            
            // Click to open lightbox (use full-size image)
            img.addEventListener('click', () => {
                this.openLightbox(photo, `${albumName} Photo ${i + 1}`);
            });
            
            // Click download button (use full-size image)
            item.querySelector('.download-overlay').addEventListener('click', (e) => {
                e.stopPropagation();
                this.downloadSinglePhoto(photo, `${albumName}_Photo_${i + 1}`);
            });
            
            container.appendChild(item);
        }
        
        this.currentBatch++;
    }

    getThumbnailPath(originalPath) {
        // Temporarily use original images directly to fix 404 errors
        console.log('Loading image from:', originalPath);
        return originalPath;
    }

    setupLazyLoad(img, placeholder) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    const src = image.getAttribute('data-src');
                    
                    // Load the image
                    image.src = src;
                    image.onload = () => {
                        image.style.display = 'block';
                        placeholder.style.display = 'none';
                        image.classList.add('loaded');
                    };
                    
                    // Add error handling for lazy loaded images
                    image.onerror = () => {
                        console.error('Lazy load failed for:', src);
                        const originalPath = image.getAttribute('data-full');
                        if (originalPath && originalPath !== src) {
                            console.log('Trying original path for lazy load:', originalPath);
                            image.src = originalPath;
                            image.onerror = () => {
                                console.error('Original path also failed:', originalPath);
                                // Replace with error message
                                const placeholder = image.parentElement.querySelector('.image-placeholder');
                                if (placeholder) {
                                    placeholder.innerHTML = '<div style="color: #666; font-size: 12px;">Image not found</div>';
                                    placeholder.style.display = 'flex';
                                    placeholder.style.alignItems = 'center';
                                    placeholder.style.justifyContent = 'center';
                                }
                            };
                        }
                    };
                    
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before the image is visible
        });
        
        observer.observe(img);
    }

    loadPhotosBatchOptimized(container, albumName) {
        const startIndex = this.currentBatch * this.batchSize;
        const endIndex = Math.min(startIndex + this.batchSize, this.currentAlbumPhotos.length);
        
        console.log(`Loading batch ${this.currentBatch + 1}: photos ${startIndex + 1}-${endIndex} of ${this.currentAlbumPhotos.length}`);
        
        // Create a document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        for (let i = startIndex; i < endIndex; i++) {
            const photo = this.currentAlbumPhotos[i];
            const thumbnailPath = this.getThumbnailPath(photo);
            const item = document.createElement('div');
            item.className = 'full-album-item';
            
            // Create placeholder first, then lazy load
            item.innerHTML = `
                <div class="image-placeholder">
                    <div class="placeholder-spinner"></div>
                </div>
                <img data-src="${thumbnailPath}" data-full="${photo}" alt="${albumName} Photo ${i + 1}" class="lazy-image" style="display: none;">
                <button class="download-overlay" title="Download Photo">
                    <i class="fas fa-download"></i>
                </button>
            `;
            
            const img = item.querySelector('img');
            const placeholder = item.querySelector('.image-placeholder');
            
            // Set up intersection observer for lazy loading
            this.setupLazyLoading(img, placeholder, photo, albumName, i + 1);
            
            fragment.appendChild(item);
        }
        
        // Add all items to DOM at once for better performance
        container.appendChild(fragment);
        
        this.currentBatch++;
        this.isLoading = false;
        
        // Remove loading indicator if present
        const loader = container.querySelector('.loading-more');
        if (loader) loader.remove();
        
        console.log(`Batch loaded. Total items in container: ${container.children.length}`);
    }
    
    setupLazyLoading(img, placeholder, photo, albumName, photoNumber) {
        // Create intersection observer for each image
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    const src = image.getAttribute('data-src');
                    const placeholder = image.parentElement.querySelector('.image-placeholder');
                    
                    // Load the image
                    image.src = src;
                    image.onload = () => {
                        image.style.display = 'block';
                        image.style.opacity = '1';
                        image.classList.add('loaded');
                        if (placeholder) placeholder.style.display = 'none';
                    };
                    
                    // Error handling
                    image.onerror = () => {
                        console.error('Failed to load:', src);
                        const originalPath = image.getAttribute('data-full');
                        if (originalPath && originalPath !== src) {
                            image.src = originalPath;
                            image.onerror = () => {
                                if (placeholder) {
                                    placeholder.innerHTML = '<div style="color: #666; font-size: 12px; text-align: center;">Image not found</div>';
                                }
                            };
                        }
                    };
                    
                    // Add click handler
                    image.addEventListener('click', () => {
                        this.openLightbox(photo, `${albumName} Photo ${photoNumber}`);
                    });
                    
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image comes into view
        });
        
        observer.observe(img);
    }
    
    loadAllPhotosSimple(container, albumName) {
        // Performance optimizations
        const startTime = performance.now();
        
        // Create all photo elements with virtual scrolling for 200+ photos
        const totalPhotos = this.currentAlbumPhotos.length;
        const photosToShow = Math.min(totalPhotos, 50); // Show first 50 immediately
        
        console.log(`Loading ${photosToShow} of ${totalPhotos} photos immediately...`);
        
        const fragment = document.createDocumentFragment();
        
        // Load first batch immediately
        for (let i = 0; i < photosToShow; i++) {
            const item = this.createPhotoItem(i, albumName);
            fragment.appendChild(item);
        }
        
        // Add first batch to DOM
        container.appendChild(fragment);
        
        // Load remaining photos progressively
        if (totalPhotos > photosToShow) {
            this.loadRemainingPhotos(container, albumName, photosToShow);
        }
        
        const endTime = performance.now();
        console.log(`Initial ${photosToShow} photos loaded in ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    createPhotoItem(index, albumName) {
        const photo = this.currentAlbumPhotos[index];
        const thumbnailPath = this.getThumbnailPath(photo);
        const item = document.createElement('div');
        item.className = 'full-album-item';
        
        // Optimized image creation
        const img = document.createElement('img');
        img.src = thumbnailPath;
        img.alt = `${albumName} Photo ${index + 1}`;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
        img.loading = 'lazy'; // Native lazy loading
        
        // Error handling
        img.onerror = () => {
            img.src = photo;
        };
        
        // Click handler
        img.addEventListener('click', () => {
            this.openLightbox(photo, `${albumName} Photo ${index + 1}`);
        });
        
        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-overlay';
        downloadBtn.title = 'Download Photo';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        
        item.appendChild(img);
        item.appendChild(downloadBtn);
        
        return item;
    }
    
    loadRemainingPhotos(container, albumName, startIndex) {
        // Load remaining photos in small batches to prevent lag
        const batchSize = 20;
        const totalPhotos = this.currentAlbumPhotos.length;
        
        const loadBatch = (start) => {
            if (start >= totalPhotos) return;
            
            requestIdleCallback(() => {
                const end = Math.min(start + batchSize, totalPhotos);
                const fragment = document.createDocumentFragment();
                
                for (let i = start; i < end; i++) {
                    const item = this.createPhotoItem(i, albumName);
                    fragment.appendChild(item);
                }
                
                container.appendChild(fragment);
                console.log(`Loaded photos ${start + 1}-${end} of ${totalPhotos}`);
                
                // Schedule next batch
                loadBatch(end);
            });
        };
        
        loadBatch(startIndex);
    }
    
    setupInfiniteScrollOptimized(container, albumName) {
        const modal = document.getElementById('full-album-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        // Throttle scroll events for better performance
        let scrollTimeout;
        
        modalBody.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const scrollPosition = modalBody.scrollTop + modalBody.clientHeight;
                const scrollThreshold = modalBody.scrollHeight - 200; // Load 200px before bottom
                
                if (scrollPosition >= scrollThreshold && !this.isLoading) {
                    const startIndex = this.currentBatch * this.batchSize;
                    if (startIndex < this.currentAlbumPhotos.length) {
                        this.showLoadingIndicator(container);
                        this.loadPhotosBatchOptimized(container, albumName);
                    }
                }
            }, 100); // Throttle to every 100ms
        });
    }

    showLoadingIndicator(container) {
        if (!document.querySelector('.loading-more')) {
            this.isLoading = true;
            const loader = document.createElement('div');
            loader.className = 'loading-more';
            loader.innerHTML = `
                <div class="loading-spinner"></div>
                Loading more photos...
            `;
            container.appendChild(loader);
            
            // Remove loader after a short delay
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
                this.isLoading = false;
            }, 500);
        }
    }

    loadThumbnail(img) {
        // Simple immediate loading for thumbnails since they're smaller
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.onload = () => {
                img.classList.add('loaded');
            };
        }
    }

    downloadSinglePhoto(photoUrl, filename) {
        const link = document.createElement('a');
        link.href = photoUrl;
        link.download = filename + '.jpg';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadAlbum(eventId, albumId) {
        const event = this.events[eventId];
        const album = event.albums[albumId];
        
        // Create a simple alert for now - in a real app, you'd implement ZIP download
        alert(`Downloading ${album.count} photos from ${album.name} album. This feature will be fully implemented soon!`);
        
        // For now, download first 5 photos as demo
        album.photos.slice(0, 5).forEach((photo, index) => {
            setTimeout(() => {
                this.downloadSinglePhoto(photo, `${album.name}_Sample_${index + 1}`);
            }, index * 1000);
        });
    }

    openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'photo-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 15000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
        `;

        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 80px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
        `;

        lightbox.appendChild(img);
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(downloadBtn);
        document.body.appendChild(lightbox);

        // Event handlers
        const closeLightbox = () => {
            document.body.removeChild(lightbox);
        };

        closeBtn.addEventListener('click', closeLightbox);
        downloadBtn.addEventListener('click', () => {
            this.downloadSinglePhoto(src, alt.replace(/[^a-zA-Z0-9]/g, '_'));
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    closeAllModals() {
        document.getElementById('event-modal').style.display = 'none';
        document.getElementById('album-preview-modal').style.display = 'none';
        document.getElementById('full-album-modal').style.display = 'none';
        
        // Stop rotation
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !message) {
            this.showMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        this.form.reset();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            padding: 15px;
            margin-top: 20px;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            ${type === 'success' ? 
                'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
        `;

        this.form.appendChild(message);

        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll('.team-card, .event-card, .gallery-item, .stat-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Hero scroll indicator
document.querySelector('.hero-scroll').addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({
        behavior: 'smooth'
    });
});

// Counter animation for stats
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (counter.textContent.includes('+')) {
                counter.textContent = Math.floor(current) + '+';
            } else if (counter.textContent.includes(',')) {
                counter.textContent = Math.floor(current).toLocaleString();
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Placeholder images for gallery (using CSS gradients as placeholders)
function createPlaceholderImages() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach((img, index) => {
        // Create placeholder with Islamic-inspired colors and patterns
        const colors = [
            'linear-gradient(135deg, #2c5530, #4a7c59)',
            'linear-gradient(135deg, #1e3a2e, #2d5633)',
            'linear-gradient(135deg, #4a7c59, #6b9474)',
            'linear-gradient(135deg, #2c5530, #3d6b43)'
        ];
        
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 400);
        gradient.addColorStop(0, '#2c5530');
        gradient.addColorStop(1, '#4a7c59');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        // Add Islamic geometric pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        // Draw geometric pattern
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const x = i * 50 + 25;
                const y = j * 50 + 25;
                
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                if ((i + j) % 2 === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x - 10, y - 10);
                    ctx.lineTo(x + 10, y + 10);
                    ctx.moveTo(x + 10, y - 10);
                    ctx.lineTo(x - 10, y + 10);
                    ctx.stroke();
                }
            }
        }
        
        // Add MSA text overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('MSA Event', 200, 180);
        ctx.font = '16px Inter';
        ctx.fillText('Photo Coming Soon', 200, 220);
        
        img.src = canvas.toDataURL();
    });
}

// Gallery Toggle Handler
class GalleryToggle {
    constructor() {
        this.galleryGrid = document.querySelector('.gallery-grid');
        this.toggleBtn = document.getElementById('galleryToggleBtn');
        this.toggleText = this.toggleBtn?.querySelector('.toggle-text');
        this.toggleIcon = this.toggleBtn?.querySelector('.toggle-icon');
        this.init();
    }

    init() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.toggleGallery();
            });
        }
    }

    toggleGallery() {
        const isExpanded = this.galleryGrid.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse gallery
            this.galleryGrid.classList.remove('expanded');
            this.toggleText.textContent = 'Show More Photos';
            this.toggleIcon.classList.remove('fa-chevron-up');
            this.toggleIcon.classList.add('fa-chevron-down');
        } else {
            // Expand gallery
            this.galleryGrid.classList.add('expanded');
            this.toggleText.textContent = 'Show Less Photos';
            this.toggleIcon.classList.remove('fa-chevron-down');
            this.toggleIcon.classList.add('fa-chevron-up');
        }
        
        // Re-apply current filter to update visibility
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filter = activeFilter.getAttribute('data-filter');
            const galleryFilter = new GalleryFilter();
            galleryFilter.filterGallery(filter);
        }
    }
}

// Photo Notification Handler Class
class PhotoNotificationHandler {
    constructor() {
        this.storageKey = 'msa_photo_notifications';
        this.initializeForm();
    }

    initializeForm() {
        const form = document.getElementById('photoNotificationForm');
        const emailInput = document.getElementById('emailInput');
        const phoneInput = document.getElementById('phoneInput');
        const messageDiv = document.getElementById('formMessage');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleSubmission(emailInput, phoneInput, messageDiv);
            return false;
        });

        // Clear other input when user types in one
        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim()) {
                phoneInput.value = '';
            }
        });

        phoneInput.addEventListener('input', () => {
            if (phoneInput.value.trim()) {
                emailInput.value = '';
            }
        });
    }

    handleSubmission(emailInput, phoneInput, messageDiv) {
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        // Validation
        if (!email && !phone) {
            this.showMessage(messageDiv, 'Please enter either an email address or phone number.', 'error');
            return;
        }

        if (email && !this.isValidEmail(email)) {
            this.showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }

        if (phone && !this.isValidPhone(phone)) {
            this.showMessage(messageDiv, 'Please enter a valid phone number.', 'error');
            return;
        }

        // Check if already subscribed
        if (this.isAlreadySubscribed(email, phone)) {
            this.showMessage(messageDiv, 'You are already subscribed for photo notifications!', 'error');
            return;
        }

        // Store the data
        const contactData = {
            email: email || null,
            phone: phone || null,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        // Save the data
        this.saveNotificationData(contactData);
        
        // Send confirmation email and SMS
        this.sendConfirmationMessages(email, phone);
        
        // Show success message with more details
        const contactInfo = email ? `email: ${email}` : `phone: ${phone}`;
        this.showMessage(messageDiv, `🎉 Success! Your ${contactInfo} has been saved for notifications. Check your ${email ? 'email' : 'phone'} for confirmation!`, 'success');
        
        // Clear the form
        emailInput.value = '';
        phoneInput.value = '';
        
        // Log for verification
        console.log('Notification signup successful:', contactData);
        console.log('Total subscribers:', this.getStoredNotifications().length);
        
        // Close modal and refresh page after success
        setTimeout(() => {
            // Close the notification modal
            const modal = document.getElementById('notificationModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Refresh the page
            window.location.reload();
        }, 3000); // Increased to 3 seconds to show the confirmation message
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it's 10 or 11 digits (with or without country code)
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }

    isAlreadySubscribed(email, phone) {
        const existingData = this.getStoredNotifications();
        return existingData.some(item => 
            (email && item.email === email) || 
            (phone && item.phone === phone)
        );
    }

    saveNotificationData(data) {
        const existingData = this.getStoredNotifications();
        existingData.push(data);
        localStorage.setItem(this.storageKey, JSON.stringify(existingData));
        
        // Also log to console for admin purposes
        console.log('New photo notification subscription:', data);
    }

    getStoredNotifications() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (error) {
            console.error('Error reading stored notifications:', error);
            return [];
        }
    }

    showMessage(messageDiv, message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }, 5000);
        }
    }

    // Send confirmation email and SMS
    sendConfirmationMessages(email, phone) {
        if (email) {
            this.sendConfirmationEmail(email);
        }
        if (phone) {
            this.sendConfirmationSMS(phone);
        }
    }

    // Send confirmation email using EmailJS
    sendConfirmationEmail(email) {
        const templateParams = {
            to_email: email,
            to_name: email.split('@')[0], // Use part before @ as name
            from_name: 'Rutgers MSA',
            message: `Welcome to Rutgers MSA notifications! 🎉

You've successfully signed up to receive updates about:
• Upcoming MSA events
• New event photos when we post them
• Important announcements

Thank you for staying connected with the Rutgers Muslim Student Association!

Best regards,
The Rutgers MSA Team

---
Follow us:
Instagram: @rutgersmsa
YouTube: @rutgersmsa
TikTok: @rutgersmsa

Website developed by Shaheer Saud at Cipher Consulting
cipherconsulting.net`
        };

        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS IDs
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Email sending failed:', error);
            });
    }

    // Send confirmation SMS using Twilio (via your backend endpoint)
    sendConfirmationSMS(phone) {
        const message = `Welcome to Rutgers MSA! 🕌 You'll now receive updates about our events and photos. Thanks for joining our community! - Rutgers MSA Team`;

        // This would call your backend endpoint that handles Twilio
        fetch('/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('SMS sent successfully:', data);
        })
        .catch(error => {
            console.error('SMS sending failed:', error);
        });
    }

    // Function to send event/photo updates to all subscribers
    sendBulkNotifications(subject, message, type = 'both') {
        const subscribers = this.getStoredNotifications();
        
        subscribers.forEach(subscriber => {
            if (type === 'email' || type === 'both') {
                if (subscriber.email) {
                    this.sendUpdateEmail(subscriber.email, subject, message);
                }
            }
            
            if (type === 'sms' || type === 'both') {
                if (subscriber.phone) {
                    this.sendUpdateSMS(subscriber.phone, message);
                }
            }
        });
        
        console.log(`Sent notifications to ${subscribers.length} subscribers`);
    }

    // Send update email
    sendUpdateEmail(email, subject, message) {
        const templateParams = {
            to_email: email,
            to_name: email.split('@')[0],
            from_name: 'Rutgers MSA',
            subject: subject,
            message: `${message}

Best regards,
The Rutgers MSA Team

---
Follow us:
Instagram: @rutgersmsa
YouTube: @rutgersmsa
TikTok: @rutgersmsa

To unsubscribe, reply to this email with 'UNSUBSCRIBE'`
        };

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_UPDATE_TEMPLATE_ID', templateParams)
            .then((response) => {
                console.log('Update email sent to:', email);
            })
            .catch((error) => {
                console.error('Update email failed for:', email, error);
            });
    }

    // Send update SMS
    sendUpdateSMS(phone, message) {
        const smsMessage = `${message} - Rutgers MSA. Reply STOP to unsubscribe.`;

        fetch('/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                message: smsMessage
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update SMS sent to:', phone);
        })
        .catch(error => {
            console.error('Update SMS failed for:', phone, error);
        });
    }

    // Admin function to get all stored notifications
    getAllNotifications() {
        return this.getStoredNotifications();
    }

    // Admin function to export notifications
    exportNotifications() {
        const data = this.getStoredNotifications();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'msa_photo_notifications.json';
        link.click();
        
        console.log('Exported', data.length, 'notification subscriptions');
    }
    
    // Test function to verify data saving
    testDataSaving() {
        console.log('Testing data saving...');
        const testData = {
            email: 'test@example.com',
            phone: null,
            timestamp: new Date().toISOString(),
            id: 'test-' + Date.now()
        };
        
        this.saveNotificationData(testData);
        const stored = this.getStoredNotifications();
        const found = stored.find(item => item.id === testData.id);
        
        if (found) {
            console.log('✅ Data saving works correctly!');
            console.log('Test data saved:', found);
            console.log('Total stored items:', stored.length);
        } else {
            console.error('❌ Data saving failed!');
        }
        
        return found;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventCalendar();
    new EventGallery();
    new GalleryToggle();
    new ContactForm();
    new ScrollAnimations();
    new CounterAnimation();
    new PhotoNotificationHandler();
    createPlaceholderImages();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Navbar active link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add smooth reveal animations for text content
const revealElements = document.querySelectorAll('.hero-content > *, .section-header > *, .about-text > *');
revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, 500 + index * 100);
});

// Easter egg: Konami code for special animation
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Special MSA animation
        document.body.style.animation = 'rainbow 2s infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 4000);
    }
});

// Replace team icons with uploaded team logo images when available
function applyTeamLogos() {
    const teamKeyAliases = {
        'hope': ['hope', 'rumsa.hope', 'charity'],
        'ladders': ['ladders', 'career'],
        'iaw': ['iaw', 'islamic awareness week'],
        'r2r': ['r2r', 'road to revival', 'road2revival'],
        'submissions': ['submissions', 'creative'],
        'sisters': ['sisters social', 'sisters'],
        'brothers': ['brothers social', 'brothers']
    };

    const resolveKeyFromText = (text) => {
        const lower = text.toLowerCase();
        for (const [key, aliases] of Object.entries(teamKeyAliases)) {
            if (lower.includes(key) || aliases.some(a => lower.includes(a))) return key;
        }
        return null;
    };

    const tryLoadImage = (iconEl, key) => {
        if (!key) return;
        const aliasFilesByKey = {
            'hope': ['hope'],
            'ladders': ['ladders','lad','ladd'],
            'iaw': ['iaw','IAW'],
            'r2r': ['r2r','RR','rr'],
            'submissions': ['submissions','sub','SUB'],
            'sisters': ['sisters','ss','sisterssocial'],
            'brothers': ['brothers','bs','brotherssocial']
        };
        const aliases = aliasFilesByKey[key] || [key];
        const exts = ['png','jpg','jpeg','svg'];
        const bases = ['', 'assets/', 'assets/teams/'];
        const candidates = [];
        aliases.forEach(a => exts.forEach(ext => bases.forEach(base => candidates.push(`${base}${a}.${ext}`))));

        let index = 0;
        const img = new Image();
        img.alt = `${key} logo`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';

        const next = () => {
            if (index >= candidates.length) return; // fallback: keep icon font
            img.src = candidates[index++];
        };

        img.onerror = () => next();

        img.onload = () => {
            iconEl.innerHTML = '';
            // Tag with theme class for custom ring colors
            iconEl.classList.add(`theme-${key}`);
            // Tag parent card for tile theming
            const card = iconEl.closest('.team-card');
            if (card) card.classList.add(`card-theme-${key}`);
            iconEl.appendChild(img);
        };

        next();
    };

    document.querySelectorAll('.team-card .team-icon').forEach(iconEl => {
        // Priority 1: infer from class names like 'team-icon hope'
        const classKey = Array.from(iconEl.classList).find(c => ['hope','ladders','iaw','r2r','submissions','sisters','brothers'].includes(c));
        if (classKey) {
            tryLoadImage(iconEl, classKey);
            return;
        }

        // Priority 2: infer from nearby heading text
        const heading = iconEl.closest('.team-card')?.querySelector('h3')?.textContent || '';
        const resolved = resolveKeyFromText(heading);
        tryLoadImage(iconEl, resolved);
    });
}

// Hero Slideshow Functionality
class HeroSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    init() {
        if (this.slides.length > 0) {
            this.startSlideshow();
        }
    }

    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        this.slides[index].classList.add('active');
        
        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    startSlideshow() {
        // Change slide every 5 seconds
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlideshow();
    initializeFlipCards();
    initializeNotificationModal();
    initializeRemindMeModal();
});

// Initialize notification modal functionality
function initializeNotificationModal() {
    const floatingBtn = document.getElementById('floatingNotificationBtn');
    const modal = document.getElementById('notificationModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const overlay = document.querySelector('.notification-modal-overlay');
    
    if (!floatingBtn || !modal) return;
    
    // Open modal
    floatingBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Flip Cards Mobile Touch Support
function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        // Add click/touch support for mobile devices
        card.addEventListener('click', function(e) {
            // Only handle clicks on mobile devices (touch screens)
            if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
                e.preventDefault();
                this.classList.toggle('flipped');
                
                // Remove flipped class from other cards
                flipCards.forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.classList.remove('flipped');
                    }
                });
            }
        });
        
        // Prevent clicks on social links from flipping the card
        const socialLinks = card.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    });
    
    // Close all flipped cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.flip-card')) {
            flipCards.forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });
}

// Initialize Remind Me modal functionality
function initializeRemindMeModal() {
    const remindMeBtn = document.getElementById('remindMeBtn');
    const modal = document.getElementById('remindMeModal');
    const closeBtn = document.getElementById('remindMeCloseBtn');
    const overlay = document.querySelector('.remind-me-modal-overlay');
    const form = document.getElementById('remindMeForm');
    const emailInput = document.getElementById('remindMeEmail');
    const messageDiv = document.getElementById('remindMeMessage');
    
    if (!remindMeBtn || !modal) return;
    
    // Open the notification modal instead of remind me modal
    remindMeBtn.addEventListener('click', function() {
        const notificationModal = document.getElementById('notificationModal');
        if (notificationModal) {
            notificationModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on email input in notification modal
            const notificationEmailInput = document.getElementById('emailInput');
            if (notificationEmailInput) {
                setTimeout(() => notificationEmailInput.focus(), 100);
            }
        }
    });
    
    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        messageDiv.innerHTML = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showRemindMeMessage('Please enter your email address.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showRemindMeMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Store email in localStorage
        storeRemindMeEmail(email);
        
        showRemindMeMessage('🎉 Reminder set! You\'ll be notified about the Freshman Orientation event.', 'success');
        
        // Close modal after 2 seconds
        setTimeout(() => {
            closeModal();
        }, 2000);
        
        return false;
    });
}

// Store email in localStorage
function storeRemindMeEmail(email) {
    try {
        // Get existing emails
        let remindMeEmails = JSON.parse(localStorage.getItem('remindMeEmails') || '[]');
        
        // Check if email already exists
        if (!remindMeEmails.includes(email)) {
            remindMeEmails.push(email);
            localStorage.setItem('remindMeEmails', JSON.stringify(remindMeEmails));
        }
        
        // Also store with timestamp
        const reminderData = {
            email: email,
            event: 'Freshman Orientation',
            timestamp: new Date().toISOString(),
            reminded: false
        };
        
        let remindMeData = JSON.parse(localStorage.getItem('remindMeData') || '[]');
        
        // Check if this email/event combination already exists
        const existingIndex = remindMeData.findIndex(item => 
            item.email === email && item.event === 'Freshman Orientation'
        );
        
        if (existingIndex === -1) {
            remindMeData.push(reminderData);
            localStorage.setItem('remindMeData', JSON.stringify(remindMeData));
        }
        
        console.log('Remind Me email stored:', email);
        console.log('All stored emails:', remindMeEmails);
        console.log('All reminder data:', remindMeData);
        
    } catch (error) {
        console.error('Error storing remind me email:', error);
    }
}

// Show message in remind me modal
function showRemindMeMessage(message, type) {
    const messageDiv = document.getElementById('remindMeMessage');
    if (!messageDiv) return;
    
    messageDiv.innerHTML = message;
    messageDiv.className = 'form-message';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
}

// Get all stored remind me emails (for admin/development use)
function getRemindMeEmails() {
    try {
        return JSON.parse(localStorage.getItem('remindMeEmails') || '[]');
    } catch (error) {
        console.error('Error retrieving remind me emails:', error);
        return [];
    }
}

// Get all stored remind me data (for admin/development use)
function getRemindMeData() {
    try {
        return JSON.parse(localStorage.getItem('remindMeData') || '[]');
    } catch (error) {
        console.error('Error retrieving remind me data:', error);
        return [];
    }
}

