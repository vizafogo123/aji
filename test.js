(function() {
  var test_no = 0;
  var assert = function(boo) {
    test_no++;
    if (!boo) console.error("opkop " + test_no);
  }

  var a, b, c;
  a = new Formula([NOT, FORALL, FORALL]);
  assert(a.equals(a.negation().negation()));
  assert(!a.equals(a.negation()));

  a = new Formula([FORALL, PLACEHOLDER, EQUALS, PLACEHOLDER, PLACEHOLDER])
  assert(a.start_of_child(0, 2) === 2)
  assert(a.start_of_child(2, 1) === 3)
  assert(a.start_of_child(2, 2) === 4)

  assert(a.to_latex() === "\\forall \\Box : \\, \\Box = \\Box")

  a = new Formula([NOT,NOT,A,B,NOT,NOT,NOT,NOT,NOT,B,NOT,NOT,C]);
  assert(a.body.length===5);
  a = new Formula([NOT,NOT,A,B,NOT,NOT,NOT,NOT,NOT,B,NOT,NOT,C]);
  assert(a.body.length===5);


  a = new Formula([FORALL, PLACEHOLDER, EQUI, IN, PLACEHOLDER, PLACEHOLDER, EQUALS, PLACEHOLDER, PLACEHOLDER])
  a.substitute_equivalence(2)
  assert(a.equals(new Formula([FORALL, PLACEHOLDER, AND, IF, IN, PLACEHOLDER, PLACEHOLDER, EQUALS, PLACEHOLDER, PLACEHOLDER,
    IF, EQUALS, PLACEHOLDER, PLACEHOLDER, IN, PLACEHOLDER, PLACEHOLDER
  ])))

  assert(Operation.can_follow(FORALL, A, 1))
  assert(!Operation.can_follow(FORALL, IN, 1))
  assert(!Operation.can_follow(PLACEHOLDER, IN, 2))

  assert(a.parent_and_no_of_child(2) == "0,2")

  b = new Formula([]);
  assert(b.op_addable(IN, "rel"))
  assert(!b.op_addable(FORALL, "exp"))
  assert(!b.op_addable(A, "exp"))
  b.add_op(OR);
  assert(b.equals(new Formula([OR])));

  b = new Formula([FORALL, A, IN]);
  assert(!b.op_addable(IN, "rel"))
  assert(b.op_addable(A, "rel"))
  assert(!b.op_addable(B, "rel"))

  b = new Formula([FORALL, B, AND, FORALL, A, IN, A, A, EQUALS]);
  assert(!b.op_addable(A, "rel"));
  assert(b.op_addable(B, "rel"));

  b = new Formula([FORALL, A, AND, OR]);
  assert(!b.is_closed());
  assert(b.fill_with_placeholders().equals(new Formula([FORALL, A, AND, OR, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER])));
  assert(b.is_closed());

  a = new Formula([FORALL, B, AND, FORALL, A, IN, A, A, EQUALS]);
  b = new Formula([FORALL]);
  c = new Formula([A, B, C]);
  assert(a.substitute_parallel([b], [c]).equals(new Formula([A, B, C, B, AND, A, B, C, A, IN, A, A, EQUALS])));
  assert(a.substitute_parallel([b, new Formula([B])], [c, new Formula([A])])
    .equals(new Formula([A, B, C, A, AND, A, B, C, A, IN, A, A, EQUALS])));
  assert(a.substitute(b, c).equals(new Formula([A, B, C, B, AND, A, B, C, A, IN, A, A, EQUALS])));

  REL = new Operation("rel1", 2, "\\phi", Operation.RELATION);
  a=new Formula([REL,A,B]);
  b=new Formula([EQUALS,A,B]);
  c=new Formula([REL,EMPTY,EMPTY]);
  assert(c.substitute_definition(new Formula([REL,A,B]),b).equals(new Formula([EQUALS,EMPTY,EMPTY])));

  EXP = new Operation("rel2", 2, "\\phi", Operation.EXPRESSION);
  a=new Formula([EXP,A,B]);
  b=new Formula([PLUS,A,B]);
  c=new Formula([EQUALS,EXP,ZERO,EMPTY,EXP,ZERO,ONE]);
  assert(c.substitute_definition(new Formula([EXP,A,B]),b).equals(new Formula([EQUALS,PLUS,ZERO,EMPTY,PLUS,ZERO,ONE])));

  a=new Formula([EXP,A,B]);
  b=new Formula([PLUS,A,PLUS,A,B]);
  c=new Formula([EQUALS,EXP,ZERO,EMPTY,EXP,ZERO,EXP,ONE,ONE]);
  assert(c.substitute_definition(new Formula([EXP,A,B]),b).equals(new Formula([EQUALS,PLUS,ZERO,PLUS,
    ZERO,EMPTY,PLUS,ZERO,PLUS,ZERO,PLUS,ONE,PLUS,ONE,ONE])));

  EXP = new Operation("rel3", 1, "\\phi", Operation.EXPRESSION);
  a=new Formula([EXP,A]);
  b=new Formula([PLUS,A,A]);
  c=new Formula([EXP,EXP,A]);
  assert(c.substitute_definition(new Formula([EXP,A]),b).equals(new Formula([PLUS,PLUS,A,A,PLUS,A,A])));




})();
