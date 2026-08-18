const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let lives = 3;
let gameRunning = true;

const player = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 120,
    width: 70,
    height: 80,
    speed: 8
};

const objects = [];
const emojis = ["⭐", "🌸", "🍓", "💎", "🍎"];

let leftPressed = false;
let rightPressed = false;

// Keyboard controls
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    }

    if (event.key === "ArrowRight") {
        rightPressed = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    }

    if (event.key === "ArrowRight") {
        rightPressed = false;
    }
});

// Mobile touch controls
canvas.addEventListener("touchmove", function(event) {

    event.preventDefault();

    const touch = event.touches[0];

    player.x = touch.clientX - player.width / 2;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

}, { passive: false });

function createObject() {

    objects.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        size: 40,
        speed: 3 + Math.random() * 3,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
    });
}

function drawPlayer() {

    ctx.font = "55px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "🌸",
        player.x + player.width / 2,
        player.y + 55
    );
}

function drawObjects() {

    objects.forEach(function(object) {

        ctx.font = object.size + "px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            object.emoji,
            object.x,
            object.y
        );

    });
}

function updatePlayer() {

    if (leftPressed) {
        player.x -= player.speed;
    }

    if (rightPressed) {
        player.x += player.speed;
    }

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function updateObjects() {

    for (let i = objects.length - 1; i >= 0; i--) {

        const object = objects[i];

        object.y += object.speed;

        // Collision
        if (
            object.x > player.x &&
            object.x < player.x + player.width &&
            object.y > player.y &&
            object.y < player.y + player.height
        ) {

            score++;

            objects.splice(i, 1);

            continue;
        }

        // Object missed
        if (object.y > canvas.height + 50) {

            lives--;

            objects.splice(i, 1);

            if (lives <= 0) {
                gameRunning = false;
            }
        }
    }
}

function drawUI() {

    ctx.fillStyle = "#222";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "⭐ Score: " + score,
        15,
        35
    );

    ctx.textAlign = "right";

    ctx.fillText(
        "❤️ Lives: " + lives,
        canvas.width - 15,
        35
    );
}

function drawGameOver() {

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#222";
    ctx.textAlign = "center";

    ctx.font = "bold 42px Arial";

    ctx.fillText(
        "Game Over!",
        canvas.width / 2,
        canvas.height / 2 - 40
    );

    ctx.font = "24px Arial";

    ctx.fillText(
        "Score: " + score,
        canvas.width / 2,
        canvas.height / 2 + 10
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Refresh the page to play again",
        canvas.width / 2,
        canvas.height / 2 + 55
    );
}

function gameLoop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (gameRunning) {

        updatePlayer();
        updateObjects();

        drawPlayer();
        drawObjects();
        drawUI();

        requestAnimationFrame(gameLoop);

    } else {

        drawGameOver();
    }
}

// Create falling objects
setInterval(function() {

    if (gameRunning) {
        createObject();
    }

}, 700);

// Start game
gameLoop();

// Resize screen
window.addEventListener("resize", function() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player.y = canvas.height - 120;

});
