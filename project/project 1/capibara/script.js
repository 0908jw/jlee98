const gameBoard = document.querySelector('.game-board');
const titleElement = document.getElementById('game-title');
const victorySound = document.getElementById('congrats');

const images = [
  'url(https://i.pinimg.com/736x/6d/4f/88/6d4f880d13271ae6705872aa956b15d0.jpg)',
  'url(https://i.pinimg.com/736x/c1/49/4c/c1494c0cba7ee79597c68aff12fb6b88.jpg)',
  'url(https://i.pinimg.com/736x/44/19/c3/4419c3c2e1e188b928dc480d0853d795.jpg)',
  'url(https://i.pinimg.com/736x/53/d2/e3/53d2e34e7a0014caa724a73eab9e66c8.jpg)',
  'url(https://i.pinimg.com/736x/4d/0a/2d/4d0a2df5d7a8300c1fa373d07f4afa3e.jpg)',
  'url(https://i.pinimg.com/736x/07/21/90/072190b0913b0fbd92fcd9941ba7f57c.jpg)',
  'url(https://i.pinimg.com/736x/ad/ab/e6/adabe64b9c091a13598f454c3b4e7b87.jpg)',
  'url(https://i.pinimg.com/736x/95/1b/1b/951b1bee964388ab0dd545c6cc9de9d3.jpg)',
];
const cardImages = [...images, ...images];
cardImages.sort(() => 0.5 - Math.random());

let flippedCards = [];
let matchedCards = [];
let matchesFound = 0;

function createCard(image) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="front"></div>
    <div class="back" style="background-image: ${image}"></div>
  `;
  card.addEventListener('click', () => handleCardClick(card, image));
  return card;
}

function handleCardClick(card, image) {
  if (flippedCards.length === 2 || matchedCards.includes(card) || flippedCards.includes(card)) return;

  card.classList.add('flipped');
  flippedCards.push({ card, image });

  if (flippedCards.length === 2) {
    if (flippedCards[0].image === flippedCards[1].image) {
      matchedCards.push(flippedCards[0].card, flippedCards[1].card);
      matchesFound++; 
      flippedCards = [];
      checkForVictory();
    } else {
      setTimeout(() => {
        flippedCards[0].card.classList.remove('flipped');
        flippedCards[1].card.classList.remove('flipped');
        flippedCards = [];
      }, 1000);
    }
  }
}

function checkForVictory() {
  if (matchesFound === cardImages.length / 2) {
    titleElement.textContent = "Yay! You found them!"; 
    victorySound.play(); 
  }
}

function initializeGame() {
  cardImages.forEach(image => {
    const card = createCard(image);
    gameBoard.appendChild(card);
  });
}

initializeGame();
