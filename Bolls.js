const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
const {width, height} = canvas.getBoundingClientRect();

canvas.width = 800; // Set the width of the canvas
canvas.height = 500;

const background = new Image();
background.src = 'Bulme/SYP_Spiel/Hintergrund.jpg'; // Replace with the path to your background image

background.onload = function() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
};

const ballImage = new Image();
ballImage.src = 'Bulme/SYP_Spiel/Ball.jpg'; // Replace with the path to your ball image

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 25,
    dx: 2,
    dy: 2
};

ballImage.onload = function() {
    drawBall();
};

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 10,
    dx: 0
};

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlayer();
    drawBall();

    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height / 2;
    }

    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    requestAnimationFrame(update);
}

function movePlayer(e) {
    if (e.key === 'ArrowLeft') {
        player.dx = -5;
    } else if (e.key === 'ArrowRight') {
        player.dx = 5;
    }
}

function stopPlayer(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);
background.onload = function () {
    update();
};
