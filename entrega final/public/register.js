document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const nombre_completo = document.querySelector('#nombre_completo').value;
    const correo = document.querySelector('#correo').value;
    const contrasena = document.querySelector('#contrasena').value;
  
    fetch('/usuarios/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre_completo: nombre_completo,
        correo: correo,
        contrasena: contrasena
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/registrado_con_exito';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
  