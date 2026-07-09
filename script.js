document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. UNIFIED SINGLE-PAGE NAVIGATION & SCROLL TRACKING ENGINE
       ========================================================================== */
    const navLinksCollection = document.querySelectorAll('.sidebar-links .nav-link');
    const layoutSections = document.querySelectorAll('main#workspace > section');

    navLinksCollection.forEach(linkElement => {
        linkElement.addEventListener('click', (event) => {
            const destinationId = linkElement.getAttribute('href');

            if (destinationId.startsWith('#')) {
                event.preventDefault();

                // Swap active class styling indicators immediately
                navLinksCollection.forEach(lnk => lnk.classList.remove('active'));
                linkElement.classList.add('active');

                if (destinationId === '#arsenal') {
                    // SPA VIEW PHASE: Hide other sections and expose Arsenal standalone grid
                    layoutSections.forEach(sectionBlock => {
                        if (sectionBlock.id === 'arsenal') {
                            sectionBlock.style.display = 'block';
                        } else {
                            sectionBlock.style.display = 'none';
                        }
                    });
                    window.scrollTo({ top: 0, behavior: 'instant' });
                } else {
                    // NATIVE SCROLL PHASE: Restore all default vertical sections, hide Arsenal array
                    layoutSections.forEach(sectionBlock => {
                        if (sectionBlock.id === 'arsenal') {
                            sectionBlock.style.display = 'none';
                        } else {
                            sectionBlock.style.display = 'block';
                        }
                    });

                    // Execute smooth scroll down vector to targets cleanly
                    const activeTargetPanel = document.querySelector(destinationId);
                    if (activeTargetPanel) {
                        activeTargetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
        });
    });

    /* ==========================================================================
       2. REPAIRED ACTIVE SIDEBAR VIEWPORT SCROLL HIGHLIGHT DETECTOR
       ========================================================================== */
    window.addEventListener('scroll', () => {
        const arsenalSection = document.getElementById('arsenal');
        // Prevent calculation updates if the user is locked inside the Arsenal dashboard layout
        if (arsenalSection && arsenalSection.style.display === 'block') return;

        let currentActiveSectionId = "";
        layoutSections.forEach(section => {
            if (section.id !== 'arsenal' && window.pageYOffset >= (section.offsetTop - 160)) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        if (currentActiveSectionId) {
            navLinksCollection.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Check URL parameters on initialization if a user deep-links directly
    const initialHash = window.location.hash;
    if (initialHash) {
        const correspondingLink = document.querySelector(`.sidebar-links a[href="${initialHash}"]`);
        if (correspondingLink) correspondingLink.click();
    }

    /* ==========================================================================
       3. INTERFACE DISPLAY SELECTION MATRIX (THEME ENGINE)
       ========================================================================== */
    const modeSwitchIcoButtons = document.querySelectorAll('.theme-icon-control .theme-ico-btn');
    const rootMarkupElement = document.documentElement;

    function enforceSystemModeLayout(mode) {
        if (mode === 'system') {
            const isDarkActive = window.matchMedia('(prefers-color-scheme: dark)').matches;
            rootMarkupElement.setAttribute('data-theme', isDarkActive ? 'dark' : 'light');
        } else {
            rootMarkupElement.setAttribute('data-theme', mode);
        }
        localStorage.setItem('portfolio-icon-theme-choice', mode);
        
        modeSwitchIcoButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-mode') === mode) btn.classList.add('active');
        });
    }

    const savedIconThemeConfig = localStorage.getItem('portfolio-icon-theme-choice') || 'dark';
    enforceSystemModeLayout(savedIconThemeConfig);

    modeSwitchIcoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            enforceSystemModeLayout(btn.getAttribute('data-mode'));
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('portfolio-icon-theme-choice') === 'system') {
            enforceSystemModeLayout('system');
        }
    });

    /* ==========================================================================
       4. PERSISTENT WORKSPACE TOP STATUS TIME CLOCK FUNCTION (PHT HUD)
       ========================================================================== */
    const clockElementField = document.getElementById('live-pht-clock');
    
    function refreshPHTClockTime() {
        if (!clockElementField) return;
        const baselineDate = new Date();
        const targetTimezoneOffset = baselineDate.getTime() + (baselineDate.getTimezoneOffset() * 60000);
        const phtTimeInstance = new Date(targetTimezoneOffset + (3600000 * 8));
        
        let hrs = phtTimeInstance.getHours();
        let mins = phtTimeInstance.getMinutes();
        let secs = phtTimeInstance.getSeconds();
        
        hrs = hrs < 10 ? '0' + hrs : hrs;
        mins = mins < 10 ? '0' + mins : mins;
        secs = secs < 10 ? '0' + secs : secs;
        
        clockElementField.innerText = `${hrs}:${mins}:${secs} PHT`;
    }
    setInterval(refreshPHTClockTime, 1000);
    refreshPHTClockTime();

    /* ==========================================================================
       5. WHOLE PANEL CANVAS VERTICAL DRAG INTERACTION
       ========================================================================== */
    const dragZone = document.getElementById('gear-drag-zone');
    const dragTrack = document.getElementById('gear-vertical-track');
    const techPanelBox = document.getElementById('tech-panel');
    const maximizeBtn = document.getElementById('maximize-gear');

    let isDragActive = false;
    let clickYCoordinateStart = 0;
    let trackCurrentScrollTopOffset = 0;
    let currentCalculatedTranslateYValue = 0;

    if (dragZone && dragTrack) {
        dragZone.addEventListener('mousedown', (e) => {
            if (techPanelBox.classList.contains('maximized-state')) return;
            isDragActive = true;
            clickYCoordinateStart = e.pageY - dragTrack.offsetTop;
            trackCurrentScrollTopOffset = currentCalculatedTranslateYValue;
        });

        document.addEventListener('mouseup', () => {
            isDragActive = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragActive || techPanelBox.classList.contains('maximized-state')) return;
            e.preventDefault();
            const currentMouseY = e.pageY - dragTrack.offsetTop;
            const pointerMovementDistanceDelta = currentMouseY - clickYCoordinateStart;
            let targetTransformValue = trackCurrentScrollTopOffset + pointerMovementDistanceDelta;

            const maxNegativeShiftLimit = -(dragTrack.scrollHeight - dragZone.clientHeight);
            if (targetTransformValue > 0) targetTransformValue = 0;
            if (targetTransformValue < maxNegativeShiftLimit) targetTransformValue = maxNegativeShiftLimit;

            currentCalculatedTranslateYValue = targetTransformValue;
            dragTrack.style.transform = `translateY(${currentCalculatedTranslateYValue}px)`;
        });

        dragZone.addEventListener('touchstart', (e) => {
            if (techPanelBox.classList.contains('maximized-state')) return;
            isDragActive = true;
            clickYCoordinateStart = e.touches[0].pageY - dragTrack.offsetTop;
            trackCurrentScrollTopOffset = currentCalculatedTranslateYValue;
        });

        document.addEventListener('touchend', () => {
            isDragActive = false;
        });

        dragZone.addEventListener('touchmove', (e) => {
            if (!isDragActive || techPanelBox.classList.contains('maximized-state')) return;
            const currentTouchY = e.touches[0].pageY - dragTrack.offsetTop;
            const shiftDelta = currentTouchY - clickYCoordinateStart;
            let targetValue = trackCurrentScrollTopOffset + shiftDelta;

            const maxLimit = -(dragTrack.scrollHeight - dragZone.clientHeight);
            if (targetValue > 0) targetValue = 0;
            if (targetValue < maxLimit) targetValue = maxLimit;

            currentCalculatedTranslateYValue = targetValue;
            dragTrack.style.transform = `translateY(${currentCalculatedTranslateYValue}px)`;
        });
    }

    if (maximizeBtn && techPanelBox && dragTrack) {
        maximizeBtn.addEventListener('click', () => {
            techPanelBox.classList.toggle('maximized-state');
            const maximizeIco = maximizeBtn.querySelector('i');
            
            if (techPanelBox.classList.contains('maximized-state')) {
                maximizeIco.className = 'fa-solid fa-compress';
                dragTrack.style.transform = 'none';
            } else {
                maximizeIco.className = 'fa-solid fa-expand';
                currentCalculatedTranslateYValue = 0;
                dragTrack.style.transform = 'translateY(0px)';
            }
        });
    }

    /* ==========================================================================
       6. EXPANDABLE TECH ACCORDION DRAWER OVERLAY CONTROL
       ========================================================================== */
    const gearTriggerBoxBtn = document.getElementById('tech-gear-btn');
    const closePanelBoxBtn = document.getElementById('close-tech');

    if (gearTriggerBoxBtn && techPanelBox && closePanelBoxBtn) {
        gearTriggerBoxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            techPanelBox.classList.toggle('active');
        });
        closePanelBoxBtn.addEventListener('click', () => {
            techPanelBox.classList.remove('active');
            techPanelBox.classList.remove('maximized-state');
            const maximizeIco = maximizeBtn.querySelector('i');
            if (maximizeIco) maximizeIco.className = 'fa-solid fa-expand';
            currentCalculatedTranslateYValue = 0;
            dragTrack.style.transform = 'translateY(0px)';
        });
        document.addEventListener('click', (e) => {
            if (!techPanelBox.contains(e.target) && e.target !== gearTriggerBoxBtn) {
                techPanelBox.classList.remove('active');
            }
        });
    }

    /* ==========================================================================
       7. EXPANDABLE TECH ACCORDION DRAWER OVERLAY CONTROL
       ========================================================================== */
    const seeAllTriggers = document.querySelectorAll('.see-all-trigger');
    const archiveOverlayPanel = document.getElementById('archive-overlay');
    const closeArchivePanelBtn = document.getElementById('close-archive');
    const archiveTitleField = document.getElementById('archive-title');
    const archiveDisplayBody = document.getElementById('archive-inject-content');

    const contextualDataMap = {
        services: {
            title: "Extended Technical Services & Architecture",
            html: `<div class='matrix-grid' style='grid-template-columns:1fr; gap:20px;'>
                     <!-- API & Token Management (Existing improved) -->
                     <div class='matrix-card'>
                        <h3>Custom API & OAuth 2.0 Implementations</h3>
                        <p>Designing secure, high-throughput data routing pipelines with OAuth 2.0 validation handlers, cross-origin transactional token management, and structured REST endpoints.</p>
                     </div>
                     
                     <!-- Queue-Based Systems & Bulk Processing -->
                     <div class='matrix-card'>
                        <h3>Bulk Processing & Queue-Based Architectures</h3>
                        <p>Engineering asynchronous background worker threads and queue systems capable of parsing bulk multi-format datasets (CSV/Excel) for scalable notification and automation platforms.</p>
                     </div>

                     <!-- Automated Operations & DevOps Pipelines -->
                     <div class='matrix-card'>
                        <h3>Automated Workflows & Database DevOps</h3>
                        <p>Deploying unattended low-overhead system automation nodes (n8n matrices) alongside encrypted relational database backup routines to ensure 99.9% data durability.</p>
                     </div>

                     <!-- Machine Learning & HCI Edge Applications -->
                     <div class='matrix-card'>
                        <h3>HCI Gesture & Real-Time Intelligence Integration</h3>
                        <p>Translating predictive on-device models (Pose/Skeletal Detection) into native application rendering threads, mapping human movement directly to real-time software execution logic.</p>
                     </div>

                     <!-- Database Optimization (Existing improved) -->
                     <div class='matrix-card'>
                        <h3>Database Schema Design & Query Scaling</h3>
                        <p>Architecting normalized relational structures with optimized index lookups, transactional constraints, and efficient query execution paths to minimize server latency entirely.</p>
                     </div>
                   </div>`
        },
        experience: {
            title: "Full Work History Record Matrix",
            html: `<div class='cred-showcase-matrix' style='border-left:2px solid var(--border-system); padding-left:24px;'>
                     <div style='margin-bottom:32px; position:relative;'>
                        <div style='position:absolute; left:-31px; top:4px; width:12px; height:12px; background:var(--accent-red); border-radius:50%;'></div>
                        <span class='cred-year' style='color:var(--accent-red); font-weight:700;'>Feb 2026 — Apr 2026</span>
                        <h3 style='font-size:1.3rem; margin-top:4px;'>IT & Software Engineering Intern (Zionlab)</h3>
                        <p style='font-family:monospace; font-size:0.8rem; margin:2px 0 8px 0; color:#00ff66;'>Ref ID Status: ZN-2026-884A (SECURELY VERIFIED)</p>
                        <p style='color:var(--text-secondary); line-height:1.5;'>Formally signed off under Chylene P. Saraspe supervision track, deploying backend automated modules.</p>
                     </div>
                   </div>`
        },
        projects: {
            title: "Complete Software Production Catalog Archive (Public & Private Repositories)",
            html: `<div class='projects-stack'>
                     
                     <div class='project-row'>
                        <div class='proj-meta-col'><span class='proj-number'>01</span></div>
                        <div class='proj-desc-col'>
                            <h3>email-blaster-platform</h3>
                            <p>A secure, scalable Email Blasting Platform (Web App + API) for sending bulk personalized emails using Excel/CSV data. Features OAuth 2.0 integration, template editor, queue-based async loops, and real-time tracking.</p>
                            <div class='tag-row'><span>TypeScript</span><span>OAuth 2.0</span><span>Queue Systems</span></div>
                        </div>
                     </div>

                     <div class='project-row'>
                        <div class='proj-meta-col'><span class='proj-number'>02</span></div>
                        <div class='proj-desc-col'>
                            <h3>CampusEventManager</h3>
                            <p>A cloud-backed event coordination app architected natively to streamline scheduling pipelines, logistics, and resource tracking for university departments.</p>
                            <div class='tag-row'><span>Kotlin</span><span>Native Android</span><span>Cloud Backends</span></div>
                        </div>
                     </div>

                     <div class='project-row'>
                        <div class='proj-meta-col'><span class='proj-number'>03</span></div>
                        <div class='proj-desc-col'>
                            <h3>Cal2Hub_App</h3>
                            <p>A native utility app built to systematically parse calendar tracking elements and bridge schedule automation events to remote repositories with instant synchronization.</p>
                            <div class='tag-row'><span>Kotlin Flow</span><span>Calendar API</span><span>Sync Hooks</span></div>
                        </div>
                     </div>

                     <div class='project-row'>
                        <div class='proj-meta-col'><span class='proj-number'>04</span></div>
                        <div class='proj-desc-col'>
                            <h3>Docuview</h3>
                            <p>An interactive data reader engine built with low-overhead client dependencies to preview document asset buffers directly within secure layout configurations.</p>
                            <div class='tag-row'><span>JavaScript</span><span>Blob Rendering</span><span>UI Engine</span></div>
                        </div>
                     </div>

                     <div class='project-row'>
                        <div class='proj-meta-col'><span class='proj-number'>05</span></div>
                        <div class='proj-desc-col'>
                            <h3>DanceSense</h3>
                            <p>A motion-tracking script interface utilizing skeletal data tracking modules to parse rhythmic frame coordinates and analyze physical movements in real time.</p>
                            <div class='tag-row'><span>Python Engine</span><span>Computer Vision</span><span>Biometrics</span></div>
                        </div>
                     </div>

                     <div class='project-row'>
                        <div class='proj-meta-col'><span class='proj-number'>06</span></div>
                        <div class='proj-desc-col'>
                            <h3>Docuview</h3>
                            <p>An interactive asset preview dashboard built with lightweight rendering loops to safely isolate and manage document uploads.</p>
                            <div class='tag-row'><span>JavaScript</span><span>Sandbox UI</span></div>
                        </div>
                     </div>

                     <div class='project-row'>
                        <div class='proj-meta-col'><span class='proj-number'>07</span></div>
                        <div class='proj-desc-col'>
                            <h3>SmartInbox</h3>
                            <p>An isolated email parser layout engineered to sort transactional notifications from promotional noise using highly specific markup classification patterns.</p>
                            <div class='tag-row'><span>HTML Engine</span><span>Email Templates</span></div>
                        </div>
                     </div>

                   </div>`
        },
        credentials: {
            title: "Google Cybersecurity Specialization Complete Archive Matrix",
            html: `<div class='cred-showcase-matrix' style='gap:20px;'>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/Cybersecurity-Badge.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED BADGE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Issued 2025</span><h3>Google Cybersecurity Certification Badge</h3><p class='company-sub-label'>Credly Verification Network</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Official secure badge record documenting systems audit capabilities.</p><a href='https://www.credly.com/badges/02da0e5f-9b92-4fb8-acb5-bf0e35ebcb36/print' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify via Credly</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/putwork.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED COURSE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed January 2025</span><h3>Put It to Work: Prepare for Cybersecurity Jobs</h3><p class='company-sub-label'>Course 8 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Specialization completion and technical workforce optimization mapping metrics.</p><a href='https://www.coursera.org/account/accomplishments/verify/9KS4M1KZ62S6' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/Automate.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED COURSE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed January 2025</span><h3>Automate Cybersecurity Tasks with Python</h3><p class='company-sub-label'>Course 7 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Writing structural custom automation tools, data sanitizations, and security log parser instances.</p><a href='https://www.coursera.org/account/accomplishments/verify/CRQ5GKZKD6RP' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/SOund the alarm.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED COURSE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed December 2024</span><h3>Sound the Alarm: Detection and Response</h3><p class='company-sub-label'>Course 6 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Managing incident response matrices, network log monitoring, and threat indexing.</p><a href='https://www.coursera.org/account/accomplishments/verify/EK3KIFFNM668' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/Assets.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED COURSE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed August 2024</span><h3>Assets, Threats, and Vulnerabilities</h3><p class='company-sub-label'>Course 5 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Isolating asset dependencies, risk mitigations, and vulnerability tracking vectors.</p><a href='https://coursera.org/verify/GH6Q5BOTEI1M' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/Tools of trade.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED INSTANCE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed July 2024</span><h3>Tools of the Trade: Linux and SQL</h3><p class='company-sub-label'>Course 4 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Command line shell execution scripts and database transaction querying normalization models.</p><a href='https://www.coursera.org/account/accomplishments/verify/KLPU8EZNJHZY' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/Connectandprotect.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED COURSE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed June 2024</span><h3>Connect and Protect: Networks and Network Security</h3><p class='company-sub-label'>Course 3 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Network layout perimeter defense setups, port security, and infrastructure tracking configurations.</p><a href='https://coursera.org/verify/22M67BRLF3MK' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/Play it safe.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED COURSE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed June 2024</span><h3>Play It Safe: Manage Security Risks</h3><p class='company-sub-label'>Course 2 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Risk appraisal matrices, data integrity governance rules, and systems safety loops.</p><a href='https://www.coursera.org/account/accomplishments/verify/EZB9N8TXH3DG' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                     <div class='cred-visual-card verified-card'>
                        <div class='cred-image-frame'><img src='assets/Foundations.png' style='object-fit:contain; padding:12px;'><span class='verification-badge-label'><i class='fa-solid fa-circle-check'></i> VERIFIED COURSE</span></div>
                        <div class='cred-details-pane'><span class='verify-tag-id'>Completed May 2024</span><h3>Foundations of Cybersecurity</h3><p class='company-sub-label'>Course 1 of 8 — Google Curriculum</p><p style='font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;'>Baseline network security models, cryptographic principles, and structural data safety metrics.</p><a href='https://coursera.org/verify/UGBTLYQBDJF7' target='_blank' class='btn-verify-link-popup'><i class='fa-solid fa-arrow-up-right-from-square'></i> Verify Course</a></div>
                     </div>
                   </div>`
        }
    };

    seeAllTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const currentCategory = trigger.getAttribute('data-target');
            const targetArchiveData = contextualDataMap[currentCategory];
            if (targetArchiveData) {
                archiveTitleField.innerText = targetArchiveData.title;
                archiveDisplayBody.innerHTML = targetArchiveData.html;
                archiveOverlayPanel.classList.add('active');
            }
        });
    });

    if (closeArchivePanelBtn) {
        closeArchivePanelBtn.addEventListener('click', () => {
            archiveOverlayPanel.classList.remove('active');
        });
    }

    /* ==========================================================================
       8. DYNAMIC SYSTEM INTEGRATED CHAT KNOWLEDGE ENGINE
       ========================================================================== */
    const chatInputBox = document.getElementById('chat-input');
    const chatDisplayLogs = document.getElementById('chat-logs');

    window.processAgentLogic = function(userInputText) {
        const queryText = userInputText.toLowerCase();
        if (queryText.includes('gear') || queryText.includes('setup') || queryText.includes('laptop')) {
            return "Rica's workspace uses an Asus TUF Gaming F15 laptop mounted on an adjustable metal stand. Her peripheral equipment features an Attack Shark X11 SE wireless mouse and a QKZ AK6 setup.";
        }
        if (queryText.includes('cyber') || queryText.includes('cert') || queryText.includes('security')) {
            return "Rica is a certified Google Cybersecurity Professional (completed January 2025) with specialization covering Linux, threat modeling, and automation loops via Python and SQL.";
        }
        if (queryText.includes('project') || queryText.includes('build') || queryText.includes('code')) {
            return "Rica has engineered multiple core systems: Cycle Care, a Pickleball Court Match Controller, and the 'Popstar POS & Inventory System' designed for automated pharmacy stock tracking.";
        }
        if (queryText.includes('intern') || queryText.includes('zionlab') || queryText.includes('experience')) {
            return "Rica completed an IT Internship at Zionlab IT Consultancy from February 2 to April 30, 2026. Her technical metrics involved upgrading database queries and backend route validations.";
        }
        return "Rica builds scalable software frameworks without technical debt. Drop your specifications into the contact console form directly below!";
    };

    const chatWidgetToggleButton = document.getElementById('ai-chat-toggle');
    const chatWidgetWindowFrame = document.getElementById('ai-chat-window');
    const closeChatWidgetBtn = document.getElementById('close-chat');

    if (chatWidgetToggleButton && chatWidgetWindowFrame && closeChatWidgetBtn) {
        chatWidgetToggleButton.addEventListener('click', () => chatWidgetWindowFrame.classList.toggle('chat-hidden'));
        closeChatWidgetBtn.addEventListener('click', () => chatWidgetWindowFrame.classList.add('chat-hidden'));

        chatInputBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && chatInputBox.value.trim() !== "") {
                const textMessage = chatInputBox.value.trim();
                appendLogMessage(textMessage, 'user-msg');
                chatInputBox.value = "";

                setTimeout(() => {
                    const compiledResponse = window.processAgentLogic(textMessage);
                    appendLogMessage(compiledResponse, 'bot-msg');
                }, 400);
            }
        });
    }

    function appendLogMessage(text, className) {
        const node = document.createElement('div');
        node.className = `msg ${className}`;
        node.innerText = text;
        chatDisplayLogs.appendChild(node);
        chatDisplayLogs.scrollTop = chatDisplayLogs.scrollHeight;
    }

    /* ==========================================================================
       9. CONTACT LEAD GENERATOR EMAIL PIPELINE SUBMISSION
       ========================================================================== */
    const secureLeadForm = document.getElementById('contact-form');
    const feedbackToastField = document.getElementById('form-feedback');

    if (secureLeadForm) {
        secureLeadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const actionBtn = secureLeadForm.querySelector('button');
            const backupLabelText = actionBtn.innerText;
            
            actionBtn.innerText = 'SENDING MESSAGE...';
            actionBtn.disabled = true;

            const parameterFormFields = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            if (typeof emailjs !== 'undefined') {
                emailjs.init({ publicKey: "S4SyvUdha2fv1eq1T" });
                emailjs.send("service_pws5f0q", "template_zcjdyxs", parameterFormFields)
                    .then(() => {
                        displayGlobalToastFeedback("Message sent successfully!", "success");
                        secureLeadForm.reset();
                    })
                    .catch((err) => {
                        console.error("System pipeline dropout:", err);
                        displayGlobalToastFeedback("Failed to send message. Please try again.", "error");
                    })
                    .finally(() => {
                        actionBtn.innerText = backupLabelText;
                        actionBtn.disabled = false;
                    });
            }
        });
    }

    function displayGlobalToastFeedback(message, operationalStatus) {
        if (!feedbackToastField) return;
        feedbackToastField.innerText = message;
        feedbackToastField.className = `feedback-toast ${operationalStatus}`;
        feedbackToastField.style.display = 'block';
        setTimeout(() => {
            feedbackToastField.style.display = 'none';
        }, 5000);
    }
});

