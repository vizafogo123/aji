function cheat_add_formula() {
  FormulaBuilder.show(Proof.add_formula)
}

A = new Operation("vara", 0, "a", Operation.VARIABLE);
B = new Operation("varb", 0, "b", Operation.VARIABLE);
C = new Operation("varc", 0, "c", Operation.VARIABLE);
EMPTY = new Operation("empty", 0, "\\emptyset", Operation.EXPRESSION);
ZERO = new Operation("zero", 0, "0", Operation.EXPRESSION);
ONE = new Operation("one", 0, "1", Operation.EXPRESSION);
IN = new Operation("in", 2, "%1 \\in %2", Operation.RELATION);
POK = new Operation("pok", 2, "\\left( %1 \\otimes %2 \\right)", Operation.EXPRESSION);
PLUS = new Operation("plus", 2, "\\left( %1 + %2 \\right)", Operation.EXPRESSION);
TIMES = new Operation("times", 2, "\\left( %1 \\cdot %2 \\right)", Operation.EXPRESSION);
REL1 = new Operation("rel1", 0, "\\phi", Operation.RELATION);
REL2 = new Operation("rel2", 0, "\\psi", Operation.RELATION);
REL3 = new Operation("rel2", 0, "\\gamma", Operation.RELATION);
SUC = new Operation("suc", 1, "S %1", Operation.EXPRESSION);
REL4 = new Operation("rel2", 1, "\\color{#AA0000} \\phi \\left( %1 \\right)", Operation.RELATION);
POWER = new Operation("power", 1, "\\cal P \\left( %1 \\right)", Operation.EXPRESSION);
UNION = new Operation("union", 1, "\\bigcup %1", Operation.EXPRESSION);


//Operation.builtin_operations = Operation.builtin_operations.concat([A, B, C]);
Operation.local_operations = [];
theorems = [];
load_world = function(w) {
  Operation.global_operations = w.operations;
  theorems = w.theorems;
}

add_schemas_to_formula = function(f, schemas) {
  f.schema = schemas;
  return f;
}

worlds = [{
    operations: [REL1, REL2, REL3],
    theorems: []
  },
  {
    operations: [TIMES, ONE],
    theorems: [{
        formula: new Formula([FORALL, A, EQUALS, TIMES, A, A, ONE])
      },
      {
        formula: new Formula([FORALL, A, FORALL, B, FORALL, C, EQUALS, TIMES, A, TIMES, B, C, TIMES, TIMES, A, B, C])
      },
      {
        formula: new Formula([FORALL, A, EQUALS, TIMES, A, ONE, A])
      },
      {
        formula: new Formula([FORALL, A, EQUALS, TIMES, ONE, A, A])
      }
    ]
  },
  {
    operations: [PLUS, TIMES, SUC, ZERO],
    theorems: [{
        formula: new Formula([FORALL, A, NOT, EQUALS, SUC, A, ZERO])
      },
      {
        formula: new Formula([FORALL, A, EQUALS, PLUS, A, ZERO, A])
      },
      {
        formula: new Formula([FORALL, A, FORALL, B, EQUALS, PLUS, A, SUC, B, SUC, PLUS, A, B])
      },
      {
        formula: new Formula([FORALL, A, EQUALS, TIMES, A, ZERO, ZERO])
      },
      {
        formula: new Formula([FORALL, A, FORALL, B, EQUALS, TIMES, A, SUC, B, PLUS, TIMES, A, B, A])
      },
      {
        formula: new Formula([FORALL, A, FORALL, B, IF, EQUALS, SUC, A, SUC, B, EQUALS, A, B])
      },
      {
        formula: new Formula([IF, AND, REL4, ZERO, FORALL, A, IF, REL4, A, REL4, SUC, A, FORALL, A, REL4, A]),
        schema: [REL4]
      }
    ]
  },
  {
    operations: [IN, EMPTY],
    theorems: [{
        formula: new Formula([FORALL, A, FORALL, B, IF, FORALL, C, EQUI, IN, C, A, IN, C, B, EQUALS, A, B])
      },
      {
        formula: new Formula([FORALL,A,IF,NOT,EQUALS,A,EMPTY,EXISTS,B,NOT,EXISTS,C,AND,IN,C,B,IN,C,A])
      },
      {
        formula: new Formula([FORALL,A,FORALL,B,EQUI,IN,B,POWER,A,FORALL,C,IF,IN,C,B,IN,C,A])
      },
      {
        formula: new Formula([FORALL,A,FORALL,B,EQUI,IN,B,UNION,A,EXISTS,C,AND,IN,B,C,IN,C,A])
      },
      {
        formula: new Formula([FORALL,A,UNIQUE,B,FORALL,C,EQUI,IN,C,B,AND,IN,C,A,REL4,C]),
        schema: [REL4]
      }
    ]
  }

];

//load_world(worlds[1]);

ARGUMENTS = [
  new Operation("arg1", 0, "x", Operation.EXPRESSION),
  new Operation("arg2", 0, "y", Operation.EXPRESSION),
  new Operation("arg3", 0, "z", Operation.EXPRESSION)
]
