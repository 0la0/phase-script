export default function buildGrid(width, height, component) {
  const size = width * height;
  const gridParent = document.createElement('div');
  gridParent.classList.add('markov-box_grid');
  const gridElementList = Array(size).fill(null)
    .map((ele, index) => {
      const element = document.createElement('markov-state');
      const params = {
        index: index,
        width: width,
        height: height
      };
      element.setAttribute('id', index);
      element.setAttribute('params', JSON.stringify(params));
      return element;
    });

  gridElementList.forEach(element => gridParent.appendChild(element));

  return {
    root: gridParent,
    elementList: gridElementList
  };
}
