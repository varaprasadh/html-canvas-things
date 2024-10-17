window.onload = () => {
    const animationLoop = new AnimationController();
    animationLoop.init();
    animationLoop.start();
}

class AnimationController {
    constructor() {
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.grid = new Grid(800, 600, 20);
        this.startBtn = document.querySelector(".start-btn");
        this.instruction = document.querySelector(".instruction");
        this.origin = null;
        this.destination = null;
        this.obstacles = [];
        this.obstaclesMode = false;
        this.strategy = "BFS";
    }

    init() {
        this.instruction.innerText = "Click the cells on grid to choose origin and destination";
        this.startBtn.addEventListener("click", this.handleStart.bind(this));
        this.canvas.addEventListener("click", this.handleCanvasClick.bind(this));
        document.querySelector("#strategy-bfs").addEventListener("change", (e) => {
            if (e.target.checked) {
                this.strategy = "BFS";
                this.instruction.innerText = "click start button";
            }
        });
        document.querySelector("#strategy-dfs").addEventListener("change", (e) => {
            if (e.target.checked) {
                this.strategy = "DFS";
                this.instruction.innerText = "click start button";
            }
        });
        // document.querySelector("#strategy-astar").addEventListener("change", (e) => {
        //     if (e.target.checked) {
        //         this.strategy = "A_STAR";
        //         this.instruction.innerText = "click start button";
        //     }
        // });

        document.querySelector("#obstacles").addEventListener("change", (e) => {
            this.obstaclesMode = e.target.checked;
        });

    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.grid.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.grid.cellSize);

        if (this.obstaclesMode) {
            this.obstacles.push({ x, y });
            console.log(this.obstacles);
            this.instruction.innerText = "Click the cells on grid to choose destination";
            this.draw();
            return;
        }
        if (this.origin === null) {
            this.origin = { x, y };
            this.instruction.innerText = "Click the cells on grid to choose destination";
        } else if (this.destination === null) {
            this.destination = { x, y };
            this.instruction.innerText = "choose strategy";
        }else {
            this.origin = null;
            this.destination = null;
            this.instruction.innerText = "Click the cells on grid to choose destination";
        }

        if (this.origin?.x === this.destination?.x && this.origin?.y === this.destination?.y) {
            this.origin = null;
            this.destination = null;
            this.instruction.innerText = "Click the cells on grid to choose destination";
        }
        this.draw();

    }

    handleStart() {
        if (this.origin == null) {
            this.instruction.innerText = "Click the cells on grid to choose origin";
            return;
        } 
        if (this.destination == null) {
            this.instruction.innerText = "Click the cells on grid to choose destination";
            return;
        }
        const steps = this.strategy === "BFS" ? bfs(this.grid, this.origin, this.destination, this.obstacles) :  this.strategy === "DFS" ? dfs(this.grid, this.origin, this.destination, this.obstacles): aStar(this.grid, this.origin, this.destination, this.obstacles);
        console.log(steps);

        for (let i = 0; i < steps.length; i++) {
            setTimeout(() => {
                const step = steps[i];
                this.origin = step;
                if (this.origin) {
                    // draw circle
                    this.ctx.fillStyle = "white";
                    this.ctx.beginPath();
                    const radius = this.grid.cellSize / 3;
                    this.ctx.arc(this.origin.x * this.grid.cellSize + this.grid.cellSize / 2, this.origin.y * this.grid.cellSize + this.grid.cellSize / 2, radius, 0, 2 * Math.PI);
                    this.ctx.fill();
                    // this.ctx.fillStyle = "";
                    // this.ctx.fillRect(this.origin.x * this.grid.cellSize, this.origin.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
                }
            }, i * 100);
        }

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid.draw(this.ctx);

        if (this.origin) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.origin.x * this.grid.cellSize, this.origin.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
        }

        if (this.destination) {
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(this.destination.x * this.grid.cellSize, this.destination.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
        }

        for (let obstacle of this.obstacles) {
            this.ctx.fillStyle = "orange";
            this.ctx.fillRect(obstacle.x * this.grid.cellSize, obstacle.y * this.grid.cellSize, this.grid.cellSize, this.grid.cellSize);
        }
        
    }

    start() {
        this.draw();
        // this.interval = setInterval(() => {
        //     this.draw();
        // }, 1000 / 60);
    }
}

class Grid {

    constructor(width, height, cellSize = 10) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.rows = height / cellSize;
        this.cols = width / cellSize;
    }

    getNeighbors({ x, y }) {
        const neighbors = [];
        if (x > 0) neighbors.push({ x: x - 1, y });
        if (x < this.cols - 1) neighbors.push({ x: x + 1, y });
        if (y > 0) neighbors.push({ x, y: y - 1 });
        if (y < this.rows - 1) neighbors.push({ x, y: y + 1 });
        return neighbors;
    }

    draw(ctx) {
        for (let row = 0; row < this.rows; row++) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(0, row * this.cellSize);
            ctx.lineTo(this.width, row * this.cellSize);
            ctx.stroke();
        }

        for (let col = 0; col < this.cols; col++) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(col * this.cellSize, 0);
            ctx.lineTo(col * this.cellSize, this.height);
            ctx.stroke();
        }

    }

}


const bfs = (grid, origin, destination, obstacles = []) => {
    const queue = [origin];
    const visited = new Set();
    visited.add(origin);
    const steps = [];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.x === destination.x && current.y === destination.y) {
            return steps;
        }
        const neighbors = grid.getNeighbors(current);
        steps.push(current);
        for (let neighbor of neighbors) {
            if (!visited.entries().find(entry => entry[0].x === neighbor.x && entry[0].y === neighbor.y) && !obstacles.find(obstacle => obstacle.x === neighbor.x && obstacle.y === neighbor.y)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return steps;
}

const dfs = (grid, origin, destination, obstacles = []) => {
    const stack = [origin];
    const visited = new Set();
    visited.add(origin);
    const steps = [];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current.x === destination.x && current.y === destination.y) {
            console.log("dfs end", steps, stack.length);
            return steps;
        }
        steps.push(current);
        const neighbors = grid.getNeighbors(current);
        for (let neighbor of neighbors) {
            if (!visited.entries().find(entry => entry[0].x === neighbor.x && entry[0].y === neighbor.y) && !obstacles.find(obstacle => obstacle.x === neighbor.x && obstacle.y === neighbor.y)) {
                visited.add(neighbor);
                stack.push(neighbor);
            }
        }
    }
    return steps;
}

const aStar = (grid, origin, destination, obstacles = []) => {
    const openSet = [origin];
    const visited = new Set();
    const steps = [];

    // Use a Map with stringified keys to track gScore, fScore, and cameFrom
    const gScore = new Map();
    const fScore = new Map();
    const cameFrom = new Map();

    // Set the initial scores for the origin
    gScore.set(`${origin.x},${origin.y}`, 0);
    fScore.set(`${origin.x},${origin.y}`, heuristic(origin, destination));

    while (openSet.length > 0) {
        // Sort the openSet based on the lowest fScore
        openSet.sort((a, b) => (fScore.get(`${a.x},${a.y}`) || Infinity) - (fScore.get(`${b.x},${b.y}`) || Infinity));
        const current = openSet.shift();

        // If the destination is reached
        if (current.x === destination.x && current.y === destination.y) {
            console.log("a* end", steps);
            return reconstructPath(cameFrom, current);
        }

        steps.push(current);
        visited.add(`${current.x},${current.y}`);

        const neighbors = grid.getNeighbors(current);
        for (let neighbor of neighbors) {
            const neighborKey = `${neighbor.x},${neighbor.y}`;
            if (visited.entries().find(entry => entry.x === neighbor.x && entry.y === neighbor.y) || obstacles.find(obstacle => obstacle.x === neighbor.x && obstacle.y === neighbor.y)) {
                continue;
            }

            // Calculate tentative G score
            const tentativeGScore = (gScore.get(`${current.x},${current.y}`) || Infinity) + 1;

            if (!openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                openSet.push(neighbor); // Add neighbor to openSet if not present
            }

            if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
                continue; // This path is not better
            }

            // Update path tracking and scores
            cameFrom.set(neighborKey, current);
            gScore.set(neighborKey, tentativeGScore);
            fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, destination));
        }
    }

    return steps; // No path found
};

// Heuristic function (Manhattan distance)
const heuristic = (node, destination) => Math.abs(node.x - destination.x) + Math.abs(node.y - destination.y);

// Reconstruct path using stringified keys
const reconstructPath = (cameFrom, current) => {
    const path = [current];
    let key = `${current.x},${current.y}`;
    while (cameFrom.has(key)) {
        current = cameFrom.get(key);
        path.unshift(current);
        key = `${current.x},${current.y}`;
    }
    return path;
};
