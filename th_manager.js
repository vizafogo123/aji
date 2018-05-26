TheoremManager = (function() {
  document.querySelector("#theorem-manager .close").onclick = function() {
    //close();
    document.querySelector("#theorem-manager").style.display = "none";
  };

  var show = function() {
    document.querySelector("#theorem-manager").style.display = "block";
  }

  var init = function() {
    var bod = document.querySelector("#theorem-manager-body");
    for (i in theorems) {
      var div = document.createElement("div");
      div.innerHTML = html_from_formula(theorems[i].formula);
      bod.appendChild(div);

      var div = document.createElement("div");
      div.innerHTML = theorems[i].folder;
      bod.appendChild(div);
      div.onclick=(function(x){
        return function(){
          var daj=prompt("Enter folder name", "");
          if (daj) x.innerHTML=daj;
        }
      })(div);

      var div = document.createElement("div");
      div.innerHTML = '<input type="checkbox">';
      bod.appendChild(div);

      var div = document.createElement("div");
      div.innerHTML = "pok";
      bod.appendChild(div);
    }

  }

  document.querySelector("#th-man-cancel").onclick=function(){
    document.querySelector("#theorem-manager").style.display = "none";
  }

  document.querySelector("#th-man-done").onclick=function(){
    var c=document.querySelectorAll("#theorem-manager-body div:nth-child(4n+6)");
    for (i in theorems) {
      theorems[i].folder=c[i].innerHTML;
    }
    document.querySelector("#theorem-manager").style.display = "none";
    IO.save();
  }

  return {
    show: show,
    init: init
  }

})()
