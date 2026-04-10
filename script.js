/* ========================================
   SERVEDHOT PRODUCTIONS — Main Script
   ======================================== */

(function () {
  'use strict';

  // --- Splash Screen — Cinematic Intro ---
  var splash = document.getElementById('splash');
  var splashDismissed = false;

  function dismissSplash() {
    if (splashDismissed) return;
    splashDismissed = true;

    splash.classList.add('done');
    document.body.style.overflow = '';

    // Play + unmute hero video after splash ends
    var vid = document.querySelector('.hero__reel-video');
    if (vid) {
      vid.currentTime = 0;
      vid.play().then(function () {
        vid.muted = false;
      }).catch(function () {
        // Autoplay with sound blocked — play muted, unmute on first click
        vid.muted = true;
        vid.play();
        document.addEventListener('click', function unmute() {
          vid.muted = false;
          var iOff = document.querySelector('.hero__mute-icon--off');
          var iOn = document.querySelector('.hero__mute-icon--on');
          if (iOff) iOff.style.display = 'none';
          if (iOn) iOn.style.display = 'block';
          document.removeEventListener('click', unmute);
        }, { once: true });
      });
      var iconOff = document.querySelector('.hero__mute-icon--off');
      var iconOn = document.querySelector('.hero__mute-icon--on');
      if (iconOff) iconOff.style.display = 'none';
      if (iconOn) iconOn.style.display = 'block';
    }

    // Remove from DOM after wipe transition
    setTimeout(function () {
      splash.classList.add('done-remove');
      splash.remove();
    }, 1000);
  }

  if (splash) {
    document.body.style.overflow = 'hidden';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Tagline typing effect
    var taglineEl = document.getElementById('splashTagline');
    if (taglineEl && !reducedMotion) {
      var taglineText = 'PRODUCTIONS';
      var charIdx = 0;
      setTimeout(function () {
        var typeInterval = setInterval(function () {
          taglineEl.textContent += taglineText[charIdx];
          charIdx++;
          if (charIdx >= taglineText.length) clearInterval(typeInterval);
        }, 65);
      }, 1900);
    } else if (taglineEl) {
      taglineEl.textContent = 'PRODUCTIONS';
    }

    // Skip button
    var skipBtn = document.getElementById('splashSkip');
    if (skipBtn) {
      skipBtn.addEventListener('click', dismissSplash);
    }

    // Auto dismiss after full sequence
    var splashTotal = reducedMotion ? 800 : 4200;
    setTimeout(dismissSplash, splashTotal);
  }

  // --- DOM Cache ---
  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const filterBtns = document.querySelectorAll('.work__filter');
  const workCards = document.querySelectorAll('.work__card');
  const statNumbers = document.querySelectorAll('.about__stat-number');
  const processLineFill = document.querySelector('.process__line-fill');

  // --- Hero Video: mute/unmute button + auto-mute when out of view ---
  var heroVideo = document.querySelector('.hero__reel-video');
  var heroMuteBtn = document.getElementById('heroMuteBtn');
  var muteIconOff = heroMuteBtn ? heroMuteBtn.querySelector('.hero__mute-icon--off') : null;
  var muteIconOn = heroMuteBtn ? heroMuteBtn.querySelector('.hero__mute-icon--on') : null;
  var userWantsSound = true;

  function updateMuteIcons() {
    if (!muteIconOff || !muteIconOn) return;
    if (heroVideo.muted) {
      muteIconOff.style.display = 'block';
      muteIconOn.style.display = 'none';
    } else {
      muteIconOff.style.display = 'none';
      muteIconOn.style.display = 'block';
    }
  }

  if (heroMuteBtn && heroVideo) {
    heroMuteBtn.addEventListener('click', function () {
      heroVideo.muted = !heroVideo.muted;
      userWantsSound = !heroVideo.muted;
      updateMuteIcons();
    });
  }

  if (heroVideo && 'IntersectionObserver' in window) {
    var heroVideoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && userWantsSound) {
            heroVideo.muted = false;
          } else if (!entry.isIntersecting) {
            heroVideo.muted = true;
          }
          updateMuteIcons();
        });
      },
      { threshold: 0.5 }
    );
    heroVideoObserver.observe(heroVideo);
  }

  // --- Navigation: scroll styling + active link highlight ---
  let lastScroll = 0;
  const navLinkItems = document.querySelectorAll('.nav__link[href^="#"]');
  const sections = [];
  navLinkItems.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) sections.push({ el: sec, link: link });
  });

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 60);
    lastScroll = y;

    // Scroll spy — highlight active section
    var current = '';
    var offset = window.innerHeight * 0.35;
    for (var i = sections.length - 1; i >= 0; i--) {
      if (sections[i].el.getBoundingClientRect().top <= offset) {
        current = sections[i].el.id;
        break;
      }
    }
    navLinkItems.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  navBurger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.classList.toggle('active');
    navBurger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navBurger.classList.remove('active');
      navBurger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll Reveal (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Counter Animation ---
  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    });
  }

  // Observe stats section for counter trigger
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsSection = document.querySelector('.about__stats');
    if (statsSection) {
      const statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounters();
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      statsObserver.observe(statsSection);
    }
  }

  // --- Process timeline line animation ---
  if ('IntersectionObserver' in window && processLineFill) {
    const processObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            processLineFill.classList.add('animated');
            processObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    processObserver.observe(processLineFill.parentElement);
  }

  // --- Work Filter ---
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.style.opacity = '';
              card.style.transform = '';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Contact Form ---
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      let valid = true;
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      // Clear previous errors
      contactForm.querySelectorAll('.form__error').forEach(function (el) {
        el.remove();
      });
      contactForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      if (!name.value.trim()) {
        showFieldError(name, 'Please enter your name');
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email');
        valid = false;
      }

      if (!message.value.trim()) {
        showFieldError(message, 'Please tell us about your project');
        valid = false;
      }

      if (!valid) {
        // Focus first invalid field
        var firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate submission
      var submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';

      setTimeout(function () {
        // Show success
        contactForm.innerHTML = '<div class="form__success visible">' +
          '<div class="form__success-icon">' +
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '</div>' +
          '<h3 class="form__success-title">Message Sent!</h3>' +
          '<p class="form__success-text">Thanks for reaching out. We\'ll get back to you within 24 hours.</p>' +
          '</div>';
      }, 1500);
    });
  }

  function showFieldError(field, msg) {
    field.classList.add('error');
    var errorEl = document.createElement('div');
    errorEl.className = 'form__error visible';
    errorEl.textContent = msg;
    errorEl.setAttribute('role', 'alert');
    field.parentNode.appendChild(errorEl);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Back to Top ---
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ==============================================
  // VISUAL ENHANCEMENTS (desktop only, motion ok)
  // ==============================================
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!prefersReducedMotion && !isTouch) {

    // --- Magnetic Buttons ---
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.25) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });

    // --- Tilt Effect on Cards ---
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) scale(1.02)';

        // Move glow ::after to cursor position
        card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });

    // --- Brands Wall: 3D perspective on mouse move ---
    var brandsWall = document.getElementById('brandsWall');
    if (brandsWall) {
      brandsWall.addEventListener('mousemove', function (e) {
        var rect = brandsWall.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        brandsWall.style.transform = 'rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 4) + 'deg)';
      });
      brandsWall.addEventListener('mouseleave', function () {
        brandsWall.style.transform = '';
      });
    }

    // Position glow via CSS custom props
    var glowStyle = document.createElement('style');
    glowStyle.textContent = '.services__card::after { left: var(--glow-x, 50%); top: var(--glow-y, 50%); }';
    document.head.appendChild(glowStyle);

    // --- Parallax on Scroll ---
    var parallaxImages = document.querySelectorAll('.about__image-frame img, .hero__reel-main img');
    var heroTitle = document.querySelector('.hero__title');

    function updateParallax() {
      var scrollY = window.scrollY;
      var winH = window.innerHeight;

      parallaxImages.forEach(function (img) {
        var rect = img.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < winH) {
          var offset = (rect.top - winH / 2) * 0.08;
          img.style.transform = 'translateY(' + offset + 'px) scale(1.08)';
        }
      });

      // Hero title parallax
      if (heroTitle && scrollY < winH) {
        heroTitle.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
        heroTitle.style.opacity = 1 - (scrollY / winH) * 1.2;
      }
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();

    // --- Floating Particles ---
    var canvas = document.getElementById('particles');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      var particles = [];
      var particleCount = 40;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
      }

      for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 60, 40, ' + p.alpha + ')';
          ctx.fill();

          // Draw lines between nearby particles
          for (var j = i + 1; j < particles.length; j++) {
            var p2 = particles[j];
            var dx = p.x - p2.x;
            var dy = p.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = 'rgba(255, 60, 40, ' + (0.06 * (1 - dist / 120)) + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(drawParticles);
      }
      drawParticles();
    }

  } // end if !reducedMotion && !isTouch

})();
