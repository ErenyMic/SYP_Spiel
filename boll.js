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
gameOverImage.src = 'loose.jpg'; // Replace with the path to your game over image

var game = {
    lives: 1, // Start with 5 lives
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
        ball.y = Math.random() * (canvas.height / 2 - ball.radius * 2) + ball.radius; // Random y position but not lower than half of the canvas height
        ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius; // Set a random horizontal position
        game.lives--; // Decrease lives

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
        game.score++;
        ball.y = Math.random() * (canvas.height / 2 - ball.radius * 2) + ball.radius; // Reset the ball's position to a random y position but not lower than half of the canvas height
        ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius; // Set a random horizontal position

        // Increase ball speed and level after every 10 points
        if (game.score % 3 === 0) {
            ball.dy += 2;
            game.level++;
        }
    }
}

function displayGameOver() {
    gameRunning = false; // Stop the game loop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imgWidth = canvas.width * 0.35;
    const imgHeight = canvas.height * 0.7;
    const imgX = (canvas.width - imgWidth) / 2;
    const imgY = (canvas.height - imgHeight) / 2;
    ctx.drawImage(gameOverImage, imgX, imgY, imgWidth, imgHeight);
    const restartButton = document.getElementById('restartButton');
    restartButton.style.display = 'block'; // Show the restart button
    restartButton.style.position = 'absolute';
    restartButton.style.left = `${canvas.offsetLeft + imgX + imgWidth / 2 - restartButton.offsetWidth / 2}px`;
    restartButton.style.top = `${canvas.offsetTop + imgY + imgHeight + 10}px`; // Position it directly below the image with a small margin
}

function restartGame() {
    game.lives = 2;
    game.score = 0;
    game.level = 1;
    ball.dy = 2;
    document.getElementById('restartButton').style.display = 'none'; // Hide the restart button
    gameRunning = true;
    update();
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

function drawHUD() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${game.score}`, 10, 30);
    ctx.fillText(`Lives: ${game.lives}`, 10, 60);
    ctx.fillText(`Level: ${game.level}`, 10, 90);
}

function update() {
    if (!gameRunning) return; // Stop the update loop if the game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlayer();
    drawBall();
    drawHUD(); // Draw the score, lives, and level

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