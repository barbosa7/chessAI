var board,
    game = new Chess();

/*The "AI" part starts here */

var AImove = function (chessgame) {
    const moves = chessgame.ugly_moves()
    var topmove;
    var pos = -999;
    var temp;
    for (var i=0; i<moves.length; i++) {
        
        chessgame.ugly_move(moves[i]);
        temp = calcinadvance(3,chessgame,true);
        chessgame.undo();
        if (temp >= pos) {
            topmove = moves[i];
            pos=temp;
        }
    }
    return topmove;
}

var calcinadvance = function (vardepth, chessgame, myturn){
    if (vardepth==0){
        return evaluateboard(chessgame.board());
    }
    if(myturn){
    const moves = chessgame.ugly_moves()
    var topmove;
    var pos = -999;
    var temp;
    for (var i=0; i<moves.length; i++) {
        chessgame.ugly_move(moves[i]);
        temp = calcinadvance(vardepth-1,chessgame,!myturn);
        chessgame.undo();
        if (temp > pos) {
            topmove = moves[i];
            pos=temp;
        }
    }
    return pos;
    }
    else{
        const moves = chessgame.ugly_moves()
        var topmove;
        var pos = -999;
        var temp;
        for (var i=0; i<moves.length; i++) {
            chessgame.ugly_move(moves[i]);
            //alert(vardepth);
            temp = calcinadvance(vardepth-1,chessgame,!myturn);
            chessgame.undo();
            if (temp < pos) {
                topmove = moves[i];
                pos=temp;
            }
        }
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
            return (piece.color=='w' ? -9 : 9);
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
    var bestMove = AImove(game);
    game.ugly_move(bestMove);
    
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
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