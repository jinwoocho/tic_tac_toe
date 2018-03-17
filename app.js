var game;
var CreateGame = function() {
    var player1 = $('.player1');
    var player2 = $('.player2');
    var tieCounter = 0;
    player1.addClass('current_player');
    //in playsMadeArr 0 = not played space, 1 = X played and 2 = O played
    this.playsMadeArr = [];
    this.gameStarted = false;
    this.current_player = 'X';
    this.gameBoardSize = null;
    this.winCondition = null;
    //the following two functions are meant to allow control of when the variables will actually be set
    this.userWinCondition = function () {
        this.winCondition = $("input[name='match']:checked").val();
        this.winCondition = parseInt(this.winCondition);
    };
    //When the size of the board changes, the match size has to reflect any changes as
    //well as take into account that you can't match more than the size of the board.
    this.getSize = function() {
        this.gameBoardSize = $("input[name='chosen']:checked").val();
        this.gameBoardSize = parseInt(this.gameBoardSize);
        if (this.gameBoardSize === 3) {
            $(".matchThree").prop('checked', true).attr('checked', true);
            $(".matchFour").attr("disabled", true).removeAttr('checked');
            $(".matchFive").attr("disabled", true).removeAttr('checked');
        } else if (this.gameBoardSize === 4) {
            $(".matchFour").attr("disabled", false);
            $(".matchFive").attr("disabled", true);
            if ($('.matchFive').is(':checked')) {
                $(".matchFive").prop("checked", false).removeAttr('checked');
                $(".matchFour").prop("checked", true).attr('checked',true);
            }
        } else {
            $(".matchFour").attr("disabled", false);
            $(".matchFive").attr("disabled", false);
        }
        this.userWinCondition();
    };
    //handles when the match buttons are changed.
    this.changeChecked = function() {
        $("input[name='match']").removeAttr('checked');
        $(event.target).prop('checked', true).attr('checked', true);
        this.userWinCondition();
    };
    this.addClickHandlers = function() {
        $("input[name='match']").click(this.changeChecked.bind(this));
        $("input[name='chosen']").click(this.getSize.bind(this));
        $(".start_game").click(this.beginGame.bind(this));
        $(".reset_game").click(this.ResetGame.bind(this));
    };
    //sets up game by calling the functions in correct order as well as making the newly created
    //cells clickable. It also disables the start game button and makes the reset game button available.
    this.beginGame = function() {
        if (!this.gameStarted) {
            this.getSize();
            this.createBoard();
            this.createCells();
            this.createPlaysMade();
            $(".ttt_cell").click(this.switchPlayers.bind(this));
            $("input").attr("disabled", true);
            this.gameStarted = true;
        }
    };
    //creates board based on size of game chosen
    this.createBoard = function() {
        if(this.gameBoardSize === 3) {
            var board = $("<div>", {
                class : "game_board_three"
            });
        } else if (this.gameBoardSize === 4) {
            board = $("<div>", {
                class : "game_board_four"
            });
        } else {
            board = $("<div>", {
                class : "game_board_five"
            });
        }
        $(".board_location").append(board);
    }; // end of createBoard
    //creates the individual cells for the board and appends them on
    this.createCells = function() {
        var size = this.gameBoardSize;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j< size; j++) {
                var cell = $("<div>", {
                    class: "ttt_cell",
                    "row": i,
                    "col": j
                });
                if (size === 3) {
                    $(".game_board_three").append(cell);
                } else if (size === 4) {
                    $(".game_board_four").append(cell);
                }
                else {
                    $(".game_board_five").append(cell);
                }
            }
        }
    };//end of createCells
    //creates the array of arrays that will hold the representation of the board filling it all with 0's
    this.createPlaysMade = function() {
        var size = this.gameBoardSize;
        for(var i=0; i < size; i++){
            var temp = [];
            this.playsMadeArr.push(temp);
            for (var j=0; j< size; j++){
                this.playsMadeArr[i][j] = 0;
            }
        }
    };
    //this checks if the game has been one by checking rows, then columns and finally diagnols in order if
    //game hasn't already been won.
    this.checkWin = function(row, col, symbolChecking) {
        var size = this.gameBoardSize;
        //check row
        var rowCount = 0;
        for (var i = 0; i < this.playsMadeArr.length; i++) {
            if(this.playsMadeArr[row][i]===symbolChecking) {
                rowCount += 1;
            } else {
                if (rowCount < this.winCondition) {
                    rowCount = 0;
                }
            }
        }
        //check columns
        if (!(rowCount >= this.winCondition)) {
            var colCount = 0;
            for (var j = 0; j < this.playsMadeArr.length; j++) {
                if(this.playsMadeArr[j][col]===symbolChecking) {
                    colCount += 1;
                } else {
                    if(colCount < this.winCondition) {
                        colCount = 0;
                    }
                }
            }
        }
        //checks diagonal
        if (!(rowCount >= this.winCondition) || !(colCount >= this.winCondition)) {
            var upLeft = [];
            var upRight = [];
            var downLeft = [];
            var downRight = [];
            var currentRow = parseInt(row);
            var currentCol = parseInt(col);
            for (var i = 0; i < size; i++) {
                if (this.playsMadeArr.hasOwnProperty(currentRow - i)) {
                    if (this.playsMadeArr.hasOwnProperty(currentCol - i)) {
                        upLeft.push(this.playsMadeArr[currentRow - i][currentCol - i]);
                    }
                }
                if (this.playsMadeArr.hasOwnProperty(currentRow - i)) {
                    if (this.playsMadeArr.hasOwnProperty(currentCol + i)) {
                        upRight.push(this.playsMadeArr[currentRow - i][currentCol + i]);
                    }
                }
                if (this.playsMadeArr.hasOwnProperty(currentRow + i)) {
                    if (this.playsMadeArr.hasOwnProperty(currentCol - i)) {
                        downLeft.push(this.playsMadeArr[currentRow + i][currentCol - i]);
                    }
                }
                if (this.playsMadeArr.hasOwnProperty(currentRow + i)) {
                    if (this.playsMadeArr.hasOwnProperty(currentCol + i)) {
                        downRight.push(this.playsMadeArr[currentRow + i][currentCol + i]);
                    }
                }
            }
            //because the four arrays all hold the value of the clicked cell, it is necessary
            //to remove one of those so that the final array will not hold two copies of the
            //same space.
            downRight.shift();
            var leftDiagonalComplete = upLeft.reverse().concat(downRight);
            upRight.shift();
            var rightDiagonalComplete = downLeft.reverse().concat(upRight);
            var countLeft = 0;
            for (var j = 0; j<leftDiagonalComplete.length; j++) {
                if (leftDiagonalComplete[j] === symbolChecking) {
                    countLeft += 1;
                } else if (countLeft < this.winCondition) {
                    countLeft = 0;
                }
            } if (countLeft < this.winCondition) {
                var countRight = 0;
                for (var k = 0; k < rightDiagonalComplete.length; k++) {
                    if (rightDiagonalComplete[k] === symbolChecking) {
                        countRight += 1;
                    } else if (countRight < this.winCondition) {
                        countRight = 0;
                    }
                }
            }
        }
        //check win
        tieCounter++;
        if(rowCount >= this.winCondition || colCount >= this.winCondition
        || countLeft >= this.winCondition || countRight >= this.winCondition) {
            if (symbolChecking === 1) {
                $('.board_location').empty().append('<img src="../C2.17_tictactoe/images/cartman-victory.jpg" id = "victory">')
            } else {
                $('.board_location').empty().append('<img src="../C2.17_tictactoe/images/kyle-victory.gif" id = "victory">');
            }
        }
        else if (tieCounter == 9 && size == 3 || tieCounter == 25 && size == 5 || tieCounter == 16 && size == 4){
            $('.board_location').empty().append('<img src="../C2.17_tictactoe/images/Cartman_Kyle_Tie.jpg" id = "victory">');
        }
    };//end checkWin
    //
    this.switchPlayers = function () {
        var self = event.target; // sets the variable self to the cell clicked
        var row = $(self).attr('row');
        var col = $(self).attr('col');
        //prevents people from changing the symbols
        if(!$(self).hasClass('occupied')) {
            //assigns a row and column, switches current player and places the symbol in cell
            if (this.current_player == 'X') {
                this.playsMadeArr[row][col] = 1;
                $(self).append(('<img src="../C2.17_tictactoe/images/EricCartman.png" id = "symbol">'));
                this.checkWin(row, col, 1);
                this.current_player = 'O';
                player2.addClass('current_player');
                player1.removeClass('current_player');
                $(self).addClass('occupied');
            } else {
                this.playsMadeArr[row][col] = 2;
                $(self).append(('<img src="../C2.17_tictactoe/images/KyleBroflovski.png" id = "symbol">'));
                this.checkWin(row, col, 2);
                this.current_player = 'X';
                player1.addClass('current_player');
                player2.removeClass('current_player');
                $(self).addClass('occupied');
            }
        }
    };//End of switchPlayers
    
    this.ResetGame = function () {
        $("input").prop("disabled", false);
        $(".matchThree").prop("checked", true).attr('checked', true);
        $(".matchFour").prop("disabled", true).removeAttr('checked');
        $(".matchFive").prop("disabled", true).removeAttr('checked');
        $("#startPosition").prop("checked", true);
        player1.addClass('current_player');
        player2.removeClass('current_player');
        this.playsMadeArr = [];
        this.current_player = 'X';
        $('.board_location').empty();
        tieCounter = 0;
        this.gameStarted = false;
    }
    
};//end of CreateGame
function initialize() {
    game.addClickHandlers();
    $(".matchFour").attr("disabled", true);
    $(".matchFive").attr("disabled", true);
}

$(document).ready(function() {
    game = new CreateGame;
    initialize();
});
