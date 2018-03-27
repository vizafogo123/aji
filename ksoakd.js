document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById('formula-builder').style.display = "none";
}

function displayMessage() {
  document.getElementById('formula-builder').style.display = "block";
}

function imgsrc_from_formula(f){
  return "http://latex.codecogs.com/svg.latex?"+f.to_latex()
}


var img = document.createElement("img");

img.src = imgsrc_from_formula(a);
var src = document.getElementById("formula-builder-body");

src.appendChild(img);

var x = document.getElementById("im");
x.src=imgsrc_from_formula(a);
