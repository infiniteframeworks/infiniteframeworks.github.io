

document.addEventListener('DOMContentLoaded', function () {

  const spotlight = document.querySelector('.spotlight');
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.8) 80%)`;
  });

  document.querySelector('.hamburger').addEventListener('click', function () {
    document.getElementById('nav').classList.toggle('open');
  });

  const shimmer = document.querySelector('.shimmer-overlay');


  document.querySelector('.hero').addEventListener('mousemove', e => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    shimmer.style.backgroundPosition = `${40 + x * 20}% ${40 + y * 20}%`;
  });

});
