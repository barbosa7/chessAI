var board,
    game = new Chess();
let allboards = [];
/*The "AI" part starts here */

var AImove = function (chessgame) {
    const moves = chessgame.ugly_moves()
    var topmove;
    var pos = -99999;
    var temp;
    for (var i=1; i<moves.length; i++) {
        
        chessgame.ugly_move(moves[i]);
        temp = calcinadvance(1,chessgame,-9999,99999,true);
        chessgame.undo();
        if (temp >= pos) {
            topmove = moves[i];
            pos=temp;
        }
    }
    if (pos<=0){
        return (moves[Math.floor(Math.random() * moves.length)])
    }
    return topmove;
}

var AImove_white = function (chessgame) {
    const moves = chessgame.ugly_moves()
    var topmove;
    var pos = 99999;
    var temp;
    for (var i=1; i<moves.length; i++) {
        
        chessgame.ugly_move(moves[i]);
        temp = calcinadvance(1,chessgame,-9999,99999,false);
        chessgame.undo();
        if (temp <= pos) {
            topmove = moves[i];
            pos=temp;
        }
    }
    if (pos>=0){
        return (moves[Math.floor(Math.random() * moves.length)]);
    }
    return topmove;
};

var calcinadvance = function (vardepth, chessgame, alpha, beta, myturn){
    if (vardepth==0){
        if(!localStorage.getItem(chessgame.fen())){
        return evaluateboard(chessgame.board());
        }
        else{
            return evaluateboard(chessgame.board()) + parseInt(localStorage.getItem(chessgame.fen()));
        }
    }
    if(!myturn){
    const moves = chessgame.ugly_moves()
    var pos = -999;
    var temp;
    for (var i=0; i<moves.length; i++) {
        chessgame.ugly_move(moves[i]);
        temp = calcinadvance(vardepth-1,chessgame, alpha, beta,!myturn);
        chessgame.undo();
        if (temp > pos) {
            pos=temp;
        }
        if (alpha < temp){
           alpha =  temp;    
        }
        if (beta <= alpha){
            break;
        }
    }
    return pos;
    }
    else{
        const moves = chessgame.ugly_moves()
        var topmove;
        var pos = 999;
        var temp;
        for (var i=0; i<moves.length; i++) {
            chessgame.ugly_move(moves[i]);
            temp = calcinadvance(vardepth-1,chessgame, alpha, beta,!myturn);
            chessgame.undo();
            if (temp < pos) {
                topmove = moves[i];
                pos=temp;
            }
            if (beta > temp){
                alpha =  temp;    
             }
             if (beta <= alpha){
                 break;
             }
        }
        return pos
    }
}

var evaluateboard = function (board) {
    var acc = 0
    
    for(var i = 0; i<8; i++){
        for (var j= 0; j<8; j++){
            acc = acc + evaluatepiece(board[i][j]);
        }
    }
    return acc;
}

var evaluatepiece = function (piece) {
    if (piece==null){
        return 0;
    }
    switch(piece.type) {
        case 'p': return (piece.color=='w' ? -1 : 1);
        case 'r':
            return (piece.color=='w' ? -5 : 5);
          case 'n':
            return (piece.color=='w' ? -3 : 3);
          case 'b':
            return (piece.color=='w' ? -3 : 3);
          case 'q': return (piece.color=='w' ? -9 : 9);

        default: return (piece.color=='w' ? -10 : 10);
        //default: return 0;
      }
}


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    //var bestMove = getBestMove(game);
    if (game.game_over()) {
        if (!game.in_draw()){
        for(position of allboards){
            if (!localStorage.getItem(position)){
                localStorage.setItem(position,-1);
            }
            else {
                localStorage.setItem(position,(parseInt(localStorage.getItem(position))-1));
            }
        }
        console.log("bot lost")
         
     }
     console.log(game.fen());
    console.log('Game over');
    return true;
}
    allboards.push(game.fen());
    var bestMove = AImove(game);
    game.ugly_move(bestMove);
    allboards.push(game.fen());
    
    board.position(game.fen());
    renderMoveHistory(game.history());

    if (game.game_over()) {
            if (!game.in_draw()){
            for(position of allboards){
                if (!localStorage.getItem(position)){
                    localStorage.setItem(position,1);
                }
                else {
                    localStorage.setItem(position,(parseInt(localStorage.getItem(position))+1));
                }
            }
            console.log("bot won")
         }
         console.log(game.fen());
        console.log('Game over');
        return true;
    }
};


var positionCount;

var getBestMove = function (game) {
    if (game.game_over()) {
        console.log('Game over');
    }

    positionCount = 0;
    //var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = AImove(game);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);
 
    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);
};

//so whenever oponent makes first move, then we instantly play ours and wait for them to play again
var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};
 
var onSnapEnd = function () {
    board.position(game.fen());
};

let goagain = function () {
    game.reset();
};

//the point of this function is to let the bot play itself once the button is clicked.
var botplay = function () {
    var move;
    while (true){
       console.log('moves were made');
       move = AImove_white(game);
       game.ugly_move(move);
       renderMoveHistory(game.history());
       if (makeBestMove()){
        //break;
        game.reset();
       }; 
       renderMoveHistory(game.history());
    }
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
    showErrors: 'console'
    //orientation: 'black'
};
board = ChessBoard('board', cfg);

// code to open file from https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                return allText;
            }
        }
    }
    rawFile.send(null);
}