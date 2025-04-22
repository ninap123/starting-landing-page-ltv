
document.addEventListener('DOMContentLoaded', () => {
  initGoogleAuth().then(() => {
    console.log('Google Auth initialized');
  }).catch(error => {
    console.error('Failed to initialize Google Auth', error);
  });
  
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', submitForm);
  }
});

function submitForm(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const userData = isAuthenticated() ? getUserProfile() : null;
  
  console.log('Form submitted with:', {
    email,
    userData
  });
  
  document.querySelector('form').classList.add('hidden');
  document.getElementById('thankYouMessage').classList.remove('hidden');
  
  if (userData) {
    document.getElementById('thankYouMessage').textContent = 
      `Thanks for your interest, ${userData.name}! We'll be in touch soon.`;
  }
}
