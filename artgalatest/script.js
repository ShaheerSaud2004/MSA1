// Art Gala Page Script

// Artwork data - extracted from filenames with sale prices
const artworks = [
    { filename: '_ Khan - Sanctum in Erbil .jpeg', artist: 'Yassir Khan', title: 'Sanctum in Erbil', price: 800 },
    { filename: 'AAFIA - Dreams of Values - @cornerofaafiaandthird .jpeg', artist: 'Aminat Jenrola Olajide (AAFIA)', title: 'Dreams of Values', instagram: '@cornerofaafiaandthird', price: 400 },
    { filename: 'Abrar Khan - Aazam.jpeg', artist: 'Abrar Khan', title: 'Aazam', price: 300 },
    { filename: 'Afrin A Shaikh - Gratefulness 14_7- @kalimatalraaha_afrin .jpeg', artist: 'Afrin A Shaikh', title: 'Gratefulness. [Quran 14:7]', instagram: '@kalimatalraaha_afrin', price: 2100 },
    { filename: 'Fariah Baig -Bismillahirahmanirrahim - @faru_flix .jpeg', artist: 'Fariah Baig', title: 'Bismillahirahmanirrahim', instagram: '@faru_flix', price: 500 },
    { filename: 'Fariah Baig-SubhanAllah- @faru_flix - jpeg.jpg', artist: 'Fariah Baig', title: 'SubhanAllah', instagram: '@faru_flix', price: 650 },
    { filename: 'Filza Alam - Veins of Gold - @artbyfilza .jpeg', artist: 'Filza Alam', title: 'Veins of Gold', instagram: '@artbyfilza', price: 475 },
    { filename: 'Hafsah Amjad - Ayatul Kursi.jpeg', artist: 'Hafsah Amjad', title: 'Ayatul Kursi', price: 2300 },
    { filename: 'Hafsah Faizan- By the Olive and the Fig - @art.byhafsah .jpeg', artist: 'Hafsah Faizan', title: 'By the Olive and the Fig', instagram: '@art.byhafsah', price: 750 },
    { filename: 'Haniyah Mahmood-His Mercy - @art.haniyah - .jpeg', artist: 'Haniyah Mahmood', title: 'His Mercy', instagram: '@art.haniyah', price: 1400 },
    { filename: 'Haniyah Mahmood-Rooh ar Rooh - @art.haniyah -.jpeg', artist: 'Haniyah Mahmood', title: 'Rooh ar Rooh', instagram: '@art.haniyah', price: 450 },
    { filename: 'Iman Siddiqui - [6_162] .jpeg', artist: 'Iman Siddiqui', title: '(6:162)', price: 900 },
    { filename: 'Khaleel - Majestic Forest.jpeg', artist: 'Khaleel', title: 'Majestic Forest', price: 550 },
    { filename: 'Nabilah Julikar (Highest Bid)-Morning Chai.jpeg', artist: 'Nabilah Julikar', title: 'Morning Chai', badge: 'Highest Bid', price: 8000 },
    { filename: 'Nafia Naveed- Foundation of Iman- @rifalutions - .jpeg', artist: 'Nafia Naveed', title: 'Foundation of Iman', instagram: '@rifalutions', price: 300 },
    { filename: 'Romeesa Baig-Bound by Faith .jpeg', artist: 'Romeesa Baig', title: 'Bound by Faith', price: 1000 },
    { filename: 'Safa Hashmi (Highest Voted)-Signs in the Stars.jpeg', artist: 'Safa Hashmi', title: 'Signs in the Stars', badge: 'Highest Voted' },
    { filename: 'Saima Shabbir-Alhumdulillah - @saimas.art.corner - .jpeg', artist: 'Saima Shabbir', title: 'Alhumdulillah calligraphy', instagram: '@saimas.art.corner', price: 1200 },
    { filename: 'Sofiyah Ameen - _Where Earth Recites Bismillah_.jpeg', artist: 'Sofiyah Ameen', title: 'Where Earth Recites Bismillah', price: 550 },
    { filename: 'Zainab Masoud (Live Artist)- Masjid Al-Nabawi -@turmericpowderr-. png', artist: 'Zainab Masoud', title: 'Masjid Al-Nabawi', instagram: '@turmericpowderr', badge: 'Live Artist' },
    { filename: 'Zaynab Khan - Oasis.jpeg', artist: 'Zaynab Khan', title: 'Oasis', price: 800 },
    { filename: 'Zaynab Khan - Pure Heart.jpeg', artist: 'Zaynab Khan', title: 'Pure Heart', price: 800 }
];

// Function to create artwork card HTML
function createArtworkCard(artwork) {
    const imagePath = `../ArtGalaArtpieces/${artwork.filename}`;
    const badgeHTML = artwork.badge ? `<div class="artwork-badge">${artwork.badge}</div>` : '';
    const instagramHTML = artwork.instagram ? `<div class="artwork-instagram">${artwork.instagram}</div>` : '';
    const priceHTML = artwork.price ? `<div class="artwork-price">$${artwork.price.toLocaleString()}</div>` : '';
    
    return `
        <div class="artwork-card">
            <div class="artwork-image-container">
                <img src="${imagePath}" alt="${artwork.title} by ${artwork.artist}" class="artwork-image" loading="lazy">
                ${badgeHTML}
            </div>
            <div class="artwork-info">
                <div class="artwork-title">${artwork.title}</div>
                <div class="artwork-artist">by ${artwork.artist}</div>
                ${priceHTML}
                ${instagramHTML}
            </div>
        </div>
    `;
}

// Function to sort artworks
let currentSort = 'none';

function sortArtworks(sortType) {
    let sortedArtworks = [...artworks];
    
    if (sortType === 'high') {
        sortedArtworks.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortType === 'low') {
        sortedArtworks.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    // If sortType is 'none', keep original order
    
    return sortedArtworks;
}

// Function to load artworks into the grid
function loadArtworks(sortType = 'none') {
    const artworksGrid = document.getElementById('artworksGrid');
    if (!artworksGrid) return;
    
    const sortedArtworks = sortArtworks(sortType);
    artworksGrid.innerHTML = sortedArtworks.map(artwork => createArtworkCard(artwork)).join('');
    
    // Add click handlers for lightbox effect (optional)
    const artworkCards = artworksGrid.querySelectorAll('.artwork-card');
    artworkCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // You can add a lightbox/modal here if desired
            console.log('Clicked artwork:', sortedArtworks[index]);
        });
    });
    
    // Re-initialize scroll animations
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll indicator click handler
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const artworksSection = document.getElementById('artworks');
            if (artworksSection) {
                const offsetTop = artworksSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Mobile menu toggle (reuse from main site if needed)
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe artwork cards
    const artworkCards = document.querySelectorAll('.artwork-card');
    artworkCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe organization cards
    const orgCards = document.querySelectorAll('.org-card');
    orgCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize sort button
function initSortButton() {
    const sortBtn = document.getElementById('sortBtn');
    if (!sortBtn) return;
    
    sortBtn.addEventListener('click', () => {
        // Cycle through: none -> high -> low -> none
        if (currentSort === 'none') {
            currentSort = 'high';
            sortBtn.setAttribute('data-sort', 'high');
            sortBtn.innerHTML = '<i class="fas fa-sort-amount-down"></i><span>High to Low</span>';
        } else if (currentSort === 'high') {
            currentSort = 'low';
            sortBtn.setAttribute('data-sort', 'low');
            sortBtn.innerHTML = '<i class="fas fa-sort-amount-up"></i><span>Low to High</span>';
        } else {
            currentSort = 'none';
            sortBtn.setAttribute('data-sort', 'none');
            sortBtn.innerHTML = '<i class="fas fa-sort"></i><span>Sort by Price</span>';
        }
        
        loadArtworks(currentSort);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadArtworks();
    initSmoothScroll();
    initScrollIndicator();
    initMobileMenu();
    initSortButton();
    
    // Delay scroll animations slightly to ensure elements are rendered
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
});

// Handle image loading errors
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && e.target.classList.contains('artwork-image')) {
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%233f0709" width="300" height="300"/%3E%3Ctext fill="%23a89664" font-family="serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Found%3C/text%3E%3C/svg%3E';
    }
}, true);

