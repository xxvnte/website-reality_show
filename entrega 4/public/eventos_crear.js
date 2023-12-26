document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    fetch('/eventos/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre_evento1: document.getElementById('nombre_evento1').value,
        candidato_1a: document.getElementById('candidato_1a').value,
        candidato_2a: document.getElementById('candidato_2a').value,
        candidato_3a: document.getElementById('candidato_3a').value,
        fecha: document.getElementById('fecha').value,
        estado: document.querySelector('input[name="estado"]:checked').value
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/newEvento_Exito';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
  