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
            '2025-09-30': [{ title: 'HOPE Event', location: 'CA MPR', type: 'HOPE', time: '4:30 PM - 11:45 PM' }],
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
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    renderCalendar() {
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

            // Check if this day has an event
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (this.events[dateString]) {
                const events = this.events[dateString];
                dayElement.classList.add('has-event');
                
                // Add primary event type class (first event's type)
                const primaryType = events[0].type.toLowerCase().replace(/\s/g, '-');
                dayElement.classList.add(`event-${primaryType}`);
                
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
                
                // Add click event listener
                dayElement.addEventListener('click', () => {
                    this.showEventModal(dateString, events);
                });
                
                // Add cursor pointer
                dayElement.style.cursor = 'pointer';
            }

            // Highlight today
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
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

// Gallery Filter
class GalleryFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                this.filterGallery(filter);
            });
        });
    }

    filterGallery(filter) {
        this.galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventCalendar();
    new GalleryFilter();
    new ContactForm();
    new ScrollAnimations();
    new CounterAnimation();
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
