const gameBoard = document.querySelector('.game-board');
const titleElement = document.getElementById('game-title');
const victorySound = document.getElementById('congrats');

const images = [
  'url(https://i.pinimg.com/736x/94/36/f8/9436f8f84c4277a61295c557fa9c9c36.jpg)',
  'url(https://i.pinimg.com/736x/75/7d/ee/757dee979c8015725b9f2eed18cf3410.jpg)',
  'url(https://i.pinimg.com/736x/68/77/79/6877791b2986a09d54d9a4ee7411b7e3.jpg)',
  'url(https://i.pinimg.com/736x/c6/d2/2b/c6d22b0953d982d37cb94ed8df43ede4.jpg)',
  'url(https://i.pinimg.com/736x/42/7b/0c/427b0c4679534a11dddc3b42dfd4ab9d.jpg)',
  'url(https://i.pinimg.com/736x/1b/85/f0/1b85f0cbee4ce0435db0606478bda32d.jpg)',
  'url(https://i.pinimg.com/736x/10/51/d9/1051d93d414191163b246edb71ba546f.jpg)',
  'url(https://i.pinimg.com/736x/5c/db/52/5cdb52a67c0b9cab96af81a8abfebdec.jpg)',
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
