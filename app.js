// BUDGET CONTROLLER
var BudgetController = (function() {

    var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    };

    var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    };

    var calcItemTypeTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });

        data.totals[type] = sum;
    }

    var data = {
    // very JASON looking
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
    }

    return {
        addItem: function(type, des, val) {
          var newItem, ID;

          if (data.allItems[type].length > 0 ) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          } else {
            ID = 1
          }

          if (type === 'exp') {
            newItem = new Expense(ID, des, val);
          } else if (type === 'inc') {
            newItem = new Income(ID, des, val);
          }

          data.allItems[type].push(newItem);
          return newItem;
        },

        deletItem: function(type, id){
          var ids, index;
            ids = data.allItems[type].map(function(current){
              return current.id;
          });

            index = ids.indexOf(id);
            if(index !== -1) {
             data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {
            calcItemTypeTotal('exp');
            calcItemTypeTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
          console.log(data);
        }
    };
})();

// UI CONTROLLER
var UIController = (function() {
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        totalBudgetValue: ".budget__value",
        totalIncomeValue: ".budget__income--value",
        totalExpenseValue: ".budget__expenses--value",
        totalBudgetPercentage: ".budget__expenses--percentage",
        listsContainer: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
  // to make the closure's data available you
  // return an "object/function"
  return {
    getInput: function() {
      // Here the functions return is an object with properties
      // note the use of : as a name : val paradigm
      return {
        type : document.querySelector(DOMStrings.inputType).value, // either inc or exp
        description : document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    }, // why no ; here?

    // Accepts a 'newItem' and the adds to the display
    addListItem: function(obj, type) {

        var html, newHtml, containerElement;
        // Create HTML string with 'placeholder' text
        if (type === 'inc') {
            containerElement = DOMStrings.incomeContainer;

            html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        } else if (type === 'exp') {
            containerElement = DOMStrings.expenseContainer;

            html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // Replace the placeholder text with actual
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        // Insert HTML to the DOM
        document.querySelector(containerElement).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields: function() {
        var fields, fieldArr;

        fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue );

        // fields is static NodeList not an array so you
        // use the Array.prototype to use slice on the object
        fieldsArr = Array.prototype.slice.call(fields);
        //
        fieldsArr.forEach(function(current, index, array){
            current.value = ""
        });

        fieldsArr[0].focus();
    },

      displayBudget: function (obj) {

        document.querySelector(DOMStrings.totalBudgetValue).textContent = obj.budget;
        document.querySelector(DOMStrings.totalIncomeValue).textContent = obj.totalInc;
        document.querySelector(DOMStrings.totalExpenseValue).textContent = obj.totalExp;

          if(obj.percentage > 0){
            document.querySelector(DOMStrings.totalBudgetPercentage).textContent = obj.percentage + '%';
             } else {
             document.querySelector(DOMStrings.totalBudgetPercentage).textContent = '---';
             };
    },


    getDOMstrings: function () {
      return DOMStrings;
    }
  };
}    )(); // hmm... apparently functions/iFFE dont use ;

// GLOBAL APP CONTROLLER
var AppController = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function(){
      var DOM = UICtrl.getDOMstrings();

      document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

      // sample capturing the keypress event
      // because its not related to a specific CONTROL
      // we add it generically to the entire page
      // i.e. no querySelector
      // Note use of the 'event' object
      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });

      // Event Delegtion for the Delete buttons
      document.querySelector(DOM.listsContainer).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {
        // BudgetController calculate the budget
        budgetCtrl.calculateBudget();
        // Get current budget datastructure
        // I would normally do this as one function
        // and return from calculateBudget()
        var budget = budgetCtrl.getBudget();
        // Pass the budget obj to UIController to
        // fill the relevant controls
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to the budget CONTROLLER
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add item to UI
            UICtrl.addListItem(input, input.type );
            // 4. clear fields
            UICtrl.clearFields();
            // 5. calc the budget
            updateBudget();
        }
  };

    var ctrlDeleteItem = function(event) {
        var itemID, splitId, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
           splitId = itemID.split('-');
            type = splitId[0];
            id = splitId[1];
        };

        // delete the item

        // delete the item from the UI

        // Update and show the new budget
    };

    // to expose these functions and have them run you
    // create a function return
    return {
        init: function() {
        console.log('Application has started.');
        UICtrl.displayBudget({
            budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
        });
        setupEventListeners();
        }
    };

})(BudgetController, UIController);

// Here is where the init is called.
// Note it is outside the closures
AppController.init();
