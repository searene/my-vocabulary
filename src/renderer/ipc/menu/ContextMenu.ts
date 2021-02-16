function initContextMenu() {
  const images = document.getElementsByTagName("img");
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    img.addEventListener("contextmenu",function(event){
      event.preventDefault();
      const ctxMenu = document.getElementById("ctxMenu") as HTMLMenuElement;
      console.log("img");
      console.log(ctxMenu.style.zIndex);
      ctxMenu.style.display = "block";
      ctxMenu.style.left = (event.pageX - 10)+"px";
      ctxMenu.style.top = (event.pageY - 10)+"px";
    },false);
    img.addEventListener("click",function(event) {
      console.log("img");
      const ctxMenu = document.getElementById("ctxMenu") as HTMLMenuElement;
      ctxMenu.style.display = "";
      ctxMenu.style.left = "";
      ctxMenu.style.top = "";
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
    <menu title="File">
        <menu title="Save"></menu>
        <menu title="Save As"></menu>
        <menu title="Open"></menu>
    </menu>
    <menu title="Edit">
        <menu title="Cut"></menu>
        <menu title="Copy"></menu>
        <menu title="Paste"></menu>
    </menu>
</menu>
`);

function initCSS() {
  const styles = `
#ctxMenu{
    display:none;
    z-index:100;
}
menu {
    position:absolute;
    display:block;
    left:0px;
    top:0px;
    height:20px;
    width:20px;
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
menu:hover > menu{
    display:block;
}
menu > menu{
    display:none;
    position:relative;
    top:-20px;
    left:100%;
    width:55px;
}
menu[title]:before{
    content:attr(title);
}
menu:not([title]):before{
    content:"\\2630";
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
  console.log(document.documentElement.innerHTML);
});

