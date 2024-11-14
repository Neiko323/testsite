const cards = [
    '🐶', '🐶',
    '🐱', '🐱',
    '🐭', '🐭',
    '🐹', '🐹',
    '🐰', '🐰',
    '🦊', '🦊',
    '🐻', '🐻',
    '🐼', '🐼'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let lives = 3;
let isAITurn = false; 
let aiActive = false; 

let playerScore = 0;
let aiScore = 0;

function updateScores() {
    document.getElementById('player-score').textContent = `Joueur : ${playerScore}`;
    document.getElementById('ai-score').textContent = `IA : ${aiScore}`;
}

function updateLives() {
    document.getElementById('lives').textContent = `Vies restantes : ${lives}`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const gameBoard = document.querySelector('.game-board');
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.icon = card;
        cardElement.textContent = '';
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
    updateLives();
    updateScores();
}

function flipCard() {
    if (lockBoard || isAITurn) return; 
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.icon;
    
    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.icon === secondCard.dataset.icon) {
        disableCards(aiActive ? 'ai' : 'player'); 
    } else {
        loseLife();
        unflipCards();
    }

    if (aiActive && lives > 0) { 
        setTimeout(aiTurn, 1500); 
    }
}

function disableCards(finder) {
    if (finder === 'player') {
        playerScore++;
        firstCard.classList.add('player');
        secondCard.classList.add('player');
    } else {
        aiScore++;
        firstCard.classList.add('ai');
        secondCard.classList.add('ai');
    }

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    updateScores();
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function loseLife() {
    lives -= 1;
    updateLives();
    if (lives === 0) {
        alert("Vous avez perdu toutes vos vies ! Le jeu va se réinitialiser.");
        resetGame();
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetGame() {
    lives = 3;
    playerScore = 0;
    aiScore = 0;
    document.querySelector('.game-board').innerHTML = '';
    createBoard();
}

// Mode IA : Logique pour le tour de l'IA
function aiTurn() {
    isAITurn = true;
    lockBoard = true;

    const unflippedCards = Array.from(document.querySelectorAll('.card:not(.flipped)'));
    if (unflippedCards.length < 2) return; 

    const randomCard1 = unflippedCards[Math.floor(Math.random() * unflippedCards.length)];
    let randomCard2;
    do {
        randomCard2 = unflippedCards[Math.floor(Math.random() * unflippedCards.length)];
    } while (randomCard1 === randomCard2);

    randomCard1.classList.add('flipped');
    randomCard1.textContent = randomCard1.dataset.icon;
    randomCard2.classList.add('flipped');
    randomCard2.textContent = randomCard2.dataset.icon;

    setTimeout(() => {
        if (randomCard1.dataset.icon === randomCard2.dataset.icon) {
            randomCard1.classList.add('ai');
            randomCard2.classList.add('ai');
            aiScore++;
            randomCard1.removeEventListener('click', flipCard);
            randomCard2.removeEventListener('click', flipCard);
            updateScores();
        } else {
            randomCard1.classList.remove('flipped');
            randomCard1.textContent = '';
            randomCard2.classList.remove('flipped');
            randomCard2.textContent = '';
        }

        isAITurn = false;
        lockBoard = false;
    }, 1000);
}

document.getElementById('solo-mode').addEventListener('click', () => {
    aiActive = false;
    setActiveModeButton('solo-mode');
    document.getElementById('ai-score').style.display = 'none'; // Masquer le score de l'IA en mode solo
    document.getElementById('lives').style.display = 'block'; // Afficher les vies en mode solo
    resetGame();
});

document.getElementById('ai-mode').addEventListener('click', () => {
    aiActive = true;
    setActiveModeButton('ai-mode');
    document.getElementById('ai-score').style.display = 'block'; // Afficher le score de l'IA en mode IA
    document.getElementById('lives').style.display = 'none'; // Masquer les vies en mode IA
    resetGame();
});

function loseLife() {
    if (!aiActive) { // Appliquer la perte de vies uniquement en mode solo
        lives -= 1;
        updateLives();
        if (lives === 0) {
            alert("Vous avez perdu toutes vos vies ! Le jeu va se réinitialiser.");
            resetGame();
        }
    }
}


function setActiveModeButton(activeButtonId) {
    document.getElementById('solo-mode').classList.remove('active');
    document.getElementById('ai-mode').classList.remove('active');
    
    document.getElementById(activeButtonId).classList.add('active');
}

document.getElementById('reset-button').addEventListener('click', resetGame);

createBoard();
