/* ================================================
   theme-physics.js — Realistic pull string physics for theme toggle
   ================================================ */

(function initThemePhysics() {
  const container = document.getElementById('theme-toggle-wrapper');
  const svg = document.getElementById('theme-string-svg');
  const path = document.getElementById('string-path');
  const handle = document.getElementById('string-handle');
  if (!container || !svg || !path || !handle) return;

  // Initialize theme from localStorage
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  // Physics constants
  const anchor = { x: 30, y: -20 }; // Fixed top point, slightly hidden
  const restY = 80;                 // Resting length of the string
  const k = 0.05;                   // Spring constant
  const damping = 0.85;             // Friction/damping (lower = stops faster)
  const gravity = 0.8;              // Downward force
  const scrollForceMult = 0.08;     // How much scroll affects the handle

  // State
  let handlePos = { x: anchor.x, y: restY };
  let velocity = { x: 0, y: 0 };
  let isDragging = false;
  let hasTriggered = false; // Prevents multiple toggles on one pull
  
  // Dragging state
  let dragOffset = { x: 0, y: 0 };

  // Scroll momentum tracking
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;

  window.addEventListener('scroll', () => {
    let currentScroll = window.scrollY;
    scrollVelocity = currentScroll - lastScrollY;
    lastScrollY = currentScroll;
    
    // Apply scroll velocity to handle (pulling up when scrolling down)
    if (!isDragging) {
      velocity.y -= scrollVelocity * scrollForceMult;
    }
  }, { passive: true });

  // Mouse / Touch Events
  function startDrag(clientX, clientY) {
    isDragging = true;
    hasTriggered = false;
    
    // Convert client coords to SVG local coords
    const rect = svg.getBoundingClientRect();
    const svgX = clientX - rect.left;
    const svgY = clientY - rect.top;
    
    // Calculate offset from handle center to drag point
    dragOffset.x = svgX - handlePos.x;
    dragOffset.y = svgY - handlePos.y;
    
    velocity.x = 0;
    velocity.y = 0;
    
    // Add grabbed class for visual feedback
    handle.setAttribute('stroke', 'var(--accent-purple)');
    handle.setAttribute('r', '14');
  }

  function doDrag(clientX, clientY) {
    if (!isDragging) return;
    const rect = svg.getBoundingClientRect();
    handlePos.x = (clientX - rect.left) - dragOffset.x;
    handlePos.y = (clientY - rect.top) - dragOffset.y;
    
    // Limit how far it can be pulled down
    if (handlePos.y > 180) {
      handlePos.y = 180;
    }
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    handle.setAttribute('stroke', 'var(--accent-blue)');
    handle.setAttribute('r', '12');
    
    // Toggle theme if pulled down far enough
    if (handlePos.y > 150 && !hasTriggered) {
      hasTriggered = true;
      toggleTheme();
      // Give it an extra upward kick after toggling
      velocity.y = -20;
    }
  }

  function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle('light-mode');
    if (root.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  }

  // Event Listeners
  handle.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
  handle.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  window.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      e.preventDefault(); // Prevent scrolling while pulling the string
      const touch = e.touches[0];
      doDrag(touch.clientX, touch.clientY);
    }
  }, { passive: false });

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  // Physics Loop
  function update() {
    if (!isDragging) {
      // Spring forces
      const forceX = -k * (handlePos.x - anchor.x);
      const forceY = -k * (handlePos.y - restY) + gravity;

      velocity.x += forceX;
      velocity.y += forceY;

      velocity.x *= damping;
      velocity.y *= damping;

      handlePos.x += velocity.x;
      handlePos.y += velocity.y;
    }

    // Render
    handle.setAttribute('cx', handlePos.x);
    handle.setAttribute('cy', handlePos.y);

    // Draw curved string (quadratic bezier)
    // Control point is halfway down, but pushed out based on horizontal displacement
    const cpX = (anchor.x + handlePos.x) / 2;
    // The curve bows outwards based on velocity for a waving effect
    const waveOffset = velocity.x * 2;
    
    path.setAttribute('d', `M ${anchor.x} ${anchor.y} Q ${cpX + waveOffset} ${(anchor.y + handlePos.y)/2} ${handlePos.x} ${handlePos.y}`);

    requestAnimationFrame(update);
  }

  // Start physics loop
  update();
})();
