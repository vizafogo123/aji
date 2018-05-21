NewDefWindow=(function(){
  document.querySelector("#new-def .close").onclick = function() {
    //close();
    document.querySelector("#new-def").style.display = "none";
  };

  var VARS=[
    new Operation("vara", 0, "a", Operation.VARIABLE),
    new Operation("varb", 0, "b", Operation.VARIABLE),
    new Operation("varc", 0, "c", Operation.VARIABLE)
  ];
  var no_of_args=Number(document.querySelector("#no-of-args").value);
  var type=document.querySelector("#def-type").value;
  var formula=false;
  var res_formula=false;
  var op=new Operation("ojioj", no_of_args, "", 0);
  var set_res_formula=function(){
    if (formula) {
      var f=new Formula([(type==='rel'?EQUI:EQUALS),op]
        .concat(ARGUMENTS.slice(0, no_of_args)).concat(formula.body))
      document.querySelector("#def-formula").innerHTML=html_from_formula(f);
      res_formula=f;
    }
  }
  var refresh_op=function(){
    op.no_of_args=no_of_args;
    op.print_scheme=op.print_scheme=document.querySelector("#print-scheme").value;
    op.type=type==="rel" ? Operation.RELATION : Operation.EXPRESSION;
  }
  refresh_op();

  document.querySelector("#no-of-args").onchange=function(){
    no_of_args=Number(document.querySelector("#no-of-args").value);
    refresh_op();
    formula=false;
    document.querySelector("#def-formula").innerHTML="";
  }

  document.querySelector("#def-type").onchange=function(){
    type=document.querySelector("#def-type").value;
    formula=false;
    refresh_op();
    document.querySelector("#def-formula").innerHTML="";
  }

  document.querySelector("#print-scheme").onchange=function(){
    op.print_scheme=document.querySelector("#print-scheme").value;
    console.log(op.print_scheme);
  }

  document.querySelector("#give-def").onclick = function() {
    FormulaBuilder.show(function(f) {
      formula=f;
      set_res_formula();
    }, mod = type, args = ARGUMENTS.slice(0, no_of_args),forb_vars=VARS.slice(0, no_of_args).map(function(x){return x.print_scheme}))

  };

  document.querySelector("#def-done").onclick = function() {
    var f=res_formula;
    for (var i=no_of_args-1;i>=0;i--) {
      f.body=[FORALL,VARS[i]].concat(f.substitute(new Formula([ARGUMENTS[i]]),new Formula([VARS[i]])).body);
    }
    //document.querySelector("#def-formula").innerHTML=html_from_formula(f);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    Operation.global_operations.push(op);
    theorems.push({formula:f});
    IO.save();
  };

  var show=function(){
    document.querySelector("#new-def").style.display = "block";
  }

  return {show:show}

})()
