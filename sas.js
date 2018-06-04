COLOR_VARIABLES=true;

function Operation(id, no_of_args, print_scheme, type) {
  this.id = id;
  this.no_of_args = no_of_args;
  this.print_scheme = print_scheme;
  this.type = type;

  this.printout = function(arg_list) {
    var s = this.print_scheme;
    for (var i = 0; i < arg_list.length; i++) {
      s = s.replace("%" + (i + 1), arg_list[i])
    }
    if (this.type===Operation.VARIABLE && COLOR_VARIABLES) s="\\color{blue}{"+s+"}";
    return s;
  }
}
Operation.QUANTOR = 0;
Operation.VARIABLE = 1;
Operation.LOGICAL = 2;
Operation.RELATION = 3;
Operation.EXPRESSION = 4;
Operation.PLACEHOLDER = 5;

Operation.can_follow = function(parent, child, no_of_child) {
  return (parent.type === Operation.QUANTOR && child.type === Operation.VARIABLE && no_of_child === 1) ||
    (parent.type === Operation.QUANTOR && [Operation.LOGICAL, Operation.RELATION, Operation.QUANTOR]
      .includes(child.type) && no_of_child === 2) ||
    (parent.type === Operation.LOGICAL && [Operation.LOGICAL, Operation.RELATION, Operation.QUANTOR]
      .includes(child.type)) ||
    (parent.type === Operation.RELATION && [Operation.EXPRESSION, Operation.VARIABLE].includes(child.type)) ||
    (parent.type === Operation.EXPRESSION && [Operation.EXPRESSION, Operation.VARIABLE].includes(child.type))
}


FORALL = new Operation("forall", 2, "\\forall %1 : \\, %2", Operation.QUANTOR);
EXISTS = new Operation("exists", 2, "\\exists %1 : \\, %2", Operation.QUANTOR);
UNIQUE = new Operation("unique", 2, "\\exists ! %1 : \\, %2", Operation.QUANTOR);

IF = new Operation("if", 2, "\\left[ %1 \\rightarrow %2 \\right]",  Operation.LOGICAL);
EQUI = new Operation("equi", 2, "\\left[ %1 \\Leftrightarrow %2 \\right]", Operation.LOGICAL);
OR = new Operation("or", 2, "\\left[ %1 \\vee %2 \\right]", Operation.LOGICAL);
AND = new Operation("and", 2, "\\left[ %1 \\wedge %2 \\right]", Operation.LOGICAL);
NOT = new Operation("not", 1, "\\neg %1", Operation.LOGICAL);

EQUALS = new Operation("equals", 2, "%1 = %2", Operation.RELATION);

PLACEHOLDER = new Operation("place", 0, "\\Box", Operation.PLACEHOLDER);

Operation.builtin_operations = [FORALL, EXISTS, UNIQUE, IF, OR, AND, NOT, EQUI, EQUALS];
Operation.global_operations=[];
Operation.local_operations=[];
Operation.blank_operations=[];
