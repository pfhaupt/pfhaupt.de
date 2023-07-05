const tree = new Tree();

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    background("#262626");
}

function getNumberInput(id) {
    let number = document.getElementById(id).value;
    if (number === '') return null;
    return Math.round(number);
}

function addNumberToTree() {
    let number = getNumberInput("addElemInput");
    if (number === null) return;
    let result = tree.addValue(number);
    if (result) {
        document.getElementById("treeResult").innerHTML = "Added " + number + " to the tree!";
        document.getElementById("treeAsString").innerHTML = "Tree as List: " + tree.toString();
    } else {
        document.getElementById("treeResult").innerHTML = number + " is already element in the tree!";
    }
}

function searchNumberInTree() {
    let number = getNumberInput("searchElemInput");
    if (number === null) return;
    let result = tree.search(number) !== null;
    if (result) {
        document.getElementById("treeResult").innerHTML = number + " is in the tree!";
    } else {
        document.getElementById("treeResult").innerHTML = number + " is not in the tree!";
    }
}

function clickPress(event, id) {
    if (event.key == "Enter") {
        switch (id) {
            case "addElemInput": addNumberToTree(); break;
            case "searchElemInput": searchNumberInTree(); break;
        }
    }
}