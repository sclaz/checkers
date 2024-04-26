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
    if (msg.tag == "boxClicked") {
        const boxClicked = msg.number;

        let isSelectingAPiece = state.piecesWhite.includes(boxClicked) 
                || state.piecesBlack.includes(boxClicked);

        let allowedMoves = [
            state.selected - 7, 
            state.selected - 9, 
            state.selected + 7, 
            state.selected + 9
        ];

        let isMovingASelectedPiece = allowedMoves.includes(boxClicked);

        if (isSelectingAPiece) {
            state.selected = boxClicked;
        } else if (isMovingASelectedPiece) {
            let newBlackPieces0 = state.piecesBlack.filter(function (value) { 
                return value !== state.selected;
            });
            let newBlackPieces = newBlackPieces0.concat([boxClicked]);

            state.piecesBlack = newBlackPieces;
            state.selected = -1;
            state.blackTurn = false;
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
    

    const isSelected = boxNumber == highlighted;
    const isRelevant1 = boxNumber == (highlighted - 7);
    const isRelevant2 = boxNumber == (highlighted - 9);
    const isRelevant3 = boxNumber == (highlighted + 7);
    const isRelevant4 = boxNumber == (highlighted + 9);
    const isEmptySpace = !isBlackPiece && !isWhitePiece;
    const isRelevant = isRelevant1 || isRelevant2 || isRelevant3 || isRelevant4

    if (isSelected) {
        return "background-color: #a37000; border: 3px double #FFFF00";
    } else if (isEmptySpace && isRelevant) {
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


