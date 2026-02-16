/**
 * PIERRE MICHAUD — PORTFOLIO JS 
 * Logique d'interaction et d'harmonie visuelle
 */

// Note: L'initialisation globale est gérée à la fin du fichier (section 11)

/**
 * 1. INITIALISATION DU MARQUEE INFINI
 * Duplique le contenu du track pour créer une boucle sans coupure.
 */
function initMarquee() {
    const track = document.querySelector('.skills-marquee-track');
    if (track) {
        // On clone le contenu une fois pour assurer la continuité visuelle
        const clone = track.innerHTML;
        track.innerHTML += clone;
    }
}

/**
 * 1.5. DÉFILEMENT DES CHIPS AU CLIC
 * Clic à gauche = scroll vers la gauche, clic à droite = scroll vers la droite
 * L'animation s'arrête au clic sur un tag et reprend après 3s d'inactivité
 */
function initChipsScroll() {
    const wrapper = document.querySelector('.skills-marquee-wrapper');
    const track = document.querySelector('.skills-marquee-track');
    
    if (!wrapper || !track) return;
    
    // Ajouter un curseur pointer pour indiquer la clickabilité
    wrapper.style.cursor = 'pointer';
    
    let inactivityTimer = null;
    
    wrapper.addEventListener('click', (e) => {
        // Vérifier si le clic est sur un chip
        const isChipClick = e.target.classList.contains('chip');
        
        const rect = wrapper.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const wrapperWidth = rect.width;
        const scrollAmount = 400; // Distance de défilement en pixels
        
        // Arrêter l'animation SEULEMENT si on clique sur un tag
        if (isChipClick) {
            track.style.animationPlayState = 'paused';
            
            // Annuler le timer précédent
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
            
            // Reprendre l'animation après 3 secondes d'inactivité
            inactivityTimer = setTimeout(() => {
                track.style.animationPlayState = 'running';
            }, 3000);
        }
        
        // Déterminer la direction selon la position du clic
        if (clickX < wrapperWidth / 2) {
            // Clic à gauche : scroll vers la gauche
            wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            // Clic à droite : scroll vers la droite
            wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    });
}

/**
 * 2. EFFET DE SUIVI DE SOURIS (HALO GEMINI)
 * Calcule la position relative de la souris pour animer le gradient radial.
 */
function initPhiHoverEffect() {
    const sections = document.querySelectorAll('.phi-section');
    
    sections.forEach(section => {
        section.addEventListener('mousemove', e => {
            const rect = section.getBoundingClientRect();
            
            // Calcul de la position X et Y en pourcentage à l'intérieur de la section
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Mise à jour des variables CSS lues par le background radial-gradient
            section.style.setProperty('--mouse-x', `${x}%`);
            section.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

/**
 * 3. GESTION DES MODALES PROJETS
 */

// Ouvre la modale et injecte le contenu du template correspondant
function openProject(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const template = document.getElementById('content-' + projectId);

    if (template && modalBody) {
        // Injection du HTML propre au projet
        modalBody.innerHTML = template.innerHTML;
        
        // Activation de la modale (déclenche l'animation CSS)
        modal.classList.add('active');
        
        // Bloque le scroll de la page principale pour une meilleure UX
        document.body.style.overflow = 'hidden';
        
        // Remonte le scroll de la modale tout en haut
        modalBody.scrollTop = 0;
    }
}

// Ferme la modale
function closeProject() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        
        // On attend la fin de l'animation de sortie (600ms dans le CSS) 
        // avant de rendre le scroll à la page principale
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 600);
    }
}

/**
 * 4. GESTION DU CHAT (TOGGLE)
 */
function toggleChatModal() {
    const chatModal = document.getElementById('chat-modal');
    if (chatModal) {
        const isActive = chatModal.classList.toggle('active');
        // Bloque le scroll si le chat est ouvert
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
}

/**
 * 5. ACCESSIBILITÉ & CLAVIER
 */
document.addEventListener('keydown', (e) => {
    // Fermeture globale avec la touche Échap
    if (e.key === 'Escape') {
        closeProject();
        
        const chatModal = document.getElementById('chat-modal');
        if (chatModal && chatModal.classList.contains('active')) {
            toggleChatModal();
        }
    }
});

/**
 * 6. LOGIQUE D'ENVOI DU CHAT (FACULTATIF/DÉMO)
 */
const chatForm = document.querySelector('.chat-input-area');
if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = chatForm.querySelector('.chat-input');
        if (input.value.trim() !== "") {
            // Ici, vous pourriez ajouter une logique d'envoi réelle (API)
            input.value = "";
            alert("Message envoyé ! Pierre vous répondra bientôt.");
        }
    });
}

/* =========================================
   PREMIUM INTERACTIONS (GSAP + LENIS + CURSOR)
   ========================================= */

/**
 * 8. LENIS SMOOTH SCROLL
 * Défilement ultra-fluide et organique basé sur le nombre d'or
 */
function initLenisScroll() {
    // Vérifier que Lenis est chargé
    if (typeof Lenis === 'undefined') {
        console.warn('⚠️ Lenis not loaded, skipping smooth scroll');
        return;
    }

    console.log('🎯 Initializing Lenis smooth scroll...');

    const lenis = new Lenis({
        duration: 1.618, // Durée basée sur phi
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing exponentiel
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    });

    // Synchronisation avec GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
    }

    // Animation loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose globalement pour les contrôles
    window.lenis = lenis;
    
    console.log('✓ Lenis smooth scroll initialized');
}

/**
 * 9. GSAP SCROLL ANIMATIONS
 * Animations basées sur le Nombre d'Or (34px de décalage Fibonacci)
 */
function initGSAPAnimations() {
    // Vérifier que GSAP est chargé
    if (typeof gsap === 'undefined') {
        console.warn('⚠️ GSAP not loaded, skipping scroll animations');
        return;
    }

    console.log('🎯 Initializing GSAP scroll animations...');

    // Configuration globale GSAP
    gsap.config({ 
        nullTargetWarn: false,
        trialWarn: false 
    });

    // Enregistrement du plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.warn('⚠️ ScrollTrigger not loaded');
        return;
    }

    // Animation des titres (H1, H2) - Rapide et dynamique
    const titles = document.querySelectorAll('h1, h2, .hero-title, .case-title, .case-heading');
    titles.forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 95%',  // Déclenche dès l'entrée dans le viewport
                toggleActions: 'play none none none',
            },
            y: 21,  // Fibonacci - mouvement court et vif
            opacity: 0,
            duration: 0.5,  // Animation rapide
            ease: 'power2.out'  // Easing sec et dynamique
        });
    });

    // Animation des cartes de projets - Effet vague rapide
    const projectCards = document.querySelectorAll('.project-card, .phi-section');
    projectCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 95%',  // Déclenche immédiatement
                toggleActions: 'play none none none',
            },
            y: 21,  // Fibonacci - mouvement subtil
            opacity: 0,
            duration: 0.4,  // Très rapide
            delay: index * 0.05,  // Stagger minimal pour effet vague
            ease: 'expo.out'  // Easing très dynamique
        });
    });

    // Animation des paragraphes - Ultra-subtile et rapide
    const paragraphs = document.querySelectorAll('.case-paragraph, .case-body');
    paragraphs.forEach((p) => {
        gsap.from(p, {
            scrollTrigger: {
                trigger: p,
                start: 'top 95%',  // Déclenche immédiatement
                toggleActions: 'play none none none',
            },
            y: 13,  // Fibonacci - mouvement minimal
            opacity: 0,
            duration: 0.4,  // Rapide
            ease: 'power2.out'
        });
    });
    
    console.log('✓ GSAP scroll animations initialized');
}

/**
 * 10. CUSTOM CURSOR SIMPLIFIÉ
 * Cercle plein avec effet halo au survol
 */
function initCustomCursor() {
    // Détection appareil tactile
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    };

    // Sortie sur mobile/tactile
    if (isTouchDevice()) {
        const cursor = document.getElementById('custom-cursor');
        if (cursor) cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    const cursor = document.getElementById('custom-cursor');
    if (!cursor) {
        console.warn('Custom cursor element not found');
        return;
    }

    // Variables de position pour le lag fluide
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Suivi de la souris
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation avec lag fluide (RequestAnimationFrame)
    function animateCursor() {
        // Lerp (Linear Interpolation) pour le lag
        const lagFactor = 0.15; // Facteur de poursuite
        
        cursorX += (mouseX - cursorX) * lagFactor;
        cursorY += (mouseY - cursorY) * lagFactor;

        // Appliquer la position
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // SPOTLIGHT CONSTANT - Pas de changement au survol
    // On supprime les événements hover pour garder le halo uniforme partout
    // Le curseur reste identique sur tous les éléments (liens, images, vide)

    // Visibilité aux bords de la fenêtre
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    console.log('✨ Custom cursor initialized');
}

/**
 * 11. LIGHTBOX POUR IMAGES
 * Affiche les images en plein écran au clic
 */
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-modal');
    lightbox.classList.remove('active');
    
    // Réactiver le scroll du body
    document.body.style.overflow = '';
}

// Fermer la lightbox avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

/**
 * 12. INITIALISATION GLOBALE
 * Démarre tous les systèmes au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    // Fonctions de base
    initMarquee();
    initPhiHoverEffect();
    initChipsScroll();
    
    // Premium interactions
    initLenisScroll();
    initCustomCursor();
    
    // GSAP Animations (après un court délai pour stabilité)
    setTimeout(() => {
        initGSAPAnimations();
    }, 100);
    
    console.log('✨ Portfolio initialized: Base + Premium (Lenis + GSAP + Custom Cursor)');
});
