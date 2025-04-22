
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
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const company = document.getElementById('company').value;
  const role = document.getElementById('role').value;
  const userData = isAuthenticated() ? getUserProfile() : null;
  
  console.log('Form submitted with:', {
    name,
    email,
    company,
    role,
    userData
  });
  
  document.getElementById('contactForm').classList.add('hidden');
  document.getElementById('thankYouMessage').classList.remove('hidden');
  
  const userName = userData ? userData.name : name;
  document.getElementById('thankYouMessage').textContent = 
    `Thanks for your interest, ${userName}! We'll be in touch soon.`;
}
