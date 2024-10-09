document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Signup successful!');
    window.location.href = 'login.html';
  } else {
    alert(data.msg || 'Signup failed');
  }
});