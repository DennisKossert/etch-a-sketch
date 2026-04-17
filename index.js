const body = document.querySelector("body")
const grid = document.querySelector(".grid");
let mouseDown = false;
let lastGridSize = 16;

let colorized = false;
let eraser = false;
let chosenColor = "rgb(255, 0, 0)"


function createGrid(gridHeigth, gridWidth) {
    const gridRow = document.createElement("div");
    gridRow.classList = "grid-row";

    const square = document.createElement("div");
    square.classList = "square";
    if (colorized == true) {
        square.classList.add("paintable");
    } else {
        square.classList.add("sketchable");
    }
    square.style.width = (100 / gridWidth) + "%"
    gridRow.appendChild(square);

    for (let i = 1; i < gridWidth; i++) {
        gridRow.appendChild(square.cloneNode(true));
    }
    
    for (let i = 0; i < gridHeigth; i++) {
        grid.appendChild(gridRow.cloneNode(true));
    }
};

function deleteGrid() {
    grid.replaceChildren();
};

function parseColor(string) {
    let colorArr = string.slice(4, -1).split(",");
    return colorArr;
};

function getDarkerColors(colorArr) {
    for (let i = 0; i < colorArr.length; i++) {
        colorArr[i] = Math.max(10, Math.floor(colorArr[i] / 2));
    }
    let newColor = `rgb(${colorArr[0]}, ${colorArr[1]}, ${colorArr[2]})`
    return newColor;
}

function paint(target) {
    if (eraser) {
        if (colorized) {
            target.style.backgroundColor = "rgb(250, 235, 215)";
            return;
        }
        target.style.backgroundColor = "rgb(102, 126, 88)";
        return;
    }
    if (colorized) {
        target.style.backgroundColor = chosenColor;
        return;
    }
    target.style.backgroundColor = getDarkerColors(parseColor(getComputedStyle(target).backgroundColor));
}

function resetGrid() {
    deleteGrid();
    createGrid(lastGridSize, lastGridSize);
}
//Painting---------------------------------------------
grid.addEventListener("mouseover", (event) => {

    let target = event.target;
    if (!(target.className.includes("square"))) {
        return;
    };
    if (mouseDown) {
        paint(target);
    };   
});

grid.addEventListener("mousedown", (event) => {
    event.preventDefault();
    mouseDown = true;
    let target = event.target;
    if (!(target.className.includes("square"))) {
        return;
    }
    paint(target);
});


body.addEventListener("mouseup", (event) => {
    mouseDown = false;
});

//Size-modification-----------------------------------
const sizeInput = document.querySelector("#size-message");

const GRID_LIMIT = 100;

sizeInput.addEventListener("keydown", (event) => {
    if (event.key != "Enter") {
        return;
    };
    lastGridSize = event.target.value;
    let gridWidth = event.target.value;
    let gridHeigth = event.target.value;
    deleteGrid();
    createGrid(Math.min(GRID_LIMIT, gridHeigth), Math.min(GRID_LIMIT, gridWidth));
    sizeInput.value = "";
});

//---------------------Toolbar

const toolBarButtons = document.querySelector(".button-tools");
const eraserButton = document.querySelector("#eraser");
const clearButton = document.querySelector("#clear");
const sketchButton = document.querySelector("#sketch");
const paintButton = document.querySelector("#paint");
const colorPicker = document.querySelector("#color-picker")

toolBarButtons.addEventListener("click", (event) => {
    switch (event.target) {
        
        case eraserButton:
            eraser = !eraser;
            break;
        
        case clearButton:
            resetGrid();
            break;
        
        case sketchButton:
            colorized = false;
            eraser = false;
            colorPicker.style.display = "none";
            resetGrid();
            break;
    
        case paintButton:
            colorized = true;
            erase = false;
            colorPicker.style.display = "block";
            resetGrid();
            break;
    }
});

colorPicker.addEventListener("change", (event) => {
    chosenColor = event.target.value;
    eraser = false;
})

createGrid(16, 16);