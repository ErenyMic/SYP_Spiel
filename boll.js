const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = 'Hintergrund.jpg'; // Replace with the path to your background image

const ballImage = new Image();
ballImage.src = 'Ball-removebg-preview.png'; // Replace with the path to your ball image

const playerImage = new Image();
playerImage.src = 'korb-neu.png'; // Replace with the path to your player image

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50, // Adjusted to match the image dimensions
    dx: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    dy: 2
};



function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
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
    const canvasRect = canvas.getBoundingClientRect();
    player.x = e.clientX - canvasRect.left - player.width / 2;

    // Ensure the player stays within the canvas boundaries
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

document.addEventListener('mousemove', movePlayer);

background.onload = function() {
    update();
}

function stopPlayer(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.dx = 0;
    }
}
background.onload = function() {
update();
}