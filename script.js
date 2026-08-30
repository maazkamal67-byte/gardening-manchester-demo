/**
 * Gardening Services Manchester - Interactive Scripts
 * Pure vanilla JavaScript: Fast, accessible, and lightweight.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation & Header Scrolled State
  const mainHeader = document.getElementById('main-header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Scroll Reveal Animations via Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 4. Active Navigation Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // 5. Service Card Selection Helper
  const serviceSelectDropdown = document.getElementById('service-select');
  const serviceCtaLinks = document.querySelectorAll('.service-select-btn');

  serviceCtaLinks.forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedService = button.getAttribute('data-service');
      if (serviceSelectDropdown && selectedService) {
        serviceSelectDropdown.value = selectedService;
        
        // Scroll to form smoothly
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          
          // Flash highlight on the select element
          setTimeout(() => {
            serviceSelectDropdown.focus();
            serviceSelectDropdown.style.borderColor = 'var(--color-accent-terracotta)';
            setTimeout(() => {
              serviceSelectDropdown.style.borderColor = '';
            }, 1800);
          }, 600);
        }
      }
    });
  });

  // 6. Area / Postcode Filter & Checker
  const areaSearchInput = document.getElementById('area-search-input');
  const areaChips = document.querySelectorAll('.area-chip');
  const areaSearchFeedback = document.getElementById('area-search-feedback');

  if (areaSearchInput) {
    areaSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let matchCount = 0;

      areaChips.forEach((chip) => {
        const areaName = chip.getAttribute('data-area') ? chip.getAttribute('data-area').toLowerCase() : chip.textContent.toLowerCase();
        const postcodes = chip.getAttribute('data-postcode') ? chip.getAttribute('data-postcode').toLowerCase() : '';

        if (!query || areaName.includes(query) || postcodes.includes(query)) {
          chip.style.display = 'inline-flex';
          matchCount++;
        } else {
          chip.style.display = 'none';
        }
      });

      if (areaSearchFeedback) {
        if (query.length > 0) {
          if (matchCount > 0) {
            areaSearchFeedback.innerHTML = `✓ Yes! We cover <strong>${matchCount} matching area(s)</strong> in Manchester. Call 0161 823 0201 for immediate booking.`;
            areaSearchFeedback.style.color = 'var(--color-primary-dark)';
          } else {
            areaSearchFeedback.innerHTML = `We cover all M-postcodes across Greater Manchester! Call <strong>0161 823 0201</strong> to confirm your specific address.`;
            areaSearchFeedback.style.color = 'var(--color-accent-terracotta)';
          }
        } else {
          areaSearchFeedback.innerHTML = '';
        }
      }
    });

    areaChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const areaName = chip.getAttribute('data-area') || chip.textContent.trim();
        areaSearchInput.value = areaName;
        areaSearchInput.dispatchEvent(new Event('input'));
      });
    });
  }

  // 7. Contact / Quote Form Validation & Submission
  const quoteForm = document.getElementById('quote-form');
  const formSuccessBanner = document.getElementById('form-success-banner');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('quote-name');
      const phoneInput = document.getElementById('quote-phone');
      const emailInput = document.getElementById('quote-email');
      const serviceInput = document.getElementById('service-select');
      const messageInput = document.getElementById('quote-message');

      // Basic validation
      if (!nameInput.value.trim()) {
        nameInput.focus();
        return;
      }
      if (!phoneInput.value.trim()) {
        phoneInput.focus();
        return;
      }

      // UI Loading state
      if (formSubmitBtn) {
        const originalText = formSubmitBtn.innerHTML;
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Submitting Quote Request...
        `;

        setTimeout(() => {
          // Success Response
          quoteForm.style.display = 'none';
          if (formSuccessBanner) {
            const customerName = nameInput.value.trim().split(' ')[0] || 'there';
            const selectedServiceName = serviceInput.options[serviceInput.selectedIndex]?.text || 'Gardening';
            
            formSuccessBanner.innerHTML = `
              <div class="form-success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h4>Thank you, ${escapeHtml(customerName)}!</h4>
              <p style="margin-bottom: 0.75rem;">Your quote request for <strong>${escapeHtml(selectedServiceName)}</strong> has been received by our Manchester team.</p>
              <p style="font-size: 0.85rem; color: var(--color-text-muted);">One of our local gardeners will review your details and contact you at <strong>${escapeHtml(phoneInput.value.trim())}</strong> shortly.</p>
              <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--color-border);">
                <p style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary-dark);">Need urgent same-day service? Call our 24/7 hotline directly:</p>
                <a href="tel:01618230201" class="btn btn-primary btn-sm" style="margin-top: 0.5rem; display: inline-flex;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  0161 823 0201
                </a>
              </div>
            `;
            formSuccessBanner.classList.add('show');
          }
        }, 800);
      }
    });
  }

  // Robust Image Fallback & Load Error Handling
  const allImages = document.querySelectorAll('img');
  allImages.forEach((img) => {
    img.addEventListener('error', function () {
      if (this.dataset.fallback && this.src !== this.dataset.fallback) {
        console.warn('Primary image load failed, applying verified fallback for:', this.alt);
        this.src = this.dataset.fallback;
      }
    });
  });
});

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
