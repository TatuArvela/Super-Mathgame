// Mathgame variables

let screenWidth: number = 16;
let screenScroll = setInterval(null);
let ops: string[] = ['+', '-', '×', '÷'];

let op: string;
let mode: string;
let level: string;

let num01: number;
let num02: number;
let score: number;
let goal: number;
let answer: number;
let userAnswer: string;

let randomMin: number;
let randomMax: number;
let maxDecimals: number;
let acceptNumbers: boolean;


// DEFAULTS

mode = '+';
setLevel('EASY');


// FUNCTIONS

function runGame(_mode: string) {
  mode = _mode;
  if (mode === '+-×÷') {
    op = ops[Math.floor(Math.random()*ops.length)];
  }
  else {
    op = mode;
  }
  
  randomizeNumbers();
  answer = 0;
  userAnswer = '';
  
  switch(op) {
    case '+':
      answer = num01 + num02;
      break;
    case '-':
      answer = num01 - num02;
      break;
    case '×':
      answer = num01 * num02;
      break;
    case '÷':
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
  let newNum01 = Math.floor(Math.random() * (randomMax + 1 - randomMin) + randomMin);
  let newNum02 = Math.floor(Math.random() * (randomMax + 1 - randomMin) + randomMin);
  
  if (
    (newNum01 == num01) && (newNum02 == num02)
  ) {
    randomizeNumbers();
  }
  else {
    num01 = newNum01;
    num02 = newNum02;
  }
}


function getDecimalPlaces(number: number) {
  return ((+number).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length;
}


function setLevel(newLevel: String) {
  score = 0;
  switch(newLevel) {
    case 'EASY':
      level = 'EASY';
      goal = 10;
      randomMin = 2;
      randomMax = 10;
      maxDecimals = 1;
      break;
    case 'MEDI':
      level = 'MEDI';
      goal = 20;
      randomMin = 3;
      randomMax = 12;
      maxDecimals = 1;
      break;
    case 'HARD':
      level = 'HARD';
      goal = 30;
      randomMin = 5;
      randomMax = 20;
      maxDecimals = 1;
      break;
    case 'XTRM':
      level = 'XTRM';
      goal = 99;
      randomMin = 10;
      randomMax = 24;
      maxDecimals = 2;
      break;
  }
  runGame(mode);
}


function check() {
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
  const problem: string = num01 + op + num02 + '=';
  const screenContent: string = problem + content;

  return screenContent.length <= screenWidth;
}

function enterNumber(number: string) {
  if (acceptNumbers)
    if (screenHasSpaceForContent(userAnswer+number)) {
      userAnswer += number;
      drawProblem();
      display('main', 'add', userAnswer);
    }
}


function undo() {
  if (acceptNumbers) {
    if (userAnswer.length > 0) {
      userAnswer = userAnswer.substring(0, userAnswer.length - 1);
      drawProblem();
      display('main', 'add', userAnswer);
    }
  }
}


function minus() {
  if (acceptNumbers) {
    if ((userAnswer.length > 0) && parseFloat(userAnswer)) {
      userAnswer = String(parseFloat(userAnswer) * -1);
      drawProblem();
      display('main', 'add', userAnswer);
    }
    else if (userAnswer.length == 0){
      userAnswer += '-';
      drawProblem();
      display('main', 'add', userAnswer);
    }
  }
}


// INPUTS

const buttons = document.querySelectorAll('[id^=button]');
[].forEach.call(buttons, function(button: HTMLElement) {
  button.addEventListener('click', function() {
    switch(button.getAttribute('id')) {
      
      // NUMPAD
      case 'button-point':
        if (userAnswer.indexOf('.') == -1) {
          enterNumber('.');
        }
        break;
      case 'button-0':
        enterNumber('0');
        break;
      case 'button-1':
        enterNumber('1');
        break;
      case 'button-2':
        enterNumber('2');
        break;
      case 'button-3':
        enterNumber('3');
        break;
      case 'button-4':
        enterNumber('4');
        break;
      case 'button-5':
        enterNumber('5');
        break;
      case 'button-6':
        enterNumber('6');
        break;
      case 'button-7':
        enterNumber('7');
        break;
      case 'button-8':
        enterNumber('8');
        break;
      case 'button-9':
        enterNumber('9');
        break;

      // FUNCTIONS
      case 'button-minus':
        minus();
        break;
      case 'button-check':
        check();
        break;
      case 'button-undo':
        undo();
        break;

      // LEVELS
      case 'button-easy':
        setLevel('EASY');
        runGame(mode);
        break;
      case 'button-medi':
        setLevel('MEDI');
        runGame(mode);
        break;
      case 'button-hard':
        setLevel('HARD');
        runGame(mode);
        break;
      case 'button-xtrm':
        setLevel('XTRM');
        runGame(mode);
        break;

      // OPTIONS
      case 'button-division':
        score = 0;
        runGame('÷');
        break;
      case 'button-multiplication':
        score = 0;
        runGame('×');
        break;
      case 'button-subtraction':
        score = 0;
        runGame('-');
        break;
      case 'button-addition':
        score = 0;
        runGame('+');
        break;
      case 'button-all':
        score = 0;
        runGame('+-×÷');
        break;
      }
  });
});


// OUTPUT

function drawProblem() {
  display(
    'main',
    'replace',
    num01 + op + num02 + '='
  );
}


function drawLevel() {
  display(
    'level',
    'replace',
    level
  );
}


function drawMode() {
  display(
    'mode',
    'replace',
    mode
  );
}


function drawScore() {
  display(
    'score',
    'replace',
    score + '/' + goal
  );
}


function win() {
  acceptNumbers = false;
  drawScore();
  display(
    'main',
    'startscroll',
    'ALL\xa0RIGHT!'
  );
}


function lose() {
  acceptNumbers = false;
  drawScore();
  display(
    'main',
    'startscroll',
    'WRONG!'
  );
}


function display(target: string, method: string, input: string, keepScrolling?: boolean) {
  if (!keepScrolling) {
    clearInterval(screenScroll);
  }

  let element;
  switch(target) {
    case 'main':
      element = document.getElementById( 'screen-mathgame-main' );
      break;
    case 'level':
      element = document.getElementById( 'screen-mathgame-level' );
      break;
    case 'mode':
      element = document.getElementById( 'screen-mathgame-mode' );
      break;
    case 'score':
      element = document.getElementById( 'screen-mathgame-score' );
      break;
    default:
      return false;
  }
  
  let output = '';
  switch(method) {
      case 'add':
        output = element.innerHTML + input;
        element.innerHTML = output.substring(0,screenWidth);
        break;
      case 'replace':
        output = input;
        element.innerHTML = output.substring(0,screenWidth);
        break;
      case 'startscroll':
        drawScore();
        const padding = Array(screenWidth + 1).join('\xa0');
        input = (input + padding).substring(0, padding.length);
        screenScroll = setInterval(function () {
          input = input[input.length - 1] + input.substring(0, input.length - 1);
          display('main', 'replace', input, true);
        }, 200);
        break;
      default:
        return false;
  }
}