/* script.js - JavaScript for ZTJENITH website */
/* Internet Technologies Module - Component B */

/* ---- Active nav link ---- */
// Get the current page filename from the URL
var currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Loop through all nav links and add 'active' class to the current page
document.querySelectorAll('.nav-links a').forEach(function(link) {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});


/* ---- Image Slider ---- */
// Only runs if there is a slider on the page
var sliderTrack = document.querySelector('.slider-track');

if (sliderTrack) {
    var currentSlide = 0;
    var slides = document.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');
    var totalSlides = slides.length;

    // Move to a specific slide
    function goToSlide(n) {
        // Keep number in range using modulo
        currentSlide = (n + totalSlides) % totalSlides;
        sliderTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

        // Update dots
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Prev and next buttons
    var prevBtn = document.querySelector('.slider-prev');
    var nextBtn = document.querySelector('.slider-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToSlide(currentSlide + 1);
        });
    }

    // Clicking dots
    dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
            goToSlide(i);
        });
    });

    // Auto slide every 4 seconds
    setInterval(function() {
        goToSlide(currentSlide + 1);
    }, 4000);
}


/* ---- Lightbox for gallery ---- */
// Get the lightbox elements
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightbox-img');
var lightboxCap = document.getElementById('lightbox-cap');
var closeBtn = document.getElementById('lightbox-close');

// When a gallery item is clicked, open the lightbox
document.querySelectorAll('[data-lightbox]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        var imgSrc = item.getAttribute('data-full');
        var caption = item.getAttribute('data-caption') || '';

        if (lightbox && imgSrc) {
            lightboxImg.src = imgSrc;
            if (lightboxCap) lightboxCap.textContent = caption;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close button
function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
}

// Click outside the image to close
if (lightbox) {
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Escape key to close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});


/* ---- Contact form validation (requirement #9) ---- */
var contactForm = document.getElementById('contactForm');

if (contactForm) {

    contactForm.addEventListener('submit', function(e) {
        // Stop the form from actually submitting
        e.preventDefault();

        var isValid = true;

        // Helper function to validate a field
        function validate(fieldId, errId, checkFn, message) {
            var field = document.getElementById(fieldId);
            var errSpan = document.getElementById(errId);

            if (!field || !errSpan) return;

            // Reset previous errors
            field.classList.remove('error');
            errSpan.classList.remove('show');

            // Check the value
            if (!checkFn(field.value.trim())) {
                field.classList.add('error');
                errSpan.textContent = message;
                errSpan.classList.add('show');
                isValid = false;
            }
        }

        // Run all validations
        validate('name', 'nameErr',
            function(v) { return v.length >= 2; },
            'Please enter your name (at least 2 characters).'
        );

        validate('email', 'emailErr',
            function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
            'Please enter a valid email address.'
        );

        validate('subject', 'subjectErr',
            function(v) { return v !== ''; },
            'Please select a subject.'
        );

        validate('message', 'msgErr',
            function(v) { return v.length >= 10; },
            'Message must be at least 10 characters.'
        );

        // If everything passed, show success
        if (isValid) {
            var successMsg = document.getElementById('successMsg');
            if (successMsg) {
                successMsg.classList.add('show');
                contactForm.reset();
                // Hide after 5 seconds
                setTimeout(function() {
                    successMsg.classList.remove('show');
                }, 5000);
            }
        }
    });

    // Clear error when user starts typing
    contactForm.querySelectorAll('input, textarea, select').forEach(function(el) {
        el.addEventListener('input', function() {
            this.classList.remove('error');
            // Work out which error span to clear
            var errId = this.id + 'Err';
            if (this.id === 'message') errId = 'msgErr';
            var errSpan = document.getElementById(errId);
            if (errSpan) errSpan.classList.remove('show');
        });
    });
}


/* ---- Skill bar animation ---- */
// When skill bars scroll into view, animate them
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar').forEach(function(bar) {
                bar.style.width = bar.getAttribute('data-width') || '0%';
            });
        }
    });
}, { threshold: 0.3 });

// Store original widths and start at 0 for animation
document.querySelectorAll('.skills-grid').forEach(function(grid) {
    grid.querySelectorAll('.skill-bar').forEach(function(bar) {
        bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0%';
    });
    observer.observe(grid);
});
