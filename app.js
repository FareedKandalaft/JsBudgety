// BUDGET CONTROLLER
var BudgetController = (function() {


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

  var DOM = UICtrl.getDOMstrings();

  var ctrlAddItem = function() {
    // 1. Get input data
    var input = UICtrl.getInput();
    console.log(input);
    // 2. Add item to the budget CONTROLLER
    // 3. add item to UI
    // 4. calc the budget
    // 5. display the budget on the UI

  };

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

})(BudgetController, UIController);
