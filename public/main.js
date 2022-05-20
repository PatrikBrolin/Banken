const loginForm = document.querySelector('.login-form')
const formUser = document.getElementById('email');
const formPass = document.getElementById('password');

loginForm.addEventListener('submit', async (event) =>{
  event.preventDefault();

  await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Email: formUser.value,
      Password: formPass.value
    })
  });
  console.log(formUser.value)
  location.reload();
});

const loginUser = async (email, password) => {
  await axios.post('/api/login', {
    Email: email,
    Password: password
  },
  {})
}


const checkLoggedin = async () => { 
  const res = await fetch('/api/loggedin');
  const data = await res.json();
  console.log(data)
  if (data.user) {
  location.href = "http://localhost:3000/mainPage.html"
  }
}

checkLoggedin();
