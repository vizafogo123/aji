Proof = (function() {
  var list = [];
  var max = 0;

  var id_to_index = function(id) {
    return Object.keys(list).findIndex(function(x) {
      return x == id
    });
  }

  var add_formula = function(f, ass = false) {
    max += 1;
    ProofPane.add_element(f, max, ass);
    list[max] = {
      formula: f,
      assumption: ass
    };

  }

  var remove_formula = function(id) {
    ProofPane.remove_element(id_to_index(id));
    delete list[id];
  }

  var remove_unused_locals = function() {
    var changed = false;
    for (var i in Operation.local_operations) {
      var b = true;
      for (var id in list) {
        if (list[id].formula.body.includes(Operation.local_operations[i])) {
          b = false;
          break;
        };
      }
      if (b) {
        delete Operation.local_operations[i];
        changed = true;
      }
    }
    if (changed) FormulaBuilder.refresh_locals();
  }

  var modify_formula = function(id, f) {
    list[id].formula = f;
    ProofPane.modify_element(id_to_index(id), f);
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
      FormulaBuilder.refresh_locals();
    } else if (f.body[0] === AND) {
      add_formula(new Formula(f.first_child(0)));
      add_formula(new Formula(f.second_child(0)));
      if (!list[n].assumption && in_top_assumption(n)) remove_formula(n);
    } else if (f.body[0] === EQUI) {
      add_formula(new Formula([IF].concat(f.body.slice(1))));
      add_formula(new Formula([IF].concat(f.second_child(0)).concat(f.first_child(0))));
      if (!list[n].assumption && in_top_assumption(n)) remove_formula(n);
    } else if (f.body[0] === IF) {
      add_formula(new Formula([NOT].concat(f.first_child(0))), ass = true);
    } else if (f.body[0] === OR) {
      add_formula(new Formula(f.first_child(0)), ass = true);
    } else if (f.body[0] === NOT) {
      if (f.body[1] === AND) {
        add_or_modify(new Formula([OR, NOT].concat(f.first_child(1)).concat([NOT]).concat(f.second_child(1))));
      } else if (f.body[1] === OR) {
        add_or_modify(new Formula([AND, NOT].concat(f.first_child(1)).concat([NOT]).concat(f.second_child(1))));
      } else if (f.body[1] === IF) {
        add_or_modify(new Formula([AND].concat(f.first_child(1)).concat([NOT]).concat(f.second_child(1))));
      } else if (f.body[1] === EQUI) {
        add_or_modify(new Formula([EQUI, NOT].concat(f.body.slice(2))));
      } else if (f.body[1] === FORALL) {
        add_or_modify(new Formula([EXISTS, f.body[2], NOT].concat(f.body.slice(3))));
      } else if (f.body[1] === EXISTS) {
        add_or_modify(new Formula([FORALL, f.body[2], NOT].concat(f.body.slice(3))));
      } else if (f.body[1] === EQUALS) {
        if (array_equal(f.second_child(1), f.first_child(1))) {
          contradiction();
        }
      }
    } else if (f.body[0] === EQUALS) {
      add_or_modify(new Formula([EQUALS].concat(f.second_child(0)).concat(f.first_child(0))));
    }
  }

  var drag_drop_formula = function(a, b) {
    if (a == b) return;
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
    if (f1.body[0] === EQUALS) {
      substitution(f1, f2)
    }
    if (f1.body[0] === FORALL) {
      var k = 0,
        vars = Array(),
        match;
      while (f1.body[k] === FORALL) {
        vars.push(f1.body[k + 1]);
        k = k + 2;
      }
      if (f1.body[k] === IF) {
        match = f2.match_pattern(f1.first_child(k), vars);
        if (match) {
          add_formula(new Formula(f1.second_child(k)).substitute_parallel(vars.map(function(op) {
            return new Formula([op])
          }), match));
        } else {
          match = f2.match_pattern(negate(f1.second_child(k)), vars);
          if (match) {
            add_formula(new Formula(negate(f1.first_child(k))).substitute_parallel(vars.map(function(op) {
              return new Formula([op])
            }), match));
          }
        }
      }
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
      if (array_equal(f1.first_child(0), f2.body)) {
        (add_or_modify())(new Formula(f1.second_child(0)));
        return true;
      }
      if (array_equal(f1.second_child(0), f2.negation().body)) {
        (add_or_modify())(new Formula([NOT].concat(f1.first_child(0))));
        return true;
      }
    }

    if (f1.body[0] === OR) {
      if (array_equal(f1.first_child(0), f2.negation().body)) {
        (add_or_modify())(new Formula(f1.second_child(0)));
        return true;
      }
      if (array_equal(f1.second_child(0), f2.negation().body)) {
        (add_or_modify())(new Formula(f1.first_child(0)));
        return true;
      }
    }

    if (f1.body[0] === EQUI) {
      if (array_equal(f1.first_child(0), f2.body)) {
        (add_or_modify())(new Formula(f1.second_child(0)));
        return true;
      }
      if (array_equal(f1.second_child(0), f2.body)) {
        (add_or_modify())(new Formula(f1.first_child(0)));
        return true;
      }
      if (array_equal(f1.first_child(0), f2.negation().body)) {
        (add_or_modify())(new Formula([NOT].concat(f1.second_child(0))));
        return true;
      }
      if (array_equal(f1.second_child(0), f2.negation().body)) {
        (add_or_modify())(new Formula([NOT].concat(f1.first_child(0))));
        return true;
      }
    }
    return false;
  }

  var substitution = function(f1, f2) {
    var res1 = f2.substitute(new Formula(f1.first_child(0)), new Formula(f1.second_child(0)));
    if (!array_equal(res1.body, f2.body)) {
      add_formula(res1);
    } else {
      var res2 = f2.substitute(new Formula(f1.second_child(0)), new Formula(f1.first_child(0)));
      if (!array_equal(res2.body, f2.body)) {
        add_formula(res2);
      }
    }
  }

  var make_assumption = function() {
    FormulaBuilder.show(function(f) {
      add_formula(f, ass = true)
    }, 'rel')
  }

  var contradiction = function() {
    var f, i, ids = Object.keys(list);
    for (i = ids.length - 1; i >= 0; i--) {
      if (list[ids[i]].assumption) {
        f = list[ids[i]].formula.negation();
        remove_formula(ids[i]);
        i = -1;
      } else remove_formula(ids[i]);
    }
    add_formula(f);
    remove_unused_locals();
  }

  var click_theorem = function(th) {
    if (!th.schema) {
      add_formula(th);
    } else {
      FormulaBuilder.show(function(f) {
        add_formula(th.substitute_definition(new Formula([th.schema[0]].concat(ARGUMENTS.slice(0, 1))), f))
      }, mod = 'rel', args = ARGUMENTS.slice(0, 1))
    }

  }

  var remove_request = function(n) {
    if (list[n].assumption) {
      var ids = Object.keys(list);
      if (ids[ids.length - 1] !== n) return;
    }
    remove_formula(n);
  }

  return {
    click_formula: click_formula,
    drag_drop_formula: drag_drop_formula,
    click_theorem: click_theorem,
    add_formula: add_formula, //debug
    make_assumption: make_assumption,
    remove_request: remove_request
  }

})()
