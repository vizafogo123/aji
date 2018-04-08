Proof = (function() {
   list = [];

  var id_to_index=function(id){
    return Object.keys(list).findIndex(function(x) {
      return x == id
    });
  }

  var add_formula = function(f) {
    add_element(f, list.length);
    list.push(f);
  }

  var remove_formula = function(id) {
    remove_element(id_to_index(id));
    delete list[id];
  }

  var modify_formula=function(id,f){
    list[id]=f;
    modify_element(id_to_index(id),f);
  }

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
        modify_formula(n,new Formula([OR, NOT].concat(list[n].body.slice(2, list[n].start_of_child(1, 2)))
          .concat([NOT]).concat(list[n].body.slice(list[n].start_of_child(1, 2)))));
      } else if (list[n].body[1] === OR) {
        modify_formula(n,new Formula([AND, NOT].concat(list[n].body.slice(2, list[n].start_of_child(1, 2)))
          .concat([NOT]).concat(list[n].body.slice(list[n].start_of_child(1, 2)))));
      } else if (list[n].body[1] === IF) {
        modify_formula(n,new Formula([AND].concat(list[n].body.slice(2, list[n].start_of_child(1, 2)))
          .concat([NOT]).concat(list[n].body.slice(list[n].start_of_child(1, 2)))));
      } else if (list[n].body[1] === FORALL) {
        modify_formula(n,new Formula([EXISTS, list[n].body[2], NOT].concat(list[n].body.slice(3))));
      } else if (list[n].body[1] === EXISTS) {
        modify_formula(n,new Formula([FORALL, list[n].body[2], NOT].concat(list[n].body.slice(3))));
      }
    }
  }

  var drag_drop_formula = function(a, b) {
    if (a === b) return;
    if (list[a].body.length>list[b].body.length) {
      deduction(a,b);
    }
    if (list[b].body.length>list[a].body.length) {
      deduction(b,a);
    }
  }

  var deduction=function(a,b){
    //console.log(list[a],list[b]);
    if (list[a].body[0]===IF){
      if (array_equal(list[a].body.slice(1,list[a].start_of_child(0, 2)),list[b].body)){
        add_formula(new Formula(list[a].body.slice(list[a].start_of_child(0, 2))));
      }
      if (array_equal(list[a].body.slice(list[a].start_of_child(0, 2)),list[b].negation().body)){
        add_formula(new Formula([NOT].concat(list[a].body.slice(1,list[a].start_of_child(0, 2)))));
      }
    }

    if (list[a].body[0]===OR){
      if (array_equal(list[a].body.slice(1,list[a].start_of_child(0, 2)),list[b].negation().body)){
        add_formula(new Formula(list[a].body.slice(list[a].start_of_child(0, 2))));
      }
      if (array_equal(list[a].body.slice(list[a].start_of_child(0, 2)),list[b].negation().body)){
        add_formula(new Formula(list[a].body.slice(1,list[a].start_of_child(0, 2))));
      }
    }

    if (list[a].body[0]===EQUI){
      if (array_equal(list[a].body.slice(1,list[a].start_of_child(0, 2)),list[b].body)){
        add_formula(new Formula(list[a].body.slice(list[a].start_of_child(0, 2))));
      }
      if (array_equal(list[a].body.slice(list[a].start_of_child(0, 2)),list[b].body)){
        add_formula(new Formula(list[a].body.slice(1,list[a].start_of_child(0, 2))));
      }
      if (array_equal(list[a].body.slice(1,list[a].start_of_child(0, 2)),list[b].negation().body)){
        add_formula(new Formula([NOT].concat(list[a].body.slice(list[a].start_of_child(0, 2)))));
      }
      if (array_equal(list[a].body.slice(list[a].start_of_child(0, 2)),list[b].negation().body)){
        add_formula(new Formula([NOT].concat(list[a].body.slice(1,list[a].start_of_child(0, 2)))));
      }
    }

  }


  return {
    click_formula: click_formula,
    drag_drop_formula: drag_drop_formula,
    add_formula: add_formula //aspo
  }

})()
