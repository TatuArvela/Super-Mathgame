// Mathgame variables
var screenWidth: number = 16;
var screenScroll = setInterval(null);
var ops: string[] = ['+', '-', '×', '÷'];

var op: string;
var mode: string;
var level: string;

var num01: number;
var num02: number;
var score: number;
var goal: number;
var answer: number;
var userAnswer: string;

var randomMin: number;
var randomMax: number;
var maxDecimals: number;
var acceptNumbers: boolean;



$( document ).ready(function() {
  
  // DEFAULTS
  mode = "+";
  setLevel("Easy");
  
  
  
  // FUNCTIONS
  function runGame(_mode: string) {
    mode = _mode;
    if (mode === "+-×÷") {
      op = ops[Math.floor(Math.random()*ops.length)];
    }
    else {
      op = mode;
    }
    
    randomizeNumbers();
    answer = 0;
    userAnswer = "";
    
    switch(op) {
      case "+":
        answer = num01 + num02;
        break;
      case "-":
        answer = num01 - num02;
        break;
      case "×":
        answer = num01 * num02;
        break;
      case "÷":
        answer = num01 / num02;
        // If the answer has more than wanted maximum decimal places, a new task is calculated
        while (getDecimalPlaces(answer) > maxDecimals) {
            randomizeNumbers();
            answer = num01 / num02;
        }
        break;
    }
    acceptNumbers = true;
    drawProblem();
    drawLevel();
    drawMode();
    drawScore();
  }
  
  
  function randomizeNumbers() {
    num01 = Math.floor(Math.random() * (randomMax + 1 - randomMin) + randomMin);
    num02 = Math.floor(Math.random() * (randomMax + 1 - randomMin) + randomMin);
    
    if (num01 === num02)
      randomizeNumbers();
  }
  
  
  function getDecimalPlaces(number: number) {
    return ((+number).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length;
  }
  
  
  function setLevel(newLevel: String) {
    switch(newLevel) {
      case "Easy":
        level = "Easy";
        score = 0;
        goal = 10;
        randomMin = 2;
        randomMax = 10;
        maxDecimals = 1;
        break;
      case "Medium":
        level = "Medium";
        score = 0;
        goal = 15;
        randomMin = 3;
        randomMax = 12;
        maxDecimals = 1;
        break;
      case "Hard":
        level = "Hard";
        score = 0;
        goal = 20;
        randomMin = 5;
        randomMax = 20;
        maxDecimals = 1;
        break;
      case "Very Hard":
        level = "Very Hard";
        score = 0;
        goal = 25;
        randomMin = 10;
        randomMax = 24;
        maxDecimals = 1;
        break;
    }
    runGame(mode);
  }


  function switchLevel() {
    switch(level) {
      case "Very Hard":
        setLevel("Easy");
        break;
      case "Easy":
        setLevel("Medium");
        break;
      case "Medium":
        setLevel("Hard");
        break;
      case "Hard":
        setLevel("Very Hard");
        break;
    }
    runGame(mode);
  }
  
  
  function check() {
    var main = $( "#screen-main" ).html();
    if(answer === parseFloat(userAnswer)) {
      score++;
      if (score < goal) {
        runGame(mode);
      }
      else {
        win();
      }
    }
    else {
      lose();
    }
  }
  

  function screenHasSpaceForContent(content: string) {
    var problem: string = num01 + op + num02 + "=";
    var screenContent: string = problem + content;

    if (screenContent.length > screenWidth) {
      return false;
    }
    else {
      return true;
    }
  }
  
  function enterNumber(number: string) {
    if (acceptNumbers)
      if (screenHasSpaceForContent(userAnswer+number)) {
        userAnswer += number;
        drawProblem();
        screen("main", "add", userAnswer);
      }
  }
  
  
  function undo() {
    if (acceptNumbers) {
      if (userAnswer.length > 0) {
        userAnswer = userAnswer.substring(0, userAnswer.length - 1);
        drawProblem();
        screen("main", "add", userAnswer);
      }
    }
  }
  
  
  function minus() {
    if (acceptNumbers) {
      if ((userAnswer.length > 0) && parseFloat(userAnswer)) {
        userAnswer = String(parseFloat(userAnswer) * -1);
        drawProblem();
        screen("main", "add", userAnswer);
      }
      else if (userAnswer.length == 0){
        userAnswer += "-";
        drawProblem();
        screen("main", "add", userAnswer);
      }
    }
  }
  
  
  
  
  // INPUTS
  $( ".button" ).each(function() {
    $( this ).click(function() {
      var button = $( this ).attr('id');
      switch(button) {
        
        // NUMPAD
        case "button-point":
          if (userAnswer.indexOf(".") == -1)
            enterNumber(".");
          break;
        case "button-0":
          enterNumber("0");
          break;
        case "button-1":
          enterNumber("1");
          break;
        case "button-2":
          enterNumber("2");
          break;
        case "button-3":
          enterNumber("3");
          break;
        case "button-4":
          enterNumber("4");
          break;
        case "button-5":
          enterNumber("5");
          break;
        case "button-6":
          enterNumber("6");
          break;
        case "button-7":
          enterNumber("7");
          break;
        case "button-8":
          enterNumber("8");
          break;
        case "button-9":
          enterNumber("9");
          break;
        
        // OPTIONS
        case "button-minus":
          minus();
          break;
        case "button-level":
          switchLevel();
          break;
        case "button-check":
          check();
          break;
        case "button-undo":
          undo();
          break;
        
        // FUNCTIONS
        case "button-division":
          score = 0;
          runGame("÷");
          break;
        case "button-multiplication":
          score = 0;
          runGame("×");
          break;
        case "button-subtraction":
          score = 0;
          runGame("-");
          break;
        case "button-addition":
          score = 0;
          runGame("+");
          break;
        case "button-all":
          score = 0;
          runGame("+-×÷");
          break;
        }
    })
  })
  
  
  
  // OUTPUT
  function drawProblem() {
    screen(
    "main",
    "replace",
    num01 + op + num02 + "="
    );
  }
  
  
  function drawLevel() {
    screen(
    "level",
    "replace",
    level
    );
  }
  
  
  function drawMode() {
    screen(
    "mode",
    "replace",
    mode
    );
  }
  
  
  function drawScore() {
    screen(
    "score",
    "replace",
    score + "/" + goal
    );
  }
  
  
  function win() {
    acceptNumbers = false;
    drawScore();
    screen(
      "main",
      "startscroll",
      "ALL\xa0RIGHT!"
    );
  }
  
  
  function lose() {
    acceptNumbers = false;
    drawScore();
    screen(
      "main",
      "startscroll",
      "WRONG!"
    );
  }
  
  
  function screen(target: string, method: string, input: string, keepScrolling?: boolean) {
    if (!keepScrolling) {
      clearInterval(screenScroll);
    }

    var element;
    switch(target) {
      case "main":
       element = $( "#screen-mathgame-main" );
        break;
      case "level":
        element = $( "#screen-mathgame-level" );
        break;
      case "mode":
        element = $( "#screen-mathgame-mode" );
        break;
      case "score":
        element = $( "#screen-mathgame-score" );
        break;
      default:
        return false;
    }
    
    var output = "";
    switch(method) {
        case "add":
          output = element.html() + input;
          element.html(output.substring(0,screenWidth));
          break;
        case "replace":
          output = input;
          element.html(output.substring(0,screenWidth));
          break;
        case "startscroll":
          drawScore();
          var padding = Array(screenWidth + 1).join('\xa0');
          input = (input + padding).substring(0, padding.length);
          screenScroll = setInterval(function () {
            input = input[input.length - 1] + input.substring(0, input.length - 1);
            screen("main", "replace", input, true);
          }, 200);
          break;
        default:
          return false;
    }
  }
  
});