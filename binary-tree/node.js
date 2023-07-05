class Node {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
    }

    addNode = function(n) {
        if (n.value < this.value) {
            if (this.left === null) {
                this.left = n;
                return true;
            } else {
                return this.left.addNode(n);
            }
        } else if (n.value > this.value) {
            if (this.right === null) {
                this.right = n;
                return true;
            } else {
                return this.right.addNode(n);
            }
        }
        return false;
    }

    search = function(val) {
        if (this.value === val) {
            return this;
        } else if (val < this.value && this.left !== null) {
            return this.left.search(val);
        } else if (val > this.value && this.right !== null) {
            return this.right.search(val);
        }
        return null;
    }

    collectElements = function(elements) {
        if (this.left !== null) this.left.collectElements(elements);
        elements.push(this.value);
        if (this.right !== null) this.right.collectElements(elements);
    }
}