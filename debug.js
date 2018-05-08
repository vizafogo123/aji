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
TIMES = new Operation("times", 2, "\\left( %1 \\cdot %2 \\right)", Operation.EXPRESSION);
REL1 = new Operation("rel1", 0, "\\phi", Operation.RELATION);
REL2 = new Operation("rel2", 0, "\\psi", Operation.RELATION);
REL3 = new Operation("rel2", 0, "\\gamma", Operation.RELATION);
SUC = new Operation(102, 1, "S %1", Operation.EXPRESSION);
REL4 = new Operation("rel2", 1, "\\phi \\left( %1 \\right)", Operation.RELATION);
//Operation.builtin_operations = Operation.builtin_operations.concat([A, B, C]);
Operation.local_operations = [];
theorems=[];
load_world=function(w){
  Operation.global_operations = w.operations;
  theorems=w.theorems;
}

add_schemas_to_formula=function(f,schemas){
  f.schema=schemas;
  return f;
}

worlds=[
  {
    operations:[TIMES,ONE],
    theorems:[
      new Formula([FORALL,A,EQUALS,TIMES,A,A,ONE]),
      new Formula([FORALL,A,FORALL,B,FORALL,C,EQUALS,TIMES,A,TIMES,B,C,TIMES,TIMES,A,B,C]),
      new Formula([FORALL,A,EQUALS,TIMES,A,ONE,A]),
      new Formula([FORALL,A,EQUALS,TIMES,ONE,A,A])
    ]
  },
  {
    operations:[PLUS,TIMES,SUC,ZERO],
    theorems:[
      new Formula([FORALL,A,NOT,EQUALS,SUC,A,ZERO]),
      new Formula([FORALL,A,EQUALS,PLUS,A,ZERO,A]),
      new Formula([FORALL,A,FORALL,B,EQUALS,PLUS,A,SUC,B,SUC,PLUS,A,B]),
      new Formula([FORALL,A,EQUALS,TIMES,A,ZERO,ZERO]),
      new Formula([FORALL,A,FORALL,B,EQUALS,TIMES,A,SUC,B,PLUS,TIMES,A,B,A]),
      new Formula([FORALL,A,FORALL,B,IF,EQUALS,SUC,A,SUC,B,EQUALS,A,B]),
      add_schemas_to_formula(new Formula([IF,AND,REL4,ZERO,FORALL,A,IF,REL4,A,REL4,SUC,A,FORALL,A,REL4,A]),[REL4])
    ]
  }

];

load_world(worlds[1]);

ARGUMENTS=[
  new Operation("arg1", 0, "x", Operation.EXPRESSION),
  new Operation("arg2", 0, "y", Operation.EXPRESSION),
  new Operation("arg3", 0, "z", Operation.EXPRESSION)
]
