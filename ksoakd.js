document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById('formula-builder').style.display = "none";
}

function displayMessage() {
  document.getElementById('formula-builder').style.display = "block";
}



var x = document.getElementById("im");
x.src=imgsrc_from_formula(a);
