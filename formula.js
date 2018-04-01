function imgsrc_from_formula(f) {
  return "http://latex.codecogs.com/svg.latex?" + f.to_latex()
}

var array_equal = function(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function Formula(body) {
  this.body = body;

  this.deepcopy = function() {
    return new Formula(this.body.slice());
  }

  this.negation = function() {
    if (body[0] === NOT) {
      return new Formula(this.body.slice(1))
    } else {
      return new Formula([NOT].concat(this.body))
    }
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

  this.substitute_equivalence = function(n) {
    this.body = this.body.slice(0, n).concat([AND, IF]).concat(this.body.slice(n + 1, this.start_of_child(n, 3)))
      .concat([IF]).concat(this.body.slice(this.start_of_child(n, 2), this.start_of_child(n, 3)))
      .concat(this.body.slice(n + 1, this.start_of_child(n, 2))).concat(this.body.slice(this.start_of_child(n, 3)))
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
        if (parent.type === Operation.QUANTOR && no_of_child === 1) {
          for (var i = 0; i < this.body.length; i++) {
            if (this.body[i] === op) return false;
          }
        } else {
          var p = this.parent_and_no_of_child(this.body.length)[0];
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
    this.body.push(op);
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

}
