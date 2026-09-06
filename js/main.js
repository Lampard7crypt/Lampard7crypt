/**
 * Lampard Kipyegon - Portfolio JavaScript
 * Architecture: Clean Vanilla JS (Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  const openDrawer = () => {
    mobileToggle?.classList.add('active');
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileToggle?.classList.remove('active');
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerBackdrop?.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 3. Typewriter Headline Animation
  const typewriterText = document.getElementById('typewriterText');
  if (typewriterText) {
    const roles = [
      'Machine Learning & Data Science Engineer',
      'Building End-to-End Scikit-Learn Pipelines',
      'Full-Stack Developer (Django, React, TS)',
      'Predictive Modeling & Feature Engineering',
      'Strategic Problem Solver & ML Practitioner'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    const typeRole = () => {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriterText.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 35;
      } else {
        typewriterText.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typingSpeed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400; // Pause before new word
      }

      setTimeout(typeRole, typingSpeed);
    };

    setTimeout(typeRole, 600);
  }

  // 4. Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 5. Active Section Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const scrollSpy = () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollSpy, { passive: true });

  // 6. In-Page Asynchronous Contact Form Submission (Zero Redirects)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic client-side validation
      const name = contactForm.querySelector('#userName')?.value.trim();
      const email = contactForm.querySelector('#userEmail')?.value.trim();
      const subject = contactForm.querySelector('#userSubject')?.value.trim() || 'Portfolio Inquiry';
      const message = contactForm.querySelector('#userMessage')?.value.trim();

      if (!name || !email || !message) {
        formStatus.className = 'form-status status-error';
        formStatus.innerHTML = '<span>Please fill in all required fields before submitting.</span>';
        formStatus.style.display = 'flex';
        return;
      }

      // Enter loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      formStatus.style.display = 'none';

      // Send to serverless form endpoint via fetch
      const formData = new FormData(contactForm);
      const accessKey = contactForm.querySelector('#formAccessKey')?.value;

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        formStatus.className = 'form-status status-error';
        formStatus.innerHTML = `<strong>Setup required:</strong> Please add your free Web3Forms access key from <a href="https://web3forms.com" target="_blank" rel="noopener" style="color:#a78bfa; text-decoration:underline;">web3forms.com</a> to <code>index.html</code> to receive emails at tk654001@gmail.com. You can also email me directly at <a href="mailto:tk654001@gmail.com" style="color:#a78bfa; text-decoration:underline;">tk654001@gmail.com</a>.`;
        formStatus.style.display = 'flex';
        return;
      }
      
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          formStatus.className = 'form-status status-success';
          formStatus.innerHTML = `<strong>Message sent successfully!</strong> Thank you ${name}, your note was delivered directly to Lampard at tk654001@gmail.com.`;
          contactForm.reset();
        } else {
          formStatus.className = 'form-status status-error';
          formStatus.innerHTML = `<strong>Notice:</strong> ${result.message || 'Unable to deliver message.'} Please reach out directly to <a href="mailto:tk654001@gmail.com" style="color:#a78bfa; text-decoration:underline;">tk654001@gmail.com</a>.`;
        }
      } catch (err) {
        formStatus.className = 'form-status status-error';
        formStatus.innerHTML = `<strong>Network error:</strong> Could not reach form service. Please email me directly at <a href="mailto:tk654001@gmail.com" style="color:#a78bfa; text-decoration:underline;">tk654001@gmail.com</a>.`;
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        formStatus.style.display = 'flex';
      }
    });
  }

  // 7. Dynamic Footer Year
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});
