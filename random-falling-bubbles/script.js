
const onWindowLoad = () => {

    const canvas = document.querySelector('.canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    const fullScreenBtn = document.querySelector('.fs');
    fullScreenBtn.addEventListener('click', () => {
        canvas.requestFullscreen();
    })
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    })

    class Ball {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2, false);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius / 4, 0, Math.PI * 2, false);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius / 8, 0, Math.PI * 2, false);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();

        }

        update() {
            this.y += 4;
            if (this.y - this.radius > canvas.height) {
                this.y = 0;
            }
        }
    }

    let balls = [];

    function init() {
        balls = [];
        for (let i = 0; i < 25; i++) {
            let radius = 30;
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let y = Math.random() * (canvas.height - radius * 2) + radius;
            let color = ["red", "blue", "green", "yellow"][Math.floor(Math.random() * 4)];
            let ball = new Ball(x, y, radius, color);
            balls.push(ball);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < balls.length; i++) {
            balls[i].draw();
            balls[i].update();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
    
}

window.onload = onWindowLoad;
