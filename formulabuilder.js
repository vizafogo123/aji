FormulaBuilder = (function() {
  var fbuilder = document.getElementById('formula-builder');
  var foot = document.getElementById("formula-builder-footer");
  var mode = 'rel';
  var after = function(f) {};
  var fbuilder_formula = new Formula([]);
  var vars = Array();

  var remove_all_child_nodes = function(node) {
    var k = node.childElementCount,
      i;
    for (i = 0; i < k - 1; i++) node.removeChild(node.lastChild);
  }

  var add_var = function(printout, n) {
    var div=document.createElement("div");
    div.className="variable-div";
    document.getElementById("var").appendChild(div);
    var img = document.createElement("article");
    img.innerHTML = html_from_formula((new Formula([new Operation("", 0, printout, Operation.VARIABLE)])));
    div.appendChild(img);
    var modify=document.createElement("button");
    modify.className="var-mod-button";
    div.appendChild(modify);
    modify.innerHTML="X";
    modify.onclick=function(){
      printout=prompt("Input variable name in LaTeX",printout);
      img.innerHTML = html_from_formula((new Formula([new Operation("", 0, printout, Operation.VARIABLE)])));
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
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
          vars[k] = new Operation("var" + k, 0, printout, Operation.VARIABLE);
          fbuilder_formula.add_op(vars[k]);
          refresh();
          modify.disabled=true;
        }
      }
    })(n));
  }
  add_var("x", 0);
  add_var("y", 1);
  add_var("z", 2);

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
    var ops = Operation.builtin_operations.concat(Operation.global_operations);
    for (var i = 0; i < ops.length; i++) {
      add_op(ops[i]);
    }
  }
  add_globals();

  var refresh_locals = function() {
    remove_all_child_nodes(document.getElementById("loc"));

    for (var i in Operation.local_operations) {
      add_op(Operation.local_operations[i], local = true);
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
  refresh_locals();

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

  document.getElementsByClassName("close")[0].onclick = function() {
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
  refresh();

  var show = function(a, mod = 'rel', args = []) {
    mode = mod;
    after = a;
    if (vars.length > 0) {
      remove_all_child_nodes(document.getElementById("var"));
      vars = Array();
      add_var("x", 0);
      add_var("y", 1);
      add_var("z", 2);
    }
    remove_all_child_nodes(document.getElementById("arg"));
    if (args.length > 0) {
      for (var i in args) add_op(args[i], local = false, argument = true);
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    fbuilder.style.display = "block";
  }

  return {
    show: show,
    refresh_locals: refresh_locals
  }

})();
