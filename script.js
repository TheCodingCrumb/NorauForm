// Fonction appelée par Google Identity Services
function handleCredentialResponse(response) {
  // Décoder le JWT pour obtenir le nom de l'utilisateur
  const data = parseJwt(response.credential);
  document.getElementById('user-name').textContent = data.name || data.email;
  document.querySelector('.g_id_signin').style.display = 'none';
  document.getElementById('user-info').style.display = 'block';
}

// Décoder un JWT (très simple, pas sécurisé pour prod)
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Déconnexion (juste masquer l'UI)
document.getElementById('logout').onclick = function() {
  document.getElementById('user-info').style.display = 'none';
  document.querySelector('.g_id_signin').style.display = 'block';
}

// Formulaire
document.getElementById('simple-form').onsubmit = function(e) {
  e.preventDefault();
  alert('Message envoyé : ' + this.message.value);
  this.reset();
}
