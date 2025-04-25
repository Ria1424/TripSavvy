const testimonials = [
  {
    name: "Ria Chawak1",
    quote: "TripSavvy helped me discover hidden gems across India. Highly recommended!",
  },
  {
    name: "Ria Chawak2",
    quote: "The best travel planning experience I've ever had. Kerala trip was magical!",
  },
  {
    name: "Ria Chawak3",
    quote: "Local insights and seamless planning made our Ladakh adventure unforgettable!",
  },
];

let currentTestimonial = 0;
const testimonialBox = document.getElementById('testimonialBox');

function showTestimonial() {
  testimonialBox.innerHTML = `
    <p>"${testimonials[currentTestimonial].quote}"</p>
    <h4>- ${testimonials[currentTestimonial].name}</h4>
  `;
  testimonialBox.style.animation = 'fadeIn 0.5s ease';
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
}

// Initialize testimonials rotation
showTestimonial();
setInterval(showTestimonial, 5000);

// Image overlay functionality
document.querySelectorAll('.destination-card img').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.querySelector('.image-overlay');
    overlay.querySelector('img').src = img.src;
    overlay.classList.add('show');
  });
});

document.querySelector('.image-overlay').addEventListener('click', (e) => {
  if (e.target.classList.contains('image-overlay')) {
    e.target.classList.remove('show');
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});