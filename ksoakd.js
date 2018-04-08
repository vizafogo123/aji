function displayMessage() {
  fbuilder_show(Proof.add_formula)
}

ul = document.createElement("ul");
document.body.appendChild(ul);
ul.style = "list-style-type:none";


add_element = function(f,id) {
  var img = document.createElement("img");
  img.src = imgsrc_from_formula(f);
  var li = document.createElement("li");
  ul.appendChild(li);
  li.appendChild(img);
  img.onclick = (function(n) {
    return function() {
      Proof.click_formula(n)
    }
  })(id)

  img.ondrop = (function(n) {
    return function(event) {
      event.preventDefault();
      Proof.drag_drop_formula(event.dataTransfer.getData("text"), n);
    }
  })(id)

  img.ondragover = function(event) {
    event.preventDefault();
  }

  img.ondragstart = (function(n) {
    return function(event) {
      event.dataTransfer.setData("text/plain", n);
    }
  })(id)

}


remove_element = function(index) {
  var li = document.querySelectorAll("ul li")[index];
  li.parentNode.removeChild(li);
}
