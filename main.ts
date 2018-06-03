const canvas: HTMLCanvasElement =
    document.getElementById("canvas") as HTMLCanvasElement;
const squareCanvasSize: number = Math.min(canvas.width, canvas.height);

const context: CanvasRenderingContext2D =
    canvas.getContext("2d") as CanvasRenderingContext2D;

class Dial {
    public readonly x: number;
    public readonly y: number;
    public readonly radius: number;
    public angleIncrement: number;
    public angle: number = 0;
    public tangentX: number = 0;
    public tangentY: number = 0;

    public constructor(x: number, y: number, radius: number,
                       angleIncrement: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angleIncrement = angleIncrement;
    }

    public draw(): void {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(this.x, this.y);
        const dx: number =
            Math.cos(convertDegreesToRadians(this.angle)) * this.radius;
        this.tangentX = this.x + dx;
        const dy: number =
            Math.sin(convertDegreesToRadians(this.angle)) * this.radius;
        this.tangentY = this.y + dy;
        context.lineTo(this.tangentX, this.tangentY);
        context.stroke();
        context.closePath();
    }

    public updateAngle(): void {
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
    radius: number;
}

const dial1: Dial = new Dial(Math.floor(squareCanvasSize / 4),
                             Math.floor(squareCanvasSize / 4),
                             Math.floor(squareCanvasSize * (3 / 16)),
                             4);
const dial2: Dial = new Dial(Math.floor(squareCanvasSize * (3 / 4)),
                             Math.floor(squareCanvasSize * (3 / 4)),
                             Math.floor(squareCanvasSize * (3 / 16)),
                             3);
let points: Point[] = [];

function step(): void {
    context.clearRect(0, 0, canvas.width, canvas.height);

    dial1.draw();
    dial1.updateAngle();
    dial2.draw();
    dial2.updateAngle();

    context.beginPath();
    context.moveTo(dial1.tangentX, dial1.tangentY);
    context.setLineDash([5]);
    context.lineTo(dial2.tangentX, dial1.tangentY);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(dial2.tangentX, dial2.tangentY);
    context.setLineDash([5]);
    context.lineTo(dial2.tangentX, dial1.tangentY);
    context.stroke();
    context.closePath();

    context.setLineDash([]);
    points.push({
        x: dial2.tangentX,
        y: dial1.tangentY,
        radius: 1,
    });
    for (let i: number = 0; i < points.length - 1; i++) {
        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        context.lineTo(points[i + 1].x, points[i + 1].y);
        context.stroke();
        context.closePath();
    }

    requestAnimationFrame(step);
}

step();

const increaseButton1: HTMLButtonElement =
    document.getElementById("increase-button1") as HTMLButtonElement;
const decreaseButton1: HTMLButtonElement =
    document.getElementById("decrease-button1") as HTMLButtonElement;
const speedLabel1: HTMLSpanElement =
    document.getElementById("speed-label1") as HTMLSpanElement;

const increaseButton2: HTMLButtonElement =
    document.getElementById("increase-button2") as HTMLButtonElement;
const decreaseButton2: HTMLButtonElement =
    document.getElementById("decrease-button2") as HTMLButtonElement;
const speedLabel2: HTMLSpanElement =
    document.getElementById("speed-label2") as HTMLSpanElement;

speedLabel1.textContent = `Left Speed: ${dial1.angleIncrement}`;
speedLabel2.textContent = `Right Speed: ${dial2.angleIncrement}`;

function resetDials(): void {
    dial1.angle = 0;
    dial2.angle = 0;
    points = [];
}

increaseButton1.addEventListener("click", () => {
    dial1.angleIncrement++;
    speedLabel1.textContent = `Left Speed: ${dial1.angleIncrement}`;
    resetDials();
});

decreaseButton1.addEventListener("click", () => {
    dial1.angleIncrement--;
    speedLabel1.textContent = `Left Speed: ${dial1.angleIncrement}`;
    resetDials();
});

increaseButton2.addEventListener("click", () => {
    dial2.angleIncrement++;
    speedLabel2.textContent = `Right Speed: ${dial2.angleIncrement}`;
    resetDials();
});

decreaseButton2.addEventListener("click", () => {
    dial2.angleIncrement--;
    speedLabel2.textContent = `Right Speed: ${dial2.angleIncrement}`;
    resetDials();
});
