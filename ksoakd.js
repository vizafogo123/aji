function displayMessage() {
  fbuilder_show(add_formula)
}

ul = document.createElement("ul");
document.body.appendChild(ul);
ul.style = "list-style-type:none";


list = []
var next_index = function() {
  return list.length;
}

add_formula = function(f) {
  var img = document.createElement("img");
  img.src = imgsrc_from_formula(f);
  var li = document.createElement("li");
  var index = next_index();
  ul.appendChild(li);
  li.appendChild(img);
  list[index] = f;
  img.onclick = (function(n) {
    return function() {
      click_formula(n)
    }
  })(index)

  img.ondrop = (function(n) {
    return function(event) {
      event.preventDefault();
      drop_formula(event.dataTransfer.getData("text"), n);
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

click_formula = function(n) {
  if (list[n].body[0] === FORALL) {
    fbuilder_show(function(f) {
      add_formula((new Formula(list[n].body.slice(2))).substitute(new Formula([list[n].body[1]]), f))
    }, 'exp')
  } else if (list[n].body[0] === AND) {
    add_formula(new Formula(list[n].body.slice(1, list[n].start_of_child(0, 2))));
    add_formula(new Formula(list[n].body.slice(list[n].start_of_child(0, 2))));
    remove_formula(n);
  } else if (list[n].body[0] === NOT) {
    if (list[n].body[1] === AND) {
      add_formula(new Formula([OR, NOT].concat(list[n].body.slice(2, list[n].start_of_child(1, 2)))
        .concat([NOT]).concat(list[n].body.slice(list[n].start_of_child(1, 2)))));
    } else if (list[n].body[1] === OR) {
      add_formula(new Formula([AND, NOT].concat(list[n].body.slice(2, list[n].start_of_child(1, 2)))
        .concat([NOT]).concat(list[n].body.slice(list[n].start_of_child(1, 2)))));
    } else if (list[n].body[1] === IF) {
      add_formula(new Formula([AND].concat(list[n].body.slice(2, list[n].start_of_child(1, 2)))
        .concat([NOT]).concat(list[n].body.slice(list[n].start_of_child(1, 2)))));
    } else if (list[n].body[1] === FORALL) {
      add_formula(new Formula([EXISTS, list[n].body[2], NOT].concat(list[n].body.slice(3))));
    } else if (list[n].body[1] === EXISTS) {
      add_formula(new Formula([FORALL, list[n].body[2], NOT].concat(list[n].body.slice(3))));
    }

  }
}

drop_formula = function(a, b) {
  if (a != b)
    add_formula(new Formula([AND].concat(list[a].body).concat(list[b].body)));
}

remove_formula = function(id) {
  var index = Object.keys(list).findIndex(function(x) {
    return x == id
  });
  delete list[id];
  var li = document.querySelectorAll("ul li")[index];
  li.parentNode.removeChild(li);
}

//after(Formula(formulas[0].body[1:formulas[0].start_of_child(0, 2)]), rule_name=and_first.name)
//after(Formula(formulas[0].body[formulas[0].start_of_child(0, 2):]), rule_name=and_second.name)
