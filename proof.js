Proof = (function() {
  list = [];

  var id_to_index = function(id) {
    return Object.keys(list).findIndex(function(x) {
      return x == id
    });
  }

  var add_formula = function(f, ass = false) {
    FormulaPane.add_element(f, list.length, ass);
    list.push({
      formula: f,
      assumption: ass
    });
  }

  var remove_formula = function(id) {
    FormulaPane.remove_element(id_to_index(id));
    delete list[id];
  }

  var modify_formula = function(id, f) {
    list[id].formula = f;
    FormulaPane.modify_element(id_to_index(id), f);
  }

  var click_formula = function(n) {
    var in_top_assumption = function(k) {
      var ids = Object.keys(list);
      for (var i = id_to_index(n); i < ids.length; i++) {
        if (list[ids[i]].assumption) return false;
      }
      return true;
    }
    var f = list[n].formula;
    var add_or_modify = (list[n].assumption ? add_formula : function(f) {
      modify_formula(n, f)
    });

    var get_new_op = function() {
      var variable, identifier = "local" + Operation.local_operations.length,
        tries = [f.body[1].print_scheme, "a", "b", "c", "d", "e", "f", "g", "h"],
        op = new Operation(identifier, 0, "", Operation.EXPRESSION),
        schemes = Operation.local_operations.map(function(x) {
          return x.print_scheme
        });
      if (!schemes.includes(tries[0])) {
        op.print_scheme = tries[0];
      } else {
        schemes = schemes.concat(f.body.map(function(x) {
          return x.print_scheme
        }));
        var i = 1;
        while (schemes.includes(tries[i])) i++;
        op.print_scheme = tries[i];
      };
      return op;
    }

    if (f.body[0] === FORALL) {
      FormulaBuilder.show(function(x) {
        add_formula((new Formula(f.body.slice(2))).substitute(new Formula([f.body[1]]), x))
      }, 'exp')
    } else if (f.body[0] === EXISTS) {
      var op = get_new_op();
      Operation.local_operations.push(op);
      add_or_modify(new Formula(f.body.slice(2)).substitute(new Formula([f.body[1]]), new Formula([op])));
    } else if (f.body[0] === AND) {
      add_formula(new Formula(f.body.slice(1, f.start_of_child(0, 2))));
      add_formula(new Formula(f.body.slice(f.start_of_child(0, 2))));
      if (!list[n].assumption && in_top_assumption(n)) remove_formula(n);
    } else if (f.body[0] === EQUI) {
      add_formula(new Formula([IF].concat(f.body.slice(1))));
      add_formula(new Formula([IF].concat(f.body.slice(f.start_of_child(0, 2))).concat(f.body.slice(1, f.start_of_child(0, 2)))));
      if (!list[n].assumption && in_top_assumption(n)) remove_formula(n);
    } else if (f.body[0] === IF) {
      add_formula(new Formula([NOT].concat(f.body.slice(1, f.start_of_child(0, 2)))), ass = true);
    } else if (f.body[0] === OR) {
      add_formula(new Formula(f.body.slice(1, f.start_of_child(0, 2))), ass = true);
    } else if (f.body[0] === NOT) {
      if (f.body[1] === AND) {
        add_or_modify(new Formula([OR, NOT].concat(f.body.slice(2, f.start_of_child(1, 2)))
          .concat([NOT]).concat(f.body.slice(f.start_of_child(1, 2)))));
      } else if (f.body[1] === OR) {
        add_or_modify(new Formula([AND, NOT].concat(f.body.slice(2, f.start_of_child(1, 2)))
          .concat([NOT]).concat(f.body.slice(f.start_of_child(1, 2)))));
      } else if (f.body[1] === IF) {
        add_or_modify(new Formula([AND].concat(f.body.slice(2, f.start_of_child(1, 2)))
          .concat([NOT]).concat(f.body.slice(f.start_of_child(1, 2)))));
      } else if (f.body[1] === EQUI) {
        add_or_modify(new Formula([EQUI, NOT].concat(f.body.slice(2))));
      } else if (f.body[1] === FORALL) {
        add_or_modify(new Formula([EXISTS, f.body[2], NOT].concat(f.body.slice(3))));
      } else if (f.body[1] === EXISTS) {
        add_or_modify(new Formula([FORALL, f.body[2], NOT].concat(f.body.slice(3))));
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
    var a_higher_than_b = function() {
      if (a > b) return true;
      var ids = Object.keys(list);
      var maxi = id_to_index(b);
      for (var i = id_to_index(a); i <= maxi; i++) {
        if (list[ids[i]].assumption) return false;
      }
      return true;
    };
    var add_or_modify = function() {
      return (!list[a].assumption && a_higher_than_b() ? function(f) {
        modify_formula(a, f)
      } : add_formula)
    };

    if (f1.body[0] === IF) {
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.body)) {
        (add_or_modify())(new Formula(f1.body.slice(f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.negation().body)) {
        (add_or_modify())(new Formula([NOT].concat(f1.body.slice(1, f1.start_of_child(0, 2)))));
        return true;
      }
    }

    if (f1.body[0] === OR) {
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.negation().body)) {
        (add_or_modify())(new Formula(f1.body.slice(f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.negation().body)) {
        (add_or_modify())(new Formula(f1.body.slice(1, f1.start_of_child(0, 2))));
        return true;
      }
    }

    if (f1.body[0] === EQUI) {
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.body)) {
        (add_or_modify())(new Formula(f1.body.slice(f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.body)) {
        (add_or_modify())(new Formula(f1.body.slice(1, f1.start_of_child(0, 2))));
        return true;
      }
      if (array_equal(f1.body.slice(1, f1.start_of_child(0, 2)), f2.negation().body)) {
        (add_or_modify())(new Formula([NOT].concat(f1.body.slice(f1.start_of_child(0, 2)))));
        return true;
      }
      if (array_equal(f1.body.slice(f1.start_of_child(0, 2)), f2.negation().body)) {
        (add_or_modify())(new Formula([NOT].concat(f1.body.slice(1, f1.start_of_child(0, 2)))));
        return true;
      }
    }
    return false;
  }

  var make_assumption = function() {
    FormulaBuilder.show(function(f) {
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
    deduction:deduction, //debug
    make_assumption: make_assumption
  }

})()
