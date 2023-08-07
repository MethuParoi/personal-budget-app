//Budget Controller
var budgetController = (function(){

    var Expense = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var Income = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0
    };

    calculateTotalIncome = function(inc){
        var sum = 0;

        data.allItems[inc].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[inc] = sum;
    };

    calculateTotalExpence = function(exp){
        var sum = 0;

        data.allItems[exp].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[exp] = sum;
    };

    return{
        addItem: function(type, desc, val){
            var newItem, ID;

            //[1 2 3 4 5], next ID= 6
            //ID = last ID + 1

            //Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else{
                ID = 0;
            }
            
            //Create new item based on 'inc' or 'exp' type
            if(type === "exp"){
                console.log("Expence Added");
                newItem = new Expense(ID, desc, val);
            }
            else if(type === "inc"){
                console.log("Income Added");
                newItem = new Income(ID, desc, val);
            }

            //push it into the data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;

        }, 

        calculateBudget: function(){
            //Calculate total income and expences
            calculateTotalIncome("inc");
            calculateTotalExpence("exp");
            //Calculate the budget: income-expence
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the total percentage
            data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }, 

        /*testing: function(){
            console.log(this.calculate.totalincome);
            console.log(this.calculate.totalexpence);

        } */
    };

})();


//-----------------------------------------------


//UI Controller
var UIController = ( function(){
    
var DOMstrings = {
    inputDesc: '.add_desc',
    inputValue: '.add_value',
    inputDeposits: '.plus',
    inputExpences: '.minus',
    incomeContainer: '.income_list',
    expenceContainer: '.expence_list',
    budgetContainer: ".budget",
    depositContainer: ".income",
    costContainer: ".exp"
};

    return{
        getinput: function(){
            return{
            
                desc: document.querySelector(DOMstrings.inputDesc).value,

                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addIncomeList: function(obj){
            var html_inc, new_html_inc, element;
            element = DOMstrings.incomeContainer;

            //create HTML string with place holder text
            html_inc = '<div class="Item_clearfix flex justify-between" id="income-%id%"><div class="item_desc font-serif font-medium text-lg ">%si%</div><div class="item_desc font-serif font-medium text-lg ">%desc%</div><div class="right_clearfix"><div class="item_value text-green-400 font-semibold">%value%</div><div class="item_delete"><button class="item_delet_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            //Replace the placeholder text with some actual data
            new_html_inc = html_inc.replace('%si%', obj.id+1).replace('%id%', obj.id).replace('%desc%', obj.desc).replace('%value%', obj.value);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', new_html_inc);
        },

        addExpenceList: function(obj){
            var html_exp, new_html_exp, element;
            element = DOMstrings.expenceContainer;

            //create HTML string with place holder text
            html_exp = '<div class="Item_clearfix flex justify-between" id="expence-%id%"><div class="item_desc font-serif font-medium text-lg ">%si%</div><div class="item_desc font-serif font-medium text-lg ">%desc%</div><div class="right_clearfix"><div class="item_value text-red-400 font-semibold">%value%</div><div class="item_delete"><button class="item_delet_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            //Replace the placeholder text with some actual data
            new_html_exp = html_exp.replace('%si%', obj.id+1).replace('%id%', obj.id).replace('%desc%', obj.desc).replace('%value%', obj.value);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', new_html_exp);
        },

        addBudget: function(obj){
            document.querySelector(DOMstrings.budgetContainer).textContent = obj.budget;
            document.querySelector(DOMstrings.depositContainer).textContent = obj.totalInc;
            document.querySelector(DOMstrings.costContainer).textContent = obj.totalExp;

        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll (DOMstrings.inputDesc + ', ' +
            DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach (function(current, index, array) {
            current.value = "";
            });
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };
}
)();


//-----------------------------------------------



//Global App Controller
var AppController = (function(budgetcntlr, uicntlr){
   

var setupEventListeners = function(){
    var DOM = UIController.getDOMstrings();

    //inputDeposit
    document.querySelector(DOM.inputDeposits).addEventListener('click', ctrlAddIncome);

    /* document.addEventListener('keydown', (event) => {
        var keyPressed = event.key;
        if(keyPressed == 'Enter'){
            ctrlAddIncome();
        }
      }); */

    //inputExpenses
    document.querySelector(DOM.inputExpences).addEventListener('click', ctrlAddExpences);

    /*
    document.addEventListener('keydown', (event) => {
        var keyPressed = event.key;
        if(keyPressed == 'Enter'){
            ctrlAddExpences();
        }
    }); */

};

    var updateBudget = function(){
        //Calculate the budget
        budgetController.calculateBudget();

        //Return the budget
        var budget = budgetController.getBudget();
        console.log("Budget: ", budget.budget);

        //Display the budget on the UI
        UIController.addBudget(budget);
    };

    var ctrlAddIncome = function(){

        //get the field input data
        var input = UIController.getinput();
        console.log(input);

        if(input.desc !== "" && !isNaN(input.value) && input.value > 0){

        //Add the item to the budget controller
        var newIncome = budgetController.addItem("inc", input.desc, input.value);

        //Add the item to the UI
        UIController.addIncomeList(newIncome);

        //Clear the field
        UIController.clearFields();

        //Calculate & Update Budget
        updateBudget();
        }


    }

    var ctrlAddExpences = function(){

        //get the field input data
        var input = UIController.getinput();
        console.log(input);

        if(input.desc !== "" && !isNaN(input.value) && input.value > 0){

        //Add the item to the budget controller
        var newExpence = budgetController.addItem("exp", input.desc, input.value);
    
        //Add the item to the UI
        UIController.addExpenceList(newExpence);
    
        //Clear the field
        UIController.clearFields();
    
        //Calculate & Update Budget
        updateBudget();
        }
    }

    return {
        init: function(){
            console.log("Application has started");
            setupEventListeners();
        }
    };
      

})(budgetController, UIController);

AppController.init();