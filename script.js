const { init, h, text } = UI;


const root = document.querySelector("#container");

const initialState = { 
    gamePlaying: true,
    selected: -1,
    blackTurn: true,
    piecesWhite: [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23],
    piecesBlack: [40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62],
};

init(root, initialState, update, view); 

function update(state, msg) {
    if (state.blackTurn && msg.tag == "boxClicked") {
        const boxClicked = msg.number;

        let isSelectingAPiece = state.piecesBlack.includes(boxClicked);
        let isSelectingAPiece2 = state.piecesWhite.includes(boxClicked);

        let allowedMoves = [
            state.selected - 7, 
            state.selected - 9,
            state.selected - 14,
            state.selected - 18
        ];

        let isMovingASelectedPiece = allowedMoves.includes(boxClicked);

        if (isSelectingAPiece) {
            state.selected = boxClicked;
        } else if (isMovingASelectedPiece && !isSelectingAPiece2 && !isSelectingAPiece) {
            let newBlackPieces0 = state.piecesBlack.filter(function (value) { 
                return value !== state.selected;
            });

            let newWhitePieces = state.piecesWhite;
            if ((state.selected - 9) == allowedMoves[1]) {
                newWhitePieces = state.piecesWhite.filter(function (value) { 
                    return value !== (state.selected - 9)
                });
            }

            if ((state.selected - 7) == allowedMoves[0]) {
                newWhitePieces = state.piecesWhite.filter(function (value) { 
                    return value !== (state.selected - 7)
                });
            }
            
            state.piecesWhite = newWhitePieces;

            let newBlackPieces = newBlackPieces0.concat([boxClicked]);

            state.piecesBlack = newBlackPieces;
            state.selected = -1;
            state.blackTurn = false;
        }
    }   
    if (!state.blackTurn && msg.tag == "boxClicked") {
        const boxClicked = msg.number;

        let isSelectingAPiece = state.piecesBlack.includes(boxClicked);
        let isSelectingAPiece2 = state.piecesWhite.includes(boxClicked);

        let allowedMoves2 = [
            state.selected + 7, 
            state.selected + 9, 
            state.selected + 14,
            state.selected + 18
        ];

        let isMovingASelectedPiece2 = allowedMoves2.includes(boxClicked);

        if (isSelectingAPiece2) {
            state.selected = boxClicked;
        } else if (isMovingASelectedPiece2 && !isSelectingAPiece2 && !isSelectingAPiece) {
            let newWhitePieces0 = state.piecesWhite.filter(function (value) { 
                return value !== state.selected;
            });
           
            let newBlackPieces = state.piecesBlack;
            if ((state.selected + 9) == allowedMoves2[1]) {
                newBlackPieces = state.piecesBlack.filter(function (value) { 
                    return value !== (state.selected + 9)
                });
            }

            if ((state.selected + 7) == allowedMoves2[0]) {
                newBlackPieces = state.piecesBlack.filter(function (value) { 
                    return value !== (state.selected + 7)
                });
            }
            
            state.piecesBlack = newBlackPieces;
                    
            let newWhitePieces = newWhitePieces0.concat([boxClicked]);

            state.piecesWhite = newWhitePieces;
            state.selected = -1;
            state.blackTurn = true;
        }
        
    } else if(msg.tag == "gameStarted") {
        state.gamePlaying = true;
    }

    return state;
}

function row(state, rowNumber) {
    const highlighted = state.selected;
    const boxes = [];
    for (let columnNumber = 0; columnNumber < 8; columnNumber++) {

        const number = boxNumber(rowNumber, columnNumber);

        let isWhitePiece = initialState.piecesWhite.includes(number);
        let isBlackPiece = initialState.piecesBlack.includes(number);
        
        const moves = possibleMoves(state.piecesWhite, state.piecesBlack, state.selected);
        const properties = { 
            class: "box", 
            onClick: () => {
                return { tag: "boxClicked", number: number };  
            }, 
            style: boxStyle(highlighted, moves, number),

        };
        let box = h("div", properties, []);
        


        if (isWhitePiece) {
             box = h("div", properties, [
                h("div", {class:"piece white"}, [])
            ]);
        } else if (isBlackPiece) {
            box = h("div", properties, [
                h("div", {class:"piece black"}, [])
            ]);
        } else {
            box = h("div", properties, []);
        }

        boxes.push(box);

    }

    return h("div", {class: "row"}, boxes);
}

function view(state) {
   
    if (!initialState.gamePlaying) {
        return [
            h("h1", {id:"title"}, [text("Checkers")]),
            h(
                "button", 
                { class: "startBtn", 
                  onClick: () => {
                    return { tag: "gameStarted" };
                  } 
                }, 
                [text("Play")]
            )
        ]
    };

    let rows = [];
    for (let i = 0; i < 8; i++) {
        rows.push(row(state, i));
    }

    let playerTurn = state.blackTurn ? "Black" : "White";

    return [
        h("h1", {id:"title"}, [text("Checkers")]),
        h("h2", {class: "playerTurn"}, [text(`${playerTurn}'s Turn`)]),  
        h("div", {class: "board"}, rows),       
    ];
}

function possibleMoves(piecesWhite, piecesBlack, selected) {
    if (selected < 0) { 
        return [];
    }

    const add = (x,y) => x + y;
    const sub = (x,y) => x - y;
    const calcRowNumber = (x) => Math.floor(x / 8)

    const goingUp = [
        { fun: sub, close: 7, far: 14 },
        { fun: sub, close: 9, far: 18 },
    ];
    const goingDown = [
        { fun: add, close: 7, far: 14 },
        { fun: add, close: 9, far: 18 },
    ];

    const directions = piecesBlack.includes(selected)
        ? goingUp
        : goingDown;

    const moves = [];
    for (let direction of directions) {
        const close = direction.fun(selected, direction.close);
        const closeHasPiece = piecesWhite.includes(close) || piecesBlack.includes(close);
        const expectedCloseRow = direction.fun(calcRowNumber(selected), 1);
        const closeIsValid = expectedCloseRow === calcRowNumber(close);
        if (!closeHasPiece && closeIsValid) {
            moves.push(close);
            continue;
        }
        if (piecesBlack.includes(selected) && piecesBlack.includes(close)) {
            continue;
        }
        if (piecesWhite.includes(selected) && piecesWhite.includes(close)) {
            continue;
        }

        const far = direction.fun(selected, direction.far);
        const farHasPiece = piecesWhite.includes(far) || piecesBlack.includes(far);
        const expectedFarRow = direction.fun(calcRowNumber(selected), 2);
        const farIsValid = expectedFarRow === calcRowNumber(far);
        if (!farHasPiece && farIsValid) {
            moves.push(far);
        }
    }

    return moves;

}

function boxStyle (highlighted, moves, boxNumber) {
    const isSelected = boxNumber == highlighted;
    let r = highlighted - 18;
    if (isSelected) {
        return "background-color: #a37000; border: 3px double #FFFF00";
    }
    if (!moves.includes(boxNumber)) {
        return "";
    }

    if (Math.abs(boxNumber - highlighted) > 9 ) {
        return "background-color: #a72a2a; border: 3px double #FF3131";
    }

    return "background-color: #7a9c59; border: 3px double #00FF00";
}

function boxNumber(rowNumber, columnNumber){
    let i = rowNumber * 8 + columnNumber
    return i;
}

function isBlackBox(rowNumber, colNumber) {
    if (isEven(rowNumber) && isEven(colNumber)){
        return false;
    } else if (isEven(rowNumber)== false && isEven(colNumber) == false){
        return false;
    } else return true;
}

function isEven(n){
    return n % 2 == 0;
}
