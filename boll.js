const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = 'Hintergrund.jpg';

const ballImage = new Image();
ballImage.src = 'Ball-removebg-preview.png';

const playerImage = new Image();
playerImage.src = 'korb-neu.png';

const gameOverImage = new Image();
gameOverImage.src = 'loose.jpg';

const footballImage = new Image();
footballImage.src = 'football2.png';

const btn = document.getElementById('restartButton');
btn.addEventListener('click', restartGame);

var game = {
    lives: 3, // lives
    score: 0,
    level: 1,
}

var gameRunning = true; // Flag to control the game loop

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
    dy: 4
};

const football = {
    x: Math.random() * (canvas.width - 100) + 50,
    y: Math.random() * (canvas.height / 2 - 100) + 50,
    radius: 50,
    dy: 4
};

background.onload = function () {
    update();
};

function gameLogic() {
    if (!gameRunning) return; // Stop game logic if the game is over

    ball.y += ball.dy;
    football.y += football.dy;

    if (ball.y + ball.radius > canvas.height) {
        ball.y = Math.random() * (canvas.height / 2 - ball.radius * 2) + ball.radius; // Random y position but not lower than half of the canvas height
        ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius; // Set a random horizontal position
        game.lives--; // Decrease lives

        if (game.lives <= 0) {
            displayGameOver();
            return;
        }
    }

    if (football.y + football.radius > canvas.height) {
        football.y = Math.random() * (canvas.height / 2 - football.radius * 2) + football.radius; // Random y position but not lower than half of the canvas height
        football.x = Math.random() * (canvas.width - football.radius * 2) + football.radius; // Set a random horizontal position
    }

    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    let collBall = intersect(player, ball);
    if (collBall) {
        game.score++;
        ball.y = Math.random() * (canvas.height / 2 - ball.radius * 2) + ball.radius; // Reset the ball's position to a random y position but not lower than half of the canvas height
        ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius; // Set a random horizontal position

        // Increase ball speed and level after every 3 points
        if (game.score % 3 === 0) {
            ball.dy += 2;
            football.dy = ball.dy; // Match football speed to ball speed
            game.level++;
        }
    }

    let collFootball = intersect(player, football);
    if (collFootball) {
        game.lives--; // Decrease lives if football is caught
        football.y = Math.random() * (canvas.height / 2 - football.radius * 2) + football.radius; // Reset the football's position to a random y position but not lower than half of the canvas height
        football.x = Math.random() * (canvas.width - football.radius * 2) + football.radius; // Set a random horizontal position

        if (game.lives <= 0) {
            displayGameOver();
            return;
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
    ctx.font = '50px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', imgX + imgWidth / 2 - ctx.measureText('Game Over').width / 2, imgY - 20); 
    ctx.drawImage(gameOverImage, imgX, imgY, imgWidth, imgHeight);
    btn.style.display = 'block'; // Show the restart button
    btn.style.position = 'absolute';
    btn.style.left = `${canvas.offsetLeft + imgX + imgWidth / 2 - btn.offsetWidth / 2}px`;
    btn.style.top = `${canvas.offsetTop + imgY + imgHeight + 10}px`; // Position it directly below the image with a small margin
}

function restartGame() {
    game.lives = 2;
    game.score = 0;
    game.level = 1;
    ball.dy = 4;
    football.dy = 4;
    btn.style.display = 'none'; // Hide the restart button
    gameRunning = true;
    update();
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    ctx.drawImage(footballImage, football.x - football.radius, football.y - football.radius, football.radius * 2, football.radius * 2);
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

background.onload = function () {
    update();
}

function stopPlayer(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.dx = 0;
    }
}
background.onload = function () {
    update();
}