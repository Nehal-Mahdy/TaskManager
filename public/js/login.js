document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
     localStorage.setItem('username', data.username);
    alert('Login successful!');
    window.location.href = 'tasks.html';
  } else {
    alert(data.msg || 'Login failed');
  }
});