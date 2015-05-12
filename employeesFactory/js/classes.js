'use strict';

/*1) Create 3 Classes which describe Employee. One Abstract Class and two concrete implementations. 
First implementation - Employee with fixed salary. Where average monthly salary = employee salary. 
Second implementation - Employee with per-hour salary. Where average monthly salary = 20.8 8 employee salary.

In Abstract Employee Class describe an abstract method which calculates Employee average monthly salary 
according to rules described above(method:getSalary).*/

function Employee() {}
Employee.prototype.getSalary = function() {
	throw new Error("You should define this method in the class before use.");
};

function EmployeeFactory() {}
EmployeeFactory.prototype.createEmployee = function(parameters) {
  var parentClass = null;
  switch(parameters.type) {
  	case 'FixedSalaryEmployee':
  		parentClass = EmployeeWithFixedSalary;
  		break;
  	case 'HourlySalaryEmployee':
	  	parentClass = EmployeeWithHourlySalary;
	  	break;
  }  
  if(parentClass === null) return false;  
  return new parentClass(parameters);
}

function EmployeeWithFixedSalary(parameters) {
	this.salary = parameters.salary;
	this.name = parameters.name;
	this.id = parameters.id;	
}
EmployeeWithFixedSalary.prototype = Object.create(Employee.prototype, {
	getSalary: {
		value: function() {
			return this.salary;
		}
	}
});
function EmployeeWithHourlySalary(parameters) {
	this.salary = parameters.salary;
	this.name = parameters.name;
	this.id = parameters.id;
}
EmployeeWithHourlySalary.prototype = Object.create(Employee.prototype, {
	getSalary: {
		value: function() {
			return this.salary * 20.8 * 8;
		}
	}
});

/*2) Create Class which represents collection of Employees. 
1. Collection of Employees must be sorted by the next rules: 
Sort all workers in descending order of average monthly salary. 
If average monthly salary of Employees is equal use Employee name instead. */

//When creating a new instance, array of employee objects will be sorted by DESC avg salary and ASC alphabetically in case avg salaries are equal.
function EmployeesCollection(employees) {
	if (arguments.length) {
		try {
			/*this.employees = this._sort(employees).map(function(employee) {
				return new EmployeeFactory().createEmployee(employee);*/
			this.employees = this._sort(employees).map(function(employee) {
				return new EmployeeFactory().createEmployee(employee);
			});
		} catch(e) {
			console.error('Wrong argument. It should be an array of employees\' objects.');
		}		
	} else {
		this.employees = [];
	}	
}
//Helper to sort by DESC avg salary and ASC alphabetically in case avg salaries are equal.
EmployeesCollection.prototype._sort = function(employees) {
	return employees.sort(function(a,b) {
		var x = a.name.toLowerCase();
		var y = b.name.toLowerCase();
		a = this._countAvgSalary(a);
		b = this._countAvgSalary(b);
		return (b - a) || (x < y ? -1 : x > y ? 1 : 0);		
	}.bind(this));
};
//Helper to count avg monthly salary.
EmployeesCollection.prototype._countAvgSalary = function(employee) {
	return new EmployeeFactory().createEmployee(employee).getSalary();
};

/*2. Ability to get id, name, average monthly salary for each Employee in collection. 
Output example: 
[ 
{id: employeeId, name: employeeName, salary: employee average monthly salary}, 
{id: employeeId, name: employeeName, salary: employee average monthly salary} 
] */

EmployeesCollection.prototype.getInfo = function() {
	return this.employees.map(function(employee) {
		return {
			id: employee.id,
			name: employee.name,
			salary: employee.getSalary()
		};
	}, this);
};

/*3. Ability to get five first employee names from collection. 
Output example: 
['Jo', 'Bob', 'Alice', 'Robb', 'Jenny'] */
EmployeesCollection.prototype.getTopNames = function(quantity) {
	return this.employees.slice(0,quantity).map(function(employee) {
		return employee.name;
	});
};

/*4. Ability to get last three employee ids from collection. 
Output example: 
['id5', 'id4', 'id3']*/
EmployeesCollection.prototype.getLastIds = function(quantity) {
	return this.employees.slice(-quantity).map(function(employee) {
		return employee.id;
	});
};

/*3) Organize ability to get Employees Data from different sources (AJAX, Textarea on the page). 
Note here: 
Using the same Collection Class we want to have an ability to get data from Back End in one place but in another place 
we want to get data from text area on the page(Lets imagine that it's a kind of admin tool).
4) Protect your classes from incorrect input. Meaningful error handling.*/
EmployeesCollection.prototype.getData = function(dataType,source,callFunc) {
	switch(dataType) {
		case 'html':
			try {
				this.employees = this._sort(JSON.parse(source)).map(function(employee) {
					return new EmployeeFactory().createEmployee(employee);
				});
			} catch(e) {
				alert('Invalid input.');
				throw new Error('Invalid input.');
			}			
			break;
		case 'json':
			$.getJSON(source, function(data) {
				this.employees = this._sort(data).map(function(employee) {
					return new EmployeeFactory().createEmployee(employee);
				});
			}.bind(this)).done(callFunc);
			break;
	}
};

//Parser for initialization behavior to any page
function Parser(nodes) {
	this.textareaButton = nodes.textareaButton;
	this.inputForWebButton = nodes.inputForWebButton;
	this.getInfoButton = nodes.getInfoButton;
	this.getTopNames = nodes.getTopNames;
	this.topNamesInput = nodes.topNamesInput;
	this.getLastIdsButton = nodes.getLastIdsButton;
	this.lastIdsInput = nodes.lastIdsInput;
	this.inputForWeb = nodes.inputForWeb;
	this.textarea = nodes.textarea;
	this.output = nodes.output;
}
Parser.prototype.init = function() {
	var collection = new EmployeesCollection();
	function decorateWithHighlight() {
		$('code').each(function(i, block) {
			hljs.highlightBlock(block);
		});
	}

	this.textareaButton.click(function() {
		if(this.textarea.val()) {
			collection.getData('html', this.textarea.val());
			this.output.append($('<div><code class="hljs json">' + collection.employees.map(function(employee) {
				return JSON.stringify(employee);
			}) + '</code></div>'));
		}	
		decorateWithHighlight();
	}.bind(this));
	this.inputForWebButton.click(function() {
		function cb () {
				this.output.append($('<div><code class="hljs json">' + collection.employees.map(function(employee) {
					return JSON.stringify(employee);
				}) + '</code></div>'));
				decorateWithHighlight();
		};
		collection.getData('json', this.inputForWeb.val(), cb.bind(this));
	}.bind(this));
	this.getInfoButton.click(function() {
		this.output.append($('<div><code class="hljs json">' + JSON.stringify(collection.getInfo()) + '</code></div>'));
		decorateWithHighlight();
	}.bind(this));
	this.getTopNames.click(function() {
		this.output.append($('<div><code class="hljs">' + JSON.stringify(collection.getTopNames(this.topNamesInput.val())) + '</code></div>'));
		decorateWithHighlight();
	}.bind(this));
	this.getLastIdsButton.click(function() {
		this.output.append($('<div><code class="hljs">' + JSON.stringify(collection.getLastIds(this.lastIdsInput.val())) + '</code></div>'));
		decorateWithHighlight();
	}.bind(this));
}
var nodesForParser = {
	textareaButton: $('#getDataArea'),
	inputForWebButton: $('#getDataWeb'),
	getInfoButton: $('#getInfo'),
	getTopNames: $('#getTop5'),
	topNamesInput: $('#topNames'),
	getLastIdsButton: $('#getLast3Ids'),
	lastIdsInput: $('#lastIds'),
	inputForWeb: $('#webSource'),
	textarea: $('textarea'),
	output: $('.output')
};
var parser = new Parser(nodesForParser);
parser.init();