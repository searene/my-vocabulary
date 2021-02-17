import { ipcRenderer } from "electron";

function initContextMenu() {
  const images = document.getElementsByTagName("img");
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    img.addEventListener("contextmenu",function(event){
      event.preventDefault();
      const ctxMenu = document.getElementById("ctxMenu") as HTMLMenuElement;
      ctxMenu.style.display = "block";
      ctxMenu.style.left = event.pageX + "px";
      ctxMenu.style.top = event.pageY + "px";
      ctxMenu.setAttribute("src", img.src);

      ctxMenu.addEventListener("click", (event) => {
        const ctxMenuElement = (event.target as HTMLMenuElement).parentElement as HTMLMenuElement;
        const src = ctxMenuElement.getAttribute("src") as string;
        ipcRenderer.sendToHost(src);
      });
    },false);
  }
}

function create(htmlStr: string) {
  const frag = document.createDocumentFragment();
  const temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

const fragment = create(`
<menu id="ctxMenu">
  <menu title="Use this image"></menu>
</menu>
`);

function initCSS() {
  const styles = `
#ctxMenu{
    display:none;
    width: 0;
    height: 0;
    z-index:100;
}
menu {
    position:absolute;
    display:block;
    left:0px;
    top:0px;
    height:20px;
    padding:0;
    margin:0;
    border:1px solid;
    background-color:white;
    font-weight:normal;
    white-space:nowrap;
}
menu:hover{
    background-color:#eef;
    font-weight:bold;
}
menu > menu{
    display:block;
    position:relative;
    top:-20px;
    left:100%;
    width: 100px;
}
menu[title]:before{
    content:attr(title);
}
`;
  const styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertBefore(fragment, document.body.childNodes[0]);
  initContextMenu();
  initCSS();
});

