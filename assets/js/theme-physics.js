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
  const anchorX = 30;               // Fixed horizontal anchor
  const switchRestY = -20;          // Resting position of the switch (top of string)
  const maxPullY = 20;              // Maximum downward pull of the switch
  const stringLength = 130;         // Fixed length of the inelastic string
  let gravityX = 0;                 // Horizontal gravity (from device orientation)
  let gravityY = 0.6;               // Vertical gravity (reduced for slower swing)
  const friction = 0.98;            // Air friction / damping (higher = swings longer)
  const switchSpring = 0.2;         // Spring constant for the switch
  const scrollForceMult = 0.15;     // How much scroll affects the handle

  // State
  let switchY = switchRestY;
  let switchVy = 0;

  let handlePos = { x: anchorX, y: switchRestY + stringLength };
  let velocity = { x: 0, y: 0 };

  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let hasTriggered = false;

  // Scroll momentum tracking
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;

  // Device Orientation for Gravity (Mobile)
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
      let gamma = event.gamma; // Left-to-right tilt in degrees [-90, 90]
      if (gamma !== null) {
        // Clamp to [-45, 45] and reduce multiplier to make it less harsh
        let clampedGamma = Math.max(-45, Math.min(45, gamma));
        gravityX = (clampedGamma / 45) * gravityY * 0.4;
      }
    }, { passive: true });
  }

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

    const rect = svg.getBoundingClientRect();
    const svgX = clientX - rect.left;
    const svgY = clientY - rect.top;

    dragOffset.x = svgX - handlePos.x;
    dragOffset.y = svgY - handlePos.y;

    velocity.x = 0;
    velocity.y = 0;

    handle.setAttribute('stroke', 'var(--accent-purple)');
    handle.setAttribute('r', '14');
  }

  function doDrag(clientX, clientY) {
    if (!isDragging) return;
    const rect = svg.getBoundingClientRect();
    handlePos.x = (clientX - rect.left) - dragOffset.x;
    handlePos.y = (clientY - rect.top) - dragOffset.y;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    handle.setAttribute('stroke', 'var(--accent-blue)');
    handle.setAttribute('r', '12');
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

  handle.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
  handle.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  window.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      doDrag(touch.clientX, touch.clientY);
    }
  }, { passive: false });

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  // Physics Loop
  function update() {
    // 1. Switch Spring Physics
    const switchForce = -switchSpring * (switchY - switchRestY);
    switchVy += switchForce;
    switchVy *= 0.8; // High damping for switch
    switchY += switchVy;

    // 2. Handle Physics
    if (!isDragging) {
      velocity.x += gravityX;
      velocity.y += gravityY;
      velocity.x *= friction;
      velocity.y *= friction;

      handlePos.x += velocity.x;
      handlePos.y += velocity.y;

      // Prevent string from swinging into the upper half (above the switch)
      if (handlePos.y < switchY) {
        handlePos.y = switchY;
        if (velocity.y < 0) velocity.y = 0; // kill upward velocity if it hits the ceiling
      }
    }

    // 3. String Constraint (Inelastic string)
    const dx = handlePos.x - anchorX;
    const dy = handlePos.y - switchY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > stringLength) {
      // String is taut!
      const nx = dx / distance;
      const ny = dy / distance;
      const diff = distance - stringLength;

      if (isDragging) {
        // Dragging forces the switch down
        switchY += diff;
      } else {
        // Pull handle back, and pull switch down based on relative masses
        // Let's say switch is much heavier/stiffer
        const switchCorrection = diff * 0.1;
        const handleCorrection = diff * 0.9;

        switchY += switchCorrection;
        handlePos.x -= nx * handleCorrection;
        handlePos.y -= ny * handleCorrection;

        // Remove velocity component outward (inelastic string)
        const dot = velocity.x * nx + velocity.y * ny;
        if (dot > 0) {
          // If the string snaps taut and loses a lot of vertical velocity, 
          // transfer a tiny bit to horizontal so it swings (pendulum effect)
          if (ny > 0.9 && Math.abs(velocity.x) < 1) {
            velocity.x += (Math.random() > 0.5 ? 1 : -1) * (dot * 0.15);
          }
          velocity.x -= dot * nx;
          velocity.y -= dot * ny;
        }
      }
    }

    // 4. Clamp Switch
    if (switchY > maxPullY) {
      switchY = maxPullY;
      // If pulled to max and hasn't triggered yet, toggle!
      if (!hasTriggered && distance >= stringLength - 1) {
        hasTriggered = true;
        toggleTheme();

        // Give a little haptic feedback kick (simulate switch snapping)
        switchVy = -15;
        if (!isDragging) {
          velocity.y = -5;
        }
      }
    }

    // Render
    handle.setAttribute('cx', handlePos.x);
    handle.setAttribute('cy', handlePos.y);

    // Render String (Bend if slack)
    const slack = stringLength - distance;
    if (slack > 0) {
      // String is slack, render as curved Bezier
      // The curve bows outwards. Bow direction depends on horizontal position/velocity
      const midX = (anchorX + handlePos.x) / 2;
      const midY = (switchY + handlePos.y) / 2;

      // Calculate a bowing amount based on slack
      const bowAmount = Math.sqrt(slack * stringLength) * 0.8;

      // Bow direction based on horizontal velocity or position
      let bowDir = 1;
      if (Math.abs(velocity.x) > 0.5) {
        bowDir = (velocity.x > 0) ? -1 : 1; // Bow opposite to movement
      } else {
        bowDir = (handlePos.x > anchorX) ? -1 : 1;
      }

      // Add extra bowing if scrolling up fast
      const scrollBow = Math.max(0, -scrollVelocity * 0.4);

      const cpX = midX + (bowAmount + scrollBow) * bowDir;
      const cpY = midY + (bowAmount * 0.3); // downward droop for the curve

      path.setAttribute('d', `M ${anchorX} ${switchY} Q ${cpX} ${cpY} ${handlePos.x} ${handlePos.y}`);
    } else {
      // String is taut, straight line
      path.setAttribute('d', `M ${anchorX} ${switchY} Q ${(anchorX + handlePos.x) / 2} ${(switchY + handlePos.y) / 2} ${handlePos.x} ${handlePos.y}`);
    }

    requestAnimationFrame(update);
  }

  // Start physics loop
  update();
})();
