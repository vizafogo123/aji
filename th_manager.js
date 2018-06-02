TheoremManager = (function() {
  document.querySelector("#theorem-manager .close").onclick = function() {
    //close();
    document.querySelector("#theorem-manager").style.display = "none";
  };

  var init = function() {
    var bod = document.querySelector("#theorem-manager-body");
    for (i in theorems) {
      var div = document.createElement("div");
      div.innerHTML = html_from_formula(theorems[i].formula);
      bod.appendChild(div);

      var div = document.createElement("div");
      bod.appendChild(div);
      div.onclick = (function(x) {
        return function() {
          var daj = prompt("Enter folder name", "");
          if (daj) x.innerHTML = daj;
        }
      })(div);

      var div = document.createElement("div");
      bod.appendChild(div);

      var div = document.createElement("div");
      var button = document.createElement("button");
      div.appendChild(button);
      button.innerHTML = "Delete";
      button.onclick = (function(x) {
        return function() {
          theorems.splice(x,1);
          IO.save();
        }
      })(i);
      bod.appendChild(div);

      var div = document.createElement("div");
      bod.appendChild(div);
      var j = 0;
      while (theorems[i].formula.body[j] === FORALL) j = j + 2;
      if (theorems[i].formula.body[j] === UNIQUE) {
        var button = document.createElement("button");
        div.appendChild(button);
        button.innerHTML = "Create";
        button.onclick = (function(i,j) {return function() {
          var id=get_new_def_id();
          var daj="def_{"+id.slice(3)+"} \\left( ";
          for (var k=2;k<=j;k=k+2) daj=daj+"%"+(k/2)+", ";
          daj=daj.slice(0,daj.length-2);
          daj=daj+"\\right)";
          if (j===0) daj="def_{"+id.slice(3)+"}";
          var op=new Operation(id, j / 2, daj, Operation.EXPRESSION);
          var pok=[op];
          for (var k=1;k<j;k=k+2) pok.push(theorems[i].formula.body[k]);
          var formula=new Formula(theorems[i].formula.body.slice(0,j).concat((new Formula(theorems[i].formula.body.slice(j+2)))
            .substitute(new Formula([theorems[i].formula.body[j+1]]),new Formula(pok)).body));
          Operation.global_operations.push(op);
          theorems.push({formula:formula,folder:"(base)",hidden:false});
          console.log(theorems);
          IO.save();
        }
      })(i,j);
      }
    }

  }

  var fill=function(){
    var nodes=document.querySelectorAll("#theorem-manager-body > div");
    for (var i in theorems) {
      nodes[5*i+1].innerHTML = theorems[i].folder;
      nodes[5*i+2].innerHTML = '<input type="checkbox"' + (theorems[i].hidden ? ' checked' : '') + '>';
    }
  }

  var show = function() {
    fill();
    document.querySelector("#theorem-manager").style.display = "block";
  }

  document.querySelector("#th-man-cancel").onclick = function() {
    document.querySelector("#theorem-manager").style.display = "none";
  }

  document.querySelector("#th-man-done").onclick = function() {
    var c = document.querySelectorAll("#theorem-manager-body div:nth-child(5n+7)");
    var checkboxes = document.querySelectorAll("#theorem-manager-body input");
    for (i in theorems) {
      theorems[i].folder = c[i].innerHTML;
      theorems[i].hidden = checkboxes[i].checked;
    }
    document.querySelector("#theorem-manager").style.display = "none";
    IO.save();
  }

  return {
    show: show,
    init: init
  }

})()
