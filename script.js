// ============================================
// WELLBEING RESOURCES - INTERACTIVE JAVASCRIPT
// Self-Care Tracker & Mood Checker: ONLY on Resources page
// Other features: Work on all pages
// ============================================

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wellbeing Resources page loaded! 🌟');
    
    // Check which page we're on
    const currentPage = getCurrentPage();
    console.log(`Current page: ${currentPage}`);
    
    // ============================================
    // FEATURES THAT WORK ON ALL PAGES
    // ============================================
    initializeBackToTop();      // Back to top button
    showWelcomeMessage();       // Welcome toast message
    
    // ============================================
    // FEATURES ONLY FOR RESOURCES PAGE
    // ============================================
    if (currentPage === 'resources' || currentPage === 'index') {
        console.log('✅ Resources page detected - Loading Self-Care Tracker and Mood Checker');
        
        // Resources page specific features
        initializeResourceInteractions();  // Clickable cards
        initializeSearchFeature();          // Search bar
        initializeWellbeingTip();           // Daily tip banner
        initializeProgressTracker();        // SELF-CARE TRACKER (ONLY HERE)
        initializeMoodChecker();             // MOOD CHECKER (ONLY HERE)
        addResourceCounters();               // Resource counter
    } else {
        console.log('❌ Not on Resources page - Self-Care Tracker and Mood Checker will NOT appear');
    }
    
    // Page-specific placeholders for other pages
    if (currentPage === 'tips') {
        console.log('Tips page - No tracker or mood checker');
    } else if (currentPage === 'help') {
        console.log('Help page - No tracker or mood checker');
    }
});

// ============================================
// DETECT CURRENT PAGE
// ============================================

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'index.html' || filename === '' || filename === '/') {
        return 'index';
    } else if (filename === 'resources.html') {
        return 'resources';
    } else if (filename === 'tips.html') {
        return 'tips';
    } else if (filename === 'help.html') {
        return 'help';
    }
    return 'index';
}

// ============================================
// SELF-CARE TRACKER (ONLY ON RESOURCES PAGE)
// ============================================

function initializeProgressTracker() {
    // CRITICAL: Double check we're on resources page
    const currentPage = getCurrentPage();
    if (currentPage !== 'index' && currentPage !== 'resources') {
        console.log('🚫 Self-Care Tracker blocked - Not on Resources page');
        return;
    }
    
    // Check if tracker already exists
    if (document.querySelector('.tracker-section')) {
        console.log('Self-Care Tracker already exists');
        return;
    }
    
    const main = document.querySelector('main');
    if (!main) {
        console.log('Main element not found');
        return;
    }
    
    console.log('✅ Adding Self-Care Tracker to Resources page');
    
    const checklist = [
        "I got enough sleep last night",
        "I ate a healthy meal today",
        "I moved my body (walked, stretched, exercised)",
        "I connected with someone",
        "I took time for myself",
        "I drank enough water",
        "I did something I enjoy"
    ];
    
    // Create tracker section
    const trackerSection = document.createElement('section');
    trackerSection.className = 'tracker-section';
    trackerSection.style.cssText = `
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 25px;
        border-radius: 15px;
        margin: 30px 0;
        border: 1px solid #ddd;
    `;
    
    trackerSection.innerHTML = `
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Today's Self-Care Tracker</h3>
        <div id="checklist">
            ${checklist.map((item, index) => `
                <div style="
                    margin: 10px 0;
                    padding: 10px;
                    background: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                ">
                    <input type="checkbox" id="check${index}" style="
                        width: 20px;
                        height: 20px;
                        margin-right: 15px;
                        cursor: pointer;
                    ">
                    <label for="check${index}" style="
                        flex: 1;
                        cursor: pointer;
                        font-size: 16px;
                        color: #555;
                    ">${item}</label>
                </div>
            `).join('')}
        </div>
        <div style="
            margin-top: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            text-align: center;
        ">
            <div style="font-size: 24px; font-weight: bold; color: #3498db;" id="progressPercent">0%</div>
            <div style="font-size: 14px; color: #7f8c8d;">Self-care completed today</div>
            <button id="resetTracker" style="
                margin-top: 10px;
                padding: 8px 16px;
                background: #95a5a6;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Reset All</button>
        </div>
    `;
    
    main.appendChild(trackerSection);
    
    // Initialize tracker functionality
    const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    const progressSpan = document.getElementById('progressPercent');
    const resetBtn = document.getElementById('resetTracker');
    
    function updateProgress() {
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percent = Math.round((checked / total) * 100);
        progressSpan.textContent = `${percent}%`;
        
        if (percent === 100) {
            progressSpan.style.color = '#27ae60';
            showConfetti();
        } else if (percent >= 50) {
            progressSpan.style.color = '#f39c12';
        } else {
            progressSpan.style.color = '#e74c3c';
        }
        
        // Save to localStorage
        const savedState = Array.from(checkboxes).map(cb => cb.checked);
        localStorage.setItem('wellbeingChecklist', JSON.stringify(savedState));
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
    
    resetBtn.addEventListener('click', () => {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateProgress();
    });
    
    // Load saved progress
    const savedProgress = localStorage.getItem('wellbeingChecklist');
    if (savedProgress) {
        const savedState = JSON.parse(savedProgress);
        checkboxes.forEach((checkbox, index) => {
            if (savedState[index]) {
                checkbox.checked = true;
            }
        });
        updateProgress();
    }
}

// ============================================
// MOOD CHECKER (ONLY ON RESOURCES PAGE)
// ============================================

function initializeMoodChecker() {
    // CRITICAL: Double check we're on resources page
    const currentPage = getCurrentPage();
    if (currentPage !== 'index' && currentPage !== 'resources') {
        console.log('🚫 Mood Checker blocked - Not on Resources page');
        return;
    }
    
    // Check if mood checker already exists
    if (document.querySelector('.mood-section')) {
        console.log('Mood Checker already exists');
        return;
    }
    
    const main = document.querySelector('main');
    if (!main) {
        console.log('Main element not found');
        return;
    }
    
    console.log('✅ Adding Mood Checker to Resources page');
    
    const moodSection = document.createElement('section');
    moodSection.className = 'mood-section';
    moodSection.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
    `;
    
    moodSection.innerHTML = `
        <h3 style="color: #2c3e50; margin-bottom: 15px;">😊 How are you feeling today?</h3>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button class="mood-btn" data-mood="great">😁 Great</button>
            <button class="mood-btn" data-mood="good">🙂 Good</button>
            <button class="mood-btn" data-mood="okay">😐 Okay</button>
            <button class="mood-btn" data-mood="stressed">😰 Stressed</button>
            <button class="mood-btn" data-mood="tired">😴 Tired</button>
        </div>
        <div id="moodMessage" style="margin-top: 15px; font-size: 14px; color: #7f8c8d; min-height: 50px;"></div>
    `;
    
    // Add mood styles
    if (!document.getElementById('moodButtonStyles')) {
        const style = document.createElement('style');
        style.id = 'moodButtonStyles';
        style.textContent = `
            .mood-btn {
                padding: 10px 20px;
                font-size: 16px;
                border: 2px solid #ddd;
                border-radius: 50px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .mood-btn:hover {
                transform: scale(1.05);
                border-color: #3498db;
                background: #f0f8ff;
            }
            .mood-btn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Insert before footer
    const footer = document.querySelector('footer');
    if (footer) {
        main.insertBefore(moodSection, footer);
    } else {
        main.appendChild(moodSection);
    }
    
    // Add click handlers
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodMessage = document.getElementById('moodMessage');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            let message = '';
            
            switch(mood) {
                case 'great':
                    message = '🌟 Wonderful! Keep shining bright today!';
                    break;
                case 'good':
                    message = '👍 That\'s great to hear! Have an amazing day!';
                    break;
                case 'okay':
                    message = '💪 It\'s okay to feel okay. Remember to be kind to yourself.';
                    break;
                case 'stressed':
                    message = '🧘 Take a deep breath. You\'ve got this. Consider taking a short break.';
                    break;
                case 'tired':
                    message = '😴 Rest is important! Listen to your body and take a nap if you can.';
                    break;
            }
            
            moodMessage.innerHTML = message;
            moodMessage.style.animation = 'fadeIn 0.5s ease';
            
            // Save to localStorage
            const today = new Date().toDateString();
            const moodData = JSON.parse(localStorage.getItem('moodHistory') || '{}');
            moodData[today] = mood;
            localStorage.setItem('moodHistory', JSON.stringify(moodData));
            
            console.log(`Mood saved for ${today}: ${mood}`);
        });
    });
}

// ============================================
// BACK TO TOP BUTTON (All Pages)
// ============================================

function initializeBackToTop() {
    if (document.getElementById('backToTopBtn')) return;
    
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTopBtn';
    backToTop.innerHTML = '⬆️ Top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 12px 18px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        display: none;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
}

// ============================================
// WELCOME MESSAGE (All Pages)
// ============================================

function showWelcomeMessage() {
    if (sessionStorage.getItem('welcomeShown')) return;
    
    const hour = new Date().getHours();
    let greeting = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
    
    const toast = document.createElement('div');
    toast.textContent = `${greeting}! Take care of your wellbeing today 💙`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        animation: slideInRight 0.5s ease;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
    
    sessionStorage.setItem('welcomeShown', 'true');
}

// ============================================
// RESOURCE INTERACTIONS (Resources Page)
// ============================================

function initializeResourceInteractions() {
    const resources = document.querySelectorAll('.resource');
    if (resources.length === 0) return;
    
    resources.forEach(resource => {
        resource.style.cursor = 'pointer';
        resource.style.transition = 'all 0.3s ease';
        
        resource.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        });
        
        resource.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
        
        resource.addEventListener('click', function() {
            const title = this.querySelector('h2').innerText;
            const description = this.querySelector('p').innerText;
            alert(`📚 ${title}\n\n${description}`);
        });
    });
}

// ============================================
// SEARCH FEATURE (Resources Page)
// ============================================

function initializeSearchFeature() {
    if (document.getElementById('searchInput')) return;
    
    const main = document.querySelector('main');
    if (!main) return;
    
    const searchSection = document.createElement('section');
    searchSection.style.cssText = `
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 30px;
        text-align: center;
    `;
    
    searchSection.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #2c3e50;">🔍 Find Resources</h3>
        <input type="text" id="searchInput" placeholder="Search for physical, emotional, diet, gym, relationships..." style="
            width: 100%;
            max-width: 400px;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        ">
        <div id="searchCount" style="margin-top: 10px; font-size: 14px; color: #7f8c8d;"></div>
    `;
    
    const firstResource = document.querySelector('.resource');
    if (firstResource) {
        main.insertBefore(searchSection, firstResource);
    }
    
    const searchInput = document.getElementById('searchInput');
    const resources = document.querySelectorAll('.resource');
    const searchCount = document.getElementById('searchCount');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let visibleCount = 0;
        
        resources.forEach(resource => {
            const title = resource.querySelector('h2').innerText.toLowerCase();
            const text = resource.querySelector('p').innerText.toLowerCase();
            
            if (title.includes(searchTerm) || text.includes(searchTerm)) {
                resource.style.display = 'block';
                visibleCount++;
            } else if (searchTerm === '') {
                resource.style.display = 'block';
                visibleCount = resources.length;
            } else {
                resource.style.display = 'none';
            }
        });
        
        searchCount.textContent = searchTerm === '' ? 
            `Showing all ${visibleCount} resources` : 
            `Found ${visibleCount} resource(s) matching "${searchTerm}"`;
    });
}

// ============================================
// DAILY TIP (Resources Page)
// ============================================

function initializeWellbeingTip() {
    if (document.querySelector('.tip-banner')) return;
    
    const main = document.querySelector('main');
    if (!main) return;
    
    const tips = [
        "💧 Drink a glass of water right now - hydration boosts focus!",
        "🧘 Take 5 deep breaths. Inhale peace, exhale stress.",
        "📝 Write down 3 things you're grateful for today.",
        "🚶 Take a 10-minute walk between study sessions.",
        "😴 Aim for 7-9 hours of sleep tonight."
    ];
    
    const tipBanner = document.createElement('div');
    tipBanner.className = 'tip-banner';
    tipBanner.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 30px;
        text-align: center;
        cursor: pointer;
    `;
    
    tipBanner.innerHTML = `
        <strong>✨ Daily Wellbeing Tip ✨</strong><br>
        <span id="dailyTip">${tips[Math.floor(Math.random() * tips.length)]}</span>
        <div style="margin-top: 8px; font-size: 12px;">Click for another tip →</div>
    `;
    
    const firstResource = document.querySelector('.resource');
    if (firstResource) {
        main.insertBefore(tipBanner, firstResource);
    }
    
    tipBanner.addEventListener('click', function() {
        const newTip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('dailyTip').textContent = newTip;
    });
}

// ============================================
// RESOURCE COUNTER (Resources Page)
// ============================================

function addResourceCounters() {
    const resourceCount = document.querySelectorAll('.resource').length;
    const footer = document.querySelector('footer');
    
    if (footer && !document.querySelector('.resource-counter')) {
        const counterDiv = document.createElement('div');
        counterDiv.className = 'resource-counter';
        counterDiv.style.cssText = `margin-top: 15px; font-size: 14px; color: #bdc3c7;`;
        counterDiv.innerHTML = `📚 ${resourceCount} wellbeing resources available`;
        footer.appendChild(counterDiv);
    }
}

// ============================================
// CONFETTI EFFECT
// ============================================

function showConfetti() {
    const colors = ['#ff4757', '#ffa502', '#ff6b81', '#7bed9f', '#70a1ff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: fall ${Math.random() * 2 + 2}s linear forwards;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// ============================================
// CSS ANIMATIONS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    .resource { animation: fadeIn 0.6s ease; }
`;
document.head.appendChild(style);

console.log('✅ JavaScript loaded - Self-Care Tracker and Mood Checker ONLY on Resources page');