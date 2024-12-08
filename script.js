function add(num1, num2){
    return num1 + num2;
}

function subtract(num1, num2){
    return num1 - num2;
}

function multiply(num1, num2){
    return num1 * num2;
}

function divide(num1, num2){
    return num1 / num2;
}

function operate(operator, num1 = 0, num2 = 0){ 
    switch(operator){
        case '+':
            return add(num1, num2);
        case '−':
            return subtract(num1, num2);
        case '×':
            return multiply(num1, num2);
        case '÷':
            return divide(num1, num2);
    }
}

function clearDisplay(){
    let displayNum = document.querySelectorAll(".result");
    Array.from(displayNum).map((node) => node.remove());
    screen = [];
}

function addToDisplay(thing){
    let displayThing = document.createElement("p");
    displayThing.textContent = thing;
    displayThing.setAttribute("class", "result");
    display.appendChild(displayThing);
    screen.push(thing);
}

function captureDisplay(){
    let convertedNum = parseFloat(screen.reduce((string, curr) => string + curr, ""));
    if(!override){
        secondNum = convertedNum;
    }
    else{
        firstNum = convertedNum;
    }
}

function numberKeyLogic(number){
    if(operator !== null && override === true){ //if 2nd operand, clear display first 
        clearDisplay();
        override = false;
    }
    point = screen.reduce((total, curr) => //function checks screen for any decimal points and updates the value point
        total > curr.includes(".")
        ? total
        : curr.includes("."),
    point);
    if(number === "." && point) return;
    addToDisplay(number);
}

function opKeyLogic(opKey){  //3 behaviours, one at the start of op, in the middle of op and 1 at the end
    if(opKey === "clear"){ // before any operation, clear operation has higher priority
        clearDisplay();
        screen = [];
        firstNum = 0;
        secondNum = 0;
        operator = null;
        override = true;
        posNeg = true;
        point = false;
        return;
    }
    if(opKey === "←"){
        let displayNum = Array.from(document.querySelectorAll(".result"));
        if(displayNum.length > 0){
            displayNum[displayNum.length - 1].remove();
            screen.pop();
        } 
        return;
    }
    if(opKey === "±"){
        let displayNum = document.querySelector(".result");
        if(posNeg){
            let displayThing = document.createElement("p");
            displayThing.textContent = "-";
            displayThing.setAttribute("class", "result");
            if(displayNum === null){
                display.appendChild(displayThing);
            }
            else{
                display.insertBefore(displayNum, displayThing);
            }
            screen.unshift("-");
        } else{
            displayNum.remove();
        }
        posNeg = !posNeg;
        return;
    }
    captureDisplay();
    if(operator === null){ //checks if middle of operation
        operator = opKey;
    } else{ //end of operation, evaluate
        if(operator === "÷" && secondNum === 0){ //handle divide by 0
            firstNum = 0;
            clearDisplay();
            addToDisplay("XD");
            error = true;
        }
        else{
            firstNum = operate(operator, firstNum, secondNum);
            secondNum = 0;
            clearDisplay();
            addToDisplay(firstNum.toString()); //show results
            operator = opKey;
        }
        if(operator === "=") operator = null;
        override = true;
    }
}

function dispatch(event){
    if(event.target.tagName === "BUTTON"){
        if(error){
            opKeyLogic("clear"); 
            error = false;
            return;
        } 
        let targetClass = event.target.getAttribute("class");
        let targetSymbol = event.target.textContent;
        if(targetClass !== null && targetClass.includes("op")){
            opKeyLogic(targetSymbol);
        }
        else{
            numberKeyLogic(targetSymbol);
        }
    }
}

let firstNum = 0, operator = null, secondNum = 0; //null operator indicates it is in an intermediate state
let screen = []; //use list of strings to store numbers, combine during evalution using concatenation to parseFloat
let error = false; //true: error on screen, false: no error on screen
let override = true; //override display only happens when entering 2nd operand, happens once per operation
let posNeg = true; //true: positive num on screen or false: negative num on screen
let point = false; //true: decimal point already in number, false: decimal point not in number
let display = document.querySelector("#display");
let keypad = document.querySelector("#keypad");
keypad.addEventListener("click", dispatch);