function Operation(id, no_of_args, print_scheme, name, type) {
  this.id = id;
  this.no_of_args = no_of_args;
  this.print_scheme = print_scheme;
  this.name = name;
  this.type = type;

  this.printout = function(arg_list) {
    var s = this.print_scheme;
    for (var i = 0; i < arg_list.length; i++) {
      s = s.replace("%" + (i + 1), arg_list[i])
    }
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


FORALL = new Operation(1, 2, "\\forall %1 : \\, %2", "forall", Operation.QUANTOR);
EXISTS = new Operation(2, 2, "\\exists %1 : \\, %2", "exists", Operation.QUANTOR);
UNIQUE = new Operation(3, 2, "\\exists ! %1 : \\, %2", "unique", Operation.QUANTOR);

IF = new Operation(4, 2, "\\left[ %1 \\rightarrow %2 \\right]", "if", Operation.LOGICAL);
EQUI = new Operation(5, 2, "\\left[ %1 \\Leftrightarrow %2 \\right]", "equivalent", Operation.LOGICAL);
OR = new Operation(6, 2, "\\left[ %1 \\vee %2 \\right]", "or", Operation.LOGICAL);
AND = new Operation(7, 2, "\\left[ %1 \\wedge %2 \\right]", "and", Operation.LOGICAL);
NOT = new Operation(8, 1, "\\neg %1", "not", Operation.LOGICAL);

EQUALS = new Operation(9, 2, "%1 = %2", "equals", Operation.RELATION);

PLACEHOLDER = new Operation("place", 0, "\\Box", "placeholder", Operation.PLACEHOLDER);
Operation.builtin_operations = [FORALL, EXISTS, UNIQUE, IF, OR, AND, NOT, EQUI, EQUALS];
