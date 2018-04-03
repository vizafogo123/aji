function displayMessage() {
  fbuilder_show(add_formula)
}

ul = document.createElement("ul");
document.body.appendChild(ul);
ul.style = "list-style-type:none";


list = []
add_formula = function(f) {
  var img = document.createElement("img");
  img.src = imgsrc_from_formula(f);
  var li = document.createElement("li");
  ul.appendChild(li);
  li.appendChild(img);
  list.push(f);
  img.onclick = (function(n) {
    return function() {
      click_formula(n)
    }
  })(list.length - 1)

  img.ondrop = (function(n) {
    return function(event) {
      event.preventDefault();
      drop_formula(event.dataTransfer.getData("text"), n);
    }
  })(list.length - 1)

  img.ondragover = function(event) {
    event.preventDefault();
  }

  img.ondragstart = (function(n) {
    return function(event) {
      event.dataTransfer.setData("text/plain", n);
    }
  })(list.length - 1)

}

click_formula = function(n) {
  if (list[n].body[0] === FORALL) {
    fbuilder_show(function(f) {
      add_formula((new Formula(list[n].body.slice(2))).substitute(new Formula([list[n].body[1]]), f))
    }, 'exp')
  }
}

drop_formula = function(a, b) {
  if (a != b)
    add_formula(new Formula([AND].concat(list[a].body).concat(list[b].body)));
}
