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

function row(highlighted, rowNumber) {

    const boxes = [];
    for (let columnNumber = 0; columnNumber < 8; columnNumber++) {

        const number = boxNumber(rowNumber, columnNumber);

        let isWhitePiece = initialState.piecesWhite.includes(number);
        let isBlackPiece = initialState.piecesBlack.includes(number);
        
        const properties = { 
            class: "box", 
            onClick: () => {
                return { tag: "boxClicked", number: number };  
            }, 
            style: boxStyle(highlighted, number, rowNumber, columnNumber),

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
        rows.push(row(state.selected, i));
    }

    let playerTurn = state.blackTurn ? "Black" : "White";

    return [
        h("h1", {id:"title"}, [text("Checkers")]),
        h("h2", {class: "playerTurn"}, [text(`${playerTurn}'s Turn`)]),  
        h("div", {class: "board"}, rows),       
    ];
}

function boxStyle (highlighted, boxNumber, rowNumber, columnNumber) {

    if (!isBlackBox(rowNumber, columnNumber)) {
        return "";
    }
    let isBlackPiece = initialState.piecesBlack.includes(boxNumber);
    let isWhitePiece = initialState.piecesWhite.includes(boxNumber);

    let blackTurn = initialState.blackTurn;
    

    const isSelected = boxNumber == highlighted;
    const isPossibleMove1 = boxNumber == (highlighted - 7);
    const isPossibleMove2 = boxNumber == (highlighted - 9);
    const isPossibleMove3 = boxNumber == (highlighted + 7);
    const isPossibleMove4 = boxNumber == (highlighted + 9);

    const isPossibleMove5 = boxNumber == (highlighted - 14);
    const isPossibleMove6 = boxNumber == (highlighted - 18);
    const isPossibleMove7 = boxNumber == (highlighted + 14);
    const isPossibleMove8 = boxNumber == (highlighted + 18);

    const r1 = highlighted - 7;
    const r2 = highlighted - 9;
    const r3 = highlighted + 7;
    const r4 = highlighted + 9;

    const isEmptySpace = !isBlackPiece && !isWhitePiece;
    const isPossibleMoveForBlack = isPossibleMove1 || isPossibleMove2;
    const isPossibleMoveForWhite = isPossibleMove3 || isPossibleMove4;

    const isPossibleMoveForBlack2 = isPossibleMove5 || isPossibleMove6;
    const isPossibleMoveForWhite2 = isPossibleMove7 || isPossibleMove8;

    let possibleEatBlackPiece1 = initialState.piecesBlack.includes(r3);
    let possibleEatBlackPiece2 = initialState.piecesBlack.includes(r4);
    let possibleEatWhitePiece3 = initialState.piecesWhite.includes(r1);
    let possibleEatWhitePiece4 = initialState.piecesWhite.includes(r2);


    const possibleEatWhitePiece = possibleEatWhitePiece3 || possibleEatWhitePiece4;
    const possibleEatBlackPiece = possibleEatBlackPiece1 || possibleEatBlackPiece2;

    if (isSelected) {
        return "background-color: #a37000; border: 3px double #FFFF00";
    } else if (isEmptySpace && blackTurn && isPossibleMoveForBlack) {
        return "background-color: #7a9c59; border: 3px double #00FF00";
    } else if (isEmptySpace && !blackTurn && isPossibleMoveForWhite) {
    return "background-color: #7a9c59; border: 3px double #00FF00";

    } else if (isEmptySpace && blackTurn && isPossibleMoveForBlack2 && !isPossibleMoveForBlack && possibleEatWhitePiece) {
        return "background-color: #7a9c59; border: 3px double #00FF00";
    } else if (isEmptySpace && !blackTurn && isPossibleMoveForWhite2 && !isPossibleMoveForWhite && possibleEatBlackPiece) {
        return "background-color: #7a9c59; border: 3px double #00FF00";
    }
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
