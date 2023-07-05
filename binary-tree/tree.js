class Tree {
    constructor() {
        this.root = null;
    }

    addValue = function(val) {
        let n = new Node(val);
        if (this.root === null) {
            this.root = n;
            return true;
        } else {
            return this.root.addNode(n);
        }
    }

    search = function(val) {
        return this.root.search(val);
    }

    toString() {
        let elements = [];
        if (this.root !== null) this.root.collectElements(elements);
        let str = "[" + elements[0];
        for (let i = 1; i < elements.length; i++) {
            let elem = elements[i];
            str += ", " + elem;
        }
        str += "]";
        return str;
    }
}