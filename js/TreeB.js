class Node {
    keys;
    children;
    parent;

    constructor() {
        this.keys = [];
        this.children = [];
        this.parent = null;
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

    toHTML(head) {
        let html = "";

        if (head === null) {
            return '<li><span class="badge rounded-pill bg-secondary">*</span></li>';
        } else {
            let keys = head.keys;
            /*
                        html = '<li>' +
                            '<div class="badge rounded-pill bg-primary" >. ' +
                            keys.join(' . ') +
                            ' .</div>';
            */

            if (head.children.length > 0) {
                html = '<li>' +
                    '<div class="badge rounded-pill bg-primary" >. ' +
                    keys.join(' . ') +
                    ' .</div>';

                html += '<ul>';

                for (let i = 0; i < head.children.length; i++) {
                    html += this.toHTML(head.children[i]);
                }

                html += '</ul>';
            } else {

                html = '<li>' +
                    '<div class="badge rounded-pill bg-primary" >' +
                    keys.join('&nbsp;&nbsp;') +
                    '</div>';
            }

            html += '</li>';
        }

        return html;
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
        $('#treeUl').html(tree.toHTML(tree.root));
        $('#insertTxt').val('');
        $('#insertTxt').focus();
    } else {
        alert('Ingrese un número válido.');
    }
}

function deleteNumber() {
    tree.delete($('#deleteTxt').val());
    $('#treeUl').html(tree.toHTML(tree.root));
    $('#deleteTxt').val('');
    $('#deleteTxt').focus();
}