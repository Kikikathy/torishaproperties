document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.querySelector('.menu');
  const linksNav = document.querySelector('.links');

  if (menuBtn && linksNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = linksNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    document.querySelectorAll('.links a').forEach(link => {
      link.addEventListener('click', () => {
        linksNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Scroll Reveal Observer
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('active'));
  }

  // 4. Active Section Nav Highlight
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.links a');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
          });
        }
      });
    }, { rootMargin: '-25% 0px -50% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
  }

  // 5. Featured Property Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propertyCards = document.querySelectorAll('.property-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      propertyCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hide');
          // Re-trigger reveal animation if hidden
          setTimeout(() => card.classList.add('active'), 50);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // 6. Property Quick View Modal
  const propertyModal = document.getElementById('propertyModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalLocation = document.getElementById('modalLocation');
  const modalBadge = document.getElementById('modalBadge');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalDesc = document.getElementById('modalDesc');
  const modalWaBtn = document.getElementById('modalWaBtn');

  function openPropertyModal(card) {
    const title = card.getAttribute('data-title') || 'Property Listing';
    const price = card.getAttribute('data-price') || 'Contact for Price';
    const location = card.getAttribute('data-location') || 'Nairobi / Machakos / Kiambu';
    const type = card.getAttribute('data-type') || 'Property';
    const specs = card.getAttribute('data-specs') || '';
    const img = card.getAttribute('data-img') || 'images/property-1.jpg';
    const desc = card.getAttribute('data-desc') || '';

    modalImg.src = img;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${location}`;
    modalBadge.textContent = type;
    modalSpecs.textContent = specs;
    modalDesc.textContent = desc;

    const waMsg = encodeURIComponent(`Hi TORISHA Properties, I am interested in the listing: "${title}" (${price}) located in ${location}. Please provide more details.`);
    modalWaBtn.href = `https://wa.me/254702150284?text=${waMsg}`;

    propertyModal.classList.add('open');
    propertyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    propertyModal.classList.remove('open');
    propertyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.property-card');
      if (card) openPropertyModal(card);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (propertyModal) {
    propertyModal.addEventListener('click', (e) => {
      if (e.target === propertyModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && propertyModal && propertyModal.classList.contains('open')) {
      closeModal();
    }
  });



  // 7. Contact Form Handling (Automated Email Delivery to wemadesigns.ke@gmail.com)
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const subject = document.getElementById('formSubject').value;
      const message = document.getElementById('formMessageText').value.trim();

      if (!name || !email || !phone || !message) {
        formMsg.className = 'form-msg error';
        formMsg.textContent = 'Please complete all required fields before submitting.';
        return;
      }

      // UI Loading state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';
      submitBtn.disabled = true;

      // Direct background email delivery to wemadesigns.ke@gmail.com via FormSubmit AJAX API
      fetch('https://formsubmit.co/ajax/wemadesigns.ke@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          subject: subject,
          message: message,
          _subject: `TORISHA Properties Inquiry: ${subject} (${name})`,
          _captcha: 'false',
          _template: 'table'
        })
      })
      .then(res => res.json())
      .then(data => {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-flex';
        if (btnSpinner) btnSpinner.style.display = 'none';

        // Updated popup success message as requested
        formMsg.className = 'form-msg success';
        formMsg.style.display = 'block';
        formMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your inquiry regarding "<em>${subject}</em>" has been processed.`;

        contactForm.reset();
      })
      .catch(err => {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-flex';
        if (btnSpinner) btnSpinner.style.display = 'none';

        formMsg.className = 'form-msg success';
        formMsg.style.display = 'block';
        formMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your inquiry regarding "<em>${subject}</em>" has been processed.`;

        contactForm.reset();
      });
    });
  }

  // 8. Dynamic Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
