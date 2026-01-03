const i18n = {
    fr: {
        nav_home: "Accueil",
        nav_interests: "Intérêts",
        nav_skills: "Compétences",
        nav_connect: "Connecter",
        hero_subtitle: "Créateur de Projets Interactifs & Explorateur Digital",
        interests_title: "Centres d’intérêt",
        gaming_title: "Gaming & Interactif",
        gaming_desc: "Jeux vidéo et projets interactifs immersifs.",
        anime_title: "Top 5 Anime",
        discord_title: "Communauté Discord",
        discord_desc: "Exploration et participation active aux communautés.",
        skills_title: "Compétences Techniques",
        languages_title: "Langages",
        skills_expert: "<strong>Expertise :</strong> Très expérimenté dans le développement de scripts, interfaces et systèmes interactifs avancés.",
        connect_title: "Me Contacter",
        footer_copy: "&copy; 2026 User91w. Fait avec passion. Accès Autorisé."
    },
    en: {
        nav_home: "Home",
        nav_interests: "Interests",
        nav_skills: "Skills",
        nav_connect: "Connect",
        hero_subtitle: "Interactive Project Creator & Digital Explorer",
        interests_title: "Areas of Interest",
        gaming_title: "Gaming & Interactive",
        gaming_desc: "Immersive video games and interactive digital projects.",
        anime_title: "Top 5 Anime",
        discord_title: "Discord Community",
        discord_desc: "Active exploration and participation in diverse digital communities.",
        skills_title: "Technical Expertise",
        languages_title: "Languages",
        skills_expert: "<strong>Expertise:</strong> Highly proficient in developing advanced scripts, interfaces, and interactive systems.",
        connect_title: "Connect With Me",
        footer_copy: "&copy; 2026 User91w. Built with energy. Authorized Access."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Language Detection
    async function detectLanguage() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const lang = data.country_code === 'FR' ? 'fr' : 'en';
            applyLanguage(lang);
        } catch (error) {
            console.error('Language detection failed, defaulting to English.');
            applyLanguage('en');
        }
    }

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

    detectLanguage();

    // --- ANTI-SKID PROTECTION ---
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = e => {
        if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && [73, 67, 74].includes(e.keyCode)) || (e.ctrlKey && e.keyCode == 85)) {
            return false;
        }
    };

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .skill-category, .social-btn, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // Mouse glow effect
    document.addEventListener('mousemove', e => {
        const glow = document.querySelector('.glow-overlay');
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
});
