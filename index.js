$(document).ready(function(){
  var currentQuestion;
  var interval;
  var timeLeft = 10;
  var score = 0;
  var highscore = 0;
  var gameLimitInput = $('#limit-input');
  var limitValues = $('.limit-values');


  
  var updateTimeLeft = function (amount) {
    timeLeft += amount;
    $('.game-timer-text').text(timeLeft);
  };
  
  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
  };

  var updateHighScore = function (score) {
    if (score > highscore) {
      highscore = score;
      $('#high-score').text(highscore);
    }
  }
  
  var startGame = function () {
    //$('#game-timer').toggleClass('blur-away');
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        updateHighScore(score);
        updateScore(-score);
        //$('#game-timer').toggleClass('blur-away');

      }
      interval = setInterval(function () {
        updateTimeLeft(-1);
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
        }
      }, 1000);  
    }
  };
  
  var randomNumberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };
  
  var questionGenerator = function () {
    var selectedOperators = $('.op-select:checked').map(function() {
      return $(this).data('op');
    }).toArray();
    
    var randomOperator = selectedOperators[randomNumberGenerator(Math.floor(Math.random() * selectedOperators.length))]

    var question = {};
    var num1 = randomNumberGenerator(limitValues.text());
    var num2 = randomNumberGenerator(limitValues.text());
    
    var max = Math.max(num1, num2);
    var min = Math.min(num1, num2);

    switch (randomOperator) {
      case 'minus':
        question.answer = max - min;
        question.equation = String(max) + " - " + String(min);
        break;
      case 'times':
        question.answer = num1 * num2;
        question.equation = String(num1) + " × " + String(num2);
        break;
      case 'divide':
        question.answer = min;
        question.equation = String(max * min) + " ÷ " + String(max);
        break;
      case 'add':
        question.answer = num1 + num2;
        question.equation = String(num1) + " + " + String(num2);
      default:
    }
    
    return question;
  };
  
  var renderNewQuestion = function () {
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);  
  };
  
  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#user-input').val('');
      updateTimeLeft(+1);
      updateScore(+1);
    }
  };
  
  $('#user-input').on('keyup', function () {
    startGame();
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  gameLimitInput.on('input',function() {
    var percent = Math.floor((parseInt($(this).val())/50) * 100);
    limitValues.text($(this).val());
    $(this).css("background",`linear-gradient(90deg, #BCB6FF 0%, #FF99A0 ${percent}%)`);
    renderNewQuestion();

});
  
  renderNewQuestion();
});