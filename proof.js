Proof = (function() {
  list = [];

  var id_to_index = function(id) {
    return Object.keys(list).findIndex(function(x) {
      return x == id
    });
  }

  var add_formula = function(f, ass = false) {
    add_element(f, list.length, ass);
    list.push({
      formula: f,
      assumption: ass
    });
  }

  var remove_formula = function(id) {
    remove_element(id_to_index(id));
    delete list[id];
  }

  var modify_formula = function(id, f) {
    list[id].formula = f;
    modify_element(id_to_index(id), f);
  }

  var click_formula = function(n) {
    var f = list[n].formula;
    if (f.body[0] === FORALL) {
      fbuilder_show(function(f) {
        add_formula((new Formula(f.body.slice(2))).substitute(new Formula([f.body[1]]), f))
      }, 'exp')
    } else if (f.body[0] === AND) {
      add_formula(new Formula(f.body.slice(1, f.start_of_child(0, 2))));
      add_formula(new Formula(f.body.slice(f.start_of_child(0, 2))));
      remove_formula(n);
    } else if (f.body[0] === NOT) {
      if (f.body[1] === AND) {
        modify_formula(n, new Formula([OR, NOT].concat(f.body.slice(2, f.start_of_child(1, 2)))
          .concat([NOT]).concat(f.body.slice(f.start_of_child(1, 2)))));
      } else if (f.body[1] === OR) {
        modify_formula(n, new Formula([AND, NOT].concat(f.body.slice(2, f.start_of_child(1, 2)))
          .concat([NOT]).concat(f.body.slice(f.start_of_child(1, 2)))));
      } else if (f.body[1] === IF) {
        modify_formula(n, new Formula([AND].concat(f.body.slice(2, f.start_of_child(1, 2)))
          .concat([NOT]).concat(f.body.slice(f.start_of_child(1, 2)))));
      } else if (f.body[1] === FORALL) {
        modify_formula(n, new Formula([EXISTS, f.body[2], NOT].concat(f.body.slice(3))));
      } else if (f.body[1] === EXISTS) {
        modify_formula(n, new Formula([FORALL, f.body[2], NOT].concat(f.body.slice(3))));
      }
    }
  }

  var drag_drop_formula = function(a, b) {
    if (a === b) return;
    var f1 = list[a].formula;
    var f2 = list[b].formula;
    if (f1.body.length > f2.body.length) {
      if (deduction(a, b)) return;
    }
    if (f2.body.length > f1.body.length) {
      if (deduction(b, a)) return;
    }
    if (array_equal(f1.negation().body, f2.body)) {
      contradiction();
      return;
    }
  }

  var deduction = function(a, b) {
    var f1 = list[a].formula;
    var f2 = list[b].formula;
    if (f1.body[0] === IF) {
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.body)) {
        add_formula(new Formula(f1.body.slice(f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.negation().body)) {
        add_formula(new Formula([NOT].concat(f1.body.slice(1, f1.start_of_child(0, 2)))));
        return true;
      }
    }

    if (f1.body[0] === OR) {
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.negation().body)) {
        add_formula(new Formula(f1.body.slice(f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.negation().body)) {
        add_formula(new Formula(f1.body.slice(1, f1.start_of_child(0, 2))));
        return true;
      }
    }

    if (f1.body[0] === EQUI) {
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.body)) {
        add_formula(new Formula(f1.body.slice(f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.body)) {
        add_formula(new Formula(f1.body.slice(1, f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.negation().body)) {
        add_formula(new Formula([NOT].concat(f1.body.slice(f1.start_of_child(0, 2)))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.negation().body)) {
        add_formula(new Formula([NOT].concat(f1.body.slice(1, f1.start_of_child(0, 2)))));
        return true;
      }
    }
    return false;
  }

  var make_assumption = function() {
    fbuilder_show(function(f) {
      add_formula(f, ass = true)
    }, 'rel')
  }

  var contradiction = function() {
    var f, ids = Object.keys(list);
    for (var i = ids.length - 1; i >= 0; i--) {
      if (list[ids[i]].assumption) {
        f = list[ids[i]].formula.negation();
        remove_formula(ids[i]);
        i = -1;
      } else remove_formula(ids[i]);

    }
    add_formula(f);
  }


  return {
    click_formula: click_formula,
    drag_drop_formula: drag_drop_formula,
    add_formula: add_formula, //debug
    list: list, //debug
    contradiction: contradiction, //debug
    make_assumption: make_assumption
  }

})()
