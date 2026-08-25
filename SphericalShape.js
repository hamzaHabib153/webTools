 const companyLogos = [
      { name: "Google", logo: "https://cdn.simpleicons.org/google/4285F4" },
      { name: "Apple", logo: "https://cdn.simpleicons.org/apple/000000" },
      { name: "Microsoft", logo: "https://cdn.simpleicons.org/microsoft/00A4EF" },
      { name: "Amazon", logo: "https://cdn.simpleicons.org/amazon/FF9900" },
      { name: "Meta", logo: "https://cdn.simpleicons.org/meta/0467DF" },
      { name: "Netflix", logo: "https://cdn.simpleicons.org/netflix/E50914" },
      { name: "Tesla", logo: "https://cdn.simpleicons.org/tesla/E82127" },
      { name: "Spotify", logo: "https://cdn.simpleicons.org/spotify/1DB954" },
      { name: "YouTube", logo: "https://cdn.simpleicons.org/youtube/FF0000" },
      { name: "GitHub", logo: "https://cdn.simpleicons.org/github/181717" },
      { name: "NVIDIA", logo: "https://cdn.simpleicons.org/nvidia/76B900" },
      { name: "Uber", logo: "https://cdn.simpleicons.org/uber/000000" },
      { name: "Airbnb", logo: "https://cdn.simpleicons.org/airbnb/FF5A5F" },
      { name: "Slack", logo: "https://cdn.simpleicons.org/slack/4A154B" },
      { name: "Figma", logo: "https://cdn.simpleicons.org/figma/F24E1E" },
      { name: "Twitter / X", logo: "https://cdn.simpleicons.org/x/000000" },
      { name: "LinkedIn", logo: "https://cdn.simpleicons.org/linkedin/0A66C2" },
      { name: "Instagram", logo: "https://cdn.simpleicons.org/instagram/E4405F" },
      { name: "Discord", logo: "https://cdn.simpleicons.org/discord/5865F2" },
      { name: "Twitch", logo: "https://cdn.simpleicons.org/twitch/9146FF" },
      { name: "Intel", logo: "https://cdn.simpleicons.org/intel/0068B5" },
      { name: "AMD", logo: "https://cdn.simpleicons.org/amd/ED1C24" },
      { name: "IBM", logo: "https://cdn.simpleicons.org/ibm/054ADA" },
      { name: "Adobe", logo: "https://cdn.simpleicons.org/adobe/FF0000" },
      { name: "Salesforce", logo: "https://cdn.simpleicons.org/salesforce/00A1E0" },
      { name: "Oracle", logo: "https://cdn.simpleicons.org/oracle/F80000" },
      { name: "Samsung", logo: "https://cdn.simpleicons.org/samsung/1428A0" },
      { name: "Sony", logo: "https://cdn.simpleicons.org/sony/000000" },
      { name: "Nintendo", logo: "https://cdn.simpleicons.org/nintendo/E60012" },
      { name: "PlayStation", logo: "https://cdn.simpleicons.org/playstation/003791" }
    ];

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const pointContainer = document.getElementById('point-container');
    const sceneContainer = document.getElementById('scene-container');

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const numPoints = 300;
    const sphereRadius = 400; 
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const fibonacciOffsets = [8, 13, 21];

    let rotationY = 0.3;
    let rotationX = 0.3;
    let hoveredIndex = null;

    // --- NEW DRAG STATE VARIABLES ---
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let velX = 0; // Velocity X
    let velY = 0; // Velocity Y

    function getRandomLogo() {
      return companyLogos[Math.floor(Math.random() * companyLogos.length)];
    }

    function getSphericalPoints(count, radius) {
      const points = [];
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        points.push({
          id: i,
          x: x * radius,
          y: y * radius,
          z: z * radius,
          brand: getRandomLogo()
        });
      }
      return points;
    }

    const basePoints = getSphericalPoints(numPoints, sphereRadius);

    const htmlElements = basePoints.map((p, idx) => {
      const el = document.createElement('div');
      el.className = 'brand-node';

      const img = document.createElement('img');
      img.src = p.brand.logo;
      img.alt = p.brand.name;
      el.appendChild(img);

      el.addEventListener('mouseenter', () => {
        hoveredIndex = idx;
        el.classList.add('hovered');
      });

      el.addEventListener('mouseleave', () => {
        if (hoveredIndex === idx) hoveredIndex = null;
        el.classList.remove('hovered');
      });

      pointContainer.appendChild(el);
      return el;
    });

    const connectionsSet = new Set();
    const connections = [];

    function addConnection(i, j) {
      if (i < 0 || j < 0 || i >= numPoints || j >= numPoints || i === j) return;
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      if (!connectionsSet.has(key)) {
        connectionsSet.add(key);
        connections.push({ i, j });
      }
    }

    for (let i = 0; i < numPoints; i++) {
      for (let offset of fibonacciOffsets) {
        addConnection(i, i + offset);
      }
    }

    const poleBoundary = 13;
    for (let i = 0; i < poleBoundary; i++) {
      addConnection(i, i + 1);
      const bottomIdx = numPoints - 1 - i;
      addConnection(bottomIdx, bottomIdx - 1);
    }

    // --- NEW MOUSE/TOUCH EVENT LISTENERS ---
    function handleDragStart(x, y) {
      isDragging = true;
      lastMouseX = x;
     
      lastMouseY = y;
      velX = 0; 
      velY = 0;
    }

    function handleDragMove(x, y) {
      if (!isDragging) return;
      const dx = x - lastMouseX;
      const dy = y - lastMouseY;

      // Convert pixel movement to rotation velocity
      velX = dx * 0.005;
      velY = dy * 0.005;

      // Apply rotation instantly while dragging
      rotationY += velX;
      rotationX += velY;

      lastMouseX = x;
      lastMouseY = y;
    }

    function handleDragEnd() {
      isDragging = false;
    }

    // Desktop Mouse Events
    sceneContainer.addEventListener('mousedown', (e) => handleDragStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => handleDragMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleDragEnd);

    // Mobile Touch Events
    sceneContainer.addEventListener('touchstart', (e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
    window.addEventListener('touchmove', (e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
    window.addEventListener('touchend', handleDragEnd);


    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // --- NEW ROTATION LOGIC ---
      if (!isDragging) {
        // Apply friction to the momentum
        velX *= 0.95;
        velY *= 0.95;

        // Add momentum to rotation
        rotationY += velX;
        rotationX += velY;

        // If momentum is basically zero, and we aren't hovering, resume slow auto-spin
        if (Math.abs(velX) < 0.001 && Math.abs(velY) < 0.001) {
          if (hoveredIndex === null) {
            rotationY += 0.003;
          }
        }
      }

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const projected = basePoints.map((p, idx) => {
        let x1 = p.x * cosY + p.z * sinY;
        let y1 = p.y;
        let z1 = -p.x * sinY + p.z * cosY;

        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        const fov = 450;
        const scale = fov / (fov - z2 + sphereRadius);
        const projectedX = centerX + x2 * scale;
        const projectedY = centerY + y2 * scale;

        const isHovered = hoveredIndex === idx;
        const hoverMultiplier = isHovered ? 1.1 : 1;
        const domEl = htmlElements[idx];
         z2-=300;
        if (z2  <= 0) {
          domEl.style.display = 'none';
        } else {
          domEl.style.display = 'flex';
          domEl.style.transform = `translate3d(${projectedX - 40}px, ${projectedY - 40}px, 0px) scale(${scale * hoverMultiplier})`;
          domEl.style.opacity = isHovered ? 1 : Math.max(0.1, z2*4 / sphereRadius);
          domEl.style.zIndex = isHovered ? 999999 : Math.round((z2 + sphereRadius) * 10);
        }

        return { x: projectedX, y: projectedY, z: z2 };
      });

      for (let k = 0; k < connections.length; k++) {
        const { i, j } = connections[k];
        const p1 = projected[i];
        const p2 = projected[j];

        if (p1.z > 0 || p2.z > 0) {
          const isConnectedToHovered = hoveredIndex !== null && (i === hoveredIndex || j === hoveredIndex);
          const avgZ = (p1.z + p2.z) / 2;
          let alpha = Math.max(0.02, (avgZ + sphereRadius) / (sphereRadius * 2));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          if (isConnectedToHovered) {
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = `rgba(56, 189, 248, 0.5)`;
          } else {
            ctx.lineWidth = alpha * 0.5;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * (hoveredIndex !== null ? 0.25 : 0.75)})`;
          }

          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();