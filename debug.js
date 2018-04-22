function cheat_add_formula() {
  FormulaBuilder.show(Proof.add_formula)
}

A = new Operation("var1", 0, "a_0", Operation.VARIABLE);
B = new Operation("var2", 0, "b_0", Operation.VARIABLE);
C = new Operation("var3", 0, "c_0", Operation.VARIABLE);
EMPTY = new Operation(10, 0, "\\emptyset", Operation.EXPRESSION);
IN = new Operation(11, 2, "%1 \\in %2", Operation.RELATION);
POK = new Operation("pok", 2, "\\left( %1 \\otimes %2 \\right)", Operation.EXPRESSION);
REL1 = new Operation("rel1", 0, "\\phi", Operation.RELATION);
REL2 = new Operation("rel2", 0, "\\psi", Operation.RELATION);
REL3 = new Operation("rel2", 0, "\\gamma", Operation.RELATION);
Operation.builtin_operations = Operation.builtin_operations.concat([A, B, C]);
Operation.global_operations = [EMPTY, IN, POK, REL1, REL2, REL3];
Operation.local_operations = [];
