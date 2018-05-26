ProofPane = (function() {
  var is_theorem = function(str) {
    return str.includes("theo")
  }

  document.getElementById("assumption").draggable = false;
  var img_del = document.getElementById("delete");
  img_del.draggable = false;
  img_del.ondrop = function(event) {
    event.preventDefault();
    var s = event.dataTransfer.getData("text")
    if (!is_theorem(s)) Proof.remove_request(s);
  }
  img_del.ondragover = function(event) {
    event.preventDefault();
  }

  var pr_pane = document.getElementById("proof-pane");
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
        var s = event.dataTransfer.getData("text");
        if (is_theorem(s)) {
          Proof.drag_drop_theorem(theorems[s.slice(4)].formula, n);
        } else {
          Proof.drag_drop_formula(s, n);
        }
      }
    })(id)

    img.ondragover = function(event) {
      event.preventDefault();
    }

    img.ondragenter = function(event) {
      img.classList.add("poj");
    }

    img.ondragleave = function(event) {
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

TheoremPane = (function() {
  var theorems_div = document.getElementById("theorems");
  var init = function() {
    var fsel = document.getElementById("folder-selector");
    var folders = [];
    for (var i in theorems) {
      if (!folders.includes(theorems[i].folder)) {
        folders.push(theorems[i].folder);
        var option = document.createElement("option");
        option.text = theorems[i].folder;
        fsel.add(option);
      }

    }
    for (i in folders) {
      var div = document.createElement("div");
      div.id = "th_div_" + folders[i];
      theorems_div.appendChild(div);
    }
    var th_divs = document.querySelectorAll("#theorems div");

    for (i in theorems) {
      var img = document.createElement("article");
      img.innerHTML = html_from_formula(theorems[i].formula);
      //theorem_pane.appendChild(img);
      document.getElementById("th_div_" + theorems[i].folder).appendChild(img);

      img.onclick = (function(the) {
        return function() {
          Proof.click_theorem(the)
        }
      })(theorems[i])
      img.draggable = true;

      img.ondragstart = (function(n) {
        return function(event) {
          event.dataTransfer.setData("text/plain", "theo" + n);
        }
      })(i)

      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    }

    var show_nth_div = function(n) {
      for (i in folders) {
        th_divs[i].style.display = "none";
      }
      th_divs[n].style.display = "block";
    }
    show_nth_div(0);

    fsel.onchange=function(){
      show_nth_div(folders.findIndex(function(x){return x===fsel.value}))
    }

  }

  return {
    init: init
  }

})()
