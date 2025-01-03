const canvas = document.getElementById("canvas");
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
    y: canvas.height - 50,
    width: 100,
    height: 50,
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
background.onload = function() {
update();
}