Proof = (function() {
  var list = [];

  var click_formula = function(n) {
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

  var drag_drop_formula = function(a, b) {
    if (a != b)
      add_formula(new Formula([AND].concat(list[a].body).concat(list[b].body)));
  }

  var insert = function(f) {
    list.push(f);
    return list.length - 1;
  }

  var remove = function(id) {
    var index = Object.keys(list).findIndex(function(x) {
      return x == id
    });
    delete list[id];
    return index;
  }

  return {
    click_formula: click_formula,
    drag_drop_formula:drag_drop_formula,
    insert: insert,
    remove: remove
  }

})()
