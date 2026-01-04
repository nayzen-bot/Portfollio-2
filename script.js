const i18n = {
    fr: {
        nav_home: "Accueil",
        nav_projects: "Projets",
        nav_skills: "Compétences",
        nav_connect: "Connecter",
        hero_subtitle: "Créateur de Projets Interactifs & Explorateur Digital",
        major_project_title: "PROJET MAJEUR",
        db_searcher_name: "Database Searcher",
        db_searcher_desc: "Moteur de recherche massif capable d'indexer des données à travers des centaines de bases de données simultanément.",
        trade_title: "Trade & Exchange",
        trade_desc: "Ouvert aux échanges de bases de données de haute qualité.",
        projects_title: "Mes Créations",
        interests_title: "Centres d’intérêt",
        gaming_title: "Gaming & Interactif",
        gaming_desc: "Jeux vidéo et projets interactifs immersifs.",
        anime_title: "Top 5 Anime",
        skills_title: "Compétences Techniques",
        languages_title: "Langages & Frameworks",
        skills_expert: "<strong>Expertise :</strong> Spécialisé dans le développement fullstack moderne et les outils d'automatisation complexes.",
        connect_title: "Me Contacter",
        footer_copy: "&copy; 2026 User91w. Fait avec passion. Accès Autorisé."
    },
    en: {
        nav_home: "Home",
        nav_projects: "Projects",
        nav_skills: "Skills",
        nav_connect: "Connect",
        hero_subtitle: "Interactive Project Creator & Digital Explorer",
        major_project_title: "MAJOR PROJECT",
        db_searcher_name: "Database Searcher",
        db_searcher_desc: "Massive search engine capable of indexing data across hundreds of databases simultaneously.",
        trade_title: "Trade & Exchange",
        trade_desc: "Open to high-quality database trades and exchanges.",
        projects_title: "My Portfolio",
        interests_title: "Areas of Interest",
        gaming_title: "Gaming & Interactive",
        gaming_desc: "Immersive video games and interactive digital projects.",
        anime_title: "Top 5 Anime",
        skills_title: "Technical Expertise",
        languages_title: "Languages & Frameworks",
        skills_expert: "<strong>Expertise:</strong> Specialized in modern fullstack development and complex automation tools.",
        connect_title: "Connect With Me",
        footer_copy: "&copy; 2026 User91w. Built with passion. Authorized Access."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const userId = '1448766908445753354';
    const statusDot = document.getElementById('discord-status-dot');
    const nameEl = document.getElementById('discord-name');
    const tagEl = document.getElementById('discord-tag');
    const avatarImg = document.getElementById('discord-avatar');
    const customStatusEl = document.getElementById('discord-custom-status');
    const activitiesEl = document.getElementById('discord-activities');

    function updateDiscordStatus() {
        fetch(`https://api.lanyard.rest/v1/users/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const user = data.data;

                    nameEl.textContent = user.discord_user.global_name || user.discord_user.username;
                    tagEl.textContent = `#${user.discord_user.discriminator}`;
                    avatarImg.src = `https://cdn.discordapp.com/avatars/${userId}/${user.discord_user.avatar}.png?size=128`;
                    statusDot.className = 'status-dot-large ' + user.discord_status;

                    const customStatus = user.activities.find(a => a.type === 4);
                    customStatusEl.textContent = customStatus ? (customStatus.state || customStatus.name) : 'No status set';

                    activitiesEl.innerHTML = '';

                    if (user.listening_to_spotify) {
                        const spotify = user.spotify;
                        const spotifyHTML = `
                            <div class="activity-card spotify-card">
                                <div class="activity-assets">
                                    <img src="${spotify.album_art_url}" class="activity-image">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" class="activity-small-image">
                                </div>
                                <div class="activity-details">
                                    <span class="activity-name">${spotify.track}</span>
                                    <span class="activity-state">by ${spotify.artist}</span>
                                    <div class="spotify-bar">
                                        <div class="spotify-progress" id="spotify-progress-bar"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                        activitiesEl.insertAdjacentHTML('beforeend', spotifyHTML);

                        const total = spotify.timestamps.end - spotify.timestamps.start;
                        const current = Date.now() - spotify.timestamps.start;
                        const progress = Math.min(100, (current / total) * 100);
                        setTimeout(() => {
                            const bar = document.getElementById('spotify-progress-bar');
                            if (bar) bar.style.width = progress + '%';
                        }, 100);
                    }

                    user.activities.forEach(activity => {
                        if (activity.type === 4 || activity.name === 'Spotify') return;

                        let assetURL = 'https://canary.discord.com/assets/f04c062885994f1A45.png';
                        if (activity.assets && activity.assets.large_image) {
                            if (activity.assets.large_image.startsWith('mp:external')) {
                                assetURL = activity.assets.large_image.replace(/mp:external\/.*\/(https?:\/\/)/, '$1');
                            } else {
                                assetURL = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                            }
                        }

                        const activityHTML = `
                            <div class="activity-card">
                                <div class="activity-assets">
                                    <img src="${assetURL}" class="activity-image">
                                </div>
                                <div class="activity-details">
                                    <span class="activity-name">${activity.name}</span>
                                    <span class="activity-state">${activity.details || ''}</span>
                                    <span class="activity-state">${activity.state || ''}</span>
                                </div>
                            </div>
                        `;
                        activitiesEl.insertAdjacentHTML('beforeend', activityHTML);
                    });
                }
            })
            .catch(err => console.error('Lanyard error:', err));
    }
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 15000);

    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 157, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 150; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw();
            particlesArray[i].update();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        const translations = i18n[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
    }

    async function detectLanguage() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const lang = data.country_code === 'FR' ? 'fr' : 'en';
            applyLanguage(lang);
        } catch (error) {
            applyLanguage('en');
        }
    }
    detectLanguage();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .skill-category, .social-btn, .section-title, .searcher-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    document.addEventListener('mousemove', e => {
        const glow = document.querySelector('.glow-overlay');
        if (glow) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }
    });
});
