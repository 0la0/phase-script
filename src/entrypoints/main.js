import initApp from './initApp';
import '../app/components/_util/componentManager';

const globalStyles = require('./main.css');

function builDom() {
  const entrypoint = document.getElementById('entrypoint');
  entrypoint.innerHTML = `<style>${globalStyles}</style><app-entry></app-entry>`;
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  builDom();
});
