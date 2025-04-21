// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Add animation to elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';

    mobileMenuBtn.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
    });

    nav.insertBefore(mobileMenuBtn, nav.firstChild);
};

// Initialize mobile menu if screen width is less than 768px
if (window.innerWidth < 768) {
    createMobileMenu();
}

// Update mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        if (!document.querySelector('.mobile-menu-btn')) {
            createMobileMenu();
        }
    } else {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.remove();
        }
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.remove('show');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.nav-links')) {
            navLinks.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Music Controls
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.querySelector('.volume-control i');
    let isPlaying = false;

    // Set initial volume
    bgMusic.volume = volumeSlider.value / 100;

    // Function to toggle music
    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.play().catch(function(error) {
                console.log("Playback failed:", error);
            });
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }

    // Function to update volume
    function updateVolume() {
        const volume = volumeSlider.value / 100;
        bgMusic.volume = volume;
        if (customMusic) {
            customMusic.volume = volume;
        }

        // Update volume icon based on level
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    // Add click event listener to music toggle button
    musicToggle.addEventListener('click', toggleMusic);

    // Add input event listener to volume slider
    volumeSlider.addEventListener('input', updateVolume);

    // Handle page visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Don't pause music when page is hidden
            return;
        }
    });

    // Handle audio loading error
    bgMusic.addEventListener('error', function() {
        console.error('Error loading audio file');
        musicToggle.style.display = 'none';
        document.querySelector('.music-control').style.display = 'none';
    });

    // Ensure music continues playing even when browser tab is inactive
    bgMusic.addEventListener('pause', function() {
        if (isPlaying && !document.hidden) {
            // If music was supposed to be playing but got paused, restart it
            setTimeout(function() {
                bgMusic.play().catch(function(error) {
                    console.log("Playback restart failed:", error);
                });
            }, 100);
        }
    });

    // Auto-play music when page loads
    window.addEventListener('load', function() {
        // Try to autoplay the music
        bgMusic.play().then(function() {
            isPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(function(error) {
            console.log("Autoplay prevented:", error);
        });
    });

    // Custom Music Upload Functionality
    const musicUploadForm = document.getElementById('musicUploadForm');
    const musicFileInput = document.getElementById('musicFile');
    const uploadStatus = document.getElementById('uploadStatus');
    const currentMusic = document.getElementById('currentMusic');
    const playCustomMusic = document.getElementById('playCustomMusic');
    const removeCustomMusic = document.getElementById('removeCustomMusic');
    let customMusic = null;
    let isCustomMusicPlaying = false;

    // Handle file selection
    musicFileInput.addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : 'No file selected';
        uploadStatus.textContent = `Selected: ${fileName}`;
    });

    // Handle form submission
    musicUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!musicFileInput.files[0]) {
            uploadStatus.textContent = 'Please select a music file first';
            uploadStatus.style.color = '#ff3333';
            return;
        }

        const file = musicFileInput.files[0];

        // Check if file is an audio file
        if (!file.type.startsWith('audio/')) {
            uploadStatus.textContent = 'Please select a valid audio file';
            uploadStatus.style.color = '#ff3333';
            return;
        }

        // Create object URL for the audio file
        if (customMusic) {
            URL.revokeObjectURL(customMusic.src);
        }

        customMusic = new Audio(URL.createObjectURL(file));
        customMusic.loop = true;

        // Update UI
        currentMusic.innerHTML = `<p>Current music: <strong>${file.name}</strong></p>`;
        uploadStatus.textContent = 'Music uploaded successfully!';
        uploadStatus.style.color = '#00ff00';

        // Enable buttons
        playCustomMusic.disabled = false;
        removeCustomMusic.disabled = false;

        // Set volume to match current volume
        customMusic.volume = volumeSlider.value / 100;
    });

    // Play custom music
    playCustomMusic.addEventListener('click', function() {
        if (customMusic) {
            if (customMusic.paused) {
                // Pause default music if playing
                if (isPlaying) {
                    bgMusic.pause();
                    musicToggle.classList.remove('playing');
                    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                    isPlaying = false;
                }

                // Play custom music
                customMusic.play().catch(function(error) {
                    console.log("Custom music playback failed:", error);
                });
                playCustomMusic.innerHTML = '<i class="fas fa-pause"></i> Pause';
                playCustomMusic.classList.add('playing');
                isCustomMusicPlaying = true;
            } else {
                customMusic.pause();
                playCustomMusic.innerHTML = '<i class="fas fa-play"></i> Play';
                playCustomMusic.classList.remove('playing');
                isCustomMusicPlaying = false;
            }
        }
    });

    // Remove custom music
    removeCustomMusic.addEventListener('click', function() {
        if (customMusic) {
            customMusic.pause();
            URL.revokeObjectURL(customMusic.src);
            customMusic = null;

            // Reset UI
            currentMusic.innerHTML = '<p>No custom music uploaded yet</p>';
            uploadStatus.textContent = '';
            playCustomMusic.innerHTML = '<i class="fas fa-play"></i> Play';
            playCustomMusic.classList.remove('playing');
            playCustomMusic.disabled = true;
            removeCustomMusic.disabled = true;
            musicFileInput.value = '';
            isCustomMusicPlaying = false;
        }
    });

    // Update volume for custom music when volume slider changes
    volumeSlider.addEventListener('input', function() {
        if (customMusic) {
            customMusic.volume = this.value / 100;
        }
    });

    // Ensure custom music continues playing
    if (customMusic) {
        customMusic.addEventListener('pause', function() {
            if (isCustomMusicPlaying && !document.hidden) {
                setTimeout(function() {
                    customMusic.play().catch(function(error) {
                        console.log("Custom music restart failed:", error);
                    });
                }, 100);
            }
        });
    }

    // Cookie Consent and Privacy Policy
    const cookieConsent = document.getElementById('cookie-consent');
    const privacyPopup = document.getElementById('privacy-popup');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');
    const acceptPrivacyBtn = document.getElementById('accept-privacy');
    const declinePrivacyBtn = document.getElementById('decline-privacy');

    // Check if user has already accepted cookies and privacy policy
    function checkConsent() {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        const privacyAccepted = localStorage.getItem('privacyAccepted');

        if (!cookiesAccepted) {
            // Show cookie consent banner
            cookieConsent.style.display = 'block';
        }

        if (!privacyAccepted) {
            // Show privacy policy popup
            privacyPopup.style.display = 'flex';
        }
    }

    // Accept cookies
    acceptCookiesBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.style.display = 'none';
    });

    // Decline cookies
    declineCookiesBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieConsent.style.display = 'none';
    });

    // Accept privacy policy
    acceptPrivacyBtn.addEventListener('click', function() {
        localStorage.setItem('privacyAccepted', 'true');
        privacyPopup.style.display = 'none';
    });

    // Decline privacy policy
    declinePrivacyBtn.addEventListener('click', function() {
        localStorage.setItem('privacyAccepted', 'false');
        privacyPopup.style.display = 'none';
        // Optionally redirect to another page or show a message
        alert('You must accept our Privacy Policy to use this website.');
        window.location.href = 'https://www.google.com';
    });

    // Check consent on page load
    checkConsent();
});