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

  var data = {
    // very JASON looking
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    addBtn: ".add__btn"
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
        value : document.querySelector(DOMStrings.inputValue).value
      };
    }, // why no ; here?

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
  };

  var ctrlAddItem = function() {

    var input, newItem;

    // 1. Get input data
    input = UICtrl.getInput();
    console.log(input);
    // 2. Add item to the budget CONTROLLER
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. add item to UI
    // 4. calc the budget
    // 5. display the budget on the UI
  };

  // to expose these functions and have them run you
  // create a function return
  return {
    init: function() {
      console.log('Application has started.');
      setupEventListeners();
    }
  };

})(BudgetController, UIController);

// Here is where the init is called.
// Note it is outside the closures
AppController.init();
