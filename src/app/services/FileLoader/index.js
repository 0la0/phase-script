function getArrayBufferFromFile(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', event => resolve(event.target.result));
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
}

function loadFile(acceptedFileTypes) {
  return new Promise((resolve, reject) => {
    try {
      const inputElement = document.createElement('input');
      inputElement.setAttribute('type', 'file');
      inputElement.setAttribute('accept', acceptedFileTypes);
      inputElement.setAttribute('multiple', false);
      inputElement.style.setProperty('display', 'none');
      inputElement.addEventListener('change', () => resolve(inputElement.files[0]));
      inputElement.click();
    } catch (error) {
      reject(error);
    }
  });
}

export default () => loadFile('audio/*').then(getArrayBufferFromFile);
