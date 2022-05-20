const createForm = document.querySelector('.create-form')

createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;

    if(password === confirmPassword){
          registerUser(username, email, password);
          location.href = "http://localhost:3000/"
        }
})

const registerUser = async (username, email, password) => {
  await axios.post('/api/create.html', {
    Username: username, 
    Email: email,
    Password: password
  })
} 