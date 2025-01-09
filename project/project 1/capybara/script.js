const gameBoard = document.querySelector('.game-board');
const titleElement = document.getElementById('game-title');
const victorySound = document.getElementById('congrats');

const images = [
  'url(https://i.pinimg.com/736x/4a/82/e6/4a82e6e85cd4381168409b2be58890ba.jpg)',
  'url(https://i.pinimg.com/736x/35/f2/da/35f2da6ffc1fce738fa768180d72d739.jpg)',
  'url(https://i.pinimg.com/736x/d0/1c/ea/d01cea60e2cb871a92266915de02bd54.jpg)',
  'url(https://i.pinimg.com/736x/65/5f/68/655f68a110090a2534f472c299acc3b9.jpg)',
  'url(https://i.pinimg.com/736x/65/d0/e0/65d0e050f8b7a423ead047b2bab399fe.jpg)',
  'url(https://i.pinimg.com/736x/29/52/f3/2952f3efc8f57c89910b437a11cb9fbb.jpg)',
  'url(https://i.pinimg.com/736x/a4/9e/46/a49e4673fbaa8c5916d2fdb02121501b.jpg)',
  'url(https://i.pinimg.com/736x/a7/56/0c/a7560ca9155b17d418208241d04ebb30.jpg)',
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
