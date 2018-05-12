IO = (function() {
  var load = function() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        daj=JSON.parse(xhttp.responseText);
      }
    };
    xhttp.open("GET", "http://127.0.0.1:3000/?file=a.json", true);
    xhttp.send();
  }

  var save = function(json) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
      }
    };
    xhttp.open("POST", "http://127.0.0.1:3000/?file=a.json", true);
    xhttp.send(json);
  }

  return {
    save: save,
    load: load
  }

})();


function replacer(key, value) {
  if (is_formula(value)) {
      return value.body.map(function(x){return x.id})
  }
  return value;
}


console.log(JSON.stringify(theorems,replacer));
var json=JSON.stringify(Operation.global_operations);

//IO.save(json);
//IO.load();
