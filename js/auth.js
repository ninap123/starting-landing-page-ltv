
const AUTH_KEY = 'packit_auth_user';

let googleAuth = null;
let currentUser = null;

function initGoogleAuth() {
  return new Promise((resolve) => {
    gapi.load('auth2', () => {
      const clientIdMeta = document.querySelector('meta[name="google-signin-client_id"]');
      const clientId = clientIdMeta ? clientIdMeta.getAttribute('content') : '';
      
      if (!clientId) {
        console.error('Google Client ID not found. Add a meta tag with name="google-signin-client_id"');
        return resolve(null);
      }
      
      gapi.auth2.init({
        client_id: clientId,
        scope: 'profile email'
      }).then((auth) => {
        googleAuth = auth;
        
        if (localStorage.getItem(AUTH_KEY)) {
          try {
            currentUser = JSON.parse(localStorage.getItem(AUTH_KEY));
            updateUIForAuthState(true);
          } catch (e) {
            console.error('Error parsing stored auth data', e);
            localStorage.removeItem(AUTH_KEY);
          }
        } else {
          updateUIForAuthState(false);
        }
        
        googleAuth.isSignedIn.listen(updateSigninStatus);
        
        resolve(auth);
      }).catch(error => {
        console.error('Error initializing Google Auth', error);
        updateUIForAuthState(false);
        resolve(null);
      });
    });
  });
}

function signIn() {
  if (!googleAuth) {
    console.error('Google Auth not initialized');
    return Promise.reject('Auth not initialized');
  }
  
  return googleAuth.signIn().then(googleUser => {
    updateSigninStatus(true, googleUser);
    return googleUser;
  });
}

function signOut() {
  if (!googleAuth) {
    console.error('Google Auth not initialized');
    return Promise.reject('Auth not initialized');
  }
  
  return googleAuth.signOut().then(() => {
    updateSigninStatus(false);
    return true;
  });
}

function updateSigninStatus(isSignedIn, googleUser) {
  if (isSignedIn) {
    googleUser = googleUser || googleAuth.currentUser.get();
    const profile = googleUser.getBasicProfile();
    
    currentUser = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
  } else {
    currentUser = null;
    localStorage.removeItem(AUTH_KEY);
  }
  
  updateUIForAuthState(isSignedIn);
}

function updateUIForAuthState(isSignedIn) {
  const authButton = document.getElementById('authButton');
  const userProfile = document.getElementById('userProfile');
  const emailInput = document.getElementById('email');
  
  if (isSignedIn && currentUser) {
    authButton.textContent = 'Sign Out';
    authButton.onclick = signOut;
    
    userProfile.classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userImage').src = currentUser.imageUrl;
    
    if (emailInput) {
      emailInput.value = currentUser.email;
    }
  } else {
    authButton.textContent = 'Sign in with Google';
    authButton.onclick = signIn;
    
    userProfile.classList.add('hidden');
    
    if (emailInput) {
      emailInput.value = '';
    }
  }
}

function getUserProfile() {
  return currentUser;
}

function isAuthenticated() {
  return !!currentUser;
}
