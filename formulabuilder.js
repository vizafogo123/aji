var bod = document.getElementById("formula-builder-body");


for (var i=0;i<Operation.builtin_operations.length;i++){
  var img = document.createElement("img");
  var f=new Formula([Operation.builtin_operations[i]]);
  img.src = imgsrc_from_formula(f.fill_with_placeholders());
  bod.appendChild(img);
}
