class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    return this.sortedArrayToBST(sortedArray);
  }

  sortedArrayToBST(array) {
    if (array.length === 0) return null;

    const mid = Math.floor(array.length / 2);
    const root = new Node(array[mid]);

    root.left = this.sortedArrayToBST(array.slice(0, mid));
    root.right = this.sortedArrayToBST(array.slice(mid + 1));

    return root;
  }

  insert(value, node = this.root) {
    if (node === null) {
      return new Node(value);
    }

    if (value < node.data) {
      node.left = this.insert(value, node.left);
    } else if (value > node.data) {
      node.right = this.insert(value, node.right);
    }

    return node;
  }

  deleteItem(value, node = this.root) {
    if (node === null) return node;

    if (value < node.data) {
      node.left = this.deleteItem(value, node.left);
    } else if (value > node.data) {
      node.right = this.deleteItem(value, node.right);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      node.data = this.minValue(node.right);
      node.right = this.deleteItem(node.data, node.right);
    }

    return node;
  }

  minValue(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current.data;
  }

  find(value, node = this.root) {
    if (node === null || node.data === value) return node;

    if (value < node.data) {
      return this.find(value, node.left);
    } else {
      return this.find(value, node.right);
    }
  }

  levelOrder(callback) {
    if (this.root === null) return [];

    const queue = [this.root];
    const result = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (callback) callback(node);
      else result.push(node.data);

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    if (!callback) return result;
  }

  inOrder(node = this.root, callback, result = []) {
    if (node === null) return;

    this.inOrder(node.left, callback, result);
    if (callback) callback(node);
    else result.push(node.data);
    this.inOrder(node.right, callback, result);

    if (!callback) return result;
  }

  preOrder(node = this.root, callback, result = []) {
    if (node === null) return;

    if (callback) callback(node);
    else result.push(node.data);
    this.preOrder(node.left, callback, result);
    this.preOrder(node.right, callback, result);

    if (!callback) return result;
  }

  postOrder(node = this.root, callback, result = []) {
    if (node === null) return;

    this.postOrder(node.left, callback, result);
    this.postOrder(node.right, callback, result);
    if (callback) callback(node);
    else result.push(node.data);

    if (!callback) return result;
  }

  height(node = this.root) {
    if (node === null) return -1;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node, current = this.root, depth = 0) {
    if (current === null) return -1;

    if (current.data === node.data) return depth;

    if (node.data < current.data) {
      return this.depth(node, current.left, depth + 1);
    } else {
      return this.depth(node, current.right, depth + 1);
    }
  }

  isBalanced(node = this.root) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    const heightDiff = Math.abs(leftHeight - rightHeight);

    return (
      heightDiff <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }

  rebalance() {
    const values = this.inOrder();
    this.root = this.buildTree(values);
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) return;

    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

function getRandomArray(size, maxValue = 100) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * maxValue)
  );
}

const randomArray = getRandomArray(15);
const tree = new Tree(randomArray);

console.log("Initial tree (balanced):");
tree.prettyPrint();

console.log("Is tree balanced?", tree.isBalanced());

console.log("Level order:", tree.levelOrder());
console.log("Pre order:", tree.preOrder());
console.log("Post order:", tree.postOrder());
console.log("In order:", tree.inOrder());

tree.insert(101);
tree.insert(102);
tree.insert(103);

console.log("\nTree after inserting values > 100 (unbalanced):");
tree.prettyPrint();

console.log("Is tree balanced?", tree.isBalanced());

tree.rebalance();

console.log("\nTree after rebalancing:");
tree.prettyPrint();

console.log("Is tree balanced?", tree.isBalanced());

console.log("Level order:", tree.levelOrder());
console.log("Pre order:", tree.preOrder());
console.log("Post order:", tree.postOrder());
console.log("In order:", tree.inOrder());
