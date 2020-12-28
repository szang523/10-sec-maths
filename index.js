var gameForm = $('#game-form');
var gameButton = $('.game-button');
var gameInput = $('#game-input input');
var gameTimerText = $('.game-timer-text');
var gameLimitInput = $('#limit-input');
var limitValues = $('.limit-values');
var gameOutput = $('#game-output');
var gameScore = $('#game-score');
var gameHighScore = $('#game-high-score');
var gameSettings = $('#game-settings');


var operationSymbols = {
    "add": " + ",
    "subtract" : " - ",
    "multiply": " x ",
    "divide": " / "
}

var countDown = function(seconds) {
    var timer = setInterval(function(){
        seconds--;
        gameTimerText.text(seconds);
        if (seconds === 0) {
            clearInterval(timer);
        }
    },1000);   
}


var clearGameInput = function() {
    gameInput.val('');
}


// Generate Random Int
var generateRandomInt = function(max) {
    return Math.floor(Math.random() * (max-1) + 1);
}


var getRandomNumbers = function(max, operation) {
    if (operation !== "divide") {
        return [Math.floor(Math.random() * (max-1) + 1),Math.floor(Math.random() * (max-1) + 1)];
    }
    
    var dividend = Math.floor(Math.random() * (max-1) + 1);
    var divisor = Math.floor(Math.random() * (max-1) + 1);
    while ( dividend % divisor !== 0 ) {
        divisor = Math.floor(Math.random() * (max-1) + 1);
        dividend = Math.floor(Math.random() * (max-1) + 1);
    }
    return [dividend,divisor];   
}




var displayProblem = function(problem,op) {
    $('#place-one').text(problem[0]);
    $('#place-two').text(problem[1]);
    $('#operation').text(operationSymbols[op]);
}

var getOperation = function() {
    var operation = "";
    $('input[name=operations]').each(function(){
        if ($(this).is(':checked')) {
            operation =  $(this).val();
        }
    })
    return operation;
}

var getProblem = function() {
    var problem = getRandomNumbers(limitValues.text(),getOperation());
    var [placeOne,placeTwo] = problem;
    if(getOperation() === "subtract") {
        placeOne = Math.max(...problem);
        placeTwo = Math.min(...problem);
    }
    
    return [placeOne,placeTwo];
}

var getAnswer = function(numArray ,operation) {
    var answer;
 
    switch(operation) {
        case "add":
            answer = numArray[0] + numArray[1];
            break;
        case "subtract":
            answer = Math.max(...numArray) - Math.min(...numArray);
            break;
        case "multiply":
            answer = numArray[0] * numArray[1];
            break;
        default:
            answer = numArray[0] / numArray[1];
            break;
    }
   
    return answer;
}




function Game(problem,operation,userInput) {
    this.operation = operation;
    this.currentProblem = problem;
    this.userInput = userInput;
    this.score = 0;
    this.seconds = 10;
    this.highScore = 0;
 

    this.checkAnswer = function() {
       if (parseInt(this.userInput) === getAnswer(this.currentProblem,this.operation)) {
           this.seconds++;
           this.score++;
           gameTimerText.text(this.seconds);
           gameScore.text(this.score);
           this.getNewProblem();
           this.resetUserInput();
       }
      
    }
    this.getNewProblem = function() {
        this.currentProblem = getProblem();
        displayProblem(this.currentProblem,this.operation);
    }
    
    this.getUserInput = function() {
        var that = this;
        gameInput.on('input',function() {
            that.userInput = $(this).val();
            that.checkAnswer();
            if (that.seconds === 0) {
                $(this).unbind();
            }
        });
    }

    this.resetUserInput = function() {
        this.userInput = '';
        clearGameInput();
    }

    this.startRound = function() {
        $('#game-timer').toggleClass('blur-away');
        var that = this;
        var timer = setInterval(function() {
            that.seconds--;
            gameTimerText.text(that.seconds);
            if (that.seconds === 0) {
                clearInterval(timer);
                that.endGame();
            }
        },1000);   
        gameInput.unbind();
        displayProblem(this.currentProblem,this.operation);
        this.checkAnswer();
        this.getUserInput();
        
    }

    this.endGame = function(){
        gameTimerText.text("10");
        this.setHighScore();
        this.score = 0;
        this.seconds = 10;
        gameScore.text("0");
        var that = this;
        var count = 0;
        $('#game-timer').toggleClass('blur-away');
        gameInput.prop('disabled', true);
        gameOutput.toggleClass('blur-away');
        var timer = setInterval(function() {
            count++;
            if (count === 2) {
                gameInput.on('keypress',function() {
                    that.startRound(displayOutput,getOperation());
                });
                that.getNewProblem();
                gameTimerText.text(that.seconds);
                gameOutput.toggleClass('blur-away');
                gameInput.prop('disabled', false);
                gameInput.trigger('focus');
                clearInterval(timer);
            }
        },1000);   
     
    }

    this.setHighScore = function() {
        if (this.highScore < this.score) {
            this.highScore = this.score;
            gameHighScore.text(this.highScore);
        }
    }


}


var blurButtons = function() {
    $('input[name=operations]').each(function(){
        if (!$(this).is(':checked')) {
            $(this).parent().toggleClass('blur-away');
            $(this).parent().unbind();
        }
    })
    $('#limit-form').toggleClass('blur-away');
    gameLimitInput.unbind();
}

    
// Ensure button gets checked for the radio input
gameButton.on('click',function(){
    var current = $(this).children('input');
    if (!current.is(':checked')) {
        current.prop("checked", true);
        gameForm.find('.active').toggleClass('active');
        $(this).toggleClass('active');     
        displayOutput = getProblem();
        displayProblem(displayOutput,getOperation());
      
    }
});

// Ensures input is seen by user
$(window).click(function() {
    gameInput.trigger('focus');
})


gameLimitInput.on('input',function() {
    var percent = Math.floor((parseInt($(this).val())/50) * 100);
    limitValues.text($(this).val());
    $(this).css("background",`linear-gradient(90deg, rgb(146, 34, 34) 0%, rgb(23, 109, 87) ${percent}%)`);
    displayOutput = getProblem();
    displayProblem(displayOutput,getOperation());
});

var gameStart = function() {    
    gameInput.on('input',function() {
        var game = new Game(displayOutput,getOperation(),$(this).val());
        game.startRound();
        blurButtons();
    });
}
// Inital Problem
var displayOutput = getProblem();
// Ensures user is aware of the input
gameInput.trigger('focus');
displayProblem(displayOutput,getOperation());
gameStart();
