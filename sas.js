
function Operation(id, no_of_args, print_scheme, name, type){
	this.id=id;
	this.no_of_args=no_of_args;
	this.print_scheme=print_scheme;
	this.name=name;
	this.type=type;

	this.printout=function(arg_list){
		var s=this.print_scheme;
		for(var i=0;i<arg_list.length;i++){
			s=s.replace("%"+(i+1),arg_list[i])
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

Operation.can_follow=function(parent, child, no_of_child){
	return (parent.type === Operation.QUANTOR && child.type === Operation.VARIABLE && no_of_child === 1) ||
				 (parent.type === Operation.QUANTOR && [Operation.LOGICAL, Operation.RELATION, Operation.QUANTOR]
					 .includes(child.type) && no_of_child === 2) ||
				 (parent.type === Operation.LOGICAL && [Operation.LOGICAL, Operation.RELATION,	Operation.QUANTOR]
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
Operation.builtin_operations=[FORALL, EXISTS, UNIQUE, IF, OR, AND, NOT, EQUI, EQUALS];


var t={
	"operations": [{
		"id": 10,
		"name": "emptyset",
		"valence": 0,
		"type": 4,
		"print_scheme": "\\emptyset "
	},
	{
		"id": 11,
		"name": "in",
		"valence": 2,
		"type": 3,
		"print_scheme": "%1 \\in %2 "
	}],
	"theorems": [{
		"id": 1,
		"folder": "axioms",
		"formula": [1,
		"var1",
		8,
		11,
		"var1",
		10],
		"spec_ops": [],
		"var_print_schemes": {
			"var1": "a "
		}
	},
	{
		"id": 2,
		"folder": "axioms",
		"formula": [1,
		"var1",
		1,
		"var2",
		4,
		1,
		"var3",
		5,
		11,
		"var3",
		"var1",
		11,
		"var3",
		"var2",
		9,
		"var1",
		"var2"],
		"spec_ops": [],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b ",
			"var3": "c "
		}
	},
	{
		"id": 3,
		"folder": "axioms",
		"formula": [1,
		"var1",
		4,
		8,
		9,
		"var1",
		10,
		2,
		"var2",
		7,
		11,
		"var2",
		"var1",
		8,
		2,
		"var3",
		7,
		11,
		"var3",
		"var2",
		11,
		"var3",
		"var1"],
		"spec_ops": [],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b ",
			"var3": "c "
		}
	},
	{
		"id": 4,
		"folder": "axioms",
		"formula": [1,
		"var1",
		2,
		"var2",
		1,
		"var3",
		1,
		"var4",
		4,
		7,
		11,
		"var4",
		"var3",
		11,
		"var3",
		"var1",
		11,
		"var4",
		"var2"],
		"spec_ops": [],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b ",
			"var3": "c ",
			"var4": "d "
		}
	},
	{
		"id": 5,
		"formula": [1,
		"var1",
		2,
		"var2",
		1,
		"var3",
		5,
		11,
		"var3",
		"var2",
		1,
		"var4",
		4,
		11,
		"var4",
		"var3",
		11,
		"var4",
		"var1"],
		"spec_ops": [],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b ",
			"var3": "c ",
			"var4": "d "
		},
		"folder": "axioms"
	},
	{
		"id": 6,
		"folder": "axioms",
		"formula": [1,
		"var1",
		4,
		1,
		"var2",
		4,
		11,
		"var2",
		"var1",
		3,
		"var3",
		"op1",
		"var2",
		"var3",
		2,
		"var4",
		1,
		"var5",
		5,
		11,
		"var5",
		"var4",
		2,
		"var6",
		7,
		11,
		"var6",
		"var1",
		"op1",
		"var6",
		"var5"],
		"spec_ops": [{
			"id": "op1",
			"name": "phi2",
			"valence": 2,
			"type": 3,
			"print_scheme": "\\phi \\left( %1 , %2 \\right) "
		}],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b ",
			"var3": "c ",
			"var4": "d ",
			"var5": "e ",
			"var6": "f "
		}
	},
	{
		"id": 7,
		"folder": "axioms",
		"formula": [2,
		"var1",
		7,
		11,
		10,
		"var1",
		1,
		"var2",
		4,
		11,
		"var2",
		"var1",
		2,
		"var3",
		7,
		11,
		"var3",
		"var1",
		1,
		"var4",
		5,
		11,
		"var4",
		"var3",
		6,
		9,
		"var4",
		"var2",
		11,
		"var4",
		"var2"],
		"spec_ops": [],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b ",
			"var3": "c ",
			"var4": "d "
		}
	},
	{
		"id": 8,
		"folder": "axioms",
		"formula": [1,
		"var1",
		4,
		7,
		8,
		11,
		10,
		"var1",
		1,
		"var2",
		4,
		11,
		"var2",
		"var1",
		1,
		"var3",
		4,
		11,
		"var3",
		"var1",
		8,
		2,
		"var4",
		7,
		11,
		"var4",
		"var2",
		11,
		"var4",
		"var3",
		2,
		"var5",
		1,
		"var6",
		4,
		11,
		"var6",
		"var1",
		3,
		"var7",
		7,
		11,
		"var7",
		"var5",
		11,
		"var7",
		"var6"],
		"spec_ops": [],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b ",
			"var3": "c ",
			"var4": "d ",
			"var5": "e ",
			"var6": "f ",
			"var7": "g "
		}
	},
	{
		"id": 9,
		"folder": "axioms",
		"formula": [1,
		"var1",
		1,
		"var2",
		4,
		9,
		"var1",
		"var2",
		5,
		"op1",
		"var1",
		"op1",
		"var2"],
		"spec_ops": [{
			"id": "op1",
			"name": "phi1",
			"valence": 1,
			"type": 3,
			"print_scheme": "\\phi \\left( %1 \\right) "
		}],
		"var_print_schemes": {
			"var1": "a ",
			"var2": "b "
		}
	}]
};
