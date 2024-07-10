document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const correo = document.querySelector('#floatingInput').value;
    const contrasena = document.querySelector('#floatingPassword').value;
  
    fetch('/usuarios/ingresar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo: correo,
        contrasena: contrasena
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/ingresado_con_exito';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
  