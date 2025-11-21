document.addEventListener('DOMContentLoaded', () => {
  // Sidebar toggle logic
  const toggleBtn = document.getElementById('menu-toggle');
  const body = document.body;
  if (toggleBtn && body) {
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('rail-collapsed');
    });
  } else {
    console.error('Sidebar toggle button (#menu-toggle) not found.');
  }
});
