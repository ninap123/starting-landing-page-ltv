
const API_URL = 'http://localhost:8000';

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

async function submitForm(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const company = document.getElementById('company').value;
  const role = document.getElementById('role').value;
  const userData = isAuthenticated() ? getUserProfile() : null;
  
  const formData = {
    name,
    email,
    company,
    role,
    google_user_id: userData ? userData.id : null
  };
  
  console.log('Form submitted with:', formData);
  
  try {
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    const response = await fetch(`${API_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Server response:', result);
    
    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('thankYouMessage').classList.remove('hidden');
    
    const userName = userData ? userData.name : name;
    document.getElementById('thankYouMessage').textContent = 
      `Thanks for your interest, ${userName}! We'll be in touch soon.`;
      
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('There was an error submitting your form. Please try again later.');
    
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
}
