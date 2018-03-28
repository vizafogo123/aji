(function(){
  var bod = document.getElementById("formula-builder-body");
  var foot = document.getElementById("formula-builder-footer");
  var fbuilder_formula=new Formula([]);

  for (var i=0;i<Operation.builtin_operations.length;i++){
    var img = document.createElement("img");
    var f=new Formula([Operation.builtin_operations[i]]);
    img.src = imgsrc_from_formula(f.fill_with_placeholders());
    bod.appendChild(img);
    img.addEventListener('click',(function(op){
      return function(e){
        if (fbuilder_formula.op_addable(op,'rel')){
          fbuilder_formula.add_op(op);
          refresh_result();
        } else {console.log("oij")}
      }
    })(Operation.builtin_operations[i]));
  }

  var img_result = document.createElement("img");
  foot.appendChild(img_result);

  var refresh_result=function(){
    img_result.src = imgsrc_from_formula(fbuilder_formula.deepcopy().fill_with_placeholders());
  }
  refresh_result();



})();
