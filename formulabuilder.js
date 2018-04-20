FormulaBuilder = (function() {
  var fbuilder = document.getElementById('formula-builder');
  var foot = document.getElementById("formula-builder-footer");
  var mode = 'rel';
  var after = function(f) {};
  var fbuilder_formula = new Formula([]);

  var add_op = function(op, local = false) {
    //var img = document.createElement("img");
    //img.src = imgsrc_from_formula((new Formula([op])).fill_with_placeholders());
    var img = document.createElement("article");
    img.innerHTML = "\\( " + (new Formula([op])).fill_with_placeholders().to_latex() + " \\)";
    var parent = (local ? document.getElementById("loc") :
      (op.type === Operation.QUANTOR ? document.getElementById("qua") :
        (op.type === Operation.LOGICAL ? document.getElementById("log") :
          (op.type === Operation.EXPRESSION ? document.getElementById("exp") :
            (op.type === Operation.RELATION ? document.getElementById("rel") :
              (op.type === Operation.VARIABLE ? document.getElementById("var") : 0))))));
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
    var loc = document.getElementById("loc");
    var k = loc.childElementCount,
      i;
    for (i = 0; i < k - 1; i++) loc.removeChild(loc.lastChild);

    for (var i in Operation.local_operations) {
      add_op(Operation.local_operations[i], local = true);
    }
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

  var img_result = document.getElementById("img-result");
  //var p = document.createElement("p");
  //foot.appendChild(p);
  var refresh = function() {
    img_result.src = imgsrc_from_formula(fbuilder_formula.deepcopy().fill_with_placeholders());
    button_done.disabled = !fbuilder_formula.is_closed();
    button_clear.disabled = fbuilder_formula.body.length === 0;
    button_backspace.disabled = fbuilder_formula.body.length === 0;
    //p.innerHTML = "\\( " + fbuilder_formula.deepcopy().fill_with_placeholders().to_latex() + " \\)";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
  refresh();

  var show = function(a, mod = 'rel') {
    fbuilder.style.display = "block";
    mode = mod;
    after = a;
  }

  return {
    show: show,
    refresh_locals: refresh_locals
  }

})();
