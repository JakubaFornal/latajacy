const object1 = document.getElementById('object1');
const object2 = document.getElementById('object2');
const ball = document.getElementById('ball');
const container = document.getElementById('container');


let position1 = { top: 0, left: 0 };
let position2 = { top: 0, left: 950 };
let ballPosition = { top: 300, left: 500 };
let ballSpeed = { x: 3, y: 2 };
let velocity1 = { x: 0, y: 0 };
let velocity2 = { x: 0, y: 0 };


let score1 = 0;
let score2 = 0;
let gameOver = false;

// wyswietlanie wyniku
const scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.left = '10px';
scoreDisplay.style.fontSize = '20px';
scoreDisplay.style.fontWeight = 'bold';
container.appendChild(scoreDisplay);

function updateScore() {
    scoreDisplay.textContent = `Gracz 1: ${score1} | Gracz 2: ${score2}`;
}


function endGame(winner) {
    gameOver = true;

    // wyswietlenie komunikatu o wygranej
    const gameOverMessage = document.createElement('div');
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.fontSize = '30px';
    gameOverMessage.style.fontWeight = 'bold';
    gameOverMessage.style.color = 'red';
    gameOverMessage.textContent = `Koniec gry ${winner} wygrywa!`;
    container.appendChild(gameOverMessage);
}

// ruch kuleczki
function moveBall() {
    if (gameOver) return;

    ballPosition.left += ballSpeed.x;
    ballPosition.top += ballSpeed.y;

    // odbijanie kuleczki od scian
    if (ballPosition.left <= 0 || ballPosition.left >= container.offsetWidth - ball.offsetWidth) {
        ballSpeed.x *= -1;
    }
    if (ballPosition.top <= 0 || ballPosition.top >= container.offsetHeight - ball.offsetHeight) {
        ballSpeed.y *= -1;
    }

    ball.style.left = ballPosition.left + 'px';
    ball.style.top = ballPosition.top + 'px';
}


function moveObjects() {
    if (gameOver) return;

    position1.left += velocity1.x;
    position1.top += velocity1.y;

    position2.left += velocity2.x;
    position2.top += velocity2.y;

    
    position1.left = Math.max(0, Math.min(container.offsetWidth - object1.offsetWidth, position1.left));
    position1.top = Math.max(0, Math.min(container.offsetHeight - object1.offsetHeight, position1.top));

    
    position2.left = Math.max(0, Math.min(container.offsetWidth - object2.offsetWidth, position2.left));
    position2.top = Math.max(0, Math.min(container.offsetHeight - object2.offsetHeight, position2.top));

    // aktualizacja stylów
    object1.style.left = position1.left + 'px';
    object1.style.top = position1.top + 'px';

    object2.style.left = position2.left + 'px';
    object2.style.top = position2.top + 'px';
}

// sprawdzanie kolizji
function checkCollision(object, player) {
    if (gameOver) return;

    const objectRect = object.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    if (
        objectRect.left < ballRect.right &&
        objectRect.right > ballRect.left &&
        objectRect.top < ballRect.bottom &&
        objectRect.bottom > ballRect.top
    ) {
        if (player === 1) score1++;
        if (player === 2) score2++;
        updateScore();

        
        if (score1 >= 5) {
            endGame('Gracz 1');
        } else if (score2 >= 5) {
            endGame('Gracz 2');
        }

        // przeniesienie kuleczki w losowe miejsce
        ballPosition.left = Math.random() * (container.offsetWidth - ball.offsetWidth);
        ballPosition.top = Math.random() * (container.offsetHeight - ball.offsetHeight);
    }
}

// obsługa klawiatury dla ciągłego ruchu
document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    switch (event.key) {
        // gracz 1
        case 'ArrowUp':
            velocity1.y = -4;
            break;
        case 'ArrowDown':
            velocity1.y = 4;
            break;
        case 'ArrowLeft':
            velocity1.x = -4;
            break;
        case 'ArrowRight':
            velocity1.x = 4;
            break;

        // gracz 2
        case 'w':
            velocity2.y = -4;
            break;
        case 's':
            velocity2.y = 4;
            break;
        case 'a':
            velocity2.x = -4;
            break;
        case 'd':
            velocity2.x = 4;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (gameOver) return;

    switch (event.key) {
        // gracz 1
        case 'ArrowUp':
        case 'ArrowDown':
            velocity1.y = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            velocity1.x = 0;
            break;

        // gracz 2
        case 'w':
        case 's':
            velocity2.y = 0;
            break;
        case 'a':
        case 'd':
            velocity2.x = 0;
            break;
    }
});


function gameLoop() {
    if (!gameOver) {
        moveBall();
        moveObjects();

        
        checkCollision(object1, 1);
        checkCollision(object2, 2);
    }

    requestAnimationFrame(gameLoop);
}


updateScore();
gameLoop();