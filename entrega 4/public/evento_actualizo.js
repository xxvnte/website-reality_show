document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  const id = document.querySelector('#evento').value;
  const estado = document.querySelector('#estado').value;

  fetch('/eventos/actualizarEstado', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      estado: estado
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = '/votaciones_main';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

