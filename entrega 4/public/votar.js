document.querySelectorAll('form').forEach(function(form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault();
  
    var eventoId = form.querySelector('input[name="eventoId"]').value;
    var opcionVoto = form.querySelector('input[name="opcion_voto"]:checked').value;
  
    fetch('/eventos/' + eventoId + '/votar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ opcion_voto: opcionVoto })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Redirigir al usuario a la página de detalles del evento
        window.location.href = '/votaciones_main';
      } else {
        // Manejar el error
        console.error('Error al votar:', data.error);
      }
    });
  });
});
