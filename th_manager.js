TheoremManager=(function(){
  document.querySelector("#theorem-manager .close").onclick = function() {
    //close();
    document.querySelector("#theorem-manager").style.display = "none";
  };

  var show=function(){
    document.querySelector("#theorem-manager").style.display = "block";
  }

  return {show:show}

})()
