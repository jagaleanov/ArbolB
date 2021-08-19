// Constants
WIDTH = 32; // Key width
HEIGHT = 32; // Key height
SPACING = 32; // Node spacing
OFFSET = 16; // Scroll offset
// Constants for the BTreeDrawing.draw method
CENTER_ROOT = 0;
CENTER_NODE = 1;
SCROLL = 2;


class Node {
    keys;
    children;
    x;
    y;

    constructor() {
        this.keys = [];
        this.children = [];
        this.x = 0; // node's x coordinate in the canvas
        this.y = 0; // node's y coordinate in the canvas
    }
}

class ListNode {
    data;
    next;

    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Stack {
    head;

    constructor() {
        this.head = null;
    }

    push(data) {

        if (this.head != null) {
            var newNode = new ListNode(data);
            newNode.next = this.head;
            this.head = newNode;
        } else {
            var newNode = new ListNode(data);
            this.head = newNode;
        }
    }

    pop() {

        var removed = this.head;
        var next = this.head.next;

        this.head = next;
        return removed.data;
    }

    isEmpty() {
        return this.head == null;
    }
}

class Queue {
    head;

    constructor() {
        this.head = null;
    }

    enqueue(data) {
        var newNode = new ListNode(data);

        if (this.head == null) {
            this.head = newNode;
        } else {
            let nodeParent = this.findTail();
            nodeParent.next = newNode;
        }
    }

    findTail() {
        let pivot = this.head;
        while (pivot.next != null) {
            pivot = pivot.next;
        }
        return pivot;
    }

    dequeue() {

        var removed = this.head;
        var next = this.head.next;

        this.head = next;
        return removed.data;
    }

    isEmpty() {
        return this.head == null;
    }
}

class TreeB {
    root;
    grade;
    numMaxKey;
    numMaxPointer;

    constructor(grade) {
        this.root = null;
        this.grade = grade;
        this.numMaxKey = grade * 2;
        this.numMaxPointer = this.numMaxKey + 1;
    }

    exist(value, head) {
        if (head == null) {//si la raiz esta vacia
            return false;
        } else {
            let pivot = head;
            let pos = 0;

            while (pos < pivot.keys.length && pivot.keys[pos] < value) {//buscar la llave igual o inmediatamente mayor al valor
                pos++;
            }

            if (pos in pivot.keys && pivot.keys[pos] == value) {//si la siguiente posición existe y es el valor
                return true;
            } else if (pos in pivot.children) {//si existe un hijo en esa posición
                return this.exist(value, head.children[pos]);
            } else {//si el valor no existe
                return false;
            }
        }
    }

    insert(value) {

        if (this.exist(value, this.root)) {
            alert('El valor ' + value + ' ya existe en el árbol.');
        } else {

            let stack = new Stack();
            if (this.root == null) {//si la raiz esta vacia
                this.root = new Node();
                this.root.keys.push(value);
            } else {
                let nodePivot = this.root;

                while (nodePivot.children.length > 0) {//buscar el nodo a donde se va a añadir

                    stack.push(nodePivot);
                    let pos = 0;

                    while (pos < nodePivot.keys.length && nodePivot.keys[pos] < value) {//buscar por cual hijo continuar
                        pos++;
                    }

                    nodePivot = nodePivot.children[pos];
                }

                nodePivot = this.addKey(nodePivot, value);//añadir llave al nodo pivote

                //balanceo de nodos intermedios y hojas
                while (!stack.isEmpty()) {
                    let nodeParentPivot = stack.pop();
                    if (nodePivot.keys.length > this.numMaxKey) {//si el nodo tiene más llaves de lo debido

                        let node1 = new Node();
                        for (let i = 0; i < (this.numMaxKey / 2); i++) {
                            node1.keys.push(nodePivot.keys[i]);
                        }
                        for (let i = 0; i < (this.numMaxPointer / 2) && i < nodePivot.children.length; i++) {
                            node1.children.push(nodePivot.children[i]);
                        }

                        let node2 = new Node();
                        for (let i = (this.numMaxKey / 2) + 1; i <= this.numMaxKey; i++) {
                            node2.keys.push(nodePivot.keys[i]);
                        }

                        for (let i = Math.floor(this.numMaxPointer / 2) + 1; i <= this.numMaxPointer && i <= nodePivot.children.length; i++) {
                            node2.children.push(nodePivot.children[i]);
                        }

                        let keyUp = nodePivot.keys[this.numMaxKey / 2];

                        let pos = 0;
                        while (pos < nodeParentPivot.keys.length && nodeParentPivot.keys[pos] < keyUp) {
                            pos++;
                        }
                        nodeParentPivot.keys.splice(pos, 0, keyUp);
                        nodeParentPivot.children.splice(pos, 1, node1);
                        nodeParentPivot.children.splice(pos + 1, 0, node2);
                    }

                    nodePivot = nodeParentPivot;
                }

                //balanceo de la raiz
                if (nodePivot.keys.length > this.numMaxKey) {//si el nodo tiene más llaves de lo debido

                    let node1 = new Node();
                    for (let i = 0; i < (this.numMaxKey / 2); i++) {
                        node1.keys.push(nodePivot.keys[i]);
                    }
                    for (let i = 0; i < (this.numMaxPointer / 2) && i < nodePivot.children.length; i++) {
                        node1.children.push(nodePivot.children[i]);
                    }

                    let node2 = new Node();
                    for (let i = (this.numMaxKey / 2) + 1; i <= this.numMaxKey; i++) {
                        node2.keys.push(nodePivot.keys[i]);
                    }
                    for (let i = Math.floor(this.numMaxPointer / 2) + 1; i <= this.numMaxPointer && i <= nodePivot.children.length; i++) {
                        node2.children.push(nodePivot.children[i]);
                    }

                    let keyUp = nodePivot.keys[this.numMaxKey / 2];

                    this.root = new Node();
                    this.root.keys.push(keyUp);
                    this.root.children.push(node1);
                    this.root.children.push(node2);
                }
            }
        }
    }

    addKey(node, value) {
        let pos = 0;
        while (pos < node.keys.length && node.keys[pos] < value) {
            pos++;
        }
        node.keys.splice(pos, 0, value);
        return node;
    }

    delete(value) {
        console.log('DELETE ' + value + ' *******************************');

        if (!this.exist(value, this.root)) {
            alert('El valor ' + value + ' no existe en el árbol.');
        } else {
            let stack = new Stack();
            let queue = new Queue();
            let nodePivot = this.root;

            while (!nodePivot.keys.includes(value)) {//si el valor no esta en el nodo
                stack.push(nodePivot);
                let pos = 0;

                while (pos < nodePivot.keys.length && nodePivot.keys[pos] < value) {//buscar por cual hijo continuar
                    pos++;
                }

                nodePivot = nodePivot.children[pos];
            }

            let nodeToDeleteFrom = nodePivot;//el nodo que contiene la llave a borrar
            let i = nodeToDeleteFrom.keys.indexOf(value);// posicion de la llave a borrar

            if (nodeToDeleteFrom.children.length == 0) {//si es una hoja
                nodeToDeleteFrom.keys.splice(i, 1);
            } else {//si no es una hoja
                nodePivot = nodePivot.children[i + 1];
                while (nodePivot.children.length > 0) {//buscar el nodo sucesor
                    queue.enqueue(nodePivot);
                    nodePivot = nodePivot.children[0];
                }
                nodeToDeleteFrom.keys.splice(i, 1, nodePivot.keys[0]);//reemplazar llave borrada por el sucesor
                nodePivot.keys.splice(0, 1);//eliminar la llave sucesora de la posicion anterior

                stack.push(nodeToDeleteFrom);

                while (!queue.isEmpty()) {
                    stack.push(queue.dequeue());
                }
            }

            let nodeParentPivot;

            console.log('FINAL STACK');
            console.log(stack.head);

            while (!stack.isEmpty()) {

                nodeParentPivot = stack.pop();

                let pos;

                pos = nodeParentPivot.children.indexOf(nodePivot);

                if (nodePivot.keys.length < this.grade) {
                    console.log('**POP nodeParent');
                    console.log(nodeParentPivot);

                    console.log('nodePivot');
                    console.log(nodePivot);

                    console.log('pos pivot');
                    console.log(pos);

                    if (nodeParentPivot.children.length > pos + 1 && nodeParentPivot.children[pos + 1].keys.length > this.grade) {//redistribuir desde la derecha
                        console.log('redistribuir desde la derecha');
                        let temp = nodeParentPivot.keys.splice(pos, 1)[0];
                        console.log('temp');
                        console.log(temp);
                        nodePivot.keys.push(temp);
                        nodeParentPivot.keys.splice(pos, 1, nodeParentPivot.children[pos + 1].keys.shift());

                        if (nodeParentPivot.children[pos + 1].children.length > nodeParentPivot.children[pos + 1].keys.length + 1) {
                            nodePivot.children.push(nodeParentPivot.children[pos + 1].children.shift());
                        }

                    } else if (pos > 0 && nodeParentPivot.children[pos - 1].keys.length > this.grade) {//redistribuir desde la izquierda
                        console.log('redistribuir desde la izquierda');
                        let temp = nodeParentPivot.keys.splice(pos - 1, 1)[0];
                        console.log('temp');
                        console.log(temp);
                        nodePivot.keys.unshift(temp);
                        nodeParentPivot.keys.splice(pos, 1, nodeParentPivot.children[pos - 1].keys.pop());

                        if (nodeParentPivot.children[pos - 1].children.length > nodeParentPivot.children[pos - 1].keys.length + 1) {
                            nodePivot.children.unshift(nodeParentPivot.children[pos - 1].children.splice(0, 1));
                        }

                    } else if (pos > 0) {//mezclar con nodo izquierdo
                        console.log('mezclar con nodo izquierdo');

                        nodePivot.keys.unshift(nodeParentPivot.keys[pos - 1]);
                        while (nodeParentPivot.children[pos - 1].keys.length > 0) {
                            nodePivot.keys.unshift(nodeParentPivot.children[pos - 1].keys.pop());
                        }
                        while (nodeParentPivot.children[pos - 1].children.length > 0) {
                            nodePivot.children.unshift(nodeParentPivot.children[pos - 1].children.pop());
                        }
                        nodeParentPivot.keys.splice(pos - 1, 1);
                        nodeParentPivot.children.splice(pos - 1, 1);
                        nodeParentPivot.children[pos - 1] = nodePivot;
                    } else {
                        console.log('mezclar con nodo derecho');

                        nodePivot.keys.push(nodeParentPivot.keys[pos]);
                        while (nodeParentPivot.children[pos + 1].keys.length > 0) {
                            nodePivot.keys.push(nodeParentPivot.children[pos + 1].keys.shift());
                        }
                        while (nodeParentPivot.children[pos + 1].children.length > 0) {
                            nodePivot.children.push(nodeParentPivot.children[pos + 1].children.shift());
                        }

                        nodeParentPivot.keys.splice(pos, 1);
                        console.log(nodeParentPivot.children);
                        nodeParentPivot.children.splice(pos + 1, 1);
                        nodeParentPivot.children[pos] = nodePivot;
                    }
                } else {
                    nodeParentPivot.children[pos] = nodePivot;
                }

                nodePivot = nodeParentPivot;
            }

            if (this.root.keys.length == 0 && this.root.children.length == 1) {
                this.root = this.root.children[0];
            }
        }
    }
}

class BTreeDrawing {
    tree;
    canvas;
    context;
    highlight;

    constructor(tree) {
        console.log('tree');
        console.log(tree);
        this.tree = tree;
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext("2d");
        this.highlight = null;
    }

    /*
    draw: (re)paints the tree
        mode: describes the reason for the (re)drawing
            CENTER_ROOT: centering the root at the top
            CENTER_NODE: fully centering a node, and optionally 
                         highlighting it
            SCROLL: scrolling the tree, just move it
        For each mode, arg1 and arg2 assume different values:
            CENTER_ROOT: arg1 and arg2 are not used;
            CENTER_NODE: arg1 is center node and arg2 is highlight key
            SCROLL: arg1 is the x delta and arg2 is the y delta
    Returns: -
    */
    draw(mode, arg1, arg2) {
        if (mode == undefined)
            mode = CENTER_ROOT;

        // Localize variables for easier access
        var canvas = this.canvas;
        var context = this.context;

        canvas.width = canvas.width;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "12px sans-serif";

        // Center in the root if center_node is undefined
        // The root is centered differently: on the center at the top
        var deltas;
        if (mode != SCROLL) {
            function get_delta_to_point(node, x, y) {
                var middle = (node.keys.length * WIDTH) / 2;
                return [x - node.x - middle, y - node.y - HEIGHT / 2];
            }

            this.position_tree(this.tree.root);
            if (mode == CENTER_ROOT)
                deltas = get_delta_to_point(this.tree.root,
                    canvas.width / 2,
                    OFFSET * 2 + 8);
            else if (mode == CENTER_NODE)
                deltas = get_delta_to_point(arg1,
                    canvas.width / 2,
                    canvas.height / 2);
            this.move_tree(deltas[0], deltas[1]);
            this.highlight = null;
        } else {
            this.move_tree(arg1 * 5, arg2 * 5);
            // If we are scrolling, keep the highlighting
            if (this.highlight != null) {
                mode = CENTER_NODE;
                arg1 = this.highlight[0];
                arg2 = this.highlight[1];
            }
        }
        this.draw_node(this.tree.root, context);

        if (mode == CENTER_NODE) {
            context.lineWidth = 2;
            context.strokeStyle = "#F57900"; // Orange
            context.strokeRect(arg1.x + arg2 * WIDTH,
                arg1.y, WIDTH, HEIGHT);
            this.highlight = [arg1, arg2];
        }

        // (Re)draw the canvas frame
        context.fillStyle = "#555753"; // Aluminium
        context.beginPath();
        // Top arrow
        context.clearRect(0, 0, canvas.width, OFFSET + 4);
        context.moveTo(canvas.width / 2, 0);
        context.lineTo((canvas.width / 2) - (OFFSET / 2), OFFSET);
        context.lineTo((canvas.width / 2) + (OFFSET / 2), OFFSET);

        // Left arrow
        context.clearRect(0, 0, OFFSET + 4, canvas.height);
        context.moveTo(0, canvas.height / 2);
        context.lineTo(OFFSET, canvas.height / 2 + (OFFSET / 2));
        context.lineTo(OFFSET, canvas.height / 2 - (OFFSET / 2));

        // Bottom arrow
        context.clearRect(0, canvas.height - OFFSET - 4,
            canvas.width, canvas.height);
        context.moveTo(canvas.width / 2, canvas.height);
        context.lineTo((canvas.width / 2) - (OFFSET / 2),
            canvas.height - OFFSET);
        context.lineTo((canvas.width / 2) + (OFFSET / 2),
            canvas.height - OFFSET);

        // Right arrow
        context.clearRect(canvas.width - OFFSET - 4, 0,
            canvas.width, canvas.height);
        context.moveTo(canvas.width, canvas.height / 2);
        context.lineTo(canvas.width - OFFSET,
            canvas.height / 2 + (OFFSET / 2));
        context.lineTo(canvas.width - OFFSET,
            canvas.height / 2 - (OFFSET / 2));

        context.closePath();
        context.fill();
    }

    /*
    draw_node: draw a tree rooted in the given node to a canvas context.
        node: the node that will be drawn
    Returns: -
    */
    draw_node(node) {
        // Localize variables for easier access
        var context = this.context;

        // Draw the node
        context.lineWidth = 2;
        context.strokeStyle = "#729FCF"; // Sky Blue
        context.fillStyle = "#000000";

        var key;
        var step = WIDTH;
        for (var i = 0; i < node.keys.length; i++) {
            key = node.keys[i];
            context.strokeRect(node.x + i * step, node.y, WIDTH, HEIGHT);
            context.fillText(key, (node.x + i * step) + (WIDTH / 2),
                node.y + (HEIGHT / 2));
        }

        // Draw and connect is children
        var child;
        context.strokeStyle = "#73D216"; // Chameleon
        for (var i = 0; i < node.children.length; i++) {
            context.beginPath();
            child = node.children[i];
            this.draw_node(child, context);
            context.moveTo(node.x + i * step, node.y + HEIGHT);
            context.lineTo(child.x + ((child.keys.length * WIDTH) / 2),
                child.y - 1);
            context.lineWidth = 1;
            context.stroke();
            context.closePath();
        }
    }

    /*
    position_tree: lay out a tree for drawing.
        node: the tree root to lay out
        pnode: the parent node (defaults to undefined)
        cur_x: the current x coordinate (defaults to 0)
    Returns: -
    */
    position_tree(node, pnode, cur_x) {
        if (node.children.length != 0) {
            cur_x = (cur_x == undefined) ? 0 : cur_x;
            // Adjust the y coordinate to place the node below its 
            // parent
            if (pnode != undefined)
                node.y = (pnode.y + HEIGHT) + SPACING;
            // For every child...
            var child;
            for (var i = 0; i < node.children.length; i++) {
                child = node.children[i];

                // If it is not a leaf, place the sutree accordingly                
                if (child.children.length != 0)
                    this.position_tree(child, node, cur_x);
                // If it's a leaf, lay it out based on its siblings
                else {
                    child.x = cur_x;
                    child.y = node.y + HEIGHT + SPACING;
                }
                // Increase the x coordinate based on the sutree width
                cur_x += this.get_tree_width(child) + SPACING;
            }
            // Adjust the x coordinate to be centered above the children
            if (node.children.length != 0) {
                var first = node.children[0];
                var last = node.children[node.children.length - 1];
                var width = node.keys.length * WIDTH;
                node.x = ((first.x + last.x +
                    (last.keys.length) * WIDTH) / 2) - width / 2;
            }
        }
    }

    /*
    get_tree_width: calculate the width of a tree based on its leftmost 
    and rightmost children.
        node: the tree root whose width will be calculated
    Returns: the width of the tree.
    */
    get_tree_width(node) {
        if (node.children.length > 0) {
            var lm = node.children[0];
            while (lm.children.length > 0)
                lm = lm.children[0];
            var rm = node.children[node.children.length - 1];
            while (rm.children.length > 0)
                rm = rm.children[rm.children.length - 1];
            return (rm.x - lm.x) + WIDTH * rm.keys.length;
        }
        return WIDTH * node.keys.length;
    }

    /*
    move_tree: move the nodes of a tree based on given deltas
        node: the node to move (if undefined, becomes the root)
        delta_x: delta x (horizontal)
        delta_y: delta y (vertical)
    Returns: -
    */
    move_tree(delta_x, delta_y, node) {
        if (node == undefined) {
            node = this.tree.root;
            this.offset_x += delta_x;
            this.offset_y += delta_y;
        }

        node.x += delta_x;
        node.y += delta_y;
        for (var i = 0; i < node.children.length; i++)
            this.move_tree(delta_x, delta_y, node.children[i]);
    }
}

let tree;

function instance() {
    if ($('#gradeTxt').val() >= 1) {
        tree = new TreeB(parseInt($('#gradeTxt').val()));
        $("#gradeTxt").attr("readonly", true);
        $("#gradeBtn").attr("disabled", true);

        $("#insertTxt").attr("readonly", false);
        $("#insertBtn").attr("disabled", false);
        $("#deleteTxt").attr("readonly", false);
        $("#deleteBtn").attr("disabled", false);
        $('#insertTxt').focus();
    }
}

function insertNumber() {
    if ($('#insertTxt').val() != '') {
        tree.insert($('#insertTxt').val());
        treeDraw = new BTreeDrawing(tree);
        treeDraw.draw();
        $('#insertTxt').val('');
        $('#insertTxt').focus();
    } else {
        alert('Ingrese un caracter válido.');
    }
}

function deleteNumber() {
    tree.delete($('#deleteTxt').val());
    treeDraw = new BTreeDrawing(tree);
    treeDraw.draw();
    $('#deleteTxt').val('');
    $('#deleteTxt').focus();
}

function on_canvas_clicked(e) {
    console.log('e');
    console.log(e);
    var x = 0;
    var y = 0;
    var canvas = document.getElementById("canvas");
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
        //alert('page');
        x = e.pageX;
        y = e.pageY;
    } else if (e.clientX || e.clientY) {
        //alert('client');
        x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    // Get the coordinates relatively to the canvas
    x = x - canvas.offsetLeft - 30;
    y = y - canvas.offsetTop - 195;
    console.log('canvas.offsetLeft ' + canvas.offsetLeft);
    console.log('canvas.offsetTop ' + canvas.offsetTop);

    var delta_x = 0;
    var delta_y = 0;
    var width = canvas.width;
    var height = canvas.height;

    middle_y = canvas.height / 2;
    middle_x = canvas.width / 2;

    console.log('x ' + x);
    console.log('y ' + y);
    console.log('width ' + width);
    console.log('height ' + height);
    console.log('middle_x ' + middle_x);
    console.log('middle_y ' + middle_y);

    console.log('y-195= ');
    console.log(y - 195);

    console.log(y - 195 < OFFSET * 2);

    // Scroll left
    if (x < OFFSET * 2 &&
        middle_y - OFFSET <= y && y <= middle_y + OFFSET)
        delta_x = OFFSET;
    // Scroll right
    else if (x > width - OFFSET * 2 &&
        middle_y - OFFSET <= y && y <= middle_y + OFFSET)
        delta_x = -OFFSET;
    // Scroll down
    else if (y < OFFSET * 2 &&
        middle_x - OFFSET <= x && x <= middle_x + OFFSET)
        delta_y = OFFSET;
    // Scroll up
    else if (y > height - OFFSET * 2 &&
        middle_x - OFFSET <= x && x <= middle_x + OFFSET)
        delta_y = -OFFSET;
    treeDraw.draw(SCROLL, delta_x, delta_y);
}