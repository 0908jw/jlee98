const gameBoard = document.querySelector('.game-board');
const titleElement = document.getElementById('game-title');
const victorySound = document.getElementById('congrats');

const images = [
  'url(https://i.pinimg.com/736x/87/aa/07/87aa07ad6dc3a449381db0ddfd03f08d.jpg)',
  'url(https://i.pinimg.com/736x/21/e4/6d/21e46d750f211d9202582f7093e152cb.jpg)',
  'url(https://i.pinimg.com/736x/a9/d1/1c/a9d11c0dcab3e9620eb8b526cb2aa5ed.jpg)',
  'url(https://i.pinimg.com/736x/49/32/32/4932329bc13dc969fd0541db2f9c6dcd.jpg)',
  'url(https://i.pinimg.com/736x/19/b9/86/19b98673e7fdbc6955fc31e1fa7edc74.jpg)',
  'url(https://i.pinimg.com/736x/a8/5a/75/a85a7549a2926f1698af2709f40aafed.jpg)',
  'url(https://i.pinimg.com/736x/a9/a3/bf/a9a3bf68ef02ea5145c446638d9155cf.jpg)',
  'url(https://i.pinimg.com/736x/86/80/f3/8680f3c873a4e2487ae5db40f38762bf.jpg)',
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
