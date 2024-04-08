const { init, h, text } = UI;


const root = document.querySelector("#container");

const initialState = { on: false };

init(root, initialState, update, view); 

function update(state, msg) {
    return state;
}

function row() {
    return h("div", {class: "row"}, [
        h("div", {class: "box"}, []),
        h("div", {class: "box"}, []),
        h("div", {class: "box"}, []),
        h("div", {class: "box"}, []),
        h("div", {class: "box"}, []),
        h("div", {class: "box"}, []),
        h("div", {class: "box"}, []),
        h("div", {class: "box"}, []),
    ]);
}

function view(state) {
    return [
        h("h1", {id:"title"}, [text("Checkers")]),

        h("div", {class: "board"}, [
            row(),
            row(),
            row(),
            row(),
            row(),
            row(),
            row(),
            row(),  
        ]),       
    ];
}