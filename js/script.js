// ⬆️ FIX DÉFILEMENT : Désactive la restauration de la position par le navigateur
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// ⬆️ FORCE LE SCROLL EN HAUT AU CHARGEMENT/RECHARGEMENT DE LA PAGE
window.onload = function() {
    window.scrollTo(0, 0);
};

// 🌐 Smooth Scroll pour les liens d'ancre (sauf le logo)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e){
    // Le logo a un ID 'logo-link' et est géré séparément pour forcer un rechargement.
    if (this.id !== 'logo-link') {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({behavior:"smooth"});
    }
  });
});

// 🌟 IntersectionObserver pour animations (fadeIn)
const sections = document.querySelectorAll('section, .service-card, .product, .review');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ 
      // Ajout d'un index pour un effet de cascade sur les cartes
      const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 0.05}s`;
      entry.target.classList.add('show'); 
    }
  });
}, {threshold:0.2});
sections.forEach(el => observer.observe(el));


// 🍔 Burger menu toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('header nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('active');
  burger.classList.toggle('toggle');
});

// 📌 GESTION DU LOGO : Clic et Rechargement de la page
const logoLink = document.getElementById('logo-link');

if (logoLink) {
    logoLink.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        // 1. Scroll instantané vers le haut
        window.scrollTo({ top: 0, behavior: 'auto' }); 

        // 2. Déclencher le rechargement de la page
        setTimeout(() => {
            window.location.reload();
        }, 10); 
    });
}


// 📧 EmailJS et Formulaire
const form = document.getElementById('contactForm');

// Fonctionnalité : Pré-remplir l'objet depuis le clic sur les cartes Service
document.addEventListener('DOMContentLoaded', function() {
  const serviceCards = document.querySelectorAll('.service-card:not(.disabled)');

  for (const card of serviceCards) {
    card.addEventListener('click', function() {
      const serviceText = card.textContent.trim().replace(/\s+/g, ' '); 
      form.querySelector('input[name="subject"]').value = `Demande de service : ${serviceText}`;
      
      // Fermer le menu burger sur mobile après la sélection
      if(nav.classList.contains('active')) {
          nav.classList.remove('active');
          burger.classList.remove('toggle');
      }
      
      // Scroll vers la section contact
      window.location.href="#contact"; 
    });
  }
});

// Gestion de l'envoi du formulaire (EmailJS)
form.addEventListener('submit', function(e){
  e.preventDefault();

  // Envoi principal à l'administrateur
  emailjs.sendForm('service_8h66pwb', 'template_al2663e', this)
    .then(() => {
      // Auto-reply au client
      emailjs.send('service_8h66pwb', 'template_7vnnntr', {
        user_name: form.user_name.value,
        user_email: form.user_email.value,
        subject: form.subject.value,
        message: form.message.value
      })
      .then(() => {
        alert('Message envoyé avec succès ! Un mail de confirmation a été envoyé à votre adresse.');
        form.reset();
      })
      .catch(err => {
        console.error('Erreur lors de l\'envoi du mail auto-reply:', err);
        alert('Message envoyé ! (Erreur lors de l\'envoi du mail de confirmation automatique.)');
      });
    }, (error) => {
      console.error('Erreur lors de l\'envoi principal:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer ou utiliser un autre moyen de contact.');
    });
});