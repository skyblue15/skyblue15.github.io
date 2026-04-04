const parallax = document.getElementById('parallax');

window.addEventListener('scroll', () => {
  const offset = window.scrollY;
  parallax.style.transform = `translateY(${offset * 0.4}px)`;
});