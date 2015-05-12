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
function EmployeeWithFixedSalary(salary,name,id) {
	this.type = 'FixedSalaryEmployee';
	this.salary = salary;
	this.name = name;
	this.id = id;	
}
EmployeeWithFixedSalary.prototype = Object.create(Employee.prototype, {
	getSalary: {
		value: function() {
			return this.salary;
		}
	}
});
function EmployeeWithHourlySalary(salary,name,id) {
	this.type = 'HourlySalaryEmployee';
	this.salary = salary;
	this.name = name;
	this.id = id;
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
			this.employees = this._sort(employees);
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
	var avgSalary = null;
	switch(employee.type) {
		case 'FixedSalaryEmployee':
			avgSalary = EmployeeWithFixedSalary.prototype.getSalary.call(employee);
			break;
		case 'HourlySalaryEmployee':
			avgSalary = EmployeeWithHourlySalary.prototype.getSalary.call(employee);
			break;
	}
	return avgSalary;
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
			salary: this._countAvgSalary(employee)
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
				this.employees = this._sort(JSON.parse(source));
			} catch(e) {
				alert('Invalid input.');
				throw new Error('Invalid input.');
			}			
			break;
		case 'json':
			$.getJSON(source, function(data) {
				this.employees = this._sort(data);
			}.bind(this)).done(callFunc);
			break;
	}
};

var collection = new EmployeesCollection();

function decorateWithHighlight() {
	$('code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
}

$('#getDataArea').click(function() {
	if($('textarea').val()) {
		collection.getData('html', $('textarea').val());
		$('.output').append($('<div><code class="hljs json">' + JSON.stringify(collection.employees) + '</code></div>'));
	}	
	decorateWithHighlight();
});
$('#getDataWeb').click(function() {
	function cb () {
			$('.output').append($('<div><code class="hljs json">' + JSON.stringify(collection.employees) + '</code></div>'));
			decorateWithHighlight();
	}
	collection.getData('json', $('#webSource').val(), cb);
});
$('#getInfo').click(function() {
	$('.output').append($('<div><code class="hljs json">' + JSON.stringify(collection.getInfo()) + '</code></div>'));
	decorateWithHighlight();
});
$('#getTop5').click(function() {
	$('.output').append($('<div><code class="hljs">' + JSON.stringify(collection.getTopNames($('#topNames').val())) + '</code></div>'));
	decorateWithHighlight();
});
$('#getLast3Ids').click(function() {
	$('.output').append($('<div><code class="hljs">' + JSON.stringify(collection.getLastIds($('#lastIds').val())) + '</code></div>'));
	decorateWithHighlight();
});