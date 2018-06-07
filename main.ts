const canvas: HTMLCanvasElement = document.querySelector("canvas") as HTMLCanvasElement;
// Take up most of the screen but leave room for the controls
const canvasSize: number = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.9);
canvas.width = canvasSize;
canvas.height = canvasSize;

const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

const pointRadius: number = 3;

class Dial {
    public readonly x: number;
    public readonly y: number;
    public readonly radius: number;
    public angleIncrement: number;
    public angle: number = 0;
    public tangentX: number = 0;
    public tangentY: number = 0;

    public constructor(x: number, y: number, radius: number, angleIncrement: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angleIncrement = angleIncrement;
    }

    public draw(): void {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.arc(this.x, this.y, pointRadius, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.moveTo(this.x, this.y);
        const dx: number = Math.cos(convertDegreesToRadians(this.angle)) * this.radius;
        const dy: number = Math.sin(convertDegreesToRadians(this.angle)) * this.radius;
        this.tangentX = this.x + dx;
        this.tangentY = this.y + dy;
        context.lineTo(this.tangentX, this.tangentY);
        context.stroke();

        context.beginPath();
        context.arc(this.tangentX, this.tangentY, pointRadius, 0, Math.PI * 2);
        context.fill();
    }

    public update(): void {
        this.angle += this.angleIncrement;
        if (this.angle >= 360) {
            this.angle -= 360;
        }
    }
}

function convertDegreesToRadians(degrees: number): number {
    return (degrees / 180) * Math.PI;
}

interface Point {
    x: number;
    y: number;
}

// Dial in the second quadrant
const dial1: Dial = new Dial(
    Math.floor(canvasSize / 4),
    Math.floor(canvasSize / 4),
    Math.floor(canvasSize * (3 / 16)),
    4,
);

// Dial in the fourth quandrant
const dial2: Dial = new Dial(
    Math.floor(canvasSize * (3 / 4)),
    Math.floor(canvasSize * (3 / 4)),
    Math.floor(canvasSize * (3 / 16)),
    3,
);

let points: Point[] = [];
let frameHandle: number;
function animate(): void {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "rgba(0, 0, 0, 1.0)";
    dial1.draw();
    dial1.update();
    dial2.draw();
    dial2.update();

    context.strokeStyle = "rgba(0, 0, 0, 0.25)";
    context.beginPath();
    context.moveTo(dial1.tangentX, dial1.tangentY);
    context.lineTo(dial2.tangentX, dial1.tangentY);
    context.stroke();
    context.beginPath();
    context.moveTo(dial2.tangentX, dial2.tangentY);
    context.lineTo(dial2.tangentX, dial1.tangentY);
    context.stroke();

    context.beginPath();
    context.arc(dial2.tangentX, dial1.tangentY, pointRadius, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(0, 0, 0, 1.0)";
    const newPoint: Point = { x: dial2.tangentX, y: dial1.tangentY };
    points.push(newPoint);
    for (let i: number = 0; i < points.length - 1; i++) {
        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        context.lineTo(points[i + 1].x, points[i + 1].y);
        context.stroke();
    }

    if (points.length > 1 && newPoint.x === points[0].x && newPoint.y === points[0].y) {
        return;
    }

    frameHandle = requestAnimationFrame(animate);
}

animate();

function resetDials(): void {
    cancelAnimationFrame(frameHandle);
    dial1.angle = 0;
    dial2.angle = 0;
    points = [];
    animate();
}

const speedLabel1: HTMLSpanElement = document.getElementById("speed-label1") as HTMLSpanElement;
const speedLabel2: HTMLSpanElement = document.getElementById("speed-label2") as HTMLSpanElement;
speedLabel1.textContent = dial1.angleIncrement.toString();
speedLabel2.textContent = dial2.angleIncrement.toString();

const plusButton1: HTMLButtonElement = document.getElementById("plus-button1") as HTMLButtonElement;
const minusButton1: HTMLButtonElement = document.getElementById("minus-button1") as
    HTMLButtonElement;
const plusButton2: HTMLButtonElement = document.getElementById("plus-button2") as HTMLButtonElement;
const minusButton2: HTMLButtonElement = document.getElementById("minus-button2") as
    HTMLButtonElement;

plusButton1.addEventListener("click", () => {
    dial1.angleIncrement++;
    speedLabel1.textContent = dial1.angleIncrement.toString();
    resetDials();
});

minusButton1.addEventListener("click", () => {
    dial1.angleIncrement--;
    speedLabel1.textContent = dial1.angleIncrement.toString();
    resetDials();
});

plusButton2.addEventListener("click", () => {
    dial2.angleIncrement++;
    speedLabel2.textContent = dial2.angleIncrement.toString();
    resetDials();
});

minusButton2.addEventListener("click", () => {
    dial2.angleIncrement--;
    speedLabel2.textContent = dial2.angleIncrement.toString();
    resetDials();
});

const resetButton: HTMLButtonElement = document.getElementById("reset-button") as HTMLButtonElement;
resetButton.addEventListener("click", () => {
    resetDials();
});
