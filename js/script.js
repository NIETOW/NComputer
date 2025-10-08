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
      entry.target.classList.add('show'); 
    } else { 
      entry.target.classList.remove('show'); 
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
emailjs.init('ViFR4aDeKjiyC2vyf');

const form = document.getElementById('contactForm');
const serviceCards = document.querySelectorAll('.service-card');

// 📌 Pré-remplissage objet du formulaire depuis les services
serviceCards.forEach(card => {
  if(!card.classList.contains('disabled')){
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      form.querySelector('input[name="subject"]').value = `Demande pour : ${card.textContent}`;
      window.location.href="#contact";
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
        alert('Message envoyé ! Un mail de confirmation a été envoyé au client.');
        form.reset();
      })
      .catch(err => {
        console.error(err);
        alert('Erreur lors de l\'envoi du mail auto-reply.');
      });
    })
    .catch(err => {
      console.error(err);
      alert('Erreur lors de l\'envoi du mail principal.');
    });
});
