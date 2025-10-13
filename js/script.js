// 🌐 Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({behavior:"smooth"});
  });
});

// 🌟 IntersectionObserver pour animations
const sections = document.querySelectorAll('section, .service-card, .product, .review');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ 
      // Ajout d'un index pour un effet de cascade sur les cartes
      const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 0.05}s`;
      entry.target.classList.add('show'); 
    } else { 
      // On retire la classe show pour que l'animation se rejoue en scrollant
      // entry.target.classList.remove('show'); 
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


// ✉️ EmailJS init
// Assurez-vous que l'initialisation est toujours la première étape pour EmailJS
emailjs.init('ViFR4aDeKjiyC2vyf');

const form = document.getElementById('contactForm');
const serviceCards = document.querySelectorAll('.service-card');

// 📌 Pré-remplissage objet du formulaire depuis les services (exclut les liens/disabled)
serviceCards.forEach(card => {
  // S'assurer que ce n'est pas la carte 'disabled' ET que ce n'est pas un lien <a>
  if(!card.classList.contains('disabled') && card.tagName !== 'A'){ 
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // Pour une meilleure lecture dans le mail
      const serviceText = card.textContent.trim().replace(/\s+/g, ' '); 
      form.querySelector('input[name="subject"]').value = `Demande de service : ${serviceText}`;
      // Ferme le menu burger sur mobile après la sélection
      if(nav.classList.contains('active')) {
          nav.classList.remove('active');
          burger.classList.remove('toggle');
      }
      window.location.href="#contact"; // Scroll vers la section contact
    });
  }
});

// 📧 Gestion du formulaire : envoi à toi + auto-reply client
form.addEventListener('submit', function(e){
  e.preventDefault();

  // Envoi principal à toi-même
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
        alert('Message envoyé ! (Erreur lors de l\'envoi du mail de confirmation client).');
      });
    })
    .catch(err => {
      console.error('Erreur lors de l\'envoi du mail principal:', err);
      alert('Une erreur s\'est produite lors de l\'envoi de votre message.');
    });
});