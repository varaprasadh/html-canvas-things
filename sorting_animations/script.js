window.onload = () => {
    const canvas = document.querySelector('.canvas');

    const algoSelect = document.querySelector('#algo');
    const startBtn = document.querySelector('.btn.start');
    const randomizeBtn = document.querySelector('.btn.randomize');


    const algorithms = {
        bubble: BubbleSortingAlgorithm,
        selection: SelectionSortingAlgorithm,
        merge: MergeSortingAlgorithm,
        insertion: InsertionSortingAlgorithm,
        quick: QuickSortingAlgorithm
    }


    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const algo = new SortingAlgorithm(canvas);



    algoSelect.onchange = () => {
        const currentAlgorithm = algorithms[algoSelect.value];
        algo.setAlgorithm(currentAlgorithm);
    }

    startBtn.onclick = () => {
        if (!algo.currentAlgorithm) return;
        console.log(algo.currentAlgorithm);
        algo.runAlgorithm();
    }

    randomizeBtn.onclick = () => {
        algo.randomizeNumbers();
        algo.drawCurrentState(algo.numbers);
    }

}

class SortingAlgorithm {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.currentAlgorithm = null;
        this.currentFrame = 0;
        this.states = [];
        this.numbers = [];
        this.increasedNumbers();
        this.timer = null;
        this.running = false;
    }

    init() {
        
    }

    randomizeNumbers() {
        this.numbers = [];
        for (let i = 1; i <= 50; i++) {
            this.numbers.push(Math.random() * 500);
        }
    }
    increasedNumbers() {
        this.numbers = [];
        for (let i = 1; i <= 50; i++) {
            this.numbers.unshift(i*10);
        }
    }

    setAlgorithm(Algorithm) {
        this.currentAlgorithm = Algorithm;
        // clear the view and stop the existing animations
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.running = false;
        this.currentFrame = 0;
        this.states = [];
        this.numbers = [];
        this.increasedNumbers();
        this.drawCurrentState(this.numbers);
    }

    runAlgorithm() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        // this.numbers = normalize(this.numbers);
        this.algo = new this.currentAlgorithm(this.numbers);
        console.log("started processing");
        this.states = this.algo.sort();
        this.currentFrame = 0;
        console.log("done processing", this.states);
        this.running = true;
        this.animate();
    }


    draw() {
        // console.log("drawing", this.currentFrame);
        if (this.currentFrame < this.states.length) {
            // console.log("drawing inside", this.currentFrame);
            this.ctx.clearRect(0, 0, this.w, this.h);
            const state = this.states[this.currentFrame];
            for(let i = 0; i < state.length; i++) {
                try {
                    const barHeight = state[i];
                    // console.log( "bar hieight", barHeight, state[i], state[state.length - 1], this.h);
                    this.ctx.fillStyle = valueToColor(state[i]);
                    this.ctx.fillRect(i*10 + i * 5, this.h - barHeight, 10, barHeight);
                } catch(e) {
                    console.log(e);
                }
            }
        }
    };

    drawCurrentState(numbers) {
        this.ctx.clearRect(0, 0, this.w, this.h);
        for(let i = 0; i < numbers.length; i++) {
            try {
                const barHeight = numbers[i];
                // console.log( "bar hieight", barHeight, state[i], state[state.length - 1], this.h);
                this.ctx.fillStyle = valueToColor(numbers[i]);
                this.ctx.fillRect(i*10 + i * 5, this.h - barHeight, 10, barHeight);
            } catch(e) {
                console.log(e);
            }
        }
    }

    animate() {
       this.draw();
       if(this.currentFrame < this.states.length ) {
           this.currentFrame+=1;
           this.timer = setTimeout(() => {
               this.draw();
               this.animate();
           }, 100);
       }
    }

}



function normalize(numbers) {
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    return numbers.map(num => (num - min) / (max - min));
}

// Helper function to convert normalized value to a color
function valueToColor(value) {
    // Assuming we want a gradient from blue to red
    const startColor = { r: 0, g: 0, b: 255 }; // Blue
    const endColor = { r: 255, g: 0, b: 0 }; // Red
    
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * value);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * value);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * value);
    
    return `rgb(${r}, ${g}, ${b})`;
}
