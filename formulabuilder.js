FormulaBuilder = (function() {
  var fbuilder = document.getElementById('formula-builder');
  var foot = document.getElementById("formula-builder-footer");
  var mode = 'rel';
  var after = function(f) {};
  var fbuilder_formula = new Formula([]);
  var vars = Array();
  var vars2 = Array();
  var no_of_vars = 0;
  var default_vars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
  var forb_vs = Array();

  var remove_all_child_nodes = function(node) {
    var k = node.childElementCount,
      i;
    for (i = 0; i < k - 1; i++) node.removeChild(node.lastChild);
  }

  var add_var = function(printout) {
    vars2.push(printout);
    var div = document.createElement("div");
    div.className = "variable-div";
    document.getElementById("var").appendChild(div);
    var img = document.createElement("article");
    img.innerHTML = html_from_formula((new Formula([new Operation("", 0, printout, Operation.VARIABLE)])));
    div.appendChild(img);
    var modify = document.createElement("button");
    modify.className = "var-mod-button";
    div.appendChild(modify);
    modify.innerHTML = "X";
    var var_name = printout;
    modify.onclick = function() {
      var_name = prompt("Input variable name in LaTeX", printout);
      if (var_name) {
        img.innerHTML = html_from_formula((new Formula([new Operation("", 0, var_name, Operation.VARIABLE)])));
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
    };
    img.addEventListener('click', (function(k) {
      return function(e) {
        if (vars[k]) {
          if (!fbuilder_formula.is_closed() && fbuilder_formula.op_addable(vars[k], mode)) {
            fbuilder_formula.add_op(vars[k]);
            refresh();
          }
        } else if (fbuilder_formula.body.length > 0 &&
          fbuilder_formula.body[fbuilder_formula.body.length - 1].type === Operation.QUANTOR) {
          vars[k] = new Operation("var" + var_name, 0, var_name, Operation.VARIABLE);
          fbuilder_formula.add_op(vars[k]);
          refresh();
          modify.disabled = true;
        }
      }
    })(no_of_vars));
    no_of_vars++;
  }

  var add_new_var = function() {
    for (var i = 0; i < default_vars.length; i++) {
      if (!vars2.concat(forb_vs).includes(default_vars[i])) {
        add_var(default_vars[i]);
        return;
      }
    }
  }

  var reset_vars = function() {
    remove_all_child_nodes(document.getElementById("var"));
    vars = Array();
    vars2 = Array();
    add_new_var();
    add_new_var();
    add_new_var();
  }

  var add_op = function(op, local = false, argument = false) {
    var img = document.createElement("article");
    img.innerHTML = html_from_formula((new Formula([op])).fill_with_placeholders());
    var parent = (local ? document.getElementById("loc") :
      (argument ? document.getElementById("arg") :
        (op.type === Operation.QUANTOR ? document.getElementById("qua") :
          (op.type === Operation.LOGICAL ? document.getElementById("log") :
            (op.type === Operation.EXPRESSION ? document.getElementById("exp") :
              (op.type === Operation.RELATION ? document.getElementById("rel") : 0))))));
    parent.appendChild(img);
    img.addEventListener('click', (function(oper) {
      return function(e) {
        if (!fbuilder_formula.is_closed() && fbuilder_formula.op_addable(oper, mode)) {
          fbuilder_formula.add_op(oper);
          refresh();
        } else {
          console.log("oij")
        }
      }
    })(op));

  }

  var add_globals = function() {
    var ops = Operation.builtin_operations.concat(Operation.global_operations.filter(function(x){return !x.hidden}));
    for (var i = 0; i < ops.length; i++) {
      add_op(ops[i]);
    }
  }

  var refresh_locals = function() {
    remove_all_child_nodes(document.getElementById("loc"));
    var ops=Operation.local_operations.concat(Operation.blank_operations);
    for (var i in ops) {
      add_op(ops[i], local = true);
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  var close = function() {
    fbuilder_formula.body = [];
    refresh();
    fbuilder.style.display = "none";
  }

  var button_done = document.getElementById("button-done");
  button_done.onclick = function() {
    after(fbuilder_formula.deepcopy());
    close();
  }
  var button_clear = document.getElementById("button-clear");
  button_clear.onclick = function() {
    fbuilder_formula.body = [];
    refresh();
  }
  var button_backspace = document.getElementById("button-backspace");
  button_backspace.onclick = function() {
    fbuilder_formula.body.pop();
    refresh();
  }

  document.querySelector("#formula-builder .close").onclick = function() {
    close();
  }

  var div_result = document.getElementById("result");
  var refresh = function() {
    div_result.innerHTML = html_from_formula(fbuilder_formula.deepcopy().fill_with_placeholders());
    button_done.disabled = !fbuilder_formula.is_closed();
    button_clear.disabled = fbuilder_formula.body.length === 0;
    button_backspace.disabled = fbuilder_formula.body.length === 0;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  var init = function() {
    add_globals();
    reset_vars();
    document.getElementById("more-var-btn").onclick = function() {
      add_new_var();
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    };
    refresh();
    //refresh_locals();
  }

  var show = function(a, mod = 'rel', args = Array(), forb_vars = Array()) {
    mode = mod;
    after = a;
    no_of_vars = 0;
    forb_vs = forb_vars;
    reset_vars();
    remove_all_child_nodes(document.getElementById("arg"));
    if (args.length > 0) {
      for (var i in args) add_op(args[i], local = false, argument = true);
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    //MathJax.Hub.Queue(function(){console.log("op")});
    //a.style.width=a.children[1].offsetWidth+"px"
    fbuilder.style.display = "block";
  }

  return {
    init: init,
    show: show,
    refresh_locals: refresh_locals
  }

})();


FormulaSelector = (function() {
  document.querySelector("#formula-selector .close").onclick = function() {
    close();
  }
  var after = function(f) {};

  var remove_all_child_nodes = function(node) {
    var k = node.childElementCount,
      i;
    for (i = 0; i < k; i++) node.removeChild(node.lastChild);
  }

  var close = function() {
    document.querySelector("#formula-selector").style.display = "none";
    remove_all_child_nodes(document.querySelector("#formula-selector-body"))
  }

  var add_formulas = function(f_list, node) {
    for (var i in f_list) {
      var a = document.createElement("article");
      a.innerHTML = html_from_formula(f_list[i]);
      node.appendChild(a);
      a.addEventListener('click', (function(f) {
        return function(e) {
          after(f);
          close();
        }
      })(f_list[i]));
    }
  }

  var show = function(formulas, aft) {
    var fs=Array(),str=Array();
    for (var i in formulas){
      var s=formulas[i].body.reduce(function(total,x){return total+x.id+"."},"");
      if (!str.includes(s)){
        str.push(s);
        fs.push(formulas[i]);
      }
    }
    if (fs.length===0) return;
    if (fs.length===1) {
      aft(fs[0]);
      return
    }
    add_formulas(fs, document.querySelector("#formula-selector-body"));
    after = aft;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    document.querySelector("#formula-selector").style.display = "block";
  }

  return {
    show: show
  }


})();
