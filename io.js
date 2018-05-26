IO = (function() {
  function replacer(key, value) {
    if (is_formula(value)) {
      return value.body.map(function(x) {
        return x.id
      })
    }
    return value;
  }

  var op_from_json = function(json) {
    return new Operation(json.id, json.no_of_args, json.print_scheme, json.type)
  }

  var theorem_from_json = function(json) {
    var vars = Object();
    var res = Object();
    var f = Array();
    var ops = Operation.builtin_operations.concat(Operation.global_operations);
    if (json.schema) {
      var sch = json.schema.map(op_from_json);
      ops = ops.concat(sch);
      res.schema = sch;
    }
    for (i in json.formula) {
      if (json.formula[i].slice(0, 3) === "var") {
        if (!vars[json.formula[i]])
          vars[json.formula[i]] = new Operation(json.formula[i], 0, json.formula[i].slice(3), Operation.VARIABLE);
        f.push(vars[json.formula[i]]);
      } else {
        f.push(ops.find(function(x) {
          return x.id === json.formula[i]
        }));
      }
    }
    res.formula = new Formula(f);
    res.folder=json.folder;
    return res;
  }

  var load_data = function(data) {
    Operation.global_operations = data.operations.map(op_from_json);
    theorems = data.theorems.map(theorem_from_json);
  }

  var load = function() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        load_data(JSON.parse(xhttp.responseText));
        TheoremPane.init();
        FormulaBuilder.init();
        TheoremManager.init();
      }
    };
    xhttp.open("GET", "http://127.0.0.1:3000/?file=a.json", true);
    xhttp.send();
  }

  var save = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
        location.reload();
      }
    };
    xhttp.open("POST", "http://127.0.0.1:3000/?file=a.json", true);
    xhttp.send(JSON.stringify({
      operations: Operation.global_operations,
      theorems: theorems
    }, replacer));
  }

  return {
    save: save,
    load: load
  }

})();

IO.load();

/*load_world(worlds[3]);
TheoremPane.init();
FormulaBuilder.init();
TheoremManager.init();*/
