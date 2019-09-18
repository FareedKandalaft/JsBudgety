// BUDGET CONTROLLER
var BudgetController = (function() {


})();



// UI CONTROLLER
var UIController = (function() {


})();



// GLOBAL APP CONTROLLER
var AppController = (function() {

  var ctrlAddItem = function() {
    // 1. Get input data
    // 2. Add item to the budget CONTROLLER
    // 3. add item to UI
    // 4. calc the budget
    // 5. display the budget on the UI
  };

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

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
