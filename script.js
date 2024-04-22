const { init, h, text } = UI;


const root = document.querySelector("#container");

const initialState = { 
    selected: -1,
    blackTurn: true,
    piecesWhite: [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22],
    piecesBlack: [40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62],
    whitebox: [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22, 25, 27, 29, 31, 32, 34, 36, 38, 41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61],
    blackBox: [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23, 24, 26, 28, 30, 33, 35, 37, 39, 40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62],
};

init(root, initialState, update, view); 

function update(state, msg) {
    state.selected = msg;
    return state;
}

function row(highlighted, rowNumber) {

    const boxes = [];
    for (let i = 0; i < 8; i++) {

        const number = boxNumber(rowNumber, i);

        let isWhitePiece = initialState.piecesWhite.includes(number);
        let isBlackPiece = initialState.piecesBlack.includes(number);
        
        const properties = { 
            class: "box", 
            onClick: () => {
                if (isBlackPiece) {
                    return number;

                }
                
            }, 
            style: boxStyle(highlighted, number),

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
    let rows = [];
    for (let i = 0; i < 8; i++) {
        rows.push(row(state.selected, i));
    }

    return [
        h("h1", {id:"title"}, [text("Checkers")]),
        h("div", {class: "board"}, rows),       
    ];
}

function boxStyle (highlighted, boxNumber) {
    
    const number = boxNumber;
    let isblackBox = initialState.blackBox.includes(number);

    const isSelected = boxNumber == highlighted;
    const isRelevant = boxNumber == (highlighted - 7);
    const isRelevant2 = boxNumber == (highlighted - 9);
    if (isSelected) {
        return "background-color: #a37000; border: 3px double #FFFF00";
    } else if (isRelevant && isblackBox) {
        return "background-color: #7a9c59; border: 3px double #00FF00";
    } else if (isRelevant2 && isblackBox){
        return "background-color: #7a9c59; border: 3px double #00FF00";  
    }
}

function boxNumber(rowNumber, columnNumber){
    let i = rowNumber * 8 + columnNumber
    return i;
}


