var board,
    game = new Chess();
let allboards = [];
/*The "AI" part starts here */

var AImove = function (chessgame) {
    const moves = chessgame.ugly_moves()
    var topmove=moves[0];
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
    return topmove;
}

var AImove_white = function (chessgame) {
    const moves = chessgame.ugly_moves()
    var topmove=moves[0];
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
    return topmove;
}

var calcinadvance = function (vardepth, chessgame, alpha, beta, myturn){
    if (vardepth==0){
        //console.log(chessgame.fen());
        //console.log(localStorage.getItem(chessgame.fen()));
        if(!localStorage.getItem(chessgame.fen())){
        return evaluateboard(chessgame.board());
        }
        else{
            //alert('whatou')
            //alert(localStorage.getItem(chessgame.fen()));
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
          case 'q':

        //default: return (piece.color=='w' ? -500 : 500);
        default: return 0;
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
                localStorage.setItem(position,localStorage.getItem(position)-1);
            }
        }
     }
    alert('Game over');
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
                    localStorage.setItem(position,localStorage.getItem(position)+1);
                }
            }
         }
        alert('Game over');
    }
};


var positionCount;

var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
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
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);