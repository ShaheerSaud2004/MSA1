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
            '2025-09-04': [{ title: 'Fall Kickoff', location: 'LSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-09-09': [{ title: 'Freshman Orientation', location: 'Trayes Hall', type: 'Ladders', time: '6:00 - 9:00' }],
            '2025-09-11': [{ title: 'Scavenger Hunt', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-09-16': [
                { title: 'Sisters\' Social', location: 'BSC MPR', type: 'Sisters Social', time: '6:00 - 9:00' },
                { title: 'Brothers\' Social', location: 'Gathering Lounge', type: 'Brothers Social', time: '6:00 - 9:00' }
            ],
            '2025-09-18': [{ title: 'Shama\'il', location: 'Voorhees Mall', type: 'General', time: '6:00 - 9:00' }],
            '2025-09-23': [{ title: 'Submissions Event', location: 'CA MPR', type: 'Submissions', time: '6:00 - 9:00' }],
            '2025-09-25': [{ title: 'Speed-Friending', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-09-30': [{ title: 'HOPE Drive: Clothing & Hygiene', location: 'College Ave SC Multipurpose Room', type: 'HOPE', time: '5:00 - 9:00' }],
            '2025-10-02': [{ title: 'MSA Olympics', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-10-09': [{ title: 'Racism/Classism Discussion', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-10-14': [{ title: 'Ladders Event', location: 'Gathering Lounge', type: 'Ladders', time: '6:00 - 9:00' }],
            '2025-10-16': [{ title: 'Cultures of the World', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-10-20': [{ title: 'Charity Week Day 1', location: 'TBD', type: 'HOPE', time: 'TBD' }],
            '2025-10-21': [{ title: 'Charity Week Day 2', location: 'TBD', type: 'HOPE', time: 'TBD' }],
            '2025-10-22': [{ title: 'Charity Week Day 3', location: 'TBD', type: 'HOPE', time: 'TBD' }],
            '2025-10-23': [{ title: 'Charity Week Finale', location: 'LSC MPR', type: 'HOPE', time: '6:00 - 9:00' }],
            '2025-10-28': [
                { title: 'Sisters\' Social', location: 'Glass Room', type: 'Sisters Social', time: '6:00 - 9:00' },
                { title: 'Brothers\' Social', location: 'Gathering Lounge', type: 'Brothers Social', time: '6:00 - 9:00' }
            ],
            '2025-10-30': [{ title: 'Taboo Topics', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-11-04': [{ title: 'Pre-IAW Event', location: 'LSC MPR', type: 'IAW', time: '6:00 - 9:00' }],
            '2025-11-06': [{ title: 'Qur\'an Night', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-11-09': [{ title: 'Art Gala', location: 'BSC MPR, Cove, Center Hall, Int. Lounge', type: 'Submissions', time: '6:00 - 9:00' }],
            '2025-11-11': [{ title: 'Special MSA Event', location: 'Coffee House, 202 ABC, BSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-11-13': [{ title: 'MSA Misc. Event', location: 'LSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-11-18': [{ title: 'Pre-R2R Event', location: 'BSC MPR', type: 'R2R', time: '6:00 - 9:00' }],
            '2025-11-20': [{ title: 'Death, Resurrection, & Afterlife', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2025-11-25': [
                { title: 'Sisters\' Social', location: 'CA MPR', type: 'Sisters Social', time: '6:00 - 9:00' },
                { title: 'Brothers\' Social', location: 'BSC MPR', type: 'Brothers Social', time: '6:00 - 9:00' }
            ],
            '2025-12-02': [{ title: 'Submissions Event', location: 'Center Hall', type: 'Submissions', time: '6:00 - 9:00' }],
            '2025-12-04': [{ title: 'End of Semester Event', location: 'CA MPR + Lounge', type: 'General', time: '6:00 - 9:00' }],
            
            // Spring 2026 Events
            '2026-01-20': [{ title: 'HOPE Event', location: 'CA MPR & LSC MPR', type: 'HOPE', time: 'TBD' }],
            '2026-01-22': [{ title: 'Spring Kickoff', location: 'CA MPR + Lounge', type: 'General', time: '6:00 - 9:00' }],
            '2026-01-27': [
                { title: 'WHW Event', location: 'Gathering Lounge', type: 'Sisters Social', time: '6:00 - 9:00' },
                { title: 'Brothers\' Social', location: 'LSC MPR', type: 'Brothers Social', time: '6:00 - 9:00' }
            ],
            '2026-01-29': [{ title: 'Islamic Identity (WHW)', location: 'CA MPR + Lounge', type: 'General', time: '6:00 - 9:00' }],
            '2026-01-30': [{ title: 'R2R Setup', location: 'CA 108, 109', type: 'R2R', time: '6:00 - 9:00' }],
            '2026-01-31': [{ title: 'R2R Conference', location: 'CA MPR + Lounge, 411 ABC, 108, 109, Cap & Skull', type: 'R2R', time: '6:00 - 9:00' }],
            '2026-02-03': [{ title: 'Submissions Event', location: 'LSC MPR', type: 'Submissions', time: '6:00 - 9:00' }],
            '2026-02-05': [{ title: 'Mental Health Workshop', location: 'BSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2026-02-10': [{ title: 'Pre-IAW Event', location: 'Trayes Hall, Gathering Lounge, Glass Room', type: 'IAW', time: '6:00 - 9:00' }],
            '2026-02-12': [{ title: 'Brainrot / Pre-Ramadan', location: 'CA MPR + Lounge', type: 'General', time: '6:00 - 9:00' }],
            '2026-02-14': [{ title: 'Alumni Gala Setup', location: 'CA MPR + Lounge', type: 'Ladders', time: '6:00 - 9:00' }],
            '2026-02-15': [{ title: 'Alumni Gala', location: 'CA MPR + Lounge', type: 'Ladders', time: '6:00 - 9:00' }],
            '2026-02-17': [{ title: 'Ramadan Begins', location: 'Community Wide', type: 'General', time: 'All Month' }],
            '2026-02-19': [{ title: 'Iftar #1', location: 'BSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2026-02-24': [
                { title: 'Sisters Social Iftar', location: 'BSC MPR', type: 'Sisters Social', time: '6:00 - 9:00' },
                { title: 'Brothers Social Iftar', location: 'Gathering Lounge', type: 'Brothers Social', time: '6:00 - 9:00' }
            ],
            '2026-02-26': [{ title: 'Iftar #2', location: 'BSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2026-03-03': [{ title: 'R2R Iftar', location: 'CA MPR', type: 'R2R', time: '6:00 - 9:00' }],
            '2026-03-05': [{ title: 'Iftar #3', location: 'BSC MPR & CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2026-03-12': [{ title: 'Last 10 Nights', location: 'CA MPR', type: 'General', time: '6:00 - 9:00' }],
            '2026-03-19': [{ title: 'Ramadan Ends', location: 'Community Wide', type: 'General', time: 'All Day' }],
            '2026-03-24': [{ title: 'Dawah Workshop', location: 'LSC MPR & Gathering Lounge', type: 'IAW', time: '6:00 - 9:00' }],
            '2026-03-26': [{ title: '50(ish) Years of MSA', location: 'Trayes Hall', type: 'General', time: '6:00 - 9:00' }],
            '2026-03-31': [{ title: 'Ladders Event', location: 'Center Hall, Glass Room, Gathering Lounge', type: 'Ladders', time: '6:00 - 9:00' }],
            '2026-04-02': [{ title: 'Elections', location: 'BSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2026-04-07': [{ title: 'HOPE Event', location: 'CSC MPR & Cove', type: 'HOPE', time: '6:00 - 9:00' }],
            '2026-04-09': [{ title: 'End of Semester Event', location: 'LSC MPR', type: 'General', time: '6:00 - 9:00' }],
            '2026-04-14': [{ title: 'Submissions Event', location: 'BSC MPR', type: 'Submissions', time: '6:00 - 9:00' }],
            '2026-04-17': [{ title: 'Eid Bazaar', location: 'President\'s Tent', type: 'General', time: '6:00 - 9:00' }],
            '2026-04-20': [{ title: 'IAW Day 1', location: 'Morell Street', type: 'IAW', time: '6:00 - 9:00' }],
            '2026-04-21': [{ title: 'IAW Day 2', location: 'Morell Street', type: 'IAW', time: '6:00 - 9:00' }],
            '2026-04-22': [{ title: 'IAW Day 3', location: 'Morell Street', type: 'IAW', time: '6:00 - 9:00' }],
            '2026-04-23': [{ title: 'IAW Day 4', location: 'Morell Street', type: 'IAW', time: '6:00 - 9:00' }]
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
                    console.log('Clicked on day:', day, 'dateString:', dateString, 'events:', events);
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

        // Format date - parse correctly to avoid timezone issues
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month - 1 because JavaScript months are 0-indexed
        
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
                        count: 226,
                        photos: this.generateBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters', 
                        count: 180,
                        photos: this.generateSistersPhotos()
                    }
                }
            },
            'freshman-orientation': {
                name: 'Freshman Orientation',
                poster: 'images/posters/Freshman Orientation.JPG',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 5,
                        photos: this.generateFreshmanBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 6,
                        photos: this.generateFreshmanSistersPhotos()
                    }
                }
            },
            'scavenger-hunt': {
                name: 'Scavenger Hunt',
                poster: 'Scavenger Hunt.jpg',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 77,
                        photos: this.generateScavengerHuntBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters', 
                        count: 100,
                        photos: this.generateScavengerHuntSistersPhotos()
                    }
                }
            },
            'chai-and-chats': {
                name: 'Chai and Chats',
                poster: 'Chai and Chats.png',
                albums: {
                    'brothers': {
                        name: 'Chai Brothers',
                        count: 46,
                        photos: this.generateChaiBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Chai Sisters', 
                        count: 21,
                        photos: this.generateChaiSistersPhotos()
                    }
                }
            },
            'snacks-and-suhbah': {
                name: 'Snacks and Suhbah',
                poster: 'Snacks$SUHBAH.png',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 158,
                        photos: this.generateSnacksBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 128,
                        photos: this.generateSnacksSistersPhotos()
                    }
                }
            },
            'art-night': {
                name: 'Art Night',
                poster: 'images/gallery/Photos/ArtNight.png',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 50,
                        photos: this.generateArtNightBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 86,
                        photos: this.generateArtNightSistersPhotos()
                    }
                }
            },
            'msa-olympics': {
                name: 'MSA Olympics',
                poster: 'images/posters/MSA OLYMPICS POSTER.png',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 156,
                        photos: this.generateMSAOlympicsBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 79,
                        photos: this.generateMSAOlympicsSistersPhotos()
                    }
                }
            },
            'cultures-of-the-world': {
                name: 'Cultures of the World',
                poster: 'CulturesOfTheWorld.jpg',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 362,
                        photos: this.generateCulturesOfTheWorldBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 532,
                        photos: this.generateCulturesOfTheWorldSistersPhotos()
                    }
                }
            },
            'hope-drive': {
                name: 'Hope Clothing & Hygiene Drive',
                poster: 'HopeDrive.jpg',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 60,
                        photos: this.generateHopeDriveBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 74,
                        photos: this.generateHopeDriveSistersPhotos()
                    }
                }
            },
            'breaking-barriers': {
                name: 'Breaking Barriers',
                poster: 'images/posters/Breaking Barriers.png',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 16,
                        photos: this.generateBreakingBarriersBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 20,
                        photos: this.generateBreakingBarriersSistersPhotos()
                    }
                }
            },
            'ladders-workshop': {
                name: 'Ladders Workshop',
                poster: 'images/gallery/Ladders Workshop | Brothers/1-f39266ef-2fa0-4263-944b-b4444b73132d.jpg',
                albums: {
                    'brothers': {
                        name: 'Brothers',
                        count: 27,
                        photos: this.generateLaddersWorkshopBrothersPhotos()
                    },
                    'sisters': {
                        name: 'Sisters',
                        count: 17,
                        photos: this.generateLaddersWorkshopSistersPhotos()
                    }
                }
            },
            'career-prep': {
                name: 'Career Prep Workshop',
                poster: 'images/Career Prep.jpg',
                albums: {
                    'general': {
                        name: 'Event Photos',
                        count: 0,
                        photos: []
                    }
                }
            }
            // Future events can be easily added here
        };
    }

    generateBrothersPhotos() {
        const brothersFiles = [
            '1-IMG_6431.jpg', '2-IMG_6433.jpg', '3-IMG_6434.jpg', '4-IMG_6435.jpg', '5-IMG_6436.jpg',
            '6-IMG_6438.jpg', '7-IMG_6439.jpg', '8-IMG_6440.jpg', '9-IMG_6442.jpg', '10-IMG_6443.jpg',
            '11-IMG_6444.jpg', '12-IMG_6445.jpg', '13-IMG_6446.jpg', '14-IMG_6447.jpg', '15-IMG_6448.jpg',
            '16-IMG_6449.jpg', '17-IMG_6450.jpg', '18-IMG_6451.jpg', '19-IMG_6452.jpg', '20-IMG_6453.jpg',
            '21-IMG_6454.jpg', '22-IMG_6455.jpg', '23-IMG_6456.jpg', '24-IMG_6457.jpg', '25-IMG_6458.jpg',
            '26-IMG_6459.jpg', '27-IMG_6460.jpg', '28-IMG_6461.jpg', '29-IMG_6462.jpg', '30-IMG_6463.jpg',
            '31-IMG_6464.jpg', '32-IMG_6465.jpg', '33-IMG_6466.jpg', '34-IMG_6467.jpg', '35-IMG_6468.jpg',
            '36-IMG_6469.jpg', '37-IMG_6470.jpg', '38-IMG_6471.jpg', '39-IMG_6472.jpg', '40-IMG_6473.jpg',
            '41-IMG_6474.jpg', '42-IMG_6475.jpg', '43-IMG_6476.jpg', '44-IMG_6477.jpg', '45-IMG_6478.jpg',
            '46-IMG_6479.jpg', '47-IMG_6480.jpg', '48-IMG_6481.jpg', '49-IMG_6482.jpg', '50-IMG_6483.jpg',
            '51-IMG_6484.jpg', '52-IMG_6485.jpg', '53-IMG_6486.jpg', '54-IMG_6487.jpg', '55-IMG_6488.jpg',
            '56-IMG_6489.jpg', '57-IMG_6490.jpg', '58-IMG_6491.jpg', '59-IMG_6492.jpg', '60-IMG_6493.jpg',
            '61-IMG_6496.jpg', '62-IMG_6497.jpg', '63-IMG_6498.jpg', '64-IMG_6499.jpg', '65-IMG_6500.jpg',
            '66-IMG_6501.jpg', '67-IMG_6505.jpg', '68-IMG_6506.jpg', '69-IMG_6508.jpg', '70-IMG_6509.jpg',
            '71-IMG_6510.jpg', '72-IMG_6511.jpg', '73-IMG_6512.jpg', '74-IMG_6515.jpg', '75-IMG_6516.jpg',
            '76-IMG_6517.jpg', '77-IMG_6518.jpg', '78-IMG_6519.jpg', '79-IMG_6520.jpg', '80-IMG_6521.jpg',
            '81-IMG_6522.jpg', '82-IMG_6523.jpg', '83-IMG_6524.jpg', '84-IMG_6527.jpg', '85-IMG_6528.jpg',
            '86-IMG_6529.jpg', '87-IMG_6530.jpg', '88-IMG_6531.jpg', '89-IMG_6532.jpg', '90-IMG_6533.jpg',
            '91-IMG_6534.jpg', '92-IMG_6535.jpg', '93-IMG_6536.jpg', '94-IMG_6537.jpg', '95-IMG_6538.jpg',
            '96-IMG_6539.jpg', '97-IMG_6540.jpg', '98-IMG_6541.jpg', '99-IMG_6542.jpg', '100-IMG_6543.jpg',
            '101-IMG_6544.jpg', '102-IMG_6545.jpg', '103-IMG_6546.jpg', '104-IMG_6547.jpg', '105-IMG_6548.jpg',
            '106-IMG_6549.jpg', '107-IMG_6550.jpg', '108-IMG_6551.jpg', '109-IMG_6553.jpg', '110-IMG_6554.jpg',
            '111-IMG_6555.jpg', '112-IMG_6556.jpg', '113-IMG_6557.jpg', '114-IMG_6558.jpg', '115-IMG_6559.jpg',
            '116-IMG_6561.jpg', '117-IMG_6562.jpg', '118-IMG_6563.jpg', '119-IMG_6564.jpg', '120-IMG_6565.jpg',
            '121-IMG_6566.jpg', '122-IMG_6567.jpg', '123-IMG_6568.jpg', '124-IMG_6569.jpg', '125-IMG_6570.jpg',
            '126-IMG_6571.jpg', '127-IMG_6572.jpg', '128-IMG_6573.jpg', '129-IMG_6574.jpg', '130-IMG_6575.jpg',
            '131-IMG_6576.jpg', '132-IMG_6577.jpg', '133-IMG_6578.jpg', '134-IMG_6579.jpg', '135-IMG_6580.jpg',
            '136-IMG_6581.jpg', '137-IMG_6582.jpg', '138-IMG_6583.jpg', '139-IMG_6584.jpg', '140-IMG_6585.jpg',
            '141-IMG_6586.jpg', '142-IMG_6587.jpg', '143-IMG_6588.jpg', '144-IMG_6589.jpg', '145-IMG_6590.jpg',
            '146-IMG_6591.jpg', '147-IMG_6592.jpg', '148-IMG_6593.jpg', '149-IMG_6594.jpg', '150-IMG_6595.jpg',
            '151-IMG_6596.jpg', '152-IMG_6597.jpg', '153-IMG_6598.jpg', '154-IMG_6599.jpg', '155-IMG_6600.jpg',
            '156-IMG_6601.jpg', '157-IMG_6602.jpg', '158-IMG_6603.jpg', '159-IMG_6604.jpg', '160-IMG_6605.jpg',
            '161-IMG_6606.jpg', '162-IMG_6607.jpg', '163-IMG_6608.jpg', '164-IMG_6609.jpg', '165-IMG_6610.jpg',
            '166-IMG_6611.jpg', '167-IMG_6612.jpg', '168-IMG_6613.jpg', '169-IMG_6614.jpg', '170-IMG_6615.jpg',
            '171-IMG_6616.jpg', '172-IMG_6617.jpg', '173-IMG_6618.jpg', '174-IMG_6619.jpg', '175-IMG_6620.jpg',
            '176-IMG_6621.jpg', '177-IMG_6622.jpg', '178-IMG_6623.jpg', '179-IMG_6624.jpg', '180-IMG_6625.jpg',
            '181-IMG_6626.jpg', '182-IMG_6627.jpg', '183-IMG_6628.jpg', '184-IMG_6629.jpg', '185-IMG_6630.jpg',
            '186-IMG_6631.jpg', '187-IMG_6632.jpg', '188-IMG_6633.jpg', '189-IMG_6634.jpg', '190-IMG_6635.jpg',
            '191-IMG_6636.jpg', '192-IMG_6637.jpg', '193-IMG_6638.jpg', '194-IMG_6639.jpg', '195-IMG_6640.jpg',
            '196-IMG_6641.jpg', '197-IMG_6642.jpg', '198-IMG_6643.jpg', '199-IMG_6644.jpg', '200-IMG_6645.jpg',
            '201-IMG_6646.jpg', '202-IMG_6647.jpg', '203-IMG_6648.jpg', '204-IMG_6649.jpg', '205-IMG_6650.jpg',
            '206-IMG_6651.jpg', '207-IMG_6652.jpg', '208-IMG_6653.jpg', '209-IMG_6654.jpg', '210-IMG_6655.jpg',
            '211-IMG_6656.jpg', '212-IMG_6657.jpg', '213-IMG_6658.jpg', '214-IMG_6659.jpg', '215-IMG_6660.jpg',
            '216-IMG_6661.jpg', '217-IMG_6662.jpg', '218-IMG_6663.jpg', '219-IMG_6664.jpg', '220-IMG_6665.jpg',
            '221-IMG_6666.jpg', '222-IMG_6667.jpg', '223-IMG_6668.jpg', '224-IMG_6669.jpg', '225-IMG_6670.jpg',
            '226-IMG_6671.jpg'
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

    generateScavengerHuntBrothersPhotos() {
        const brothersFiles = [
            '1-IMG_4373.jpg', '10-IMG_4379.jpg', '11-IMG_4380.jpg', '12-IMG_4372.jpg', '13-IMG_4383.jpg',
            '14-IMG_4384.jpg', '15-IMG_4385.jpg', '16-IMG_4386.jpg', '17-IMG_4387.jpg', '18-IMG_4416.jpg',
            '19-IMG_4388.jpg', '2-IMG_4377.jpg', '20-IMG_4389.jpg', '21-IMG_4417.jpg', '22-IMG_4390.jpg',
            '23-IMG_4418.jpg', '24-IMG_4419.jpg', '25-IMG_4358.jpg', '26-IMG_4391.jpg', '27-IMG_4393.jpg',
            '28-IMG_4394.jpg', '29-IMG_4395.jpg', '3-IMG_4356.jpg', '30-IMG_4397.jpg', '31-IMG_4398.jpg',
            '32-IMG_4420.jpg', '33-IMG_4421.jpg', '34-IMG_4400.jpg', '35-IMG_4422.jpg', '36-IMG_4423.jpg',
            '37-IMG_4359.jpg', '38-IMG_4361.jpg', '39-IMG_4425.jpg', '4-IMG_4370.jpg', '40-IMG_4426.jpg',
            '41-IMG_4362.jpg', '42-IMG_4365.jpg', '43-IMG_4366.jpg', '44-IMG_4367.jpg', '45-IMG_4368.jpg',
            '46-IMG_4403.jpg', '47-IMG_4404.jpg', '48-IMG_4405.jpg', '49-IMG_4406.jpg', '5-IMG_4357.jpg',
            '50-IMG_4407.jpg', '51-IMG_4408.jpg', '52-IMG_4409.jpg', '53-IMG_4410.jpg', '54-IMG_4414.jpg',
            '55-IMG_1951.jpg', '56-IMG_1952.jpg', '57-IMG_1954.jpg', '58-IMG_1955.jpg', '59-IMG_1956.jpg',
            '6-IMG_4371.jpg', '60-IMG_1957.jpg', '61-IMG_1958.jpg', '62-IMG_1959.jpg', '63-IMG_1960.jpg',
            '64-IMG_1961.jpg', '65-IMG_1962.jpg', '66-IMG_1963.jpg', '67-IMG_1965.jpg', '68-IMG_1966.jpg',
            '69-IMG_1967.jpg', '7-IMG_4374.jpg', '70-IMG_1968.jpg', '71-IMG_1969.jpg', '72-IMG_1971.jpg',
            '73-IMG_1973.jpg', '74-IMG_1974.jpg', '75-IMG_1975.jpg', '76-IMG_1976.jpg', '77-IMG_1977.jpg',
            '8-IMG_4375.jpg', '9-IMG_4376.jpg'
        ];
        
        return brothersFiles.map(file => `images/gallery/Photos/Scavenger Hunt | Brothers/${file}`);
    }

    generateScavengerHuntSistersPhotos() {
        const sistersFiles = [
            '1-IMG_0923.jpg', '10-IMG_0932.jpg', '100-IMG_6759.jpg', '11-IMG_0933.jpg', '12-IMG_0934.jpg',
            '13-IMG_0935.jpg', '14-IMG_0936.jpg', '15-IMG_0939.jpg', '16-IMG_0940.jpg', '17-IMG_0941.jpg',
            '18-IMG_0942.jpg', '19-IMG_0945.jpg', '2-IMG_0924.jpg', '20-IMG_0946.jpg', '21-IMG_0947.jpg',
            '22-IMG_0948.jpg', '23-IMG_0949.jpg', '24-IMG_0950.jpg', '25-IMG_0951.jpg', '26-IMG_0952.jpg',
            '27-IMG_0953.jpg', '28-IMG_0954.jpg', '29-IMG_0958.jpg', '3-IMG_0925.jpg', '30-IMG_0959.jpg',
            '31-IMG_0960.jpg', '32-IMG_0961.jpg', '33-IMG_0962.jpg', '34-IMG_0963.jpg', '35-IMG_0965.jpg',
            '36-IMG_0966.jpg', '37-IMG_0967.jpg', '38-IMG_0970.jpg', '39-IMG_0971.jpg', '4-IMG_0926.jpg',
            '40-IMG_0972.jpg', '41-IMG_0973.jpg', '42-IMG_0974.jpg', '43-IMG_0975.jpg', '44-IMG_0976.jpg',
            '45-IMG_0977.jpg', '46-IMG_0978.jpg', '47-IMG_0979.jpg', '48-IMG_0980.jpg', '49-IMG_0985.jpg',
            '5-IMG_0927.jpg', '50-IMG_0986.jpg', '51-IMG_0987.jpg', '52-IMG_0989.jpg', '53-IMG_6694.jpg',
            '54-IMG_6697.jpg', '55-IMG_6698.jpg', '56-IMG_6699.jpg', '57-IMG_6700.jpg', '58-IMG_6701.jpg',
            '59-IMG_6702.jpg', '6-IMG_0928.jpg', '60-IMG_6705.jpg', '61-IMG_6706.jpg', '62-IMG_6707.jpg',
            '63-IMG_6708.jpg', '64-IMG_6710.jpg', '65-IMG_6714.jpg', '66-IMG_6716.jpg', '67-IMG_6717.jpg',
            '68-IMG_6718.jpg', '69-IMG_6719.jpg', '7-IMG_0929.jpg', '70-IMG_6720.jpg', '71-IMG_6721.jpg',
            '72-IMG_6722.jpg', '73-IMG_6723.jpg', '74-IMG_6724.jpg', '75-IMG_6725.jpg', '76-IMG_6726.jpg',
            '77-IMG_6727.jpg', '78-IMG_6728.jpg', '79-IMG_6730.jpg', '8-IMG_0930.jpg', '80-IMG_6734.jpg',
            '81-IMG_6736.jpg', '82-IMG_6737.jpg', '83-IMG_6738.jpg', '84-IMG_6739.jpg', '85-IMG_6740.jpg',
            '86-IMG_6741.jpg', '87-IMG_6742.jpg', '88-IMG_6745.jpg', '89-IMG_6746.jpg', '9-IMG_0931.jpg',
            '90-IMG_6747.jpg', '91-IMG_6748.jpg', '92-IMG_6749.jpg', '93-IMG_6750.jpg', '94-IMG_6751.jpg',
            '95-IMG_6752.jpg', '96-IMG_6753.jpg', '97-IMG_6754.jpg', '98-IMG_6756.jpg', '99-IMG_6758.jpg'
        ];
        
        return sistersFiles.map(file => `images/gallery/Photos/Scavenger Hunt | Sisters/${file}`);
    }

    generateChaiBrothersPhotos() {
        const brothersFiles = [
            '1-IMG_4513.jpg', '10-IMG_4518.jpg', '11-IMG_4448.jpg', '12-IMG_4449.jpg', '13-IMG_4486.jpg',
            '14-IMG_4450.jpg', '15-IMG_4451.jpg', '16-IMG_4452.jpg', '17-IMG_4453.jpg', '18-IMG_4454.jpg',
            '19-IMG_4455.jpg', '2-IMG_4436.jpg', '20-IMG_4456.jpg', '21-IMG_4487.jpg', '22-IMG_4457.jpg',
            '23-IMG_4458.jpg', '24-IMG_4459.jpg', '25-IMG_4460.jpg', '26-IMG_4461.jpg', '27-IMG_4489.jpg',
            '28-IMG_4490.jpg', '29-IMG_4464.jpg', '3-IMG_4437.jpg', '30-IMG_4465.jpg', '31-IMG_4495.jpg',
            '32-IMG_4479.jpg', '33-IMG_4480.jpg', '34-IMG_4481.jpg', '35-IMG_4482.jpg', '36-IMG_4483.jpg',
            '37-IMG_4500.jpg', '38-IMG_4484.jpg', '39-IMG_4504.jpg', '4-IMG_4440.jpg', '40-IMG_4506.jpg',
            '41-IMG_4507.jpg', '42-IMG_4508.jpg', '43-IMG_4509.jpg', '44-IMG_4510.jpg', '45-IMG_4511.jpg',
            '46-IMG_4512.jpg', '5-IMG_4441.jpg', '6-IMG_4442.jpg', '7-IMG_4514.jpg', '8-IMG_4517.jpg',
            '9-IMG_4443.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/gallery/Photos/Chai Brothers/${file}`);
        console.log('Chai Brothers photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateChaiSistersPhotos() {
        const sistersFiles = [
            '1-IMG_4435.jpg', '10-IMG_7431.jpg', '11-IMG_7430.jpg', '12-IMG_7450.jpg', '13-IMG_7449.jpg',
            '14-IMG_7448.jpg', '15-IMG_7447.jpg', '16-IMG_7446.jpg', '17-IMG_7445.jpg', '18-IMG_7444.jpg',
            '19-IMG_7443.jpg', '2-IMG_7440.jpg', '20-IMG_7442.jpg', '21-IMG_7441.jpg', '3-IMG_7439.jpg',
            '4-IMG_7438.jpg', '5-IMG_7437.jpg', '6-IMG_7435.jpg', '7-IMG_7434.jpg', '8-IMG_7433.jpg',
            '9-IMG_7432.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/gallery/Photos/Chai Sister/${file}`);
        console.log('Chai Sisters photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateSnacksSistersPhotos() {
        const sistersFiles = [
            '1-IMG_1013.jpg', '10-IMG_1030.jpg', '100-IMG_6966.jpg', '101-IMG_6970.jpg', '102-IMG_6971.jpg',
            '103-IMG_6972.jpg', '104-IMG_6973.jpg', '105-IMG_6975.jpg', '106-IMG_6978.jpg', '107-IMG_6979.jpg',
            '108-IMG_6981.jpg', '109-IMG_6982.jpg', '11-IMG_1031.jpg', '110-IMG_6983.jpg', '111-IMG_6984.jpg',
            '112-IMG_6985.jpg', '113-IMG_6986.jpg', '114-IMG_6988.jpg', '115-IMG_6990.jpg', '116-IMG_6992.jpg',
            '117-IMG_6997.jpg', '118-IMG_6998.jpg', '119-IMG_6999.jpg', '12-IMG_1032.jpg', '120-IMG_7000.jpg',
            '121-IMG_7001.jpg', '122-IMG_7005.jpg', '123-IMG_7007.jpg', '124-IMG_7008.jpg', '125-IMG_7009.jpg',
            '126-IMG_7010.jpg', '127-IMG_7011.jpg', '128-IMG_7012.jpg', '13-IMG_1034.jpg', '14-IMG_1035.jpg',
            '15-IMG_1036.jpg', '16-IMG_1041.jpg', '17-IMG_1047.jpg', '18-IMG_1049.jpg', '19-IMG_1050.jpg',
            '2-IMG_1016.jpg', '20-IMG_1051.jpg', '21-IMG_1053.jpg', '22-IMG_1054.jpg', '23-IMG_1055.jpg',
            '24-IMG_1056.jpg', '25-IMG_1057.jpg', '26-IMG_1058.jpg', '27-IMG_1059.jpg', '28-IMG_1060.jpg',
            '29-IMG_1061.jpg', '3-IMG_1018.jpg', '30-IMG_1066.jpg', '31-IMG_1069.jpg', '32-IMG_1070.jpg',
            '33-IMG_1073.jpg', '34-IMG_1074.jpg', '35-IMG_1075.jpg', '36-IMG_1078.jpg', '37-IMG_1080.jpg',
            '38-IMG_1081.jpg', '39-IMG_1083.jpg', '4-IMG_1019.jpg', '40-IMG_1084.jpg', '41-IMG_1089.jpg',
            '42-IMG_1090.jpg', '43-IMG_1097.jpg', '44-IMG_1099.jpg', '45-IMG_1101.jpg', '46-IMG_1102.jpg',
            '47-IMG_1104.jpg', '48-IMG_1107.jpg', '49-IMG_1110.jpg', '5-IMG_1023.jpg', '50-IMG_1114.jpg',
            '51-IMG_1115.jpg', '52-IMG_1116.jpg', '53-IMG_1117.jpg', '54-IMG_1118.jpg', '55-IMG_1120.jpg',
            '56-IMG_1121.jpg', '57-IMG_1123.jpg', '58-IMG_1124.jpg', '59-IMG_1126.jpg', '6-IMG_1024.jpg',
            '60-IMG_1127.jpg', '61-IMG_1128.jpg', '62-IMG_1129.jpg', '63-IMG_1131.jpg', '64-IMG_1132.jpg',
            '65-IMG_1133.jpg', '66-IMG_1134.jpg', '67-IMG_1135.jpg', '68-IMG_1138.jpg', '69-IMG_1139.jpg',
            '7-IMG_1026.jpg', '70-IMG_1140.jpg', '71-IMG_1142.jpg', '72-IMG_1144.jpg', '73-IMG_1146.jpg',
            '74-IMG_1147.jpg', '75-IMG_1153.jpg', '76-IMG_1159.jpg', '77-IMG_1161.jpg', '78-IMG_1162.jpg',
            '79-IMG_1164.jpg', '8-IMG_1028.jpg', '80-IMG_1167.jpg', '81-IMG_1168.jpg', '82-IMG_1169.jpg',
            '83-IMG_6925.jpg', '84-IMG_6926.jpg', '85-IMG_6927.jpg', '86-IMG_6928.jpg', '87-IMG_6932.jpg',
            '88-IMG_6933.jpg', '89-IMG_6943.jpg', '9-IMG_1029.jpg', '90-IMG_6946.jpg', '91-IMG_6950.jpg',
            '92-IMG_6952.jpg', '93-IMG_6953.jpg', '94-IMG_6954.jpg', '95-IMG_6956.jpg', '96-IMG_6957.jpg',
            '97-IMG_6961.jpg', '98-IMG_6962.jpg', '99-IMG_6965.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/gallery/Photos/Snacks-Sisters/${file}`);
        console.log('Snacks Sisters photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateSnacksBrothersPhotos() {
        const brothersFiles = [
            '1-SAU06517.jpg', '2-SAU06518.jpg', '3-SAU06519.jpg', '4-SAU06521.jpg', '5-SAU06522.jpg',
            '6-SAU06523.jpg', '7-SAU06524.jpg', '8-SAU06525.jpg', '9-SAU06526.jpg', '10-SAU06527.jpg',
            '11-SAU06528.jpg', '12-SAU06529.jpg', '13-SAU06530.jpg', '14-SAU06531.jpg', '15-SAU06532.jpg',
            '16-SAU06533.jpg', '17-SAU06534.jpg', '18-SAU06535.jpg', '19-SAU06536.jpg', '20-SAU06537.jpg',
            '21-SAU06538.jpg', '22-SAU06539.jpg', '23-SAU06540.jpg', '24-SAU06541.jpg', '25-SAU06542.jpg',
            '26-SAU06543.jpg', '27-SAU06544.jpg', '28-SAU06545.jpg', '29-SAU06546.jpg', '30-SAU06547.jpg',
            '31-SAU06548.jpg', '32-SAU06549.jpg', '33-SAU06550.jpg', '34-SAU06551.jpg', '35-SAU06552.jpg',
            '36-SAU06553.jpg', '37-SAU06554.jpg', '38-SAU06555.jpg', '39-SAU06557.jpg', '40-SAU06556.jpg',
            '41-SAU06558.jpg', '42-SAU06559.jpg', '43-SAU06560.jpg', '44-SAU06561.jpg', '45-SAU06562.jpg',
            '46-SAU06563.jpg', '47-SAU06564.jpg', '48-SAU06565.jpg', '49-SAU06566.jpg', '50-SAU06567.jpg',
            '51-SAU06568.jpg', '52-SAU06569.jpg', '53-SAU06570.jpg', '54-SAU06571.jpg', '55-SAU06572.jpg',
            '56-SAU06573.jpg', '57-SAU06574.jpg', '58-SAU06575.jpg', '59-SAU06576.jpg', '60-SAU06577.jpg',
            '61-SAU06578.jpg', '62-SAU06579.jpg', '63-SAU06580.jpg', '64-SAU06581.jpg', '65-SAU06582.jpg',
            '66-SAU06583.jpg', '67-SAU06584.jpg', '68-SAU06585.jpg', '69-SAU06586.jpg', '70-SAU06587.jpg',
            '71-SAU06588.jpg', '72-SAU06589.jpg', '73-SAU06590.jpg', '74-SAU06592.jpg', '75-SAU06591.jpg',
            '76-SAU06593.jpg', '77-SAU06594.jpg', '78-SAU06595.jpg', '79-SAU06596.jpg', '80-SAU06597.jpg',
            '81-SAU06598.jpg', '82-SAU06600.jpg', '83-SAU06599.jpg', '84-SAU06601.jpg', '85-SAU06602.jpg',
            '86-SAU06603.jpg', '87-SAU06604.jpg', '88-SAU06605.jpg', '89-SAU06606.jpg', '90-SAU06607.jpg',
            '91-SAU06608.jpg', '92-SAU06609.jpg', '93-SAU06610.jpg', '94-SAU06611.jpg', '95-SAU06612.jpg',
            '96-SAU06613.jpg', '97-SAU06614.jpg', '98-SAU06615.jpg', '99-SAU06616.jpg', '100-SAU06617.jpg',
            '101-SAU06618.jpg', '102-SAU06619.jpg', '103-SAU06620.jpg', '104-SAU06621.jpg', '105-SAU06622.jpg',
            '106-SAU06623.jpg', '107-SAU06624.jpg', '108-SAU06625.jpg', '109-SAU06626.jpg', '110-SAU06627.jpg',
            '111-SAU06628.jpg', '112-SAU06630.jpg', '113-SAU06629.jpg', '114-SAU06631.jpg', '115-SAU06632.jpg',
            '116-SAU06633.jpg', '117-SAU06634.jpg', '118-SAU06635.jpg', '119-SAU06636.jpg', '120-SAU06637.jpg',
            '121-SAU06638.jpg', '122-SAU06639.jpg', '123-SAU06640.jpg', '124-SAU06641.jpg', '125-SAU06642.jpg',
            '126-SAU06643.jpg', '127-SAU06644.jpg', '128-SAU06645.jpg', '129-SAU06647.jpg', '130-SAU06646.jpg',
            '131-SAU06648.jpg', '132-SAU06649.jpg', '133-SAU06650.jpg', '134-SAU06651.jpg', '135-SAU06652.jpg',
            '136-SAU06653.jpg', '137-SAU06654.jpg', '138-SAU06655.jpg', '139-SAU06656.jpg', '140-SAU06657.jpg',
            '141-SAU06658.jpg', '142-SAU06659.jpg', '143-SAU06660.jpg', '144-SAU06661.jpg', '145-SAU06662.jpg',
            '146-SAU06663.jpg', '147-SAU06664.jpg', '148-SAU06665.jpg', '149-SAU06666.jpg', '150-SAU06667.jpg',
            '151-SAU06668.jpg', '152-SAU06669.jpg', '153-SAU06670.jpg', '154-SAU06671.jpg', '155-SAU06672.jpg',
            '156-SAU06673.jpg', '157-SAU06674.jpg', '158-SAU06675.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/gallery/Photos/Snacks | Brothers/${file}`);
        console.log('Snacks Brothers photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateFreshmanBrothersPhotos() {
        const brothersFiles = [
            '8aa72d85-eadf-40fd-8c9d-f0118b3baf71.jpg',
            'c08c21fe-4baa-4ead-8362-7a77f86eeddd.jpg',
            'ce27a977-e990-4c7c-8cd1-3b8ef086e42f.jpg',
            'd91f2555-e5cb-4858-aaeb-093cf8ee2277.jpg',
            'f127d868-52bd-40f5-9c4a-964206144a44.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/Freshman Brothers/${file}`);
        console.log('Freshman Brothers photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateFreshmanSistersPhotos() {
        const sistersFiles = [
            '04b43bf2-df27-4b6e-a39b-cbbceef9a7c0.jpg',
            'ad7f8f23-f6f2-48e5-aec6-787911180df7.jpg',
            'b0447396-2a79-4441-ac68-2a417c8238ab.jpg',
            'ea47ba38-5b13-4c31-98e0-0c7a0ea2ff8c.jpg',
            'ea850f0e-4356-4dc6-9af5-eff99969ba86.jpg',
            'ed717bfc-e912-45c5-969d-a39d2f5beb2d.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/Freshman | Sisters/${file}`);
        console.log('Freshman Sisters photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateArtNightBrothersPhotos() {
        const brothersFiles = [
            '1-DA3A1145-D060-4CBD-861F-52342ED16361.jpg', '2-B40115CB-3690-48C9-A9DA-1FF13D4829DF(1).jpg', '3-B40115CB-3690-48C9-A9DA-1FF13D4829DF.jpg',
            '4-66F59869-7740-4A8C-B3B7-0BDF118281E8(1).jpg', '5-66F59869-7740-4A8C-B3B7-0BDF118281E8.jpg', '6-A557902D-3BB3-49EE-A38B-2BD1968C6359(1).jpg',
            '7-A557902D-3BB3-49EE-A38B-2BD1968C6359.jpg', '8-12FB96A4-4178-4155-B3E1-D2C295DF259A.jpg', '9-12FB96A4-4178-4155-B3E1-D2C295DF259A(1).jpg',
            '10-47DEEB0C-D880-46E7-B716-56C980187B5B(1).jpg', '11-47DEEB0C-D880-46E7-B716-56C980187B5B.jpg', '12-DCDB689C-3149-44BE-9159-6F5A874180A8.jpg',
            '13-8CA233B6-1BE5-4B47-BB48-3011F8D6E4E4.jpg', '14-5C8CA787-29D6-4AA1-8330-3D429EA99764.jpg', '15-6CC00228-AF4F-4692-91BE-9CA0F0FA511E.jpg',
            '16-B8193E73-1FAD-4751-8C98-05F0C13CEF1D.jpg', '17-87443F8E-9851-4B8A-95B8-ADF0F21936F8.jpg', '18-60199E2F-6C5F-47E1-BF8A-DDB956330EEF.jpg',
            '19-DSCN3852.jpg', '20-DSCN3853.jpg', '21-DSCN3854.jpg', '22-DSCN3855.jpg', '23-DSCN3865.jpg', '24-DSCN3866.jpg',
            '25-DSCN3867.jpg', '26-DSCN3869.jpg', '27-DSCN3871.jpg', '28-DSCN3872.jpg', '29-DSCN3873.jpg', '30-DSCN3874.jpg',
            '31-DSCN3875.jpg', '32-DSCN3877.jpg', '33-DSCN3878.jpg', '34-DSCN3882.jpg', '35-DSCN3884.jpg', '36-DSCN3885.jpg',
            '37-DSCN3886.jpg', '38-DSCN3887.jpg', '39-DSCN3889.jpg', '40-DSCN3890.jpg', '41-DSCN3891.jpg', '42-DSCN3892.jpg',
            '43-DSCN3894.jpg', '44-DSCN3896.jpg', '45-DSCN3897.jpg', '46-DSCN3898.jpg', '47-DSCN3899.jpg', '48-DSCN3900.jpg',
            '49-DSCN3901.jpg', '50-DSCN3902.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/Art Night _ Brothers _ Submissions/${file}`);
        console.log('Art Night Brothers photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateArtNightSistersPhotos() {
        const sistersFiles = [
            '1-875764FC-DAC4-42F3-96F0-5D77BBD735E0.jpg', '2-86AA2FD0-9B0A-4D6B-A18D-C7C4D69D4D7C.jpg', '3-7EE4E1B8-7BE3-4284-B88C-F7426FB1D11A.jpg',
            '4-AAD32E32-3C54-4B2F-95AD-56017DA636CD.jpg', '5-07AD4F9B-6201-4CF3-8312-41CD320F6952.jpg', '6-B3E4DFFE-58E8-41E1-881F-9DD7880C0710.jpg',
            '7-9D6A2842-6925-4CE6-BD02-E502F29355FC.jpg', '8-3706B967-E94C-41C5-901D-5D5E92736354.jpg', '9-010BB7CB-CEA2-4089-9200-37000849E4FD(1).jpg',
            '10-7475BAB2-BD37-4CDE-BB04-0F2CD951D9DA.jpg', '11-54072195-0B8A-4FAF-9475-9F7E17AA95E5.jpg', '12-ABEB13D1-70D3-468A-AC71-2693C00AB793.jpg',
            '13-56B203A7-FBB7-45E4-9D31-C32829CA882A.jpg', '14-1BE4D58B-E00A-4C40-B4DF-BE0C156B043D.jpg', '15-509FB180-693C-4568-ADB6-A389172277BB.jpg',
            '16-1EFEBD97-39AC-48A4-81B7-834FF1E1B262(1).jpg', '17-1BC48885-2759-424F-9975-5D53FB896AB8.jpg', '18-666DC898-2420-4316-8BC0-9B9F6D1EC162.jpg',
            '19-9B9B056A-6604-473D-AD08-FFDB0A507DF1.jpg', '20-9CA7B965-1FE7-46D0-BF0E-122F862DEF00.jpg', '21-8FC3789C-94C8-4D3B-95EA-47C9D9766EA3.jpg',
            '22-58771781-EED8-4514-BC21-B6AACA70CA41.jpg', '23-AA5B4374-2934-4AA5-806C-4E30BBEBD86D.jpg', '24-586E3EA9-26E0-405E-8E62-BB52BCF8D5A8.jpg',
            '25-6AF18240-BCD9-43AB-948A-D5FE0747B453.jpg', '26-A73C5801-FE19-4135-B94C-8F844B152B85.jpg', '27-5E56E4DC-6283-4D7B-A8F8-AB1C3F72C860.jpg',
            '28-908ADCED-00F7-4E6E-B83E-01DB85AC3745.jpg', '29-33209879-78CF-4978-BC2C-9C9108B9C291.jpg', '30-7CB38395-AC29-4D76-A37F-FCA0FA0613D0.jpg',
            '31-091FE60B-71C5-4CE1-A740-AEFB05F8A140.jpg', '32-7E7DBD4B-4A63-4E9F-9DFF-59C747DBCE12.jpg', '33-433AD09E-356F-4B64-9153-C9245FF95A97.jpg',
            '34-57AC4AF3-3133-4324-ACF9-CE744557440B.jpg', '35-0105D121-B320-49C0-B8A1-CB3E7BBC1281.jpg', '36-02A0C730-6B27-4A03-BE0E-6101CA7A41AB.jpg',
            '37-19FA6986-8F57-4BF4-9380-3AC4BF6542D5.jpg', '38-65CE5E74-49A6-4BA4-A40A-A079B2753A78.jpg', '39-5A53DC52-850A-4734-9404-27B7C00ABA5F.jpg',
            '40-19006ED7-DD8C-467B-9570-2F8177CDA5C7.jpg', '41-1BD37A98-1596-46A7-AF36-AED76C179E3E.jpg', '42-56639BBD-A631-4BCC-A761-BC6317648A22.jpg',
            '43-49327AAF-212D-4392-B5F3-D5EF342C4418.jpg', '44-8A8D4D1C-DD66-4301-95A6-75DD4368A2C2.jpg', '45-8A8D4D1C-DD66-4301-95A6-75DD4368A2C2.jpg',
            '46-0EA1E95B-0B5B-4375-98F1-AAFFF5A5927A.jpg', '47-94E61E4A-8630-41F2-9EF7-27883C955391.jpg', '48-39AEE1D2-171F-4D06-8534-86D35A9C0A08.jpg',
            '49-23657991-588A-4606-B7B3-E47FCBD924AB.jpg', '50-4A1CC67E-10AB-4BFD-BDF0-42BED0C60736.jpg', '51-74829EAD-ABDC-4F22-9EE9-0301769971ED.jpg',
            '52-59B23812-826B-4CEB-B0A9-52835980CC05.jpg', '53-26E0D407-14F3-40DD-8CD6-DEA41E9A5641.jpg', '54-BA84E4D8-CC92-4EC5-8F0C-43BF993EB514.jpg',
            '55-24175F9B-8AF2-4E3C-8047-1AB49DC2A934.jpg', '56-34501580-EA62-4839-9527-E52C57DDD1BB.jpg', '57-6A288AE3-2C59-4849-A4E6-347C42F4BAD0.jpg',
            '58-2209975D-6505-4ADB-80AB-171763CDA7BB.jpg', '59-0347D454-73F1-4882-B857-A3E7C756A5CB.jpg', '60-4387BEC7-B580-482F-8A70-CE38911ADA03.jpg',
            '61-B405D01D-944E-47E7-BEF5-AFA08559EA1A.jpg', '62-62D783A8-E3C0-49FC-8B21-A23826055C67.jpg', '63-9AFB3C22-3670-48A8-9EB8-3FF2B60BD9A0.jpg',
            '64-37D4222E-2963-4D69-9E3E-640D2D07BBA2.jpg', '65-4317F0B1-A511-43C5-B761-DC7C27F62229.jpg', '66-60D4CB6F-3A76-4C5E-80A3-19BC875C7C35.jpg',
            '67-8C35C982-1C30-4DF1-A66E-EC71DEA39A72.jpg', '68-081E8DD0-E336-4506-A234-7E5FA6D976AD.jpg', '69-7C10C20D-9431-430A-BB1E-ADBF2AADEA95.jpg',
            '70-13900EE1-54DD-4DA9-B21B-24DF23967CD6.jpg', '71-458785E6-0053-434F-8D0E-C1331B1CDD26.jpg', '72-9F9ECEC8-8D1E-468F-8ED5-F0F8CE4826C3.jpg',
            '73-992503AB-F0A5-4868-A008-04A06414866C.jpg', '74-886094F0-F8E8-47F5-A17A-671DA54A2ADB.jpg', '75-AB64EE46-5102-487B-A5EF-A45A43FD6863.jpg',
            '76-658BC33A-364F-4C96-8D85-D676ADC038FD.jpg', '77-86EAB3DA-BE8C-46C1-9F32-70237E0068DB.jpg', '78-9AA16CF0-FC45-44C6-870F-6231412907E1.jpg',
            '79-7499DCAC-4A88-4F56-9A78-E27B0F7C96AD.jpg', '80-4F2697FF-4BCE-4C19-853A-EDCCCDDB5F50.jpg', '81-5FEA6C7B-FBEF-4547-88C3-BBF6B4E80117.jpg',
            '82-8E58DB5A-2652-450F-A2A3-78EE999D0981.jpg', '83-097B5FFB-1E31-4942-9657-8A3E66A3245A.jpg', '84-AEF713C2-3A8D-40D9-9875-8EE6F57F533A.jpg',
            '85-A54958A5-1F14-49A7-8337-A6D5D56285FC.jpg', '86-2043904B-48F7-4ACF-97B7-B985C4F8319E.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/Art Night _ Sisters _ Submissions/${file}`);
        console.log('Art Night Sisters photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateMSAOlympicsBrothersPhotos() {
        const brothersFiles = [
            '3-IMG_7019.jpg', '4-IMG_7020.jpg', '5-IMG_7025.jpg', '6-IMG_7027.jpg', '7-IMG_7028.jpg',
            '8-IMG_7029.jpg', '9-IMG_7031.jpg', '10-IMG_7033.jpg', '11-IMG_7038.jpg', '12-IMG_7039.jpg',
            '13-IMG_7040.jpg', '14-IMG_7042.jpg', '15-IMG_7044.jpg', '16-IMG_7046.jpg', '17-IMG_7047.jpg',
            '18-IMG_7048.jpg', '19-IMG_7049.jpg', '20-IMG_7051.jpg', '21-IMG_7059.jpg', '22-IMG_7060.jpg',
            '23-IMG_7061.jpg', '24-IMG_7063.jpg', '25-IMG_7064.jpg', '26-IMG_7065.jpg', '27-IMG_7067.jpg',
            '28-IMG_7068.jpg', '29-IMG_7069.jpg', '30-IMG_7073.jpg', '31-IMG_7076.jpg', '32-IMG_7077.jpg',
            '33-IMG_7078.jpg', '34-IMG_7093.jpg', '35-IMG_7103.jpg', '36-IMG_7107.jpg', '37-IMG_7109.jpg',
            '38-IMG_7110.jpg', '39-IMG_7113.jpg', '40-IMG_7117.jpg', '41-IMG_7122.jpg', '42-IMG_7124.jpg',
            '43-IMG_7125.jpg', '44-IMG_7126.jpg', '45-IMG_7129.jpg', '46-IMG_7132.jpg', '47-IMG_7134.jpg',
            '48-IMG_7136.jpg', '49-IMG_7137.jpg', '50-IMG_7140.jpg', '51-IMG_2253.jpg', '52-IMG_2254.jpg',
            '53-IMG_2256.jpg', '54-IMG_2257.jpg', '55-IMG_2259.jpg', '56-IMG_2262.jpg', '57-IMG_2263.jpg',
            '58-IMG_2264.jpg', '59-IMG_2267.jpg', '60-IMG_2268.jpg', '61-IMG_2269.jpg', '62-IMG_2270.jpg',
            '63-IMG_2271.jpg', '64-IMG_2272.jpg', '65-IMG_2273.jpg', '66-IMG_2274.jpg', '67-IMG_2275.jpg',
            '68-IMG_2276.jpg', '69-IMG_2278.jpg', '70-IMG_2279.jpg', '71-IMG_2281.jpg', '72-IMG_2282.jpg',
            '73-IMG_2283.jpg', '74-IMG_2284.jpg', '75-IMG_2285.jpg', '76-IMG_2286.jpg', '77-IMG_2288.jpg',
            '78-IMG_2289.jpg', '79-IMG_2290.jpg', '80-IMG_2291.jpg', '81-IMG_2292.jpg', '82-IMG_2293.jpg',
            '83-IMG_2295.jpg', '84-IMG_2296.jpg', '85-IMG_2297.jpg', '86-IMG_2298.jpg', '87-IMG_2299.jpg',
            '88-IMG_2300.jpg', '89-IMG_2301.jpg', '90-IMG_2302.jpg', '91-IMG_2303.jpg', '92-IMG_2304.jpg',
            '93-IMG_2305.jpg', '94-IMG_2306.jpg', '95-IMG_2307.jpg', '96-IMG_2308.jpg', '97-IMG_2310.jpg',
            '98-IMG_2311.jpg', '99-IMG_2312.jpg', '100-IMG_2314.jpg', '101-IMG_2316.jpg', '102-IMG_2317.jpg',
            '103-IMG_2318.jpg', '104-IMG_2319.jpg', '105-IMG_2320.jpg', '106-IMG_2321.jpg', '107-IMG_2322.jpg',
            '108-IMG_2323.jpg', '109-IMG_2324.jpg', '110-IMG_2325.jpg', '111-IMG_2326.jpg', '112-IMG_2327.jpg',
            '113-IMG_2328.jpg', '114-IMG_2329.jpg', '115-IMG_2330.jpg', '116-IMG_2331.jpg', '117-IMG_2332.jpg',
            '118-IMG_2333.jpg', '119-IMG_2335.jpg', '120-IMG_2336.jpg', '121-IMG_2337.jpg', '122-IMG_2338.jpg',
            '123-IMG_2339.jpg', '124-IMG_2340.jpg', '125-IMG_2344.jpg', '126-IMG_2348.jpg', '127-IMG_2350.jpg',
            '128-IMG_2351.jpg', '129-IMG_2353.jpg', '130-IMG_2354.jpg', '131-IMG_2356.jpg', '132-IMG_2359.jpg',
            '133-IMG_2360.jpg', '134-IMG_2364.jpg', '135-IMG_2365.jpg', '136-IMG_2366.jpg', '137-IMG_2367.jpg',
            '138-IMG_2368.jpg', '139-IMG_2369.jpg', '140-IMG_2370.jpg', '141-IMG_2371.jpg', '142-IMG_2372.jpg',
            '143-IMG_2373.jpg', '144-IMG_2374.jpg', '145-IMG_2375.jpg', '146-IMG_2377.jpg', '147-IMG_2378.jpg',
            '148-IMG_2379.jpg', '149-IMG_2381.jpg', '150-IMG_2382.jpg', '151-IMG_2389.jpg', '152-IMG_2390.jpg',
            '153-IMG_2391.jpg', '154-IMG_2392.jpg', '155-IMG_2393.jpg', '156-IMG_2394.jpg', '157-IMG_2395.jpg',
            '158-IMG_2398.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/MSA Olympics | Brothers/${file}`);
        console.log('MSA Olympics Brothers photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateMSAOlympicsSistersPhotos() {
        const sistersFiles = [
            '1-IMG_7595.jpg', '2-IMG_7524.jpg', '3-IMG_7535.jpg', '4-IMG_7591.jpg', '5-IMG_7597.jpg',
            '6-IMG_7534.jpg', '7-IMG_7523.jpg', '8-IMG_7592.jpg', '9-IMG_7598.jpg', '10-IMG_7533.jpg',
            '11-IMG_7567.jpg', '12-IMG_7565.jpg', '13-IMG_7563.jpg', '14-IMG_7594.jpg', '15-IMG_7590.jpg',
            '16-IMG_7596.jpg', '17-IMG_7589.jpg', '18-IMG_7588.jpg', '19-IMG_7586.jpg', '20-IMG_7583.jpg',
            '21-IMG_7582.jpg', '22-IMG_7581.jpg', '23-IMG_7580.jpg', '24-IMG_7577.jpg', '25-IMG_7575.jpg',
            '26-IMG_7573.jpg', '27-IMG_7571.jpg', '28-IMG_7570.jpg', '29-IMG_7570.jpg', '30-IMG_7569.jpg',
            '31-IMG_7568.jpg', '32-IMG_7599.jpg', '33-IMG_7566.jpg', '34-IMG_7564.jpg', '35-IMG_7562.jpg',
            '36-IMG_7560.jpg', '37-IMG_7558.jpg', '38-IMG_7556.jpg', '39-IMG_7555.jpg', '40-IMG_7554.jpg',
            '41-IMG_7553.jpg', '42-IMG_7551.jpg', '43-IMG_7550.jpg', '44-IMG_7549.jpg', '45-IMG_7548.jpg',
            '46-IMG_7547.jpg', '47-IMG_7546.jpg', '48-IMG_7545.jpg', '49-IMG_7544.jpg', '50-IMG_7543.jpg',
            '51-IMG_7542.jpg', '52-IMG_7540.jpg', '53-IMG_7561.jpg', '54-IMG_7559.jpg', '55-IMG_7557.jpg',
            '56-IMG_7531.jpg', '57-IMG_7522.jpg', '58-IMG_7530.jpg', '59-IMG_7539.jpg', '60-IMG_7529.jpg',
            '61-IMG_7538.jpg', '62-IMG_7528.jpg', '63-IMG_7537.jpg', '64-IMG_7536.jpg', '66-IMG_0071.jpg',
            '67-IMG_0073.jpg', '68-IMG_0075.jpg', '69-IMG_0076.jpg', '70-IMG_0077.jpg', '71-IMG_0078.jpg',
            '72-IMG_0080.jpg', '73-IMG_0081.jpg', '74-IMG_0082.jpg', '75-IMG_0083.jpg', '76-IMG_0084.jpg',
            '77-IMG_0085.jpg', '78-IMG_0086.jpg', '79-IMG_0087.jpg', '80-IMG_0091.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/MSA Olympics | Sisters/${file}`);
        console.log('MSA Olympics Sisters photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateHopeDriveBrothersPhotos() {
        const brothersFiles = [
            '1-7827E190-FA7A-4C8A-BEFB-94FD6BCF0C1C_1_105_c.jpg', '2-DSC03669.jpg', '3-DSC03670.jpg',
            '4-DSC03671.jpg', '5-DSC03676.jpg', '6-DSC03679.jpg', '7-DSC03681.jpg', '8-DSC03683.jpg',
            '9-DSC03689.jpg', '10-DSC03690.jpg', '11-DSC03698.jpg', '12-DSC03699.jpg', '13-DSC03703.jpg',
            '14-DSC03704.jpg', '15-DSC03706.jpg', '16-DSC03707.jpg', '17-DSC03721.jpg', '18-DSC03722.jpg',
            '19-DSC03723.jpg', '20-DSC03724.jpg', '21-DSC03725.jpg', '22-DSC03728.jpg', '23-DSC03730.jpg',
            '24-DSC03729.jpg', '25-DSC03731.jpg', '26-DSC03733.jpg', '27-DSC03734.jpg', '28-DSC03735.jpg',
            '29-DSC03736.jpg', '30-DSC03737.jpg', '31-DSC03739.jpg', '32-DSC03740.jpg', '33-DSC03741.jpg',
            '34-DSC03742.jpg', '35-DSC03743.jpg', '36-DSC03744.jpg', '37-DSC03745.jpg', '38-DSC03746.jpg',
            '39-DSC03747.jpg', '40-DSC03748.jpg', '41-DSC03750.jpg', '42-DSC03753.jpg', '43-DSC03754.jpg',
            '44-DSC03755.jpg', '45-DSC03756.jpg', '46-DSC03757.jpg', '47-DSC03758.jpg', '48-DSC03759.jpg',
            '49-DSC03760.jpg', '50-DSC03761.jpg', '51-DSC03762.jpg', '52-DSC03763.jpg', '53-DSC03764.jpg',
            '54-DSC03765.jpg', '55-DSC03766.jpg', '56-DSC03767.jpg', '57-DSC03768.jpg', '58-DSC03769.jpg',
            '59-DSC03775.jpg', '60-DSC03776.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/Hope Drive | Brothers/${file}`);
        console.log('Hope Drive Brothers photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateHopeDriveSistersPhotos() {
        const sistersFiles = [
            '1-DED18E6B-B700-4538-8351-D67751EF33C3_4_5005_c.jpg', '2-IMG_5042.jpg', '3-IMG_5043.jpg',
            '4-IMG_5044.jpg', '5-IMG_5045.jpg', '6-IMG_5046.jpg', '7-IMG_5047.jpg', '8-IMG_5048.jpg',
            '9-IMG_5049.jpg', '10-IMG_5050.jpg', '11-IMG_5051.jpg', '12-IMG_5052.jpg', '13-IMG_5053.jpg',
            '14-IMG_5054.jpg', '15-IMG_5055.jpg', '16-IMG_5056.jpg', '17-IMG_5057.jpg', '18-IMG_5058.jpg',
            '19-IMG_5059.jpg', '20-IMG_5060.jpg', '21-IMG_5061.jpg', '22-IMG_5062.jpg', '23-IMG_5063.jpg',
            '24-IMG_5064.jpg', '25-IMG_5065.jpg', '26-IMG_5066.jpg', '27-IMG_5067.jpg', '28-IMG_5068.jpg',
            '29-IMG_5069.jpg', '30-IMG_5070.jpg', '31-IMG_5071.jpg', '32-IMG_5072.jpg', '33-IMG_5073.jpg',
            '34-IMG_5074.jpg', '35-IMG_5075.jpg', '36-IMG_5076.jpg', '37-IMG_5077.jpg', '38-IMG_5078.jpg',
            '39-IMG_5079.jpg', '40-IMG_5080.jpg', '41-IMG_5081.jpg', '42-IMG_5082.jpg', '43-IMG_5083.jpg',
            '44-IMG_5084.jpg', '45-IMG_5085.jpg', '46-IMG_5086.jpg', '47-IMG_5087.jpg', '48-IMG_5088.jpg',
            '49-IMG_5089.jpg', '50-IMG_5090.jpg', '51-IMG_5091.jpg', '52-IMG_5092.jpg', '53-IMG_5093.jpg',
            '54-IMG_5094.jpg', '55-IMG_5095.jpg', '56-IMG_5096.jpg', '57-IMG_5097.jpg', '58-IMG_5098.jpg',
            '59-IMG_5099.jpg', '60-IMG_5100.jpg', '61-IMG_5101.jpg', '62-IMG_5102.jpg', '63-IMG_5103.jpg',
            '64-IMG_5104.jpg', '65-IMG_5106.jpg', '66-IMG_5107.jpg', '67-IMG_5108.jpg', '68-IMG_5109.jpg',
            '69-IMG_5110.jpg', '70-IMG_5111.jpg', '71-IMG_5112.jpg', '72-IMG_5113.jpg', '73-IMG_5115.jpg',
            '74-IMG_5116.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/Hope Drive | Sisters/${file}`);
        console.log('Hope Drive Sisters photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateBreakingBarriersBrothersPhotos() {
        const brothersFiles = [
            '1-IMG_1172.jpg', '2-IMG_1173.jpg', '3-IMG_1174.jpg', '4-IMG_1175.jpg', '5-IMG_1176.jpg',
            '6-IMG_1177.jpg', '7-IMG_1178.jpg', '8-IMG_1179.jpg', '9-IMG_1180.jpg', '10-IMG_1181.jpg',
            '11-IMG_1185.jpg', '12-IMG_0161.jpg', '13-IMG_0162.jpg', '14-IMG_0173.jpg', '15-IMG_0174.jpg',
            '16-IMG_0177.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/Racism_Classism | Brothers/${file}`);
        console.log('Breaking Barriers Brothers photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateBreakingBarriersSistersPhotos() {
        const sistersFiles = [
            '1-IMG_0135.jpg', '2-IMG_0136.jpg', '3-IMG_0137.jpg', '4-IMG_0138.jpg', '5-IMG_0140.jpg',
            '6-IMG_0143.jpg', '7-IMG_0144.jpg', '8-IMG_0145.jpg', '9-IMG_0149.jpg', '10-IMG_0151.jpg',
            '11-IMG_0154.jpg', '12-IMG_0156.jpg', '13-IMG_0157.jpg', '14-IMG_0158.jpg', '15-IMG_0167.jpg',
            '16-IMG_0168.jpg', '17-IMG_0169.jpg', '18-IMG_0170.jpg', '19-IMG_0171.jpg', '20-IMG_0172.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/Racism_Classism | Sisters/${file}`);
        console.log('Breaking Barriers Sisters photos generated:', photos.slice(0, 3)); // Log first 3 for debugging
        return photos;
    }

    generateCulturesOfTheWorldBrothersPhotos() {
        const brothersFiles = [
            '1-84670034.jpg', '10-84670018.jpg', '100-SAU07248.jpg', '101-SAU07249.jpg', '102-SAU07250.jpg',
            '103-SAU07251.jpg', '104-SAU07252.jpg', '105-SAU07253.jpg', '106-SAU07254.jpg', '107-SAU07255.jpg',
            '108-SAU07256.jpg', '109-SAU07257.jpg', '11-84670020.jpg', '110-SAU07258.jpg', '111-SAU07259.jpg',
            '112-SAU07260.jpg', '113-SAU07262.jpg', '114-SAU07261.jpg', '115-SAU07263.jpg', '116-SAU07264.jpg',
            '117-SAU07265.jpg', '118-SAU07266.jpg', '119-SAU07267.jpg', '12-84670017.jpg', '120-SAU07268.jpg',
            '121-SAU07270.jpg', '122-SAU07269.jpg', '123-SAU07271.jpg', '124-SAU07272.jpg', '125-SAU07273.jpg',
            '126-SAU07274.jpg', '127-SAU07275.jpg', '128-SAU07276.jpg', '129-SAU07277.jpg', '13-84670015.jpg',
            '130-SAU07278.jpg', '131-SAU07279.jpg', '132-SAU07280.jpg', '133-SAU07282.jpg', '134-SAU07281.jpg',
            '135-SAU07283.jpg', '136-SAU07284.jpg', '137-SAU07285.jpg', '138-SAU07286.jpg', '139-SAU07287.jpg',
            '14-84670016.jpg', '140-SAU07289.jpg', '141-SAU07288.jpg', '142-SAU07290.jpg', '143-SAU07291.jpg',
            '144-SAU07293.jpg', '145-SAU07292.jpg', '146-SAU07294.jpg', '147-SAU07296.jpg', '148-SAU07295.jpg',
            '149-SAU07297.jpg', '15-84670013.jpg', '150-SAU07298.jpg', '151-SAU07299.jpg', '152-SAU07300.jpg',
            '153-SAU07301.jpg', '154-SAU07302.jpg', '155-SAU07303.jpg', '156-SAU07304.jpg', '157-SAU07305.jpg',
            '158-SAU07306.jpg', '159-SAU07307.jpg', '16-84670014.jpg', '160-SAU07308.jpg', '161-SAU07309.jpg',
            '162-SAU07310.jpg', '163-SAU07311.jpg', '164-SAU07313.jpg', '165-SAU07360.jpg', '166-SAU07362.jpg',
            '167-SAU07363.jpg', '168-SAU07364.jpg', '169-SAU07365.jpg', '17-84670011.jpg', '170-SAU07366.jpg',
            '171-SAU07367.jpg', '172-SAU07368.jpg', '173-SAU07369.jpg', '174-SAU07370.jpg', '175-SAU07372.jpg',
            '176-SAU07373.jpg', '177-SAU07374.jpg', '178-SAU07375.jpg', '179-SAU07376.jpg', '18-84670010.jpg',
            '180-SAU07377.jpg', '181-SAU07378.jpg', '182-SAU07379.jpg', '183-SAU07380.jpg', '184-SAU07381.jpg',
            '185-SAU07383.jpg', '186-SAU07382.jpg', '187-SAU07384.jpg', '188-SAU07386.jpg', '189-SAU07385.jpg',
            '19-84670012.jpg', '190-SAU07387.jpg', '191-SAU07388.jpg', '192-SAU07389.jpg', '193-SAU07390.jpg',
            '194-SAU07391.jpg', '195-SAU07392.jpg', '196-SAU07393.jpg', '197-SAU07395.jpg', '198-SAU07394.jpg',
            '199-SAU07396.jpg', '2-84670032.jpg', '200-SAU07397.jpg', '201-SAU07398.jpg', '202-SAU07399.jpg',
            '203-SAU07400.jpg', '204-SAU07401.jpg', '205-SAU07402.jpg', '206-SAU07403.jpg', '207-SAU07404.jpg',
            '208-SAU07406.jpg', '209-SAU07405.jpg', '210-SAU07407.jpg', '211-SAU07409.jpg', '212-SAU07408.jpg',
            '213-SAU07410.jpg', '214-SAU07411.jpg', '215-SAU07412.jpg', '216-SAU07413.jpg', '217-SAU07414.jpg',
            '218-SAU07415.jpg', '219-SAU07416.jpg', '220-SAU07417.jpg', '221-SAU07418.jpg', '222-SAU07419.jpg',
            '223-SAU07420.jpg', '224-SAU07421.jpg', '225-SAU07422.jpg', '226-SAU07423.jpg', '227-SAU07424.jpg',
            '228-SAU07425.jpg', '229-SAU07432.jpg', '230-SAU07433.jpg', '231-SAU07434.jpg', '232-SAU07435.jpg',
            '233-SAU07436.jpg', '234-SAU07438.jpg', '235-SAU07437.jpg', '236-SAU07439.jpg', '237-SAU07440.jpg',
            '238-SAU07441.jpg', '239-SAU07442.jpg', '240-SAU07443.jpg', '241-SAU07444.jpg', '242-SAU07445.jpg',
            '243-SAU07446.jpg', '244-SAU07448.jpg', '245-SAU07447.jpg', '246-SAU07449.jpg', '247-SAU07450.jpg',
            '248-SAU07451.jpg', '249-SAU07452.jpg', '250-SAU07453.jpg', '251-SAU07454.jpg', '252-SAU07455.jpg',
            '253-SAU07456.jpg', '254-SAU07457.jpg', '255-SAU07458.jpg', '256-SAU07460.jpg', '257-SAU07459.jpg',
            '259-SAU07461.jpg', '260-SAU07462.jpg', '263-SAU07463.jpg', '264-SAU07464.jpg', '265-SAU07465.jpg',
            '268-SAU07467.jpg', '269-SAU07466.jpg', '270-SAU07468.jpg', '271-SAU07469.jpg', '272-SAU07470.jpg',
            '274-SAU07471.jpg', '276-SAU07472.jpg', '277-SAU07473.jpg', '3-84670029.jpg', '308-SAU07511.jpg',
            '309-SAU07514.jpg', '310-SAU07515.jpg', '311-SAU07516.jpg', '312-SAU07517.jpg', '313-SAU07518.jpg',
            '314-SAU07519.jpg', '315-SAU07520.jpg', '316-SAU07521.jpg', '317-SAU07522.jpg', '318-SAU07524.jpg',
            '319-SAU07523.jpg', '320-SAU07525.jpg', '321-SAU07526.jpg', '322-SAU07527.jpg', '323-SAU07528.jpg',
            '324-SAU07529.jpg', '325-SAU07531.jpg', '326-SAU07530.jpg', '327-SAU07532.jpg', '328-SAU07533.jpg',
            '332-SAU07536.jpg', '333-SAU07537.jpg', '334-SAU07538.jpg', '335-SAU07539.jpg', '336-SAU07553.jpg',
            '337-SAU07554.jpg', '338-SAU07555.jpg', '339-SAU07556.jpg', '340-SAU07557.jpg', '341-SAU07558.jpg',
            '342-SAU07559.jpg', '343-SAU07560.jpg', '344-SAU07561.jpg', '345-SAU07562.jpg', '346-SAU07563.jpg',
            '347-SAU07564.jpg', '348-SAU07565.jpg', '349-SAU07566.jpg', '350-SAU07571.jpg', '351-SAU07572.jpg',
            '352-SAU07573.jpg', '353-SAU07574.jpg', '355-SAU07575.jpg', '356-SAU07578.jpg', '357-SAU07579.jpg',
            '358-SAU07580.jpg', '359-SAU07584.jpg', '360-SAU07585.jpg', '361-SAU07586.jpg', '362-SAU07587.jpg',
            '363-SAU07588.jpg', '364-SAU07589.jpg', '365-SAU07590.jpg', '366-SAU07591.jpg', '367-SAU07600.jpg',
            '368-SAU07601.jpg', '369-SAU07602.jpg', '370-SAU07603.jpg', '371-SAU07608.jpg', '372-SAU07609.jpg',
            '373-SAU07610.jpg', '374-SAU07611.jpg', '375-SAU07612.jpg', '376-SAU07613.jpg', '377-SAU07614.jpg',
            '378-SAU07615.jpg', '379-SAU07617.jpg', '38-SAU07188.jpg', '380-SAU07616.jpg', '382-SAU07618.jpg',
            '383-SAU07619.jpg', '384-SAU07620.jpg', '385-SAU07626.jpg', '386-SAU07627.jpg', '387-SAU07628.jpg',
            '388-SAU07629.jpg', '389-SAU07630.jpg', '39-SAU07190.jpg', '390-SAU07641.jpg', '391-SAU07640.jpg',
            '392-SAU07647.jpg', '393-SAU07649.jpg', '394-SAU07648.jpg', '395-SAU07650.jpg', '397-SAU07653.jpg',
            '398-SAU07654.jpg', '399-SAU07655.jpg', '4-84670033.jpg', '40-SAU07191.jpg', '400-SAU07656.jpg',
            '401-SAU07657.jpg', '402-SAU07658.jpg', '403-SAU07659.jpg', '404-SAU07660.jpg', '405-SAU07661.jpg',
            '406-SAU07662.jpg', '407-SAU07663.jpg', '408-SAU07664.jpg', '409-SAU07665.jpg', '41-SAU07192.jpg',
            '410-SAU07666.jpg', '411-SAU07667.jpg', '412-SAU07668.jpg', '416-SAU07670.jpg', '417-SAU07671.jpg',
            '418-SAU07672.jpg', '419-SAU07673.jpg', '42-SAU07193.jpg', '420-SAU07674.jpg', '421-SAU07675.jpg',
            '422-SAU07676.jpg', '423-SAU07677.jpg', '424-SAU07678.jpg', '425-SAU07679.jpg', '427-SAU07680.jpg',
            '428-SAU07681.jpg', '429-SAU07682.jpg', '43-SAU07194.jpg', '430-SAU07683.jpg', '44-SAU07195.jpg',
            '45-SAU07196.jpg', '46-SAU07197.jpg', '47-SAU07198.jpg', '48-SAU07199.jpg', '5-84670030.jpg',
            '52-SAU07200.jpg', '53-SAU07201.jpg', '54-SAU07202.jpg', '55-SAU07203.jpg', '56-SAU07204.jpg',
            '57-SAU07205.jpg', '58-SAU07206.jpg', '59-SAU07207.jpg', '6-84670028.jpg', '60-SAU07208.jpg',
            '61-SAU07209.jpg', '62-SAU07211.jpg', '63-SAU07210.jpg', '64-SAU07213.jpg', '65-SAU07212.jpg',
            '66-SAU07214.jpg', '67-SAU07215.jpg', '68-SAU07217.jpg', '69-SAU07216.jpg', '7-84670031.jpg',
            '70-SAU07218.jpg', '71-SAU07219.jpg', '72-SAU07220.jpg', '73-SAU07221.jpg', '74-SAU07222.jpg',
            '75-SAU07223.jpg', '76-SAU07225.jpg', '77-SAU07224.jpg', '78-SAU07226.jpg', '79-SAU07228.jpg',
            '8-84670027.jpg', '80-SAU07227.jpg', '81-SAU07229.jpg', '82-SAU07230.jpg', '83-SAU07231.jpg',
            '84-SAU07232.jpg', '85-SAU07233.jpg', '86-SAU07235.jpg', '87-SAU07234.jpg', '88-SAU07236.jpg',
            '89-SAU07237.jpg', '9-84670019.jpg', '90-SAU07238.jpg', '91-SAU07239.jpg', '92-SAU07240.jpg',
            '93-SAU07241.jpg', '94-SAU07242.jpg', '95-SAU07243.jpg', '96-SAU07245.jpg', '97-SAU07244.jpg',
            '98-SAU07246.jpg', '99-SAU07247.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/gallery/Cultures of the World | Brothers/${file}`);
        console.log('Cultures of the World Brothers photos generated:', photos.slice(0, 3));
        return photos;
    }

    generateCulturesOfTheWorldSistersPhotos() {
        const sistersFiles = [
            '1-84670026.jpg', '10-84670006.jpg', '100-IMG_7162.jpg', '101-IMG_7163.jpg', '102-IMG_7164.jpg',
            '103-IMG_7165.jpg', '104-IMG_7166.jpg', '105-IMG_7167.jpg', '106-IMG_7168.jpg', '107-IMG_7169.jpg',
            '108-IMG_7170.jpg', '109-IMG_7171.jpg', '11-84670007.jpg', '110-IMG_7172.jpg', '111-IMG_7173.jpg',
            '112-IMG_7174.jpg', '113-IMG_7175.jpg', '114-IMG_7176.jpg', '115-IMG_7177.jpg', '116-IMG_7178.jpg',
            '117-IMG_7179.jpg', '118-IMG_7180.jpg', '119-IMG_7181.jpg', '12-84670003.jpg', '120-IMG_7182.jpg',
            '121-IMG_7183.jpg', '122-IMG_7184.jpg', '123-IMG_7185.jpg', '124-IMG_7186.jpg', '125-IMG_7187.jpg',
            '126-IMG_7188.jpg', '127-IMG_7189.jpg', '128-IMG_7190.jpg', '129-IMG_7191.jpg', '13-84670004.jpg',
            '130-IMG_7192.jpg', '131-IMG_7193.jpg', '132-IMG_7194.jpg', '133-IMG_7195.jpg', '134-IMG_7196.jpg',
            '135-IMG_7197.jpg', '136-IMG_7198.jpg', '137-IMG_7199.jpg', '138-IMG_7200.jpg', '139-IMG_7201.jpg',
            '14-84670002.jpg', '140-IMG_7202.jpg', '141-IMG_7203.jpg', '142-IMG_7204.jpg', '143-IMG_7205.jpg',
            '144-IMG_7206.jpg', '145-IMG_7207.jpg', '146-IMG_7208.jpg', '147-IMG_7209.jpg', '148-IMG_7210.jpg',
            '149-IMG_7211.jpg', '15-84670001.jpg', '150-IMG_7212.jpg', '151-IMG_7213.jpg', '152-IMG_7214.jpg',
            '153-IMG_7215.jpg', '154-IMG_7216.jpg', '155-IMG_7217.jpg', '156-IMG_7218.jpg', '157-IMG_7219.jpg',
            '158-IMG_7220.jpg', '159-IMG_7221.jpg', '16-IMG_7853.jpg', '160-IMG_7222.jpg', '161-IMG_7223.jpg',
            '162-IMG_7224.jpg', '163-IMG_7225.jpg', '164-IMG_7226.jpg', '165-IMG_7227.jpg', '166-IMG_7228.jpg',
            '167-IMG_7229.jpg', '168-IMG_7230.jpg', '169-IMG_7231.jpg', '17-IMG_7840.jpg', '170-IMG_7232.jpg',
            '171-IMG_7233.jpg', '172-IMG_7234.jpg', '173-IMG_7235.jpg', '174-IMG_7236.jpg', '175-IMG_7237.jpg',
            '176-IMG_7238.jpg', '177-IMG_7239.jpg', '178-IMG_7240.jpg', '179-IMG_7241.jpg', '18-IMG_7907.jpg',
            '180-IMG_7242.jpg', '181-IMG_7243.jpg', '182-IMG_7244.jpg', '183-IMG_7245.jpg', '184-IMG_7246.jpg',
            '185-IMG_7247.jpg', '186-IMG_7248.jpg', '187-IMG_7249.jpg', '188-IMG_7250.jpg', '189-IMG_7251.jpg',
            '19-IMG_7847.jpg', '190-IMG_7252.jpg', '191-IMG_7253.jpg', '192-IMG_7254.jpg', '193-IMG_7255.jpg',
            '194-IMG_7256.jpg', '195-IMG_7257.jpg', '196-IMG_7258.jpg', '197-IMG_7259.jpg', '198-IMG_7260.jpg',
            '199-IMG_7261.jpg', '2-84670023.jpg', '20-IMG_7852.jpg', '200-IMG_7262.jpg', '201-IMG_7263.jpg',
            '202-IMG_7264.jpg', '203-IMG_7265.jpg', '204-IMG_7266.jpg', '205-IMG_7267.jpg', '206-IMG_7268.jpg',
            '207-IMG_7270.jpg', '208-IMG_7271.jpg', '209-IMG_7272.jpg', '21-IMG_7890.jpg', '210-IMG_7273.jpg',
            '211-IMG_7274.jpg', '212-IMG_7275.jpg', '213-IMG_7276.jpg', '214-IMG_7277.jpg', '215-IMG_7278.jpg',
            '216-IMG_7279.jpg', '217-IMG_7280.jpg', '218-IMG_7281.jpg', '219-IMG_7282.jpg', '22-IMG_7906.jpg',
            '220-IMG_7283.jpg', '221-IMG_7284.jpg', '222-IMG_7285.jpg', '223-IMG_7286.jpg', '224-IMG_7287.jpg',
            '225-IMG_7288.jpg', '226-IMG_7289.jpg', '227-IMG_7290.jpg', '228-IMG_7291.jpg', '229-IMG_7292.jpg',
            '23-IMG_7839.jpg', '230-IMG_7293.jpg', '231-IMG_7294.jpg', '232-IMG_7295.jpg', '233-IMG_7296.jpg',
            '234-IMG_7297.jpg', '235-IMG_7298.jpg', '236-IMG_7299.jpg', '237-IMG_7300.jpg', '238-IMG_7301.jpg',
            '239-IMG_7302.jpg', '24-IMG_7846.jpg', '240-IMG_7303.jpg', '241-IMG_7304.jpg', '242-IMG_7305.jpg',
            '243-IMG_7306.jpg', '244-IMG_7307.jpg', '245-IMG_7308.jpg', '246-IMG_7309.jpg', '247-IMG_7310.jpg',
            '248-IMG_7311.jpg', '249-IMG_7312.jpg', '25-IMG_7851.jpg', '250-IMG_7313.jpg', '251-IMG_7314.jpg',
            '252-IMG_7315.jpg', '253-IMG_7316.jpg', '254-IMG_7320.jpg', '255-IMG_7321.jpg', '256-IMG_7322.jpg',
            '257-IMG_7323.jpg', '258-IMG_7324.jpg', '259-IMG_7325.jpg', '26-IMG_7838.jpg', '260-IMG_7326.jpg',
            '261-IMG_7327.jpg', '262-IMG_7328.jpg', '263-IMG_7329.jpg', '264-IMG_7331.jpg', '265-IMG_7332.jpg',
            '266-IMG_7333.jpg', '267-IMG_7335.jpg', '268-IMG_7336.jpg', '269-IMG_7337.jpg', '27-IMG_7889.jpg',
            '270-IMG_7338.jpg', '271-IMG_7339.jpg', '272-IMG_7340.jpg', '273-IMG_7341.jpg', '274-IMG_7342.jpg',
            '275-IMG_7343.jpg', '276-IMG_7344.jpg', '277-IMG_7345.jpg', '278-IMG_7346.jpg', '279-IMG_7347.jpg',
            '28-IMG_7850.jpg', '280-IMG_7348.jpg', '281-IMG_7349.jpg', '282-IMG_7350.jpg', '283-IMG_7351.jpg',
            '284-IMG_7352.jpg', '285-IMG_7353.jpg', '286-IMG_7354.jpg', '287-DSC_0017.jpg', '288-DSC_0018.jpg',
            '289-DSC_0019.jpg', '29-IMG_7888.jpg', '290-DSC_0020.jpg', '291-DSC_0021.jpg', '292-DSC_0022.jpg',
            '293-DSC_0023.jpg', '294-DSC_0024.jpg', '295-DSC_0025.jpg', '296-DSC_0026.jpg', '297-DSC_0027.jpg',
            '298-DSC_0028.jpg', '299-DSC_0029.jpg', '3-84670024.jpg', '30-IMG_7849.jpg', '300-DSC_0030.jpg',
            '301-DSC_0031.jpg', '302-DSC_0032.jpg', '303-DSC_0033.jpg', '304-DSC_0034.jpg', '305-DSC_0035.jpg',
            '306-DSC_0036.jpg', '307-DSC_0037.jpg', '308-DSC_0038.jpg', '309-DSC_0039.jpg', '31-IMG_7905.jpg',
            '310-DSC_0040.jpg', '311-DSC_0041.jpg', '312-DSC_0042.jpg', '313-DSC_0043.jpg', '314-DSC_0044.jpg',
            '315-DSC_0045.jpg', '316-DSC_0046.jpg', '317-DSC_0047.jpg', '318-DSC_0048.jpg', '319-DSC_0049.jpg',
            '32-IMG_7887.jpg', '320-DSC_0050.jpg', '321-DSC_0051.jpg', '322-DSC_0052.jpg', '323-DSC_0053.jpg',
            '324-DSC_0054.jpg', '325-DSC_0055.jpg', '326-DSC_0056.jpg', '327-DSC_0057.jpg', '328-DSC_0058.jpg',
            '329-DSC_0059.jpg', '33-IMG_7886.jpg', '330-DSC_0060.jpg', '331-DSC_0061.jpg', '332-DSC_0062.jpg',
            '333-DSC_0063.jpg', '334-DSC_0064.jpg', '335-DSC_0065.jpg', '336-DSC_0066.jpg', '337-DSC_0067.jpg',
            '338-DSC_0068.jpg', '339-DSC_0069.jpg', '34-IMG_7885.jpg', '340-DSC_0070.jpg', '341-DSC_0071.jpg',
            '342-DSC_0072.jpg', '343-DSC_0073.jpg', '344-DSC_0074.jpg', '345-DSC_0075.jpg', '346-DSC_0076.jpg',
            '347-DSC_0077.jpg', '348-DSC_0078.jpg', '349-DSC_0079.jpg', '35-IMG_7904.jpg', '350-DSC_0080.jpg',
            '351-DSC_0081.jpg', '352-DSC_0082.jpg', '353-DSC_0083.jpg', '354-DSC_0084.jpg', '355-DSC_0085.jpg',
            '356-DSC_0086.jpg', '357-DSC_0087.jpg', '358-DSC_0088.jpg', '359-DSC_0089.jpg', '36-IMG_7841.jpg',
            '360-DSC_0090.jpg', '361-DSC_0091.jpg', '362-DSC_0092.jpg', '363-DSC_0093.jpg', '364-DSC_0094.jpg',
            '365-DSC_0095.jpg', '366-DSC_0096.jpg', '367-DSC_0097.jpg', '368-DSC_0098.jpg', '369-DSC_0099.jpg',
            '37-IMG_7837.jpg', '370-DSC_0100.jpg', '371-DSC_0101.jpg', '372-DSC_0102.jpg', '373-DSC_0103.jpg',
            '374-DSC_0104.jpg', '375-DSC_0105.jpg', '376-DSC_0106.jpg', '377-DSC_0107.jpg', '378-DSC_0108.jpg',
            '379-DSC_0109.jpg', '38-IMG_7845.jpg', '380-DSC_0110.jpg', '381-DSC_0111.jpg', '382-DSC_0112.jpg',
            '383-DSC_0113.jpg', '384-DSC_0114.jpg', '385-DSC_0115.jpg', '386-DSC_0116.jpg', '387-DSC_0117.jpg',
            '388-DSC_0118.jpg', '389-DSC_0119.jpg', '39-IMG_7884.jpg', '390-DSC_0120.jpg', '391-DSC_0121.jpg',
            '392-DSC_0122.jpg', '393-DSC_0123.jpg', '394-DSC_0124.jpg', '395-DSC_0125.jpg', '396-DSC_0126.jpg',
            '397-DSC_0127.jpg', '398-DSC_0128.jpg', '399-DSC_0129.jpg', '4-84670025.jpg', '40-IMG_7883.jpg',
            '400-DSC_0130.jpg', '401-DSC_0131.jpg', '402-DSC_0132.jpg', '403-DSC_0133.jpg', '404-DSC_0134.jpg',
            '405-DSC_0135.jpg', '406-DSC_0136.jpg', '407-DSC_0137.jpg', '408-DSC_0138.jpg', '409-DSC_0139.jpg',
            '41-IMG_7882.jpg', '410-DSC_0140.jpg', '411-DSC_0141.jpg', '412-DSC_0142.jpg', '413-DSC_0143.jpg',
            '414-DSC_0144.jpg', '415-DSC_0145.jpg', '416-DSC_0146.jpg', '417-DSC_0147.jpg', '418-DSC_0148.jpg',
            '419-DSC_0149.jpg', '42-IMG_7881.jpg', '420-DSC_0150.jpg', '421-DSC_0151.jpg', '422-DSC_0152.jpg',
            '423-DSC_0153.jpg', '424-DSC_0154.jpg', '425-DSC_0155.jpg', '426-DSC_0156.jpg', '427-DSC_0157.jpg',
            '428-DSC_0158.jpg', '429-DSC_0159.jpg', '43-IMG_7880.jpg', '430-DSC_0160.jpg', '431-DSC_0161.jpg',
            '432-DSC_0162.jpg', '433-DSC_0163.jpg', '434-DSC_0164.jpg', '435-DSC_0165.jpg', '436-DSC_0166.jpg',
            '437-DSC_0167.jpg', '438-DSC_0168.jpg', '439-DSC_0169.jpg', '44-IMG_7879.jpg', '440-DSC_0170.jpg',
            '441-DSC_0171.jpg', '442-DSC_0172.jpg', '443-DSC_0173.jpg', '444-DSC_0174.jpg', '445-DSC_0175.jpg',
            '446-DSC_0176.jpg', '447-DSC_0177.jpg', '448-DSC_0178.jpg', '449-DSC_0179.jpg', '45-IMG_7835.jpg',
            '450-DSC_0180.jpg', '451-DSC_0181.jpg', '452-DSC_0182.jpg', '453-DSC_0183.jpg', '454-DSC_0184.jpg',
            '455-DSC_0185.jpg', '456-DSC_0186.jpg', '457-DSC_0187.jpg', '458-DSC_0188.jpg', '459-DSC_0189.jpg',
            '46-IMG_7834.jpg', '460-DSC_0190.jpg', '461-DSC_0191.jpg', '462-DSC_0192.jpg', '463-DSC_0193.jpg',
            '464-DSC_0194.jpg', '465-DSC_0195.jpg', '466-DSC_0196.jpg', '467-DSC_0197.jpg', '468-DSC_0198.jpg',
            '469-DSC_0199.jpg', '47-IMG_7903.jpg', '470-DSC_0200.jpg', '471-DSC_0201.jpg', '472-DSC_0202.jpg',
            '473-DSC_0203.jpg', '474-DSC_0204.jpg', '475-DSC_0205.jpg', '476-DSC_0206.jpg', '477-DSC_0207.jpg',
            '478-DSC_0208.jpg', '479-DSC_0212.jpg', '48-IMG_7902.jpg', '480-DSC_0213.jpg', '481-DSC_0215.jpg',
            '482-DSC_0216.jpg', '483-DSC_0217.jpg', '484-DSC_0218.jpg', '485-DSC_0219.jpg', '486-DSC_0220.jpg',
            '487-DSC_0221.jpg', '488-DSC_0222.jpg', '489-DSC_0223.jpg', '49-IMG_7878.jpg', '490-DSC_0224.jpg',
            '491-DSC_0225.jpg', '492-DSC_0226.jpg', '493-DSC_0227.jpg', '494-DSC_0228.jpg', '495-DSC_0229.jpg',
            '496-DSC_0230.jpg', '497-DSC_0231.jpg', '498-DSC_0232.jpg', '499-DSC_0233.jpg', '5-84670021.jpg',
            '50-IMG_7901.jpg', '500-DSC_0234.jpg', '501-DSC_0235.jpg', '502-DSC_0236.jpg', '503-DSC_0237.jpg',
            '504-DSC_0238.jpg', '505-DSC_0239.jpg', '506-DSC_0240.jpg', '507-DSC_0241.jpg', '508-DSC_0242.jpg',
            '509-DSC_0243.jpg', '51-IMG_7900.jpg', '510-DSC_0244.jpg', '511-DSC_0245.jpg', '512-DSC_0246.jpg',
            '513-DSC_0247.jpg', '514-DSC_0248.jpg', '515-DSC_0249.jpg', '516-DSC_0250.jpg', '517-DSC_0251.jpg',
            '518-DSC_0252.jpg', '519-DSC_0253.jpg', '52-IMG_7899.jpg', '520-DSC_0254.jpg', '521-DSC_0255.jpg',
            '522-DSC_0257.jpg', '523-DSC_0258.jpg', '524-DSC_0259.jpg', '525-DSC_0260.jpg', '526-DSC_0261.jpg',
            '527-DSC_0262.jpg', '528-DSC_0263.jpg', '529-DSC_0264.jpg', '53-IMG_7877.jpg', '530-DSC_0265.jpg',
            '531-DSC_0266.jpg', '532-DSC_0267.jpg', '54-IMG_7876.jpg', '55-IMG_7898.jpg', '56-IMG_7875.jpg',
            '57-IMG_7897.jpg', '58-IMG_7874.jpg', '59-IMG_7896.jpg', '6-84670022.jpg', '60-IMG_7895.jpg',
            '61-IMG_7894.jpg', '62-IMG_7893.jpg', '63-IMG_7873.jpg', '64-IMG_7872.jpg', '65-IMG_7871.jpg',
            '66-IMG_7870.jpg', '67-IMG_7869.jpg', '68-IMG_7892.jpg', '69-IMG_7891.jpg', '7-84670009.jpg',
            '70-IMG_7868.jpg', '71-IMG_7867.jpg', '72-IMG_7866.jpg', '73-IMG_7865.jpg', '74-IMG_7864.jpg',
            '75-IMG_7843.jpg', '76-IMG_7863.jpg', '77-IMG_7848.jpg', '78-IMG_7862.jpg', '79-IMG_7861.jpg',
            '8-84670008.jpg', '80-IMG_7860.jpg', '81-IMG_7859.jpg', '82-IMG_7858.jpg', '83-IMG_7857.jpg',
            '84-IMG_7856.jpg', '85-IMG_7855.jpg', '86-IMG_7854.jpg', '87-IMG_7149.jpg', '88-IMG_7150.jpg',
            '89-IMG_7151.jpg', '9-84670005.jpg', '90-IMG_7152.jpg', '91-IMG_7153.jpg', '92-IMG_7154.jpg',
            '93-IMG_7155.jpg', '94-IMG_7156.jpg', '95-IMG_7157.jpg', '96-IMG_7158.jpg', '97-IMG_7159.jpg',
            '98-IMG_7160.jpg', '99-IMG_7161.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/gallery/Cultures of the World | Sisters/${file}`);
        console.log('Cultures of the World Sisters photos generated:', photos.slice(0, 3));
        return photos;
    }

    generateLaddersWorkshopBrothersPhotos() {
        const brothersFiles = [
            '1-f39266ef-2fa0-4263-944b-b4444b73132d.jpg', '10-192b339b-35f4-4464-bc61-27e0c1b8e8ba.jpg',
            '11-1952be83-9ebf-44ae-9ce6-201ec5f3b622.jpg', '12-154e316b-05c4-4bcd-b7a8-2a77d283a908.jpg',
            '13-8f1d9c2e-2089-44ba-9cf6-b912a8f76470.jpg', '14-651e5e2a-56e8-4e75-b1ef-61509b238d87.jpg',
            '15-75a22523-dae0-4a8d-9196-d20a622e0d30.jpg', '16-76bd2518-7f56-40d3-984e-ea686d2420ae.jpg',
            '17-7bee1ae7-ed3b-4878-b626-6a35213b6b86.jpg', '18-6cdffbcb-aca6-456e-8f63-2acd23fcccdb.jpg',
            '19-3ea4b6ac-94d4-42c0-ac7c-779cc347c6a3.jpg', '2-be978967-9068-408a-b0b2-e97b538364ce.jpg',
            '20-173c3e7c-2a3c-4969-83c7-0c47d78738ea.jpg', '21-2f6dd92b-c96f-4fcf-8185-66953d78b53c.jpg',
            '22-02ff2c34-f412-45a9-8fa7-513591595b07.jpg', '23-0fa6c353-882f-4c89-be1b-8ea467a51244.jpg',
            '24-1f0e78bf-5cb6-4ea3-b5fb-103460976aaa.jpg', '25-6b986b40-a5fe-4c1b-acf2-6abc7a9deb8b.jpg',
            '26-0b8b2d0c-976d-4321-bd9f-187bfe0b2472.jpg', '27-03d15c82-0032-40d3-abd6-2b9f46516d38.jpg',
            '3-c9072b78-68d1-4106-86d3-e4bbca96f092.jpg', '4-b1a5c643-289d-48a9-9dcc-65f61eebc280.jpg',
            '5-b481acae-6e24-4892-b8db-2ce8412c1708.jpg', '6-62510670-8023-4823-8d60-b51575e69414.jpg',
            '7-a79f776e-4237-43c9-9a1f-f45f1569823b.jpg', '8-759dc9cf-3944-494d-a216-2ebd05071883.jpg',
            '9-1001b5f7-7661-4c8f-afc1-6e745addf0c6.jpg'
        ];
        
        const photos = brothersFiles.map(file => `images/gallery/Ladders Workshop | Brothers/${file}`);
        console.log('Ladders Workshop Brothers photos generated:', photos.slice(0, 3));
        return photos;
    }

    generateLaddersWorkshopSistersPhotos() {
        const sistersFiles = [
            '1-578d194e-faa2-4ffe-9bc1-b2059c699b00.jpg', '10-bf8b98bb-04a1-4864-abc1-56f08081bfc9.jpg',
            '11-b21092a5-9117-4cfd-8ba8-9cbb16b834cd.jpg', '12-be48167f-f950-44d9-bc50-b01a8722f84d.jpg',
            '13-59772723-7994-419b-b3d3-590e099d313e.jpg', '14-18836891-043c-4568-a98a-0a33209735d1.jpg',
            '15-a2595f52-58b7-4ce3-ac2d-2e7385aaba7e.jpg', '16-ca7d4690-b282-4efb-80b5-143129273870.jpg',
            '17-a4fd1aaa-81fd-488d-aafe-0dac30c915a2.jpg', '2-12ba6f68-21e6-4355-a439-1867bce6acae.jpg',
            '3-6d63a90e-2a73-4ac5-8934-086807a2240b.jpg', '4-3f90d51e-cbc7-43fc-b0c1-4e5da738a982.jpg',
            '5-0cf2f8dc-e93d-422f-a338-837dd9b7744e.jpg', '6-0d9f5e71-c4e5-4577-a154-0cd90ae1e09d.jpg',
            '7-f420a11b-2398-4279-9bb7-8646165fd41a.jpg', '8-d7a5feba-e858-452a-ab93-b3d076497542.jpg',
            '9-d232f1cd-e5c0-402c-a3d6-5794fd68eac8.jpg'
        ];
        
        const photos = sistersFiles.map(file => `images/gallery/Ladders Workshop | Sisters/${file}`);
        console.log('Ladders Workshop Sisters photos generated:', photos.slice(0, 3));
        return photos;
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
                    <p>${album.count} photos from ${event.name}</p>
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
        
        // Create all photo elements with improved lazy loading
        const totalPhotos = this.currentAlbumPhotos.length;
        const initialLoadCount = Math.min(totalPhotos, 50); // Load first 50 immediately
        
        console.log(`Loading ${initialLoadCount} of ${totalPhotos} photos immediately, rest will lazy load...`);
        
        const fragment = document.createDocumentFragment();
        
        // Load first 50 photos immediately
        for (let i = 0; i < initialLoadCount; i++) {
            const item = this.createPhotoItem(i, albumName, false); // false = not lazy
            fragment.appendChild(item);
        }
        
        // Add first batch to DOM
        container.appendChild(fragment);
        
        // Create placeholder elements for remaining photos
        if (totalPhotos > initialLoadCount) {
            this.createLazyLoadPlaceholders(container, albumName, initialLoadCount);
        }
        
        const endTime = performance.now();
        console.log(`Initial ${initialLoadCount} photos loaded in ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    createPhotoItem(index, albumName, isLazy = true) {
        const photo = this.currentAlbumPhotos[index];
        const thumbnailPath = this.getThumbnailPath(photo);
        const item = document.createElement('div');
        item.className = 'full-album-item';
        
        // Optimized image creation
        const img = document.createElement('img');
        img.alt = `${albumName} Photo ${index + 1}`;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
        
        if (isLazy) {
            // Lazy loading with placeholder
            img.loading = 'lazy';
            img.src = thumbnailPath;
        } else {
            // Immediate loading
            img.src = thumbnailPath;
        }
        
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
    
    createLazyLoadPlaceholders(container, albumName, startIndex) {
        const totalPhotos = this.currentAlbumPhotos.length;
        const remainingPhotos = totalPhotos - startIndex;
        
        console.log(`Creating ${remainingPhotos} lazy load placeholders...`);
        
        // Create placeholder elements for remaining photos
        for (let i = startIndex; i < totalPhotos; i++) {
            const placeholder = this.createLazyPlaceholder(i, albumName);
            container.appendChild(placeholder);
        }
        
        // Set up intersection observer for lazy loading
        this.setupLazyLoadingObserver(container, albumName, startIndex);
    }
    
    createLazyPlaceholder(index, albumName) {
        const item = document.createElement('div');
        item.className = 'full-album-item lazy-placeholder';
        item.setAttribute('data-index', index);
        item.setAttribute('data-album', albumName);
        
        // Create loading placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'photo-placeholder';
        placeholder.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading...</div>
        `;
        
        item.appendChild(placeholder);
        return item;
    }
    
    setupLazyLoadingObserver(container, albumName, startIndex) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const placeholder = entry.target;
                    const index = parseInt(placeholder.getAttribute('data-index'));
                    
                    // Replace placeholder with actual photo
                    const photoItem = this.createPhotoItem(index, albumName, true);
                    placeholder.parentNode.replaceChild(photoItem, placeholder);
                    
                    // Stop observing this element
                    observer.unobserve(placeholder);
                }
            });
        }, {
            rootMargin: '100px' // Start loading 100px before the image comes into view
        });
        
        // Observe all placeholder elements
        const placeholders = container.querySelectorAll('.lazy-placeholder');
        placeholders.forEach(placeholder => observer.observe(placeholder));
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

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        removeBtn.title = 'Request Photo Removal';
        removeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 130px;
            background: rgba(220, 53, 69, 0.8);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        
        removeBtn.addEventListener('mouseover', () => {
            removeBtn.style.background = 'rgba(220, 53, 69, 1)';
        });
        removeBtn.addEventListener('mouseout', () => {
            removeBtn.style.background = 'rgba(220, 53, 69, 0.8)';
        });

        lightbox.appendChild(img);
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(downloadBtn);
        lightbox.appendChild(removeBtn);
        document.body.appendChild(lightbox);

        // Event handlers
        const closeLightbox = () => {
            document.body.removeChild(lightbox);
        };

        closeBtn.addEventListener('click', closeLightbox);
        downloadBtn.addEventListener('click', () => {
            this.downloadSinglePhoto(src, alt.replace(/[^a-zA-Z0-9]/g, '_'));
        });
        removeBtn.addEventListener('click', () => {
            this.showRemovalRequestForm(src, alt);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    showRemovalRequestForm(photoSrc, photoAlt) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'removal-request-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 16000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        // Create form container
        const formContainer = document.createElement('div');
        formContainer.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;

        formContainer.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #2c5530; font-size: 1.5rem;">Request Photo Removal</h3>
            <p style="margin: 0 0 20px 0; color: #666; font-size: 0.9rem;">Please provide your information and we'll review your request.</p>
            
            <form id="removalRequestForm" style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Full Name *</label>
                    <input type="text" id="requesterName" required style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Email Address *</label>
                    <input type="email" id="requesterEmail" required style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Reason for Removal (Optional)</label>
                    <textarea id="removalReason" rows="3" placeholder="e.g., I don't want my photo public" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; resize: vertical; box-sizing: border-box;"></textarea>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button type="submit" style="flex: 1; padding: 12px; background: #2c5530; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s ease;">
                        Submit Request
                    </button>
                    <button type="button" id="cancelRemovalBtn" style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s ease;">
                        Cancel
                    </button>
                </div>
                
                <div id="removalFormMessage" style="margin-top: 10px; padding: 10px; border-radius: 8px; display: none;"></div>
            </form>
        `;

        modal.appendChild(formContainer);
        document.body.appendChild(modal);

        // Close modal function
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        // Cancel button handler
        document.getElementById('cancelRemovalBtn').addEventListener('click', closeModal);

        // Form submission handler
        document.getElementById('removalRequestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('requesterName').value.trim();
            const email = document.getElementById('requesterEmail').value.trim();
            const reason = document.getElementById('removalReason').value.trim();
            
            // Send email using Gmail SMTP
            this.sendRemovalRequest(name, email, reason, photoSrc, photoAlt, closeModal);
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    async sendRemovalRequest(name, email, reason, photoSrc, photoAlt, closeModal) {
        const messageDiv = document.getElementById('removalFormMessage');
        const submitBtn = document.querySelector('#removalRequestForm button[type="submit"]');
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Use Formspree to send email (alternative: create backend API)
            const emailBody = `
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                            .header { background: #2c5530; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                            .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
                            .field { margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-left: 4px solid #2c5530; }
                            .label { font-weight: bold; color: #2c5530; }
                            .photo-preview { margin-top: 20px; padding: 15px; background: #f9f9f9; border: 2px dashed #ddd; border-radius: 8px; }
                            .photo-preview img { max-width: 100%; height: auto; border-radius: 4px; margin-top: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h2>📸 Photo Removal Request</h2>
                            </div>
                            <div class="content">
                                <div class="field">
                                    <div class="label">Requester Name:</div>
                                    <div>${name}</div>
                                </div>
                                
                                <div class="field">
                                    <div class="label">Requester Email:</div>
                                    <div>${email}</div>
                                </div>
                                
                                <div class="field">
                                    <div class="label">Reason for Removal:</div>
                                    <div>${reason || 'No reason provided'}</div>
                                </div>
                                
                                <div class="field">
                                    <div class="label">Photo Name:</div>
                                    <div>${photoAlt}</div>
                                </div>
                                
                                <div class="field">
                                    <div class="label">Photo URL:</div>
                                    <div style="word-break: break-all;"><a href="${photoSrc}">${photoSrc}</a></div>
                                </div>
                                
                                <div class="field">
                                    <div class="label">Timestamp:</div>
                                    <div>${new Date().toLocaleString()}</div>
                                </div>
                                
                                <div class="photo-preview">
                                    <div class="label">Photo Preview:</div>
                                    <img src="${photoSrc}" alt="${photoAlt}" />
                                </div>
                                
                                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                    <strong>Action Required:</strong> Review this request and manually delete the photo from GitHub if approved. Reply to ${email} with your decision.
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `;

            // Send email using fetch to Formspree
            const response = await fetch('https://formspree.io/f/meorpqjz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    reason: reason || 'No reason provided',
                    photoUrl: photoSrc,
                    photoName: photoAlt,
                    timestamp: new Date().toLocaleString(),
                    message: `Photo Removal Request\n\nRequester: ${name}\nEmail: ${email}\nReason: ${reason || 'No reason provided'}\nPhoto: ${photoAlt}\nPhoto URL: ${photoSrc}\nTimestamp: ${new Date().toLocaleString()}`,
                    _subject: `🗑️ Photo Removal Request from ${name}`,
                    _replyto: email,
                    _autoresponse: `Thank you for your photo removal request. We have received your request and will review it shortly. You will receive a response within 24-48 hours.\n\nRequest Details:\n- Photo: ${photoAlt}\n- Submitted: ${new Date().toLocaleString()}\n\nThank you,\nRutgers MSA Team`
                })
            });
            
            if (response.ok) {
                // Show success message
                messageDiv.style.display = 'block';
                messageDiv.style.background = '#d4edda';
                messageDiv.style.color = '#155724';
                messageDiv.style.border = '1px solid #c3e6cb';
                messageDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i> 
                    <strong>Request Submitted!</strong><br>
                    We've received your removal request and will review it shortly. You'll receive an email confirmation at ${email}.
                `;
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    closeModal();
                }, 3000);
            } else {
                throw new Error('Email sending failed');
            }
            
        } catch (error) {
            console.error('Error sending removal request:', error);
            
            // Show error message
            messageDiv.style.display = 'block';
            messageDiv.style.background = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
            messageDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i> 
                <strong>Error!</strong><br>
                There was a problem sending your request. Please try again or email us directly at shaheersaud2004@gmail.com
            `;
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
        }
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
        // Check if contactForm exists, if not, skip initialization
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.init();
        } else {
            console.log('ContactForm: No contactForm element found, skipping initialization');
        }
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
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
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
    heroScroll.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}

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
            this.showSuccessScreen(emailInput, phoneInput, messageDiv);
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

    showSuccessScreen(emailInput, phoneInput, messageDiv) {
        console.log('Button clicked - showing success screen');
        
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        
        // Store the data (even if empty)
        const contactData = {
            email: email || null,
            phone: phone || null,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        // Save to localStorage for tracking
        this.saveNotificationData(contactData);
        console.log('Saved to localStorage:', contactData);
        
        // Show success message immediately
        this.showMessage(messageDiv, `🎉 Success! You're now subscribed to photo notifications!`, 'success');
        
        // Clear the form
        emailInput.value = '';
        phoneInput.value = '';
        
        // Close modal and return to main screen after success
        setTimeout(() => {
            const modal = document.getElementById('notificationModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Scroll to top of page to show main content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
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
        console.log('showMessage called:', message, type);
        console.log('messageDiv element:', messageDiv);
        
        if (!messageDiv) {
            console.error('messageDiv is null or undefined');
            return;
        }
        
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        
        console.log('Message set, className:', messageDiv.className);
        
        // Auto-hide success and loading messages
        if (type === 'success' || type === 'loading') {
            setTimeout(() => {
                if (type === 'success') {
                    messageDiv.textContent = '';
                    messageDiv.className = 'form-message';
                }
            }, type === 'success' ? 5000 : 10000);
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
    const remindMeBtn3 = document.getElementById('remindMeBtn3');
    const modal = document.getElementById('remindMeModal');
    const closeBtn = document.getElementById('remindMeCloseBtn');
    const overlay = document.querySelector('.remind-me-modal-overlay');
    const form = document.getElementById('remindMeForm');
    const emailInput = document.getElementById('remindMeEmail');
    const messageDiv = document.getElementById('remindMeMessage');
    
    // Function to open notification modal
    function openNotificationModal() {
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
    }
    
    // Attach to remindMeBtn if it exists
    if (remindMeBtn) {
        remindMeBtn.addEventListener('click', openNotificationModal);
    }
    
    // Attach to remindMeBtn3 if it exists
    if (remindMeBtn3) {
        remindMeBtn3.addEventListener('click', openNotificationModal);
    }
    
    if (!modal) return;
    
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

// Event Filter Functionality
function initializeEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventTiles = document.querySelectorAll('.event-tile');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter event tiles
            eventTiles.forEach(tile => {
                const tileFilter = tile.getAttribute('data-filter');
                
                if (filterValue === 'all' || tileFilter === filterValue) {
                    tile.style.display = 'block';
                    tile.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    tile.style.display = 'none';
                }
            });
            
            console.log(`Filtered events by: ${filterValue}`);
        });
    });
}

// Initialize event filters when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeEventFilters();
});

