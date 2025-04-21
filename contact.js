document.addEventListener('DOMContentLoaded', function() {
    // Contact form functionality
    const contactLink = document.querySelector('a[href="/contact"]');
    const contactModal = document.getElementById('contact-modal');
    const closeContactModal = document.querySelector('.close-contact-modal');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    // Open contact modal when clicking contact link
    if (contactLink) {
      contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        contactModal.classList.add('active');
      });
    }
    
    // Close contact modal when clicking close button
    if (closeContactModal) {
      closeContactModal.addEventListener('click', function() {
        contactModal.classList.remove('active');
      });
    }
    
    // Close contact modal when clicking outside the modal
    window.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        contactModal.classList.remove('active');
      }
    });
    
    // Handle form submission
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would normally send the form data to the server
        // For now, we'll just show the success message
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Reset form after 3 seconds
        setTimeout(function() {
          contactForm.reset();
          contactForm.style.display = 'block';
          formSuccess.style.display = 'none';
          contactModal.classList.remove('active');
        }, 3000);
      });
    }
    
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (mobileMenuToggle && navLinks) {
      mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
      });
    }
    
    // Handle dropdown menus on mobile
    dropdowns.forEach(dropdown => {
      const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
      
      if (dropdownToggle && window.innerWidth <= 768) {
        dropdownToggle.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });
  });