/* ================================================
   script.js — Custom Cursor, Particles, Scroll Reveal
   Pure Vanilla JS, zero dependencies
   ================================================ */

// ─── URL CLEANUP (Hides .html locally) ────────────────
(function cleanUrl() {
  var path = window.location.pathname;
  if (path.endsWith('.html')) {
    var newPath = path.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    if (newPath === '') newPath = '/';
    window.history.replaceState(null, '', newPath + window.location.search + window.location.hash);
  }
})();

// ─── CUSTOM CURSOR ─────────────────────────────
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let visible = false;

  // Track mouse position
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
  });

  // Hide cursor when mouse leaves viewport
  document.addEventListener('mouseleave', function () {
    visible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  // Hover detection on interactive elements
  document.addEventListener('mouseover', function (e) {
    var target = e.target;
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('a') ||
      target.closest('button')
    ) {
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    var target = e.target;
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('a') ||
      target.closest('button')
    ) {
      ring.classList.remove('hovering');
    }
  });

  // Animation loop using requestAnimationFrame
  function animate() {
    // Dot follows mouse instantly
    dot.style.left = mouseX - 4 + 'px';
    dot.style.top = mouseY - 4 + 'px';

    // Ring follows with smooth easing
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX - 18 + 'px';
    ring.style.top = ringY - 18 + 'px';

    requestAnimationFrame(animate);
  }

  // Start invisible until first mouse move
  dot.style.opacity = '0';
  ring.style.opacity = '0';
  animate();
})();


// ─── FLOATING PARTICLES ────────────────────────
(function initParticles() {
  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var particles = [];
  var count = Math.min(80, Math.floor(window.innerWidth / 15));

  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  var mouseParticle = { x: -9999, y: -9999 };

  document.addEventListener('mousemove', function (e) {
    mouseParticle.x = e.clientX;
    mouseParticle.y = e.clientY;
  });

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (p.alpha * 0.5) + ')';
      ctx.fill();

      // Draw lines to nearby particles
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.05 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw line to mouse if close
      var dxm = p.x - mouseParticle.x;
      var dym = p.y - mouseParticle.y;
      var distm = Math.sqrt(dxm * dxm + dym * dym);
      if (distm < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseParticle.x, mouseParticle.y);
        ctx.strokeStyle = 'rgba(59, 130, 246, ' + (0.2 * (1 - distm / 150)) + ')'; // Subtle blue on hover
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
})();


// ─── SCROLL REVEAL ─────────────────────────────
(function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  function checkReveal() {
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      var top = el.getBoundingClientRect().top;
      var trigger = window.innerHeight * 0.85;

      if (top < trigger) {
        el.classList.add('visible');
      }
    }
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Run once on load
})();


// ─── NAVBAR SCROLL EFFECT ──────────────────────
(function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();


// ─── EXPERIENCE DATA LOADER (Supabase + Fallback) ────
(function initExperiences() {
  var container = document.getElementById('experience-container');
  if (!container) return;

  // Fallback dummy data (used when Supabase is not configured)
  var dummyExperiences = [
    {
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'Jakarta, Indonesia',
      description: 'Led the development of a complex interactive web application serving 50k+ users. Focused on performance optimization and creating fluid animations.',
      images: ['assets/img/exp-1.png', 'assets/img/exp-2.png']
    },
    {
      title: 'Web Designer & Developer',
      company: 'Creative Agency',
      location: 'Surabaya, Indonesia',
      description: 'Designed and built responsive websites for high-profile clients. Created design systems and component libraries from scratch.',
      images: ['assets/img/exp-2.png', 'assets/img/exp-3.png']
    },
    {
      title: 'Junior Developer',
      company: 'StartupX',
      location: 'Bandung, Indonesia',
      description: 'Built landing pages and web tools using HTML, CSS, and JavaScript. Learned modern development practices and agile workflows.',
      images: ['assets/img/exp-3.png', 'assets/img/exp-1.png']
    }
  ];

  function renderExperiences(experiences) {
    container.innerHTML = '';
    if (experiences.length === 0) {
      container.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 3rem;">Belum ada experience yang ditambahkan.</p>';
      return;
    }

    experiences.forEach(function (exp, index) {
      var card = document.createElement('div');
      card.className = 'glass exp-card reveal';
      card.style.transitionDelay = (index * 0.15) + 's';
      card.style.cursor = 'none';
      var coverImage = exp.images && exp.images.length > 0 ? exp.images[0] : '';
      
      card.innerHTML =
        '<div class="exp-card-inner">' +
          '<div class="exp-image">' +
            (coverImage ? '<img src="' + coverImage + '" alt="' + exp.title + '" loading="lazy">' : '<div style="width:100%;height:100%;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);font-size:0.9rem;">No Image</div>') +
          '</div>' +
          '<div class="exp-body">' +
            '<div class="exp-header">' +
              '<div>' +
                '<h3 class="exp-title">' + exp.title + '</h3>' +
                '<h4 class="exp-company">' + exp.company + '</h4>' +
              '</div>' +
            '</div>' +
            '<div class="exp-location">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>' +
              '<span>' + exp.location + '</span>' +
            '</div>' +
            '<p class="exp-desc">' + exp.description + '</p>' +
          '</div>' +
        '</div>';
      
      // Add Click Listener for Modal
      card.addEventListener('click', function() {
        var modal = document.getElementById('expModal');
        if (modal) {
          var gallery = document.getElementById('modalGallery');
          gallery.innerHTML = '';
          if (exp.images && exp.images.length > 0) {
            exp.images.forEach(function(imgSrc) {
              var img = document.createElement('img');
              img.src = imgSrc;
              gallery.appendChild(img);
            });
          }
          
          document.getElementById('modalTitle').textContent = exp.title;
          document.getElementById('modalCompany').textContent = exp.company;
          document.getElementById('modalLocation').textContent = exp.location;
          document.getElementById('modalDesc').textContent = exp.description;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });

      container.appendChild(card);
    });

    // Re-run scroll reveal for newly created elements
    var newReveals = container.querySelectorAll('.reveal');
    function checkNew() {
      for (var i = 0; i < newReveals.length; i++) {
        var el = newReveals[i];
        var top = el.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.85) {
          el.classList.add('visible');
        }
      }
    }
    window.addEventListener('scroll', checkNew);
    setTimeout(checkNew, 100);
  }

  // Try loading from Supabase, fallback to dummy
  async function loadExperiences() {
    if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
      try {
        var sb = getSupabase();
        var { data, error } = await sb
          .from('experiences')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          renderExperiences(data);
        } else {
          renderExperiences(dummyExperiences);
        }
      } catch (e) {
        console.warn('Supabase error, using fallback data:', e);
        renderExperiences(dummyExperiences);
      }
    } else {
      renderExperiences(dummyExperiences);
    }
  }

  loadExperiences();

  // Modal Close Logic
  var modal = document.getElementById('expModal');
  var closeBtn = document.getElementById('modalClose');
  if (modal && closeBtn) {
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }
})();

