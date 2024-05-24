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
        const farLeft = state.selected - 18;
        const farRight = state.selected - 14;
        const closeLeft = state.selected - 9;
        const closeRight = state.selected - 7;

        const boxClicked = msg.number;

        let isSelectingAPiece = state.piecesBlack.includes(boxClicked);
        let allPossibleMoves = possibleMoves(state.piecesWhite, state.piecesBlack, state.selected); 
        let isPossibleMove = allPossibleMoves.includes(boxClicked);

        if (isSelectingAPiece) {
            state.selected = boxClicked;
        } else if (isPossibleMove) {
            // Move selected piece
            state.piecesBlack = state.piecesBlack
                .filter(value => value !== state.selected)
                .concat([boxClicked]);

            // Take oponent's piece
            if (boxClicked == farLeft) {
                state.piecesWhite = state.piecesWhite.filter(value => value !== closeLeft);
            } else if (boxClicked == farRight) {
                state.piecesWhite = state.piecesWhite.filter(value => value !== closeRight);
            }

            state.selected = -1;
            state.blackTurn = false;
        }
        
    }   
    if (!state.blackTurn && msg.tag == "boxClicked") {
        const farRight = state.selected + 18;
        const farLeft = state.selected + 14;
        const closeRight = state.selected + 9;
        const closeLeft = state.selected + 7;

        const boxClicked = msg.number;

        let isSelectingAPiece = state.piecesWhite.includes(boxClicked);
        let allPossibleMoves = possibleMoves(state.piecesWhite, state.piecesBlack, state.selected); 
        let isPossibleMove = allPossibleMoves.includes(boxClicked);

        if (isSelectingAPiece) {
            state.selected = boxClicked;
        } else if (isPossibleMove) {
            // Move selected piece
            state.piecesWhite = state.piecesWhite
                .filter(value => value !== state.selected) 
                .concat([boxClicked]);

            // Take oponent's piece
            if (boxClicked == farLeft) {
                state.piecesBlack = state.piecesBlack.filter(value => value !== closeLeft);
            } else if (boxClicked == farRight) {
                state.piecesBlack = state.piecesBlack.filter(value => value !== closeRight);
            }
            
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
        


        if (isWhitePiece && rowNumber === 7) { // i added this extra if statement parag
            box = h("div", properties, [
                h("div", {class:"piece white"}, [
                    h("div", {class:"special"}, []) //I added this child
                ]), 
            ]); 
        } else if (isWhitePiece) { // added this parag
            box = h("div", properties, [
                h("div", {class:"piece white"}, []),
            ]);
        } else if (isBlackPiece && rowNumber === 0) { // i added this extra if statement parag
            box = h("div", properties, [
                h("div", {class:"piece black"}, [
                    h("div", {class:"special"}, []) //I added this child
                ]), 
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
