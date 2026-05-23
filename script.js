// 1. Cursor Follower Logic
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
    // Moves the cursor glow to follow the mouse
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.opacity = '0.5';
});

document.addEventListener('mouseleave', () => {
    // Hides the cursor glow when mouse leaves window
    cursor.style.opacity = '0';
});

// 2. Active Link Switching on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

const closeMobileMenu = () => {
    if (!mobileMenuToggle) return;
    document.body.classList.remove('menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
};

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                closeMobileMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
    });
}

window.addEventListener('scroll', () => {
    let current = '';

    // Determine which section is currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if ((window.pageYOffset || window.scrollY) >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });

    // Update the active class in the sidebar navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// 3. Certificate Lightbox Modal Logic
const certCards = document.querySelectorAll('#certificates .cert-card');
const lightbox = document.getElementById('cert-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxSubtitle = document.getElementById('lightbox-subtitle');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentCertIndex = 0;
const certsData = [];

// Parse certificates data from cards
certCards.forEach((card, index) => {
    const img = card.querySelector('.cert-img-top img');
    const title = card.querySelector('.cert-title')?.innerText || '';
    const issuer = card.querySelector('.cert-issuer')?.innerText || '';
    const date = card.querySelector('.cert-date')?.innerText || '';
    
    certsData.push({
        src: img?.getAttribute('src') || '',
        title: title,
        subtitle: `${issuer} • ${date}`
    });

    // We can also allow clicking the "View Certificate" button if there is one
    const btn = card.querySelector('.cert-view-btn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click
            openLightbox(index);
        });
    }
});

function openLightbox(index) {
    currentCertIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
}

function updateLightboxContent() {
    const cert = certsData[currentCertIndex];
    if (cert) {
        lightboxImg.src = cert.src;
        lightboxTitle.innerText = cert.title;
        lightboxSubtitle.innerText = cert.subtitle;
    }
}

function prevCert() {
    currentCertIndex = (currentCertIndex - 1 + certsData.length) % certsData.length;
    updateLightboxContent();
}

function nextCert() {
    currentCertIndex = (currentCertIndex + 1) % certsData.length;
    updateLightboxContent();
}

// Event Listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevCert();
});
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCert();
});

// Close when clicking outside content (on backdrop)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        prevCert();
    } else if (e.key === 'ArrowRight') {
        nextCert();
    }
});