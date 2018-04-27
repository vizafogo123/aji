function cheat_add_formula() {
  FormulaBuilder.show(Proof.add_formula)
}

A = new Operation("var1", 0, "a", Operation.VARIABLE);
B = new Operation("var2", 0, "b", Operation.VARIABLE);
C = new Operation("var3", 0, "c", Operation.VARIABLE);
EMPTY = new Operation(10, 0, "\\emptyset", Operation.EXPRESSION);
ZERO = new Operation(101, 0, "0", Operation.EXPRESSION);
ONE = new Operation(102, 0, "1", Operation.EXPRESSION);
IN = new Operation(11, 2, "%1 \\in %2", Operation.RELATION);
POK = new Operation("pok", 2, "\\left( %1 \\otimes %2 \\right)", Operation.EXPRESSION);
PLUS = new Operation("plus", 2, "\\left( %1 + %2 \\right)", Operation.EXPRESSION);
TIMES = new Operation("times", 2, "\\left( %1 \\dot %2 \\right)", Operation.EXPRESSION);
REL1 = new Operation("rel1", 0, "\\phi", Operation.RELATION);
REL2 = new Operation("rel2", 0, "\\psi", Operation.RELATION);
REL3 = new Operation("rel2", 0, "\\gamma", Operation.RELATION);
Operation.builtin_operations = Operation.builtin_operations.concat([A, B, C]);
Operation.global_operations = [EMPTY, IN, POK, REL1, REL2, REL3];
Operation.local_operations = [];

theorems=[
  new Formula([FORALL,A,EQUALS,POK,A,A,EMPTY]),
  new Formula([FORALL,A,FORALL,B,FORALL,C,EQUALS,POK,A,POK,B,C,POK,POK,A,B,C]),
  new Formula([FORALL,A,EQUALS,POK,A,EMPTY,A]),
  new Formula([FORALL,A,EQUALS,POK,EMPTY,A,A])
];
