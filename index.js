let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let scoreText = document.getElementById("score");
let sizeText = document.getElementById("size");

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

let camX = 0;
let camY = 0;

let fruits = [];

let players = [
    {
        x: 1500,
        y: 1500,
        size: 20,
        color: "deepskyblue"
    }
];

let score = 0;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} //2 eded arasinda tesadyfu eded qaytaran funksiya

function color() {
    return "#" + Math.floor(Math.random() * 16777215)
        .toString(16).padStart(6, "0");
}// buda random reng yaradir meyveler ucun

function makeFruit() {
    fruits.push({
        x: random(100, 2900),
        y: random(100, 2900),
        size: 9,
        color: color()
    });
}

for (let i = 0; i < 100; i++) {
    makeFruit();
}
canvas.onmousemove = function(e) {
    let rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left; // cixiriqki mousun canvasin icindeki kordinatlari tapaq
    mouse.y = e.clientY - rect.top;
};//getbounndingcllientrect() funksiyasi canvasin ekrndanki yernin ve olcusunu verir 

function move() {

    let targetX = mouse.x + camX;
    let targetY = mouse.y + camY;// kamera hereket edir ona gore mousenin koordinatlarini xeetirenin kordinatina cevirmelliyik

    for (let i = 0; i < players.length; i++) {

        let p = players[i];

        let dx = targetX - p.x;
        let dy = targetY - p.y;

        let distance = Math.sqrt(dx * dx + dy * dy);
// pifaqordu bunu AI lla yazmisam 
        if (distance > 2) {
            p.x += (dx / distance) * 4;
            p.y += (dy / distance) * 4;
        }
    }
}

function eat() {

    for (let i = fruits.length - 1; i >= 0; i--) {

        let f = fruits[i];

        for (let j = 0; j < players.length; j++) {

            let p = players[j];

            let dx = p.x - f.x;
            let dy = p.y - f.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < p.size + f.size) {

                p.size += 2;
                score++;

                fruits.splice(i, 1);

                makeFruit();

                break;
            }
        }
    }
}

function camera() {
    camX = players[0].x - canvas.width / 2;
    camY = players[0].y - canvas.height / 2;
}

function drawPlayers() {

    for (let i = 0; i < players.length; i++) {

        let p = players[i];

        ctx.beginPath();

        ctx.arc(
            p.x - camX,
            p.y - camY,
            p.size,
            0,
            2 * Math.PI
        );

        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}

function drawFruits() {

    for (let i = 0; i < fruits.length; i++) {

        let f = fruits[i];

        ctx.beginPath();

        ctx.arc(
            f.x - camX,
            f.y - camY,
            f.size,
            0,
            2 * Math.PI
        );

        ctx.fillStyle = f.color;
        ctx.fill();
    }
}
// drawlari AI dan komek almisam 
function background() {

    ctx.fillStyle = "#e8f5e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#d0e5d3";

    for (let x = -camX % 50; x < canvas.width; x += 50) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = -camY % 50; y < canvas.height; y += 50) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function split() {

    let biggest = 0;

    for (let i = 1; i < players.length; i++) {

        if (players[i].size > players[biggest].size) {
            biggest = i;
        }
    }

    let p = players[biggest];

    if (p.size > 150) {

        let newSize = p.size / Math.sqrt(2);

        p.size = newSize;

        players.push({
            x: p.x + 50,
            y: p.y,
            size: newSize,
            color: p.color
        });
    }
}

document.onkeydown = function(e) {

    if (e.code == "Space" && !e.repeat) {

        e.preventDefault();

        split();
    }
};

function info() {

    let biggest = 0;

    for (let i = 0; i < players.length; i++) {

        if (players[i].size > biggest) {
            biggest = players[i].size;
        }
    }

    scoreText.innerText = "Score: " + score;
    sizeText.innerText = "Size: " + Math.floor(biggest);
}

function main() {

    move();

    camera();

    eat();

    background();

    drawFruits();

    drawPlayers();

    info();
}
//oyunu baslatmaq ucun
setInterval(main, 30);
