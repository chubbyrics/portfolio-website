document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. THEME MANAGER (Fixed)
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  
    // Helper function to update the icon class
    function updateThemeIcon(theme) {
        if (!icon) return;
        if (theme === 'light') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Retrieve saved theme or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  
    // Event Listener
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
  
    /* =========================================
       2. MOBILE MENU
       ========================================= */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  
    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            mobileMenu.classList.toggle('active');
            
            const menuIcon = menuToggle.querySelector('i');
            menuIcon.classList.toggle('fa-bars-staggered');
            menuIcon.classList.toggle('fa-xmark');
        });
  
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                menuToggle.querySelector('i').classList.add('fa-bars-staggered');
                menuToggle.querySelector('i').classList.remove('fa-xmark');
            });
        });
    }
  
    /* =========================================
       3. TYPEWRITER EFFECT
       ========================================= */
    const roles = ["Full-Stack Problem Solver", "Frontend Web Developer", "Mobile App Developer", "UI/UX Engineer"];
    const typeTarget = document.querySelector(".typewriter-text");
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
  
    function typeEffect() {
        if(!typeTarget) return;
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typeTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
  
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000); 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeEffect, 500);
        } else {
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        }
    }
    typeEffect();
  
    /* =========================================
       4. CONTACT FORM (EmailJS)
       ========================================= */
    const contactForm = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
  
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.disabled = true;
  
            const templateParams = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
  
            if(typeof emailjs !== 'undefined') {
                emailjs.init({ publicKey: "S4SyvUdha2fv1eq1T" }); // Your Public Key
                emailjs.send("service_pws5f0q", "template_zcjdyxs", templateParams)
                    .then(() => {
                        feedback.textContent = "Message sent successfully!";
                        feedback.className = "toast success";
                        contactForm.reset();
                    })
                    .catch((err) => {
                        console.error("Email Error:", err);
                        feedback.textContent = "Failed to send. Please try again.";
                        feedback.className = "toast error";
                    })
                    .finally(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        setTimeout(() => {
                            feedback.className = "toast"; 
                            feedback.textContent = "";
                        }, 5000);
                    });
            } else {
                console.error("EmailJS not loaded");
                btn.innerText = originalBtnText;
                btn.disabled = false;
            }
        });
    }
  
    /* =========================================
      5. GLOBAL BACKGROUND ANIMATION (Drifting & Floating)
      ========================================= */
      const canvasContainer = document.getElementById('canvas-container');
      if (canvasContainer && window.THREE) {
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
          
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          canvasContainer.appendChild(renderer.domElement);
    
          // Material settings
          const boxMaterial = new THREE.MeshBasicMaterial({
              color: 0xff0a3a,
              wireframe: true,
              transparent: true,
              opacity: 0.25 
          });
    
          const createBox = (size, x, y, z) => {
              const geo = new THREE.BoxGeometry(size, size, size);
              const mesh = new THREE.Mesh(geo, boxMaterial);
              mesh.position.set(x, y, z);
              // Store original positions for drifting calculation
              mesh.userData = { 
                  initialX: x, 
                  initialY: y, 
                  initialZ: z,
                  speed: Math.random() * 0.002 + 0.0005, // Random speed
                  offset: Math.random() * Math.PI * 2    // Random starting point in sine wave
              };
              return mesh;
          };
    
          // --- CREATING THE BOXES ---
          const box1 = createBox(6, -8, 0, -10);
          const box2 = createBox(4, 8, 4, -20);
          const box3 = createBox(12, -20, 10, -45); // Big one
          const box4 = createBox(2, 12, -8, -15);   // Small fast one
          const box5 = createBox(5, 0, -12, -25);   // Bottom one
  
          const boxes = [box1, box2, box3, box4, box5];
          scene.add(...boxes);
    
          // Particles
          const particleGeo = new THREE.BufferGeometry();
          const pCount = 800;
          const pPos = new Float32Array(pCount * 3);
          for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 50;
          
          particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
          const particleMat = new THREE.PointsMaterial({
              size: 0.08, color: 0xff0a3a, transparent: true, opacity: 0.6
          });
          const particles = new THREE.Points(particleGeo, particleMat);
          scene.add(particles);
    
          camera.position.z = 15;
    
          // Mouse Interaction
          let mouseX = 0, mouseY = 0;
          document.addEventListener('mousemove', (e) => {
              mouseX = e.clientX / window.innerWidth - 0.5;
              mouseY = e.clientY / window.innerHeight - 0.5;
          });
    
          const animateBG = () => {
              requestAnimationFrame(animateBG);
              
              const time = Date.now();
  
              // ANIMATE BOXES (Rotate + Drift)
              boxes.forEach((box, index) => {
                  // Rotation
                  box.rotation.x += 0.002 * (index % 2 === 0 ? 1 : -1);
                  box.rotation.y += 0.002;
  
                  // Drifting Logic (Sine Wave Motion)
                  // We use the stored initial positions + sine wave of time
                  const floatSpeed = 0.001;
                  const floatHeight = 2; // How far they drift up/down
                  const floatWidth = 1;  // How far they drift left/right
  
                  box.position.y = box.userData.initialY + Math.sin(time * floatSpeed + box.userData.offset) * floatHeight;
                  box.position.x = box.userData.initialX + Math.cos(time * floatSpeed + box.userData.offset) * floatWidth;
              });
  
              // Particles slow rotation
              particles.rotation.y += 0.0005;
  
              // Mouse Parallax
              camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
              camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
              camera.lookAt(scene.position);
              
              renderer.render(scene, camera);
          };
          animateBG();
    
          window.addEventListener('resize', () => {
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(window.innerWidth, window.innerHeight);
          });
      }

    /* =========================================
       6. THE NEURAL ORACLE (Smart Version)
       ========================================= */
    const oracleContainer = document.getElementById('oracle-canvas');
    const oracleInput = document.getElementById('oracle-input');
    const oracleText = document.getElementById('oracle-text');
  
    if (oracleContainer && window.THREE) {
        // --- SCENE SETUP ---
        const oScene = new THREE.Scene();
        const width = oracleContainer.clientWidth || 500;
        const height = oracleContainer.clientHeight || 500;
        
        const oCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const oRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        oRenderer.setSize(width, height);
        oracleContainer.innerHTML = '';
        oracleContainer.appendChild(oRenderer.domElement);
  
        // --- THE CORE OBJECT ---
        const geometry = new THREE.IcosahedronGeometry(2.2, 0);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0a3a, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.8 
        });
        const orb = new THREE.Mesh(geometry, material);
        oScene.add(orb);
  
        // --- INNER GLOW ---
        const coreGeo = new THREE.IcosahedronGeometry(1, 0);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(coreGeo, coreMat);
        orb.add(core);
  
        oCamera.position.z = 6;
  
        // --- SMART LOGIC ---
        let isSpinning = false;
        const randomAnswers = [
            "Outlook Good.", "Yes, absolutely.", "Concentrate and ask again.",
            "404: Answer Not Found.", "It works on my machine.", "Coffee required first.",
            "System overload.", "Try restarting."
        ];
  
        const triggerOracle = () => {
            if (isSpinning) return;
  
            const userInput = oracleInput.value.trim().toLowerCase();
  
            if (!userInput) {
                const originalText = oracleText.innerText;
                oracleText.innerText = "ERROR: NULL INPUT";
                oracleText.style.color = "#ff0a3a";
                setTimeout(() => {
                    oracleText.innerText = originalText;
                    oracleText.style.color = "#fff";
                }, 1500);
                return;
            }
  
            // KEYWORD DETECTION
            let finalAnswer = "";
            if (userInput.includes("hire") || userInput.includes("job") || userInput.includes("work")) {
                finalAnswer = "HIRE ME IMMEDIATELY.";
            } 
            else if (userInput.includes("skill") || userInput.includes("stack") || userInput.includes("program")) {
                finalAnswer = "FULL STACK DETECTED.";
            }
            else if (userInput.includes("genius") || userInput.includes("smart") || userInput.includes("pro")) {
                finalAnswer = "YES, ABSOLUTELY.";
            }
            else if (userInput.includes("love") || userInput.includes("date")) {
                finalAnswer = "I AM A ROBOT.";
            }
            else if (userInput.includes("bug") || userInput.includes("error") || userInput.includes("fail")) {
                finalAnswer = "IT'S A FEATURE.";
            }
            else if (userInput.includes("git") || userInput.includes("code")) {
                finalAnswer = "GIT PUSH --FORCE.";
            }
            else {
                finalAnswer = randomAnswers[Math.floor(Math.random() * randomAnswers.length)];
            }
  
            isSpinning = true;
            oracleText.innerText = "CALCULATING...";
            oracleContainer.parentElement.classList.add('oracle-active');
  
            let start = Date.now();
            const duration = 2000;
  
            const spinInterval = setInterval(() => {
                let timePassed = Date.now() - start;
                if (timePassed < duration) {
                    orb.rotation.x += 0.2;
                    orb.rotation.y += 0.2;
                    orb.scale.set(1.1, 1.1, 1.1);
                    material.color.setHex(0xffffff);
                } else {
                    clearInterval(spinInterval);
                    isSpinning = false;
                    orb.scale.set(1, 1, 1);
                    material.color.setHex(0xff0a3a);
                    oracleContainer.parentElement.classList.remove('oracle-active');
                    oracleText.innerText = finalAnswer;
                }
            }, 16);
        };
  
        // --- EVENTS ---
        oracleInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") triggerOracle();
        });
  
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        oracleContainer.addEventListener('mousedown', (e) => {
            const rect = oRenderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, oCamera);
            const intersects = raycaster.intersectObjects([orb]);
            
            if (intersects.length > 0) triggerOracle();
        });
  
        // --- ANIMATION ---
        const animateOracle = () => {
            requestAnimationFrame(animateOracle);
            if (!isSpinning) {
                orb.rotation.x += 0.005;
                orb.rotation.y += 0.005;
            }
            orb.position.y = Math.sin(Date.now() * 0.002) * 0.2;
            oRenderer.render(oScene, oCamera);
        };
        animateOracle();
  
        window.addEventListener('resize', () => {
            const w = oracleContainer.clientWidth;
            const h = oracleContainer.clientHeight;
            oRenderer.setSize(w, h);
            oCamera.aspect = w / h;
            oCamera.updateProjectionMatrix();
        });
    }
});