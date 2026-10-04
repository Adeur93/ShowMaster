import type { ProjectionPayload } from '../types';

const textLayer = document.getElementById('text-layer') as HTMLDivElement;
const mediaLayer = document.getElementById('media-layer') as HTMLVideoElement;

// Escuchar actualizaciones enviadas desde el control
window.projectorApi.onUpdateScreen((payload: ProjectionPayload) => {
  
  if (payload.type === 'text') {
    // Aplicar contenido y estilos
    textLayer.innerText = payload.content || '';
    
    // Aplicar estilos dinámicos si existen
    if (payload.styles) {
      Object.assign(textLayer.style, payload.styles);
    }
    
    // Mostrar con fade-in
    textLayer.style.opacity = '1';
  }
  
  if (payload.type === 'video' && payload.src) {
    mediaLayer.src = payload.src;
    mediaLayer.style.display = 'block';
    mediaLayer.play().catch(e => console.error('Error autoplaying video:', e));
  }
});

// Escuchar orden de limpiar pantalla
window.projectorApi.onClearScreen(() => {
  // Ocultar texto
  textLayer.style.opacity = '0';
  setTimeout(() => { textLayer.innerText = ''; }, 300); // Esperar que termine la transición
  
  // Detener y ocultar video
  mediaLayer.pause();
  mediaLayer.removeAttribute('src');
  mediaLayer.style.display = 'none';
});