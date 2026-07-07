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
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.15 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.8;
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
        ctx.strokeStyle = 'rgba(59, 130, 246, ' + (0.8 * (1 - distm / 150)) + ')'; // Clearer blue connection to mouse
        ctx.lineWidth = 1.2;
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

  function renderExperiences(experiences, page = 1) {
    container.innerHTML = '';
    if (experiences.length === 0) {
      container.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 3rem;">Belum ada experience yang ditambahkan.</p>';
      return;
    }

    var isExperiencesPage = document.body.getAttribute('data-page') === 'experiences';
    var itemsPerPage = 10;
    var maxItems = isExperiencesPage ? itemsPerPage : 3;
    var startIndex = isExperiencesPage ? (page - 1) * itemsPerPage : 0;
    var endIndex = isExperiencesPage ? startIndex + itemsPerPage : maxItems;
    var displayedExperiences = experiences.slice(startIndex, endIndex);

    displayedExperiences.forEach(function (exp, index) {
      var card = document.createElement('div');
      card.className = 'glass exp-card reveal';
      card.style.transitionDelay = (index * 0.15) + 's';
      card.style.cursor = 'none';
      var coverImage = exp.images && exp.images.length > 0 ? exp.images[0] : '';
      
      var dateHtml = exp.activity_date ? '<div class="exp-date">' + exp.activity_date + '</div>' : '';
      var categoriesHtml = '';
      if (exp.categories && exp.categories.length > 0) {
        categoriesHtml = '<div class="exp-categories" style="margin-top: 0.5rem;">';
        exp.categories.forEach(function(cat) {
          categoriesHtml += '<span class="exp-category-badge">' + cat + '</span>';
        });
        categoriesHtml += '</div>';
      }
      
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
                categoriesHtml +
              '</div>' +
              dateHtml +
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
          
          var mDate = document.getElementById('modalDate');
          if(mDate) {
            mDate.textContent = exp.activity_date || '';
            mDate.style.display = exp.activity_date ? 'inline-block' : 'none';
          }
          
          var mCats = document.getElementById('modalCategories');
          if(mCats) {
            if (exp.categories && exp.categories.length > 0) {
              mCats.innerHTML = exp.categories.map(function(c) { return '<span class="exp-category-badge">' + c + '</span>'; }).join('');
              mCats.style.display = 'flex';
            } else {
              mCats.innerHTML = '';
              mCats.style.display = 'none';
            }
          }
          
          document.getElementById('modalCompany').textContent = exp.company;
          document.getElementById('modalLocation').textContent = exp.location;
          document.getElementById('modalDesc').textContent = exp.description;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });

      container.appendChild(card);
    });

    if (!isExperiencesPage && experiences.length > 3) {
      var showMoreDiv = document.createElement('div');
      showMoreDiv.style.textAlign = 'center';
      showMoreDiv.style.marginTop = '2.5rem';
      showMoreDiv.className = 'reveal';
      showMoreDiv.innerHTML = '<a href="experiences.html" class="btn" style="padding: 0.75rem 2rem;">Show More ..</a>';
      container.appendChild(showMoreDiv);
    } else if (isExperiencesPage) {
      var totalPages = Math.ceil(experiences.length / itemsPerPage);
      if (totalPages > 1) {
        var paginationDiv = document.createElement('div');
        paginationDiv.style.display = 'flex';
        paginationDiv.style.justifyContent = 'center';
        paginationDiv.style.gap = '0.5rem';
        paginationDiv.style.marginTop = '3rem';
        
        for (var p = 1; p <= totalPages; p++) {
          var btn = document.createElement('button');
          btn.textContent = p;
          btn.className = 'btn';
          btn.style.padding = '0.5rem 1rem';
          if (p === page) {
            btn.style.background = 'var(--accent-purple)';
            btn.style.borderColor = 'var(--accent-purple)';
          } else {
            btn.style.background = 'transparent';
          }
          
          btn.onclick = (function(pageNum) {
            return function() {
              if (document.getElementById('filterSort')) {
                applyFilters(pageNum);
              } else {
                renderExperiences(experiences, pageNum);
              }
              // scroll up a bit to show from the top of the list
              const section = document.getElementById('experience');
              if (section) {
                const yOffset = -80; // offset for navbar
                const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
              }
            };
          })(p);
          
          paginationDiv.appendChild(btn);
        }
        container.appendChild(paginationDiv);
      }
    }

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

  function updateHeroGrid(experiences) {
    var grid = document.getElementById('expGrid');
    if (!grid) return;
    
    // Take up to 4 experiences
    var topExps = experiences.slice(0, 4);
    
    // Default placeholders if less than 4
    var placeholders = [
      { title: 'Project 01', img: 'assets/img/exp-1.png' },
      { title: 'Project 02', img: 'assets/img/exp-2.png' },
      { title: 'Project 03', img: 'assets/img/exp-3.png' },
      { title: 'Project 04', img: 'assets/img/exp-1.png' }
    ];
    
    var html = '';
    for (var i = 0; i < 4; i++) {
      var exp = topExps[i];
      var title = exp ? exp.title : placeholders[i].title;
      var img = (exp && exp.images && exp.images.length > 0) ? exp.images[0] : placeholders[i].img;
      
      html += '<div class="exp-grid-item" data-index="' + i + '">' +
                '<img src="' + img + '" alt="' + title + '" loading="lazy">' +
                '<div class="exp-grid-overlay">' +
                  '<span>' + title + '</span>' +
                '</div>' +
              '</div>';
    }
    grid.innerHTML = html;
  }

  // Filtering State
  var allExperiencesData = [];

  function initFilters() {
    var sortSelect = document.getElementById('filterSort');
    var catSelect = document.getElementById('filterCat');
    var yearSelect = document.getElementById('filterYear');
    var monthSelect = document.getElementById('filterMonth');
    
    if (!sortSelect || !catSelect || !yearSelect || !monthSelect) return;
    
    // Extract unique categories and years
    var uniqueCats = new Set();
    var uniqueYears = new Set();
    
    allExperiencesData.forEach(function(exp) {
      if (exp.categories && exp.categories.length > 0) {
        exp.categories.forEach(function(c) { uniqueCats.add(c); });
      }
      if (exp.activity_date) {
        var year = exp.activity_date.split('-')[0];
        if (year) uniqueYears.add(year);
      }
    });
    
    // Populate Categories
    var catHtml = '<option value="all">All Categories</option>';
    Array.from(uniqueCats).sort().forEach(function(c) {
      catHtml += '<option value="' + c + '">' + c + '</option>';
    });
    catSelect.innerHTML = catHtml;
    
    // Populate Years
    var yearHtml = '<option value="all">All Years</option>';
    Array.from(uniqueYears).sort(function(a,b){return b-a}).forEach(function(y) {
      yearHtml += '<option value="' + y + '">' + y + '</option>';
    });
    yearSelect.innerHTML = yearHtml;
    
    // Attach Event Listeners
    sortSelect.addEventListener('change', function() { applyFilters(1); });
    catSelect.addEventListener('change', function() { applyFilters(1); });
    yearSelect.addEventListener('change', function() { applyFilters(1); });
    monthSelect.addEventListener('change', function() { applyFilters(1); });
  }

  function applyFilters(page) {
    page = page || 1;
    var sortVal = document.getElementById('filterSort') ? document.getElementById('filterSort').value : 'newest';
    var catVal = document.getElementById('filterCat') ? document.getElementById('filterCat').value : 'all';
    var yearVal = document.getElementById('filterYear') ? document.getElementById('filterYear').value : 'all';
    var monthVal = document.getElementById('filterMonth') ? document.getElementById('filterMonth').value : 'all';
    
    var filtered = allExperiencesData.filter(function(exp) {
      // Category Match
      var matchCat = true;
      if (catVal !== 'all') {
        matchCat = exp.categories && exp.categories.includes(catVal);
      }
      
      // Date Match
      var matchDate = true;
      var expYear = null;
      var expMonth = null;
      if (exp.activity_date) {
        var parts = exp.activity_date.split('-');
        expYear = parts[0];
        expMonth = parts[1];
      }
      
      if (yearVal !== 'all' && expYear !== yearVal) matchDate = false;
      if (monthVal !== 'all' && expMonth !== monthVal) matchDate = false;
      
      return matchCat && matchDate;
    });
    
    // Sort
    filtered.sort(function(a, b) {
      var dateA = new Date(a.activity_date || a.created_at || 0).getTime();
      var dateB = new Date(b.activity_date || b.created_at || 0).getTime();
      return sortVal === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    renderExperiences(filtered, page);
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
          allExperiencesData = data;
          initFilters();
          applyFilters(1);
          updateHeroGrid(data);
        } else {
          allExperiencesData = dummyExperiences;
          initFilters();
          applyFilters(1);
          updateHeroGrid(dummyExperiences);
        }
      } catch (e) {
        console.warn('Supabase error, using fallback data:', e);
        allExperiencesData = dummyExperiences;
        initFilters();
        applyFilters(1);
        updateHeroGrid(dummyExperiences);
      }
    } else {
      allExperiencesData = dummyExperiences;
      initFilters();
      applyFilters(1);
      updateHeroGrid(dummyExperiences);
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


// ─── PROFILE PHOTO INTERACTION ─────────────────
(function initProfilePhoto() {
  var frame = document.getElementById('profileFrame');
  var dotsContainer = document.getElementById('profileDots');
  if (!frame || !dotsContainer) return;

  var images = frame.querySelectorAll('.profile-img');
  var dots = dotsContainer.querySelectorAll('.profile-dot');
  var currentIndex = 0;

  function showPhoto(index) {
    images.forEach(function (img) { img.classList.remove('active'); });
    dots.forEach(function (dot) { dot.classList.remove('active'); });
    images[index].classList.add('active');
    dots[index].classList.add('active');
  }

  // Hover: preview next photo temporarily
  frame.addEventListener('mouseenter', function () {
    var nextIndex = (currentIndex + 1) % images.length;
    showPhoto(nextIndex);
  });

  // Leave: revert to permanent photo
  frame.addEventListener('mouseleave', function () {
    showPhoto(currentIndex);
  });

  // Click: permanently advance to next photo
  frame.addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % images.length;
    showPhoto(currentIndex);

    // Visual feedback
    frame.style.transform = 'scale(1.08)';
    frame.style.filter = 'brightness(1.2)';
    setTimeout(function () {
      frame.style.transform = '';
      frame.style.filter = '';
    }, 400);
  });

  // Click on dots: set photo permanently
  dots.forEach(function (dot) {
    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      currentIndex = parseInt(this.getAttribute('data-index'));
      showPhoto(currentIndex);
    });
  });
})();

