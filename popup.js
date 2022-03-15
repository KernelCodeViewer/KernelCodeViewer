const url = `https://raw.githubusercontent.com/KernelCodeViewer/KernelNotes/main${window.location.pathname.replace('/linux', '').replace('/source', '')}.json`;

function pauseEvent(e) {
  if(e.stopPropagation) e.stopPropagation();
  if(e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    pauseEvent(e);
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    pauseEvent(e);
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

fetch(url).then(function(response){return response.json()})
  .then(function(json){
    if (!json) return;
    if (!Array.isArray(json.notes)) return;

    const notes = json.notes;
    notes.forEach(function(note){
      const element = document.querySelector(`#L${note.line}`);
      element.style.background = 'orange';
      element.style.color = '#333';
      element.style.position = 'relative';
      element.style.pointerEvents = 'unset';
      const fragment = document.createElement('span');
      const textNode = document.createTextNode(`【L${note.line}:】${note.note}——by @KernelCodeViewer`);

      const closeNode = document.createElement('span');
      const closeTextNode = document.createTextNode('x');
      closeNode.appendChild(closeTextNode);
      closeNode.style.cssText = `
        position: absolute;
        left: -6px;
        top: -7px;
        background: #333;
        color: #fff;
        z-index: 12;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-family: fantasy, 'Ubuntu';
        font-size: 14px;
        line-height: 1em;
      `;

      fragment.appendChild(textNode);
      fragment.appendChild(closeNode);

      fragment.style.cssText = `
        position: absolute;
        min-width: 300px;
	width: 25vw;
        height: auto;
        z-index: 10;
        left: 790px;
        top: -9px;
        white-space: pre-wrap;
        display: block;
        background: rgba(255, 165, 0, 0.7);
        line-height: 1.5em;
        padding: 10px;
        box-sizing: border-box;
        border: 2px solid rgb(170, 170, 170);
        font-size: 13px;
        border-radius: 8px;
        cursor: pointer;
        backdrop-filter: blur(2px);
        transition: all .3s ease;
      `;

      element.appendChild(fragment);
      dragElement(fragment);

      element.addEventListener('mouseenter', function(e) {
        //fragment.style.left = `660px`;
        fragment.style.display = 'block';
	pauseEvent(e);
      });

      closeNode.addEventListener('click', function(e) {
        //fragment.style.left = 'calc(100vw - 255px)';
        fragment.style.display = 'none';
	pauseEvent(e);
      });
    });
  })
