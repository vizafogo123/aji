function imgsrc_from_formula(f) {
  return "http://latex.codecogs.com/svg.latex?" + f.to_latex()
}

function html_from_formula(f) {
  return "\\( " + f.to_latex() + " \\)";
}

function negate(arr){
  if (arr[0] === NOT) {
    return arr.slice(1)
  } else {
    return [NOT].concat(arr)
  }
}

var array_equal = function(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

var is_formula=function(f){
  if (!f) return false;
  return f.start_of_child
}

function Formula(body) {
  this.body = body;

  this.remove_double_neg = function() {
    for (var i = 0; i < this.body.length - 1; i++) {
      if (this.body[i] === NOT && this.body[i + 1] === NOT) {
        this.body = this.body.slice(0, i).concat(this.body.slice(i + 2));
      }
    }
  }

  this.remove_double_neg();

  this.deepcopy = function() {
    return new Formula(this.body.slice());
  }

  this.negation = function() {
    return new Formula(negate(this.body));
  }

  this.equals = function(f) {
    return array_equal(this.body, f.body);
  }

  this.start_of_child = function(n, k) {
    var i = n;
    var depth = -1;
    var ch_n = 0;
    while (true) {
      if (depth === -1) {
        ch_n++;
        depth = 0;
      }
      if (ch_n === k) {
        return i + 1;
      }
      i++;
      depth += this.body[i].no_of_args - 1;
    }
  }

  this.to_latex = function() {
    var p = Array();
    var i = this.body.length - 1;
    while (i >= 0) {
      var args = Array();
      for (var k = 1; k <= this.body[i].no_of_args; k++) {
        args[k - 1] = p[this.start_of_child(i, k)];
      }
      p[i] = this.body[i].printout(args);
      i -= 1;
    }
    return p[0];
  }

  this.parent_and_no_of_child = function(k) {
    if (k === 0) return [-1, 1];
    k--;
    var n = this.body[k].no_of_args - 1;
    while (n < 0) {
      k--;
      n += this.body[k].no_of_args - 1;
    }
    return [k, this.body[k].no_of_args - n]
  }

  this.op_addable = function(op, type) {
    if (this.body.length === 0) {
      var parent = (type === 'rel' ? NOT : EQUALS);
      var no_of_child = 1;
    } else {
      var x = this.parent_and_no_of_child(this.body.length);
      var parent = x[0];
      var no_of_child = x[1];
      parent = this.body[parent];
    }
    if (Operation.can_follow(parent, op, no_of_child)) {
      if (op.type === Operation.VARIABLE) {
        var p = this.parent_and_no_of_child(this.body.length)[0];
        if (parent.type === Operation.QUANTOR) {
          while (p >= 0) {
            if (this.body[p].type === Operation.QUANTOR && this.body[p + 1] === op) return false;
            p = this.parent_and_no_of_child(p)[0];
          }
          if (p < 0) return true;
        } else {
          while (p >= 0) {
            if (this.body[p].type === Operation.QUANTOR && this.body[p + 1] === op) return true;
            p = this.parent_and_no_of_child(p)[0];
          }
          if (p < 0) return false;
        }
      }
      return true;
    }
    return false;
  }

  this.add_op = function(op) {
    if (this.body.length > 0 && op === NOT && this.body[this.body.length - 1] === NOT) {
      this.body.pop();
    } else this.body.push(op);
  }

  this.fill_with_placeholders = function() {
    var k = 1 + this.body.reduce(function(total, elem) {
      return total + elem.no_of_args - 1
    }, 0);
    for (var i = 0; i < k; i++) this.body.push(PLACEHOLDER);
    return this;
  }

  this.is_closed = function() {
    return this.body.reduce(function(total, elem) {
      return total + elem.no_of_args - 1
    }, 0) === -1;
  }

  this.substitute_parallel = function(source_list, dest_list) {
    var k = 0;
    res = this.deepcopy();
    while (k < res.body.length) {
      var b = true;
      for (var n = 0; n < source_list.length; n++) {
        if (b && array_equal(res.body.slice(k, k + source_list[n].body.length), source_list[n].body)) {
          res.body = res.body.slice(0, k).concat(dest_list[n].body)
            .concat(res.body.slice(k + source_list[n].body.length));
          k += dest_list[n].body.length;
          b = false;
        }
      }
      if (b) k++;
    }
    return res;
  }

  this.substitute = function(source, dest) {
    return this.substitute_parallel([source], [dest]);
  }

  this.first_child = function(k) {
    return this.body.slice(k + 1, this.start_of_child(k, 2));
  }
  this.second_child = function(k) { //only applicable if last
    return this.body.slice(this.start_of_child(k, 2));
  }

  this.substitute_definition = function(fun, definition) {
    var res = this.deepcopy();
    var k = res.body.length - 1;
    while (k >= 0) {
      if (res.body[k] === fun.body[0]) {
        var source_list = [];
        for (var v = 1; v <= res.body[k].no_of_args; v++) source_list.push(new Formula([fun.body[v]]));
        var dest_list = [];
        for (var v = 1; v <= res.body[k].no_of_args; v++) dest_list.push(new Formula(
          res.body.slice(res.start_of_child(k, v), res.start_of_child(k, v + 1))));
        res.body = res.body.slice(0, k).concat(definition.deepcopy().substitute_parallel(source_list, dest_list).body)
          .concat(res.body.slice(res.start_of_child(k, res.body[k].no_of_args + 1)));
      }
      k = k - 1;
    }
    return res;

  }

  this.match_pattern = function(source, vars) {
    var i = 0,
      j = 0,
      c = 0,
      res = Array(),
      subf, k;
    while (i < source.length && j < this.body.length) {
      if (vars.includes(source[i])) {
        k = vars.findIndex(function(x) {
          return x === source[i]
        });
        subf = this.body.slice(j, this.start_of_child(j, this.body[j].no_of_args + 1));
        if (res[k]) {
          if (!array_equal(res[k].body, subf)) {
            return
          }
        } else {
          res[k] = new Formula(subf);
          c = c + 1;
        }
        i = i + 1;
        j = j + subf.length;
      } else {
        if (source[i] === this.body[j]) {
          i = i + 1;
          j = j + 1;
        } else {
          return
        }
      }
    }
    if (c === vars.length) {
      for (i = 0; i < res.length; i++)
        for (j = 0; j < res[i].body.length; j++)
          if (res[i].body[j].type === Operation.VARIABLE) return;
      return res;
    }
  }

  this.match_subpattern = function(source, vars) {
    if (source.length <= 1) return [];
    var res, i, subf, r;
    var res = Array();
    for (i = 0; i <= this.body.length - source.length; i++) {
      if (source[0] === this.body[i]) {
        subf = this.body.slice(i, this.start_of_child(i, this.body[i].no_of_args + 1));
        if (subf.length >= source.length) {
          r = (new Formula(subf)).match_pattern(source, vars);
          if (r) res.push({sub:r,location:i});
        }
      }
    }
    return res;
  }


}
