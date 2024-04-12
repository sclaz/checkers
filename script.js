const { init, h, text } = UI;


const root = document.querySelector("#container");

const initialState = { selected:-1 };

init(root, initialState, update, view); 

function update(state, msg) {
    state.selected = msg;
    return state;
}

function row(highlighted, rowNumber) {
    return h("div", {class: "row"}, [
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 0), style: addHighlight(highlighted, boxNumber(rowNumber, 0))}, []),
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 1), style: addHighlight(highlighted, boxNumber(rowNumber, 1))}, []),
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 2), style: addHighlight(highlighted, boxNumber(rowNumber, 2))}, []),
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 3), style: addHighlight(highlighted, boxNumber(rowNumber, 3))}, []), 
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 4), style: addHighlight(highlighted, boxNumber(rowNumber, 4))}, []),
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 5), style: addHighlight(highlighted, boxNumber(rowNumber, 5))}, []),
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 6), style: addHighlight(highlighted, boxNumber(rowNumber, 6))}, []), 
        h("div", {class: "box", onClick: () => boxNumber(rowNumber, 7), style: addHighlight(highlighted, boxNumber(rowNumber, 7))}, []),
    ]);
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

