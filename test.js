var test_no=0;

IN = new Operation(10, 2, "%1 \\in %2", "equals", Operation.RELATION);
A = new Operation("var1", 0, "a", "a", Operation.VARIABLE);
B = new Operation("var2", 0, "b", "b", Operation.VARIABLE);
C = new Operation("var3", 0, "c", "c", Operation.VARIABLE);
D = new Operation("var4", 0, "d", "d", Operation.VARIABLE);


assert=function(boo){
  test_no++;
  if (!boo) console.error("opkop "+test_no);
}


a=new Formula([NOT,FORALL,FORALL]);
assert(a.equals(a.negation().negation()));
assert(!a.equals(a.negation()));

a=new Formula([FORALL,PLACEHOLDER,EQUALS,PLACEHOLDER,PLACEHOLDER])
assert(a.start_of_child(0,2)===2)
assert(a.start_of_child(2,1)===3)
assert(a.start_of_child(2,2)===4)

assert(a.to_latex()==="\\forall \\Box : \\, \\Box = \\Box")



a=new Formula([FORALL,PLACEHOLDER,EQUI,IN,PLACEHOLDER,PLACEHOLDER,EQUALS,PLACEHOLDER,PLACEHOLDER])
a.substitute_equivalence(2)
assert(a.equals(new Formula([FORALL,PLACEHOLDER,AND,IF,IN,PLACEHOLDER,PLACEHOLDER,EQUALS,PLACEHOLDER,PLACEHOLDER,
  IF,EQUALS,PLACEHOLDER,PLACEHOLDER,IN,PLACEHOLDER,PLACEHOLDER])))

assert(Operation.can_follow(FORALL,A,1))
assert(!Operation.can_follow(FORALL,IN,1))
assert(!Operation.can_follow(PLACEHOLDER,IN,2))

assert(a.parent_and_no_of_child(2)=="0,2")

b=new Formula([]);
assert(b.op_addable(IN,"rel"))
assert(!b.op_addable(FORALL,"exp"))
assert(!b.op_addable(A,"exp"))

b=new Formula([FORALL,A,IN]);
assert(!b.op_addable(IN,"rel"))
assert(b.op_addable(A,"rel"))
assert(!b.op_addable(B,"rel"))

b=new Formula([FORALL,B,AND,FORALL,A,IN,A,A,EQUALS]);
assert(!b.op_addable(A,"rel"))
assert(b.op_addable(B,"rel"))
