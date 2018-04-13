function cheat_add_formula() {
  FormulaBuilder.show(Proof.add_formula)
}

ul = document.createElement("ul");
document.body.appendChild(ul);
ul.style = "list-style-type:none";

FormulaPane=(function(){
  var add_element = function(f,id,assumption=false) {
    var img = document.createElement("img");
    img.src = imgsrc_from_formula(f);
    var li = document.createElement("li");
    ul.appendChild(li);
    li.appendChild(img);
    img.onclick = (function(n) {
      return function() {
        Proof.click_formula(n)
      }
    })(id)

    img.ondrop = (function(n) {
      return function(event) {
        event.preventDefault();
        Proof.drag_drop_formula(event.dataTransfer.getData("text"), n);
      }
    })(id)

    img.ondragover = function(event) {
      event.preventDefault();
    }

    img.ondragstart = (function(n) {
      return function(event) {
        event.dataTransfer.setData("text/plain", n);
      }
    })(id)

    if (assumption) img.style.background="#a7f"
  }


  var remove_element = function(index) {
    var li = document.querySelectorAll("ul li")[index];
    li.parentNode.removeChild(li);
  }

  var modify_element=function(index,f){
    document.querySelectorAll("ul li img")[index].src=imgsrc_from_formula(f);
  }

  return {
    add_element:add_element,
    remove_element:remove_element,
    modify_element:modify_element
  }

})()
