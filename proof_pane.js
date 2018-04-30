ProofPane = (function() {
  document.getElementById("assumption").draggable=false;
  var img_del=document.getElementById("delete");
  img_del.draggable = false;
  img_del.ondrop=function(event){
    event.preventDefault();
    Proof.remove_request(event.dataTransfer.getData("text"));
  }
  img_del.ondragover = function(event) {
    event.preventDefault();
  }

  var pr_pane=document.getElementById("proof-pane");
  var add_element = function(f, id, assumption = false) {
    var img = document.createElement("article");
    img.innerHTML = html_from_formula(f);
    pr_pane.appendChild(img);
    img.onclick = (function(n) {
      return function() {
        Proof.click_formula(n)
      }
    })(id)
    img.draggable = true;
    img.ondrop = (function(n) {
      return function(event) {
        event.preventDefault();
        img.classList.remove("poj");
        Proof.drag_drop_formula(event.dataTransfer.getData("text"), n);
      }
    })(id)

    img.ondragover = function(event) {
      event.preventDefault();
    }

    img.ondragenter= function(event) {
      img.classList.add("poj");
    }

    img.ondragleave= function(event) {
      img.classList.remove("poj");
    }

    img.ondragstart = (function(n) {
      return function(event) {
        event.dataTransfer.setData("text/plain", n);
      }
    })(id)

    if (assumption) img.style.background = "#a7f"
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }


  var remove_element = function(index) {
    var li = document.querySelectorAll("#proof-pane article")[index];
    li.parentNode.removeChild(li);
  }

  var modify_element = function(index, f) {
    document.querySelectorAll("#proof-pane article")[index].innerHTML = html_from_formula(f);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  return {
    add_element: add_element,
    remove_element: remove_element,
    modify_element: modify_element
  }

})();

(function() {
  var proof_pane = document.getElementById("proof-pane");
  for (i in theorems) {
    var img = document.createElement("article");
    img.innerHTML = html_from_formula(theorems[i]);
    document.getElementById("theorem-pane").appendChild(img);
    img.onclick = (function(fo) {
      return function() {
        Proof.click_theorem(fo)
      }
    })(theorems[i])
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

  }

})()


Proof.add_formula(new Formula([FORALL,A,FORALL,B,EQUALS,TIMES,A,SUC,B,PLUS,TIMES,A,B,A]));
Proof.add_formula(new Formula([FORALL,A,FORALL,B,EQUALS,TIMES,A,SUC,B,PLUS,TIMES,A,B,A]));
Proof.add_formula(new Formula([FORALL,A,FORALL,B,EQUALS,TIMES,A,SUC,B,PLUS,TIMES,A,B,A]));
Proof.add_formula(new Formula([AND,AND,FORALL,A,FORALL,B,EQUALS,TIMES,A,SUC,B,PLUS,TIMES,A,B,A,FORALL,A,FORALL,B,EQUALS,TIMES,A,SUC,B,PLUS,TIMES,A,B,A,FORALL,A,FORALL,B,EQUALS,TIMES,A,SUC,B,PLUS,TIMES,A,B,A]));
