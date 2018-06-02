NewDefWindow = (function() {
  document.querySelector("#new-def .close").onclick = function() {
    //close();
    document.querySelector("#new-def").style.display = "none";
  };
  var init = function() {
    var VARS = [
      new Operation("vara", 0, "a", Operation.VARIABLE),
      new Operation("varb", 0, "b", Operation.VARIABLE),
      new Operation("varc", 0, "c", Operation.VARIABLE)
    ];
    var no_of_args = Number(document.querySelector("#no-of-args").value);
    var type = document.querySelector("#def-type").value;
    var formula = false;
    var res_formula = false;
    var op_name = "";
    var op = new Operation(get_new_def_id(), no_of_args, "", 0);
    var set_res_formula = function() {
      if (formula) {
        var f = new Formula([(type === 'rel' ? EQUI : EQUALS), op]
          .concat(ARGUMENTS.slice(0, no_of_args)).concat(formula.body))
        document.querySelector("#def-formula").innerHTML = html_from_formula(f);
        res_formula = f;
      }
    }
    var refresh_op = function() {
      op.no_of_args = no_of_args;
      op.print_scheme = op.print_scheme = document.querySelector("#print-scheme").value;
      op.type = type === "rel" ? Operation.RELATION : Operation.EXPRESSION;
    }
    refresh_op();

    document.querySelector("#no-of-args").onchange = function() {
      no_of_args = Number(document.querySelector("#no-of-args").value);
      refresh_op();
      formula = false;
      document.querySelector("#def-formula").innerHTML = "";
    }

    document.querySelector("#def-type").onchange = function() {
      type = document.querySelector("#def-type").value;
      formula = false;
      refresh_op();
      document.querySelector("#def-formula").innerHTML = "";
    }

    document.querySelector("#print-scheme").onchange = function() {
      op.print_scheme = document.querySelector("#print-scheme").value;
    }

    document.querySelector("#give-def").onclick = function() {
      FormulaBuilder.show(function(f) {
        formula = f;
        set_res_formula();
      }, mod = type, args = ARGUMENTS.slice(0, no_of_args), forb_vars = VARS.slice(0, no_of_args).map(function(x) {
        return x.print_scheme
      }))

    };

    document.querySelector("#def-done").onclick = function() {
      var f = res_formula;
      for (var i = no_of_args - 1; i >= 0; i--) {
        f.body = [FORALL, VARS[i]].concat(f.substitute(new Formula([ARGUMENTS[i]]), new Formula([VARS[i]])).body);
      }
      //document.querySelector("#def-formula").innerHTML=html_from_formula(f);
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      Operation.global_operations.push(op);
      theorems.push({
        formula: f,
        folder: "(base)"
      });
      IO.save();
    };

  }

  var show = function() {
    document.querySelector("#new-def").style.display = "block";
  }

  return {
    init: init,
    show: show
  }

})()

var get_new_def_id=function(){
  var i = 1,
    ids = Operation.global_operations.map(function(x) {
      return x.id
    });
  while (ids.includes("def" + i)) i = i + 1;
  return "def"+i;
}

DefManager = (function() {
  document.querySelector("#def-manager .close").onclick = function() {
    document.querySelector("#def-manager").style.display = "none";
  };

  var init = function() {
    var bod = document.querySelector("#def-manager-body");
    for (var i in Operation.global_operations) {
      var div1 = document.createElement("div");
      bod.appendChild(div1);

      var div = document.createElement("div");
      div.innerHTML = Operation.global_operations[i].type===Operation.EXPRESSION ? "Expression" : "Relation";
      bod.appendChild(div);

      var div = document.createElement("div");
      div.innerHTML = Operation.global_operations[i].no_of_args;
      bod.appendChild(div);

      var div = document.createElement("div");
      bod.appendChild(div);
      div.onclick = (function(x,y,z) {
        return function() {
          var daj = prompt("Enter new schema", x.innerHTML);
          if (daj) x.innerHTML = daj;
          y.innerHTML=html_from_formula((new Formula([new Operation("asop",Operation.global_operations[z].no_of_args,
            daj,Operation.global_operations[z].type)])).fill_with_placeholders());
          MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
      })(div,div1,i);

      var div = document.createElement("div");
      div.innerHTML = '<input type="checkbox">';
      bod.appendChild(div);

      var div = document.createElement("div");
      var button = document.createElement("button");
      div.appendChild(button);
      button.innerHTML = "Delete";
      button.onclick = (function(x) {
        return function() {
          var k=0;
          while(k<theorems.length){
            if (theorems[k].formula.body.includes(Operation.global_operations[x])){
              theorems.splice(k,1);
            } else {
              k+=1;
            }
          }
          Operation.global_operations.splice(x,1);
          IO.save();
        }
      })(i);
      bod.appendChild(div);
    }

  }

  var fill=function(){
    var nodes=document.querySelectorAll("#def-manager-body > div");
    for (var i in Operation.global_operations) {
      nodes[6*i].innerHTML = html_from_formula((new Formula([Operation.global_operations[i]])).fill_with_placeholders());
      nodes[6*i+3].innerHTML = Operation.global_operations[i].print_scheme;
      nodes[6*i+4].childNodes[0].checked=Operation.global_operations[i].hidden ? true : false;
    }
  }

  var show = function() {
    fill();
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    document.querySelector("#def-manager").style.display = "block";
  }

  document.querySelector("#def-man-cancel").onclick = function() {
    document.querySelector("#def-manager").style.display = "none";
  }

  document.querySelector("#def-man-done").onclick = function() {
    var c = document.querySelectorAll("#def-manager-body div:nth-child(6n+10)");
    var checkboxes = document.querySelectorAll("#def-manager-body input");
    for (i in Operation.global_operations) {
      Operation.global_operations[i].print_scheme = c[i].innerHTML;
      Operation.global_operations[i].hidden = checkboxes[i].checked;
    }
    document.querySelector("#def-manager").style.display = "none";
    IO.save();
  }

  return {
    show: show,
    init: init
  }

})()
