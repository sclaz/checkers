const { init, h, text } = UI;


const root = document.querySelector("#container");

const initialState = { 
    selected: -1,
    blackTurn: true,
    piecesWhite: [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22],
    piecesBlack: [40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62],
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
                return isBlackPiece ? number : undefined;
            }, 
            style: boxStyle(highlighted, number)
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

function boxStyle (n, boxNumber) {
    return n == boxNumber ? "background-color: yellow" : "";
}

function boxNumber(rowNumber, columnNumber){
    let i = rowNumber * 8 + columnNumber
    return i;
}


