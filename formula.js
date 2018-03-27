function imgsrc_from_formula(f){
  return "http://latex.codecogs.com/svg.latex?"+f.to_latex()
}

function Formula(body){
  this.body=body;

  this.negation=function(){
    if (body[0]===NOT){
      return new Formula(this.body.slice(1))
    } else {
      return new Formula([NOT].concat(this.body))
    }
  }

  this.equals=function(f){
    if (this.body.length!==f.body.length) return false;
    for(var i=0;i<this.body.length;i++){
      if (this.body[i]!==f.body[i]) return false;
    }
    return true;
  }

  this.start_of_child=function(n,k){
    var i=n;
    var depth=-1;
    var ch_n=0;
    while(true){
      if (depth===-1){
        ch_n++;
        depth=0;
      }
      if (ch_n===k){
        return i+1;
      }
      i++;
      depth+=this.body[i].no_of_args - 1;
    }
  }

  this.to_latex=function(){
    var p=Array();
    var i = this.body.length - 1;
    while (i >= 0){
        var args=Array();
        for (var k=1;k<=this.body[i].no_of_args;k++){
          args[k-1]=p[this.start_of_child(i, k)];
        }
        p[i] = this.body[i].printout(args);
        i -= 1;
    }
    return p[0];
  }

  this.substitute_equivalence=function(n){
    this.body = this.body.slice(0,n).concat([AND, IF]).concat(this.body.slice(n + 1,this.start_of_child(n, 3)))
      .concat([IF]).concat(this.body.slice(this.start_of_child(n, 2),this.start_of_child(n, 3)))
      .concat(this.body.slice(n + 1,this.start_of_child(n, 2))).concat(this.body.slice(this.start_of_child(n, 3)))
  }

  this.parent_and_no_of_child=function(k){
    if (k===0) return [-1,1];
    k--;
    var n = this.body[k].no_of_args - 1;
    while (n < 0){
        k--;
        n += this.body[k].no_of_args - 1;
    }
    return [k, this.body[k].no_of_args - n]
  }

  this.op_addable=function(op,type){
    if (this.body.length === 0){
        var parent = (type === 'rel' ? NOT : EQUALS);
        var no_of_child = 1;
    } else {
        var x=this.parent_and_no_of_child(this.body.length);
        var parent = x[0];
        var no_of_child = x[1];
        parent = this.body[parent];
    }
    if (Operation.can_follow(parent, op, no_of_child)){
        if (op.type === Operation.VARIABLE){
            if (parent.type === Operation.QUANTOR && no_of_child === 1) {
                for (var i=0; i<this.body.length;i++){
                    if (this.body[i] === op) return false;
                }
            } else {
                var p = this.parent_and_no_of_child(this.body.length)[0];
                while (p >= 0){
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

  this.fill_with_placeholders=function(){
    var k=1+this.body.reduce(function(total,elem){return total+elem.no_of_args-1},0);
    var bod=this.body.valueOf();
    for (var i=0;i<k;i++) bod.push(PLACEHOLDER);
    return new Formula(bod);
  }
}
