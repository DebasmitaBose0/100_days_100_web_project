document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Clock Elements Mapping & Global State
    // ----------------------------------------------------
    const clockState = {
        mainTz: 'local',
        isSweeping: true
    };

    const clocks = [
        {
            id: 'local',
            timeZone: null, // Custom timezone dynamic centerpiece
            hourHand: document.getElementById('local-hour'),
            minuteHand: document.getElementById('local-minute'),
            secondHand: document.getElementById('local-second'),
            digital: document.getElementById('local-digital'),
            date: document.getElementById('local-date')
        },
        {
            id: 'ny',
            timeZone: 'America/New_York',
            hourHand: document.getElementById('ny-hour'),
            minuteHand: document.getElementById('ny-minute'),
            secondHand: document.getElementById('ny-second'),
            digital: document.getElementById('ny-digital'),
            date: document.getElementById('ny-date')
        },
        {
            id: 'london',
            timeZone: 'Europe/London',
            hourHand: document.getElementById('london-hour'),
            minuteHand: document.getElementById('london-minute'),
            secondHand: document.getElementById('london-second'),
            digital: document.getElementById('london-digital'),
            date: document.getElementById('london-date')
        },
        {
            id: 'tokyo',
            timeZone: 'Asia/Tokyo',
            hourHand: document.getElementById('tokyo-hour'),
            minuteHand: document.getElementById('tokyo-minute'),
            secondHand: document.getElementById('tokyo-second'),
            digital: document.getElementById('tokyo-digital'),
            date: document.getElementById('tokyo-date')
        }
    ];

    const mainTzSelector = document.getElementById('mainTzSelector');
    const handMovementBtn = document.getElementById('handMovementBtn');
    
    const bannerImages = {
        'local': 'taj_mahal.png',
        'America/New_York': 'new_york.png',
        'Europe/London': 'london.png',
        'Asia/Tokyo': 'tokyo.png',
        'Asia/Kolkata': 'taj_mahal.png'
    };

    const timezoneLabels = {
        'local': { title: 'Local Time', tz: 'Your Location' },
        'America/New_York': { title: 'New York Time', tz: 'EST / EDT' },
        'Europe/London': { title: 'London Time', tz: 'GMT / BST' },
        'Asia/Tokyo': { title: 'Tokyo Time', tz: 'JST' },
        'Asia/Kolkata': { title: 'New Delhi Time', tz: 'IST' }
    };

    if (mainTzSelector) {
        mainTzSelector.addEventListener('change', (e) => {
            clockState.mainTz = e.target.value;
            const localTitle = document.getElementById('local-title');
            const localTzLabel = document.getElementById('local-tz-label');
            const mainClockBanner = document.querySelector('.main-clock-section .clock-banner');
            
            const labels = timezoneLabels[clockState.mainTz];
            if (localTitle) localTitle.textContent = labels.title;
            if (localTzLabel) localTzLabel.textContent = labels.tz;
            if (mainClockBanner) {
                mainClockBanner.style.backgroundImage = `url('${bannerImages[clockState.mainTz]}')`;
            }
        });
    }

    if (handMovementBtn) {
        handMovementBtn.addEventListener('click', () => {
            clockState.isSweeping = !clockState.isSweeping;
            handMovementBtn.classList.toggle('active', clockState.isSweeping);
            handMovementBtn.textContent = clockState.isSweeping ? 'Sweeping' : 'Ticking';
        });
    }

    // ----------------------------------------------------
    // 2. Programmatic Clock Ticks Generator
    // ----------------------------------------------------
    function generateTicks() {
        const clockFaces = document.querySelectorAll('.clock-face');
        clockFaces.forEach(face => {
            const existingTicks = face.querySelectorAll('.tick');
            existingTicks.forEach(tick => tick.remove());
            for (let i = 0; i < 12; i++) {
                const tick = document.createElement('div');
                tick.classList.add('tick');
                if (i % 3 === 0) {
                    tick.classList.add('major');
                }
                tick.style.transform = `rotate(${i * 30}deg)`;
                face.appendChild(tick);
            }
        });
    }

    generateTicks();

    // ----------------------------------------------------
    // 3. Dynamic Timezone Offsets Engine
    // ----------------------------------------------------
    const offsets = {
        ny: 0,
        london: 0,
        tokyo: 0,
        kolkata: 0
    };

    function calculateTimezoneOffset(timeZone) {
        const now = new Date();
        try {
            const tzString = now.toLocaleString("en-US", { timeZone, hour12: false });
            const localString = now.toLocaleString("en-US", { hour12: false });
            
            const tzDate = new Date(tzString);
            const localDate = new Date(localString);
            
            return tzDate.getTime() - localDate.getTime();
        } catch (error) {
            console.error(`Error computing offset for ${timeZone}:`, error);
            return 0;
        }
    }

    function refreshOffsets() {
        offsets.ny = calculateTimezoneOffset('America/New_York');
        offsets.london = calculateTimezoneOffset('Europe/London');
        offsets.tokyo = calculateTimezoneOffset('Asia/Tokyo');
        offsets.kolkata = calculateTimezoneOffset('Asia/Kolkata');
    }

    refreshOffsets();
    setInterval(refreshOffsets, 60000);

    // ----------------------------------------------------
    // 4. High-Performance 60 FPS Sweep / Tick Animation Loop
    // ----------------------------------------------------
    function animateClocks() {
        const now = new Date();
        const localMs = now.getMilliseconds();
        
        clocks.forEach(clock => {
            let hr, min, sec;
            let displayHr, displayMin, displaySec;
            let dateText;

            if (clock.id === 'local') {
                let targetTime = now;
                if (clockState.mainTz !== 'local') {
                    const offset = clockState.mainTz === 'America/New_York' ? offsets.ny :
                                   clockState.mainTz === 'Europe/London' ? offsets.london :
                                   clockState.mainTz === 'Asia/Tokyo' ? offsets.tokyo :
                                   clockState.mainTz === 'Asia/Kolkata' ? offsets.kolkata : 0;
                    targetTime = new Date(now.getTime() + offset);
                }
                const ms = targetTime.getMilliseconds();
                displayHr = targetTime.getHours();
                displayMin = targetTime.getMinutes();
                displaySec = targetTime.getSeconds();

                sec = clockState.isSweeping ? (displaySec + ms / 1000) : displaySec;
                min = displayMin + sec / 60;
                hr = (displayHr % 12) + min / 60;
                
                dateText = targetTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

                // Update Ambient Backlight dynamically based on centerpiece timezone hour!
                const ambient = document.getElementById('local-ambient-backlight');
                if (ambient) {
                    if (displayHr >= 6 && displayHr < 18) {
                        ambient.style.background = 'rgba(251, 191, 36, 0.4)'; // Gold daytime
                    } else {
                        ambient.style.background = 'rgba(99, 102, 241, 0.5)'; // Indigo nighttime
                    }
                }
            } else {
                const offset = offsets[clock.id] || 0;
                const targetTime = new Date(now.getTime() + offset);
                const ms = targetTime.getMilliseconds();

                displayHr = targetTime.getHours();
                displayMin = targetTime.getMinutes();
                displaySec = targetTime.getSeconds();

                sec = clockState.isSweeping ? (displaySec + ms / 1000) : displaySec;
                min = displayMin + sec / 60;
                hr = (displayHr % 12) + min / 60;
                
                dateText = targetTime.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
            }

            const hRotation = hr * 30;
            const mRotation = min * 6;
            const sRotation = sec * 6;

            if (clock.hourHand) clock.hourHand.style.transform = `rotate(${hRotation}deg)`;
            if (clock.minuteHand) clock.minuteHand.style.transform = `rotate(${mRotation}deg)`;
            if (clock.secondHand) clock.secondHand.style.transform = `rotate(${sRotation}deg)`;

            if (clock.digital) {
                const padH = String(displayHr).padStart(2, '0');
                const padM = String(displayMin).padStart(2, '0');
                const padS = String(displaySec).padStart(2, '0');
                clock.digital.textContent = `${padH}:${padM}:${padS}`;
            }

            if (clock.date && clock.date.textContent !== dateText) {
                clock.date.textContent = dateText;
            }
        });

        requestAnimationFrame(animateClocks);
    }

    requestAnimationFrame(animateClocks);

    // ----------------------------------------------------
    // 5. Light/Dark Neumorphic Theme Toggle System
    // Supports LocalStorage state and System prefers-color-scheme
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    function updateThemeUI(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.body.classList.remove('dark-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = (savedTheme === 'dark') || (!savedTheme && systemPrefersDark);
        updateThemeUI(isDark);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const willBeDark = !document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
            updateThemeUI(willBeDark);
        });
    }

    initTheme();

    // ----------------------------------------------------
    // 6. Refactored Countdown Timer Engine
    // Clean state transitions with neat UI interactions
    // ----------------------------------------------------
    let countdownInterval = null;
    let countdownTime = 0; // remaining time in seconds
    let isPaused = false;

    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const timerUpMsg = document.getElementById('timerUpMsg');
    const timerSound = document.getElementById('timerSound');
    const pausebtn = document.getElementById('pausebtn');

    window.startCountdown = function() {
        // Stop any running timer
        clearInterval(countdownInterval);
        timerUpMsg.style.display = 'none';
        
        // Load inputs
        let h = parseInt(hoursInput.value) || 0;
        let m = parseInt(minutesInput.value) || 0;
        let s = parseInt(secondsInput.value) || 0;

        // Validation bounds
        h = Math.max(0, Math.min(23, h));
        m = Math.max(0, Math.min(59, m));
        s = Math.max(0, Math.min(59, s));

        // Sync bounded values back to input fields
        hoursInput.value = h > 0 ? h : '';
        minutesInput.value = m > 0 ? m : '';
        secondsInput.value = s > 0 ? s : '';

        countdownTime = (h * 3600) + (m * 60) + s;

        if (countdownTime <= 0) {
            alert('Please specify a duration greater than 0 seconds.');
            return;
        }

        isPaused = false;
        pausebtn.innerText = 'Pause';
        
        updateTimerDisplay();
        tickCountdown();
    };

    function tickCountdown() {
    updateTimerDisplay();

    countdownInterval = setInterval(() => {
        if (countdownTime <= 0) {
            triggerTimerFinished();
        } else {
            countdownTime--;
            updateTimerDisplay();
        }
    }, 1000);
}
    

    function updateTimerDisplay() {
        const leftH = Math.floor(countdownTime / 3600);
        const leftM = Math.floor((countdownTime % 3600) / 60);
        const leftS = countdownTime % 60;

        const padH = String(leftH).padStart(2, '0');
        const padM = String(leftM).padStart(2, '0');
        const padS = String(leftS).padStart(2, '0');
        countdownDisplay.textContent = `${padH}:${padM}:${padS}`;
    }

    function triggerTimerFinished() {
        clearInterval(countdownInterval);
        timerUpMsg.style.display = 'flex';
        
        // Play audio alarm safely
        if (timerSound) {
            timerSound.currentTime = 0;
            timerSound.play().catch(e => console.log('Audio playback prevented by browser auto-play policy.', e));
        }

        countdownDisplay.textContent = '00:00:00';
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
        pausebtn.innerText = 'Pause';
        isPaused = false;
    }


    window.pauseCountdown = function() {
        if (countdownTime <= 0) return;

        if (!isPaused) {
            clearInterval(countdownInterval);
            pausebtn.innerText = 'Resume';
            isPaused = true;
        } else {
            pausebtn.innerText = 'Pause';
            isPaused = false;
            tickCountdown();
        }
    };

    window.restartCountdown = function() {
        clearInterval(countdownInterval);
        countdownTime = 0;
        countdownDisplay.textContent = '00:00:00';

        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';

        pausebtn.innerText = 'Pause';
        isPaused = false;
        timerUpMsg.style.display = 'none';

        if (timerSound) {
            timerSound.pause();
            timerSound.currentTime = 0;
        }
    };

});