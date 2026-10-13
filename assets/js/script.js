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
function initCursor() {
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
}

initCursor();
document.addEventListener('componentsLoaded', initCursor);


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
function initScrollReveal() {
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

  if (window._checkReveal) window.removeEventListener('scroll', window._checkReveal);
  window._checkReveal = checkReveal;
  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Run once on load
}

initScrollReveal();
document.addEventListener('componentsLoaded', initScrollReveal);


// ─── NAVBAR SCROLL & ACTIVE LINK EFFECT ────────
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  if (window._navScroll) window.removeEventListener('scroll', window._navScroll);
  window._navScroll = function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', window._navScroll);

  // Set active link indicator based on current page
  var currentPath = window.location.pathname.toLowerCase();
  var navLinks = navbar.querySelectorAll('.nav-links a');
  navLinks.forEach(function (link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    link.classList.remove('active');
    if (
      (href.includes('projects') && currentPath.includes('projects')) ||
      (href.includes('certificates') && currentPath.includes('certificates')) ||
      (href.includes('experiences') && currentPath.includes('experiences')) ||
      ((currentPath === '/' || currentPath === '' || currentPath.endsWith('index.html')) && (href === 'index.html#about' || href === 'index.html'))
    ) {
      link.classList.add('active');
    }
  });
}

initNavbar();
document.addEventListener('componentsLoaded', initNavbar);


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
      { title: 'Academic Portal', img: 'assets/img/proj-academic.jpg' },
      { title: 'FinTech Analytics', img: 'assets/img/proj-fintech.jpg' },
      { title: 'Creative Studio', img: 'assets/img/proj-creative.jpg' },
      { title: 'AgriFlow IoT', img: 'assets/img/proj-iot.jpg' }
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
  function initModal() {
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
  }

  // Call on load and on component load
  initModal();
  document.addEventListener('componentsLoaded', initModal);
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

// ─── PROJECTS & CERTIFICATES SYSTEM ─────────────────────────
(function initProjectsAndCertificates() {
  // ── 1. Projects Data ──
  var projectsData = [
    {
      id: 'academic',
      title: 'UTM Smart Academic Portal',
      subtitle: 'Portal Akademik Mahasiswa',
      category: 'webapp fullstack',
      categoryBadge: 'Web App',
      image: 'assets/img/proj-academic.jpg',
      desc: 'Platform jadwal perkuliahan, kalkulator IPK, dan monitoring progres studi mahasiswa UTM.',
      tags: ['React.js', 'Node.js', 'Supabase', 'Tailwind CSS'],
      features: [
        'Jadwal perkuliahan & status ruangan realtime',
        'Kalkulator IPK dan tracking SKS semester',
        'Tampilan responsif dengan dark/light mode'
      ],
      demoUrl: 'https://github.com/azes24',
      codeUrl: 'https://github.com/azes24'
    },
    {
      id: 'fintech',
      title: 'NovaPay Financial Dashboard',
      subtitle: 'Personal Finance Tracker',
      category: 'webapp fullstack',
      categoryBadge: 'FinTech',
      image: 'assets/img/proj-fintech.jpg',
      desc: 'Dashboard pelacakan arus kas, portofolio aset, dan visualisasi pengeluaran.',
      tags: ['Next.js', 'TypeScript', 'Chart.js', 'REST API'],
      features: [
        'Grafik pendapatan & pengeluaran dinamis',
        'Pemantauan saldo multi-aset kripto & tabungan',
        'Kategori anggaran belanja interaktif'
      ],
      demoUrl: 'https://github.com/azes24',
      codeUrl: 'https://github.com/azes24'
    },
    {
      id: 'creative',
      title: 'Azes Creative Studio',
      subtitle: 'Video & Motion Showcase',
      category: 'creative',
      categoryBadge: 'Creative',
      image: 'assets/img/proj-creative.jpg',
      desc: 'Showcase portofolio video editing, motion design, dan pratinjau grading warna.',
      tags: ['HTML5 Video', 'CSS3 Motion', 'Premiere Pro', 'After Effects'],
      features: [
        'Pratinjau timeline video interaktif',
        'Visualisasi RGB waveform monitor & histogram',
        'Galeri showreel dengan kontrol custom'
      ],
      demoUrl: 'https://instagram.com/azesfx_',
      codeUrl: 'https://github.com/azes24'
    },
    {
      id: 'iot',
      title: 'AgriFlow Smart Environmental',
      subtitle: 'IoT Environmental Dashboard',
      category: 'iot fullstack',
      categoryBadge: 'IoT System',
      image: 'assets/img/proj-iot.jpg',
      desc: 'Monitoring telemetri sensor suhu, kelembaban, dan level air lahan pertanian.',
      tags: ['IoT Architecture', 'MQTT', 'JavaScript', 'Leaflet Maps'],
      features: [
        'Pemetaan node sensor geospasial real-time',
        'Grafik telemetri suhu dan kelembaban',
        'Indikator status dan uptime perangkat'
      ],
      demoUrl: 'https://github.com/azes24',
      codeUrl: 'https://github.com/azes24'
    }
  ];

  // ── 2. Certificates Data ──
  var certificatesData = [
    {
      id: 'cert-fe',
      title: 'Front-End Web Development Expert',
      issuer: 'Global Technology Institute',
      category: 'web',
      categoryBadge: 'Web Dev',
      date: 'Oktober 2023',
      certId: 'GTI-FWDE-8912',
      recipient: 'Fathul Aziz Saifuddin',
      image: 'assets/img/cert-frontend.jpg',
      desc: 'Pengembangan web modern, arsitektur komponen React, dan optimasi performa web.',
      skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Responsive UI']
    },
    {
      id: 'cert-cloud',
      title: 'Cloud Computing & DevOps Architecture',
      issuer: 'Global Tech Academy',
      category: 'cloud',
      categoryBadge: 'Cloud',
      date: 'Oktober 2024',
      certId: 'GTA-CLD-9402',
      recipient: 'Fathul Aziz Saifuddin',
      image: 'assets/img/cert-cloud.jpg',
      desc: 'Perancangan arsitektur cloud, deployment container Docker, dan otomatisasi CI/CD.',
      skills: ['Cloud Systems', 'CI/CD', 'Docker', 'Microservices']
    },
    {
      id: 'cert-security',
      title: 'Network Security & Ethical Hacking',
      issuer: 'Cybersecurity Defense Institute',
      category: 'security',
      categoryBadge: 'Security',
      date: 'Oktober 2024',
      certId: 'CSEC-FAZ-8192',
      recipient: 'Fathul Aziz Saifuddin',
      image: 'assets/img/cert-security.jpg',
      desc: 'Keamanan jaringan, identifikasi kerentanan protokol, dan pertahanan siber.',
      skills: ['Network Security', 'Pentesting', 'OWASP', 'Vulnerability']
    },
    {
      id: 'cert-uiux',
      title: 'UI/UX & Digital Product Design',
      issuer: 'Accredited Design Guild',
      category: 'design',
      categoryBadge: 'UI/UX',
      date: 'September 2023',
      certId: 'MPD-FAZ-001',
      recipient: 'Fathul Aziz Saifuddin',
      image: 'assets/img/cert-uiux.jpg',
      desc: 'Riset pengalaman pengguna, pembuatan design system, dan prototyping Figma.',
      skills: ['UI/UX Design', 'Figma Prototyping', 'Design Systems', 'User Research']
    }
  ];

  // ── 3. Render Projects ──
  function renderProjects(filter) {
    filter = filter || 'all';
    var container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';

    var filtered = projectsData.filter(function (p) {
      if (filter === 'all') return true;
      return p.category.indexOf(filter) !== -1;
    });

    var isHome = document.body.getAttribute('data-page') === 'home' || !!document.getElementById('profileCard');
    if (isHome) {
      filtered = filtered.slice(0, 3);
    }

    if (filtered.length === 0) {
      container.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 3rem; grid-column: 1 / -1;">Tidak ada project dalam kategori ini.</p>';
      return;
    }

    filtered.forEach(function (proj, idx) {
      var card = document.createElement('div');
      card.className = 'glass project-card reveal';
      card.style.transitionDelay = (idx * 0.12) + 's';

      var tagsHtml = proj.tags.map(function (t) {
        return '<span class="project-tag">' + t + '</span>';
      }).join('');

      card.innerHTML =
        '<div class="project-thumb-wrap" data-id="' + proj.id + '">' +
          '<img src="' + proj.image + '" alt="' + proj.title + '" loading="lazy">' +
        '</div>' +
        '<div class="project-content">' +
          '<h3 class="project-title">' + proj.title + '</h3>' +
          '<h4 class="project-subtitle">' + proj.subtitle + '</h4>' +
          '<p class="project-desc">' + proj.desc + '</p>' +
          '<div class="project-tags">' + tagsHtml + '</div>' +
          '<div class="project-actions">' +
            '<button type="button" class="btn btn-primary-glow detail-btn" data-id="' + proj.id + '">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
              'Detail Project' +
            '</button>' +
            '<a href="' + proj.codeUrl + '" target="_blank" rel="noopener noreferrer" class="btn" title="View Source Code">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>' +
              'Repository' +
            '</a>' +
          '</div>' +
        '</div>';

      // Open Modal on click thumbnail or detail button
      var openModalAction = function () {
        openProjectModal(proj);
      };

      var thumbWrap = card.querySelector('.project-thumb-wrap');
      if (thumbWrap) thumbWrap.addEventListener('click', openModalAction);

      var detailBtn = card.querySelector('.detail-btn');
      if (detailBtn) detailBtn.addEventListener('click', openModalAction);

      container.appendChild(card);
    });

    // Refresh scroll reveal
    if (typeof initScrollReveal === 'function') initScrollReveal();
  }

  function openProjectModal(proj) {
    var modal = document.getElementById('projectModal');
    if (!modal) return;

    var modalImg = document.getElementById('projectModalImg');
    if (modalImg) {
      modalImg.src = proj.image;
      modalImg.alt = proj.title;
    }

    var catEl = document.getElementById('projectModalCategory');
    if (catEl) catEl.textContent = proj.categoryBadge;

    var titleEl = document.getElementById('projectModalTitle');
    if (titleEl) titleEl.textContent = proj.title;

    var subEl = document.getElementById('projectModalSubtitle');
    if (subEl) subEl.textContent = proj.subtitle;

    var tagsEl = document.getElementById('projectModalTags');
    if (tagsEl) {
      tagsEl.innerHTML = proj.tags.map(function (t) {
        return '<span class="project-tag">' + t + '</span>';
      }).join('');
    }

    var descEl = document.getElementById('projectModalDesc');
    if (descEl) descEl.textContent = proj.desc;

    var featsEl = document.getElementById('projectModalFeaturesList');
    if (featsEl) {
      featsEl.innerHTML = proj.features.map(function (f) {
        return '<li>' + f + '</li>';
      }).join('');
    }

    var liveLink = document.getElementById('projectModalLiveLink');
    if (liveLink) liveLink.href = proj.demoUrl;

    var codeLink = document.getElementById('projectModalCodeLink');
    if (codeLink) codeLink.href = proj.codeUrl;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── 4. Render Certificates ──
  function renderCertificates(filter) {
    filter = filter || 'all';
    var container = document.getElementById('certificates-container');
    if (!container) return;

    container.innerHTML = '';

    var filtered = certificatesData.filter(function (c) {
      if (filter === 'all') return true;
      return c.category === filter;
    });

    var isHome = document.body.getAttribute('data-page') === 'home' || !!document.getElementById('profileCard');
    if (isHome) {
      filtered = filtered.slice(0, 3);
    }

    if (filtered.length === 0) {
      container.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 3rem; grid-column: 1 / -1;">Tidak ada sertifikat dalam kategori ini.</p>';
      return;
    }

    filtered.forEach(function (cert, idx) {
      var card = document.createElement('div');
      card.className = 'glass cert-card reveal';
      card.style.transitionDelay = (idx * 0.12) + 's';

      var skillsHtml = cert.skills.slice(0, 4).map(function (s) {
        return '<span class="cert-skill-badge">' + s + '</span>';
      }).join('');

      card.innerHTML =
        '<div class="cert-thumb-wrap" data-id="' + cert.id + '">' +
          '<img src="' + cert.image + '" alt="' + cert.title + '" loading="lazy">' +
          '<div class="cert-thumb-overlay">' +
            '<span>' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>' +
              'Perbesar Sertifikat' +
            '</span>' +
          '</div>' +
        '</div>' +
        '<div class="cert-content">' +
          '<div class="cert-issuer-row">' +
            '<span class="cert-issuer">' + cert.issuer + '</span>' +
            '<span class="cert-id">' + cert.certId + '</span>' +
          '</div>' +
          '<h3 class="cert-title">' + cert.title + '</h3>' +
          '<div class="cert-date">' + cert.date + '</div>' +
          '<p class="cert-desc">' + cert.desc + '</p>' +
          '<div class="cert-skills-wrap">' + skillsHtml + '</div>' +
          '<div class="cert-actions">' +
            '<button type="button" class="btn btn-primary-glow cert-view-btn" data-id="' + cert.id + '" style="width:100%;">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' +
              'Lihat Sertifikat' +
            '</button>' +
          '</div>' +
        '</div>';

      var openModalAction = function () {
        openCertModal(cert);
      };

      var thumb = card.querySelector('.cert-thumb-wrap');
      if (thumb) thumb.addEventListener('click', openModalAction);

      var btn = card.querySelector('.cert-view-btn');
      if (btn) btn.addEventListener('click', openModalAction);

      container.appendChild(card);
    });

    if (typeof initScrollReveal === 'function') initScrollReveal();
  }

  function openCertModal(cert) {
    var modal = document.getElementById('certModal');
    if (!modal) return;

    var modalImg = document.getElementById('certModalImg');
    if (modalImg) {
      modalImg.src = cert.image;
      modalImg.alt = cert.title;
    }

    var imgDirect = document.getElementById('certModalImgDirect');
    if (imgDirect) imgDirect.href = cert.image;

    var idEl = document.getElementById('certModalId');
    if (idEl) idEl.textContent = 'ID: ' + cert.certId;

    var titleEl = document.getElementById('certModalTitle');
    if (titleEl) titleEl.textContent = cert.title;

    var issuerEl = document.getElementById('certModalIssuer');
    if (issuerEl) issuerEl.textContent = cert.issuer;

    var dateEl = document.getElementById('certModalDate');
    if (dateEl) dateEl.textContent = cert.date;

    var descEl = document.getElementById('certModalDesc');
    if (descEl) descEl.textContent = cert.desc;

    var skillsEl = document.getElementById('certModalSkills');
    if (skillsEl) {
      skillsEl.innerHTML = cert.skills.map(function (s) {
        return '<span class="cert-skill-badge">' + s + '</span>';
      }).join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── 5. Setup Filter Bars ──
  function setupFilters() {
    var pFilterBar = document.getElementById('projectFilterBar');
    if (pFilterBar) {
      var tabs = pFilterBar.querySelectorAll('.filter-tab');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
          var filterVal = tab.getAttribute('data-filter');
          renderProjects(filterVal);
        });
      });
    }

    var cFilterBar = document.getElementById('certFilterBar');
    if (cFilterBar) {
      var cTabs = cFilterBar.querySelectorAll('.filter-tab');
      cTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          cTabs.forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
          var filterVal = tab.getAttribute('data-cert-filter');
          renderCertificates(filterVal);
        });
      });
    }
  }

  // ── 6. Setup Modal Closers ──
  function setupModals() {
    var pModal = document.getElementById('projectModal');
    var pClose = document.getElementById('projectModalClose');
    if (pModal && pClose) {
      var closeP = function () {
        pModal.classList.remove('active');
        document.body.style.overflow = '';
      };
      pClose.addEventListener('click', closeP);
      pModal.addEventListener('click', function (e) {
        if (e.target === pModal) closeP();
      });
    }

    var cModal = document.getElementById('certModal');
    var cClose = document.getElementById('certModalClose');
    if (cModal && cClose) {
      var closeC = function () {
        cModal.classList.remove('active');
        document.body.style.overflow = '';
      };
      cClose.addEventListener('click', closeC);
      cModal.addEventListener('click', function (e) {
        if (e.target === cModal) closeC();
      });
    }

    // Escape Key listener for all active modals
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var activeModals = document.querySelectorAll('.modal-overlay.active');
        activeModals.forEach(function (m) {
          m.classList.remove('active');
        });
        document.body.style.overflow = '';
      }
    });
  }

  // Initial runs
  renderProjects('all');
  renderCertificates('all');
  setupFilters();
  setupModals();

  // Re-run setup on component load
  document.addEventListener('componentsLoaded', function () {
    setupModals();
  });
})();


