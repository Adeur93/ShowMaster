// Obtenemos referencias a los botones
const btnVerse = document.getElementById('btn-verse') as HTMLDivElement;
const btnVideo = document.getElementById('btn-video') as HTMLDivElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;

// Enviar un texto (Versículo o Canción)
btnVerse.addEventListener('click', () => {
  window.controlApi.projectContent({
    type: 'text',
    content: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito...',
    styles: {
      fontSize: '6vw',
      fontFamily: 'Montserrat, sans-serif',
      color: 'white',
      textAlign: 'center',
      textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
    }
  });
});

// Enviar un Video de fondo
btnVideo.addEventListener('click', () => {
  window.controlApi.projectContent({
    type: 'video',
    src: 'file:///ruta/a/tu/video.mp4' // En producción esto vendría de SQLite
  });
});

// Limpiar la pantalla de proyección
btnClear.addEventListener('click', () => {
  window.controlApi.clearScreen();
});