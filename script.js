const { init, h, text } = UI;


const root = document.querySelector("#container");

const initialState = { selected:-1 };

init(root, initialState, update, view); 

function update(state, msg) {
    state.selected = msg;
    return state;
}

function row(highlighted, rowNumber) {
    const boxes = [];
    for (let i = 0; i < 8; i++) {
        const number = boxNumber(rowNumber, i);
        const boxesObjects = { 
            class: "box", 
            onClick: () => number, 
            style: addHighlight(highlighted, number)
        };
        const box = h("div", boxesObjects, []);
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

function addHighlight (n, boxNumber) {
    return n == boxNumber ? "background-color: yellow" : "";
    
}

function boxNumber(rowNumber, columnNumber){
    let i = rowNumber * 8 + columnNumber
    return i;
}

