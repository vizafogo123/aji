function displayMessage() {
  fbuilder_show(add_formula)
}

ul = document.createElement("ul");
document.body.appendChild(ul);
ul.style = "list-style-type:none";


add_formula = function(f) {
  var img = document.createElement("img");
  img.src = imgsrc_from_formula(f);
  var li = document.createElement("li");
  ul.appendChild(li);
  li.appendChild(img);
  var index = Proof.insert(f);
  img.onclick = (function(n) {
    return function() {
      Proof.click_formula(n)
    }
  })(index)

  img.ondrop = (function(n) {
    return function(event) {
      event.preventDefault();
      Proof.drag_drop_formula(event.dataTransfer.getData("text"), n);
    }
  })(index)

  img.ondragover = function(event) {
    event.preventDefault();
  }

  img.ondragstart = (function(n) {
    return function(event) {
      event.dataTransfer.setData("text/plain", n);
    }
  })(index)

}


remove_formula = function(id) {
  var index = Proof.remove(id);
  var li = document.querySelectorAll("ul li")[index];
  li.parentNode.removeChild(li);
}
