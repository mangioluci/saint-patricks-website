// Gallery JavaScript for Chácara Saint Patrick

document.addEventListener('DOMContentLoaded', function() {
    
    // Gallery filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Filter system
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items with animation
            galleryItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    // Trigger reflow for animation
                    item.offsetHeight;
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }, 300);
                }
            });
            
            // Update gallery count
            updateGalleryCount(filter);
        });
    });
    
    // Modal functionality
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalImage = document.getElementById('modalImage');
    const viewButtons = document.querySelectorAll('.view-btn');
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Setup modal for each image
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const imageSrc = this.dataset.image;
            
            // Get all visible images for navigation
            updateCurrentImages();
            currentIndex = getCurrentImageIndex(imageSrc);
            
            showModalImage(imageSrc);
            modal.show();
        });
    });
    
    // Gallery item click to open modal
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const viewBtn = this.querySelector('.view-btn');
            if (viewBtn) {
                viewBtn.click();
            }
        });
    });
    
    // Modal navigation
    prevButton.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            const imageSrc = currentImages[currentIndex];
            showModalImage(imageSrc);
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentIndex < currentImages.length - 1) {
            currentIndex++;
            const imageSrc = currentImages[currentIndex];
            showModalImage(imageSrc);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal._isShown) {
            if (e.key === 'ArrowLeft') {
                prevButton.click();
            } else if (e.key === 'ArrowRight') {
                nextButton.click();
            } else if (e.key === 'Escape') {
                modal.hide();
            }
        }
    });
    
    // Update navigation buttons state
    function updateNavigationButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === currentImages.length - 1;
        
        if (currentImages.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
        }
    }
    
    // Show modal image
    function showModalImage(imageSrc) {
        modalImage.src = imageSrc;
        modalImage.alt = getImageAlt(imageSrc);
        updateNavigationButtons();
        
        // Add loading state
        modalImage.style.opacity = '0';
        modalImage.onload = function() {
            this.style.opacity = '1';
        };
    }
    
    // Get current images array (visible only)
    function updateCurrentImages() {
        currentImages = [];
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        visibleItems.forEach(item => {
            const viewBtn = item.querySelector('.view-btn');
            if (viewBtn) {
                currentImages.push(viewBtn.dataset.image);
            }
        });
    }
    
    // Get current image index
    function getCurrentImageIndex(imageSrc) {
        return currentImages.findIndex(src => src === imageSrc);
    }
    
    // Get image alt text
    function getImageAlt(imageSrc) {
        const img = document.querySelector(`img[src="${imageSrc}"]`);
        return img ? img.alt : 'Imagem da Chácara Saint Patrick';
    }
    
    // Update gallery count
    function updateGalleryCount(filter) {
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        const count = visibleItems.length;
        
        // Update filter button text with count
        const activeButton = document.querySelector('.filter-btn.active');
        const originalText = activeButton.textContent.split(' (')[0];
        activeButton.innerHTML = `${activeButton.innerHTML.split(' (')[0]} <small>(${count})</small>`;
    }
    
    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const item = img.closest('.gallery-item');
                
                // Add loading state
                item.classList.add('loading');
                
                img.onload = function() {
                    item.classList.remove('loading');
                    img.style.opacity = '1';
                };
                
                img.onerror = function() {
                    item.classList.remove('loading');
                    this.src = 'assets/images/placeholder.jpg';
                    this.alt = 'Imagem não disponível';
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    // Observe all gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.style.opacity = '0';
        imageObserver.observe(img);
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    modalImage.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    modalImage.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                nextButton.click();
            } else {
                // Swipe right - previous image
                prevButton.click();
            }
        }
    }
    
    // Auto-hide overlay on mobile after delay
    let overlayTimeout;
    galleryItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            const overlay = this.querySelector('.gallery-overlay');
            overlay.style.transform = 'translateY(0)';
            
            clearTimeout(overlayTimeout);
            overlayTimeout = setTimeout(() => {
                overlay.style.transform = 'translateY(100%)';
            }, 3000);
        });
    });
    
    // Search functionality (if search input exists)
    const searchInput = document.getElementById('gallerySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            galleryItems.forEach(item => {
                const title = item.querySelector('h5').textContent.toLowerCase();
                const alt = item.querySelector('img').alt.toLowerCase();
                
                if (title.includes(searchTerm) || alt.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            });
        });
    }
    
    // Analytics tracking
    function trackGalleryInteraction(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }
    
    // Track filter usage
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackGalleryInteraction('filter_click', 'gallery', this.dataset.filter);
        });
    });
    
    // Track image views
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageName = this.dataset.image.split('/').pop();
            trackGalleryInteraction('image_view', 'gallery', imageName);
        });
    });
    
    // Initialize gallery count
    updateGalleryCount('all');
    
    // Preload next/previous images for better UX
    function preloadAdjacentImages() {
        if (currentIndex > 0 && currentImages[currentIndex - 1]) {
            const prevImg = new Image();
            prevImg.src = currentImages[currentIndex - 1];
        }
        
        if (currentIndex < currentImages.length - 1 && currentImages[currentIndex + 1]) {
            const nextImg = new Image();
            nextImg.src = currentImages[currentIndex + 1];
        }
    }
    
    // Preload on modal show
    document.getElementById('imageModal').addEventListener('shown.bs.modal', function() {
        preloadAdjacentImages();
    });
    
    console.log('Gallery loaded successfully!');
});
