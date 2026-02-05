document.addEventListener('DOMContentLoaded', () => {
    // Lanyard désactivé par demande utilisateur
    /*
    const userId = '1448766908445753354';
    const statusDot = document.getElementById('discord-status-dot');
    const nameEl = document.getElementById('discord-name');
    const avatarImg = document.getElementById('discord-avatar');
    const avatarSmall = document.getElementById('discord-avatar-small');
    const customStatusEl = document.getElementById('discord-custom-status');
    const activitiesEl = document.getElementById('discord-activities');
    
    function updateDiscordStatus() {
        // Utilisation du proxy CORS pour éviter les blocages
        fetch(`https://corsproxy.io/?` + encodeURIComponent(`https://api.lanyard.rest/v1/users/${userId}`))
            .then(response => response.json())
            .then(data => {
                // Lanyard renvoie parfois data directement ou data.data selon le proxy, adaptations si besoin
                // Mais avec corsproxy c'est transparent.
                if (data.success) {
                    const user = data.data;
    
                    nameEl.textContent = user.discord_user.global_name || user.discord_user.username;
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${user.discord_user.avatar}.png?size=256`;
                    avatarImg.src = avatarUrl;
                    avatarSmall.src = avatarUrl;
                    statusDot.className = 'status-dot-large ' + user.discord_status;
    
                    const customStatus = user.activities.find(a => a.type === 4);
                    customStatusEl.textContent = customStatus ? (customStatus.state || customStatus.name) : 'Pas de status';
    
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
                                    <span class="activity-state">par ${spotify.artist}</span>
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
            .catch(err => console.error('Erreur Lanyard:', err));
    }
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 15000);
    */

    // Fonction pour récupérer l'IP et afficher le statut (indépendant)

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .skill-category, .social-btn, .section-title, .poll-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
});

// Fonction pour le sondage avec webhook Discord
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1469018106931183691/6GAfbsq6PU9VAPmf51tLwMG0bTaXiG89NhowfZgT0iYamgH_TqaIfsIwmOIXs50SYurJ';
let userIP = null;
let hasVoted = false;

// Récupérer l'IP de l'utilisateur au chargement de la page
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        userIP = data.ip;

        // Vérifier si cette IP a déjà voté (stocké dans localStorage)
        const votedIPs = JSON.parse(localStorage.getItem('votedIPs') || '[]');
        if (votedIPs.includes(userIP)) {
            hasVoted = true;
            document.getElementById('poll-results').innerHTML = '<p style="color: #888;">Tu as déjà voté depuis cette adresse IP !</p>';
            document.querySelectorAll('.poll-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'IP:', error);
        userIP = 'unknown';
    }
}

// Appeler la fonction au chargement
getUserIP();

async function vote(choice) {
    if (hasVoted) {
        alert('Tu as déjà voté !');
        return;
    }

    if (!userIP) {
        alert('Erreur : impossible de vérifier ton IP. Réessaie dans quelques secondes.');
        return;
    }

    hasVoted = true;
    const resultsDiv = document.getElementById('poll-results');

    // Préparer le message Discord
    const voteText = choice === 'yes' ? '✅ Ouais je suis chaud !' : '❌ Pas intéressé';
    const embedColor = choice === 'yes' ? 0xFFD700 : 0x888888;

    const webhookData = {
        embeds: [{
            title: '🔥 Nouveau Vote - Sondage 1:1',
            description: `**Vote:** ${voteText}\n**IP:** ${userIP}`,
            color: embedColor,
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Portfolio sayrojin_'
            }
        }]
    };

    try {
        // Envoyer au webhook Discord via un proxy CORS pour éviter le blocage
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(WEBHOOK_URL);

        await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
        });

        // Stocker l'IP dans localStorage
        const votedIPs = JSON.parse(localStorage.getItem('votedIPs') || '[]');
        votedIPs.push(userIP);
        localStorage.setItem('votedIPs', JSON.stringify(votedIPs));

        // Afficher le message de confirmation
        if (choice === 'yes') {
            resultsDiv.innerHTML = '<p style="color: var(--gold); font-weight: 700; font-size: 1.2rem;">🔥 Merci pour ton soutien ! Reste connecté sur le Discord pour les updates !</p>';
        } else {
            resultsDiv.innerHTML = '<p style="color: #888;">Pas de souci, merci d\'avoir participé !</p>';
        }

        // Désactiver les boutons
        document.querySelectorAll('.poll-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du vote:', error);
        alert('Erreur lors de l\'envoi du vote. Vérifie ta connexion et réessaie.');
        hasVoted = false;
    }
}
