document.addEventListener('DOMContentLoaded', () => {
  // Select the menu button within the nav rail header
  const toggleButton = document.querySelector('.nav-rail-header md-icon-button');
  const body = document.body;

  if (toggleButton && body) {
    toggleButton.addEventListener('click', () => {
      // Toggle the 'rail-collapsed' class on the body element
      body.classList.toggle('rail-collapsed');
    });
  } else {
    console.error('Sidebar toggle button not found.');
  }
});