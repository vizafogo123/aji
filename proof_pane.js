ProofPane=(function(){
  var ul = document.createElement("ul");
  document.getElementById("proof-pane").appendChild(ul);
  ul.style = "list-style-type:none";
  var add_element = function(f,id,assumption=false) {
    var img = document.createElement("article");
    img.innerHTML = html_from_formula(f);
    var li = document.createElement("li");
    ul.appendChild(li);
    li.appendChild(img);
    img.onclick = (function(n) {
      return function() {
        Proof.click_formula(n)
      }
    })(id)
    img.draggable=true;
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
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }


  var remove_element = function(index) {
    var li = document.querySelectorAll("ul li")[index];
    li.parentNode.removeChild(li);
  }

  var modify_element=function(index,f){
    document.querySelectorAll("ul li article")[index].innerHTML=html_from_formula(f);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  return {
    add_element:add_element,
    remove_element:remove_element,
    modify_element:modify_element
  }

})()
