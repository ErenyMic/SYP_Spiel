const canvas = document.getElementById('canvas'); // Updated to match the HTML file
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = 'Hintergrund.jpg'; // Replace with the path to your background image

const ballImage = new Image();
ballImage.src = 'Ball-removebg-preview.png'; // Replace with the path to your ball image

const playerImage = new Image();
playerImage.src = 'korb-neu.png'; // Replace with the path to your player image

const gameOverImage = new Image();
gameOverImage.src = 'Win.jpg'; // Replace with the path to your game over image

var game = {
    lives: 5, // Start with 5 lives
    score: 0,
    level: 1,
}

var gameRunning = true; // Flag to control the game loop

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 100,
    height: 50, // Adjusted to match the image dimensions
    dx: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    dy: 2
};

function gameLogic() {
    if (!gameRunning) return; // Stop game logic if the game is over

    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height) {
        ball.y = Math.random() * (canvas.height * 1 / 3) + canvas.height / 3; // Random y position but at least 1/3 of the canvas height
        ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius; // Set a random horizontal position
        document.getElementById('lives').innerHTML = `Lives: ${--game.lives}`; // Decrease lives

        if (game.lives <= 0) {
            displayGameOver();
            return;
        }
    }

    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    let coll = intersect(player, ball);
    if (coll) {
        document.getElementById('score').innerHTML = `Score: ${++game.score}`;
        ball.y = Math.random() * (canvas.height * 1 / 3) + canvas.height / 3; // Reset the ball's position to a random y position but at least 1/3 of the canvas height
        ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius; // Set a random horizontal position

        // Increase ball speed and level after every 10 points
        if (game.score % 10 === 0) {
            ball.dy *= 2;
            document.getElementById('level').innerHTML = `Level: ${++game.level}`;
        }
    }
}

function displayGameOver() {
    gameRunning = false; // Stop the game loop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
}

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
    if (!gameRunning) return; // Stop the update loop if the game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlayer();
    drawBall();

    gameLogic(); // Call gameLogic to update the ball's position

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

function intersect(player, ball) {
    const distX = Math.abs(ball.x - player.x - player.width / 2);
    const distY = Math.abs(ball.y - player.y - player.height / 2);

    if (distX > (player.width / 2 + ball.radius)) {
        return false;
    }
    if (distY > (player.height / 2 + ball.radius)) {
        return false;
    }

    if (distX <= (player.width / 2)) {
        return true;
    }
    if (distY <= (player.height / 2)) {
        return true;
    }

    const dx = distX - player.width / 2;
    const dy = distY - player.height / 2;
    return (dx * dx + dy * dy <= (ball.radius * ball.radius));
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