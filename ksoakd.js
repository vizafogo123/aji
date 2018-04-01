
function displayMessage() {
  fbuilder_show(function(f){
    var img = document.createElement("img");
    img.src = imgsrc_from_formula(f);
    var li=document.createElement("li");
    ul.appendChild(li);
    li.appendChild(img);
  })
}

ul=document.createElement("ul");
document.body.appendChild(ul);
ul.style="list-style-type:none";



/*
var modal = document.getElementById('formula-builder');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
*/
