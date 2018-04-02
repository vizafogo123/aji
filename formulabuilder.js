(function() {
  var fbuilder=document.getElementById('formula-builder');
  var bod = document.getElementById("formula-builder-body");
  var foot = document.getElementById("formula-builder-footer");
  var mode='rel';
  var fbuilder_formula = new Formula([]);

  for (var i = 0; i < Operation.builtin_operations.length; i++) {
    var img = document.createElement("img");
    var f = new Formula([Operation.builtin_operations[i]]);
    img.src = imgsrc_from_formula(f.fill_with_placeholders());
    bod.appendChild(img);
    img.addEventListener('click', (function(op) {
      return function(e) {
        if (!fbuilder_formula.is_closed() && fbuilder_formula.op_addable(op, mode)) {
          fbuilder_formula.add_op(op);
          refresh();
        } else {
          console.log("oij")
        }
      }
    })(Operation.builtin_operations[i]));
  }

  var img_result = document.createElement("img");
  foot.appendChild(img_result);


  var close = function() {
    fbuilder_formula.body = [];
    refresh();
    fbuilder.style.display = "none";
  }

  var after = function(f) {};
  var button_done = document.createElement("button");
  button_done.id = "button-done";
  button_done.textContent = "done";
  button_done.onclick = function() {
    after(fbuilder_formula.deepcopy());
    close();

  }
  foot.appendChild(button_done);

  document.getElementsByClassName("close")[0].onclick = function() {
    close();
  }

  var refresh = function() {
    img_result.src = imgsrc_from_formula(fbuilder_formula.deepcopy().fill_with_placeholders());
    button_done.disabled = !fbuilder_formula.is_closed();
  }
  refresh();

  fbuilder_show = function(a,mod='rel') {
    fbuilder.style.display = "block";
    mode=mod;
    after = a;
  }

})();
