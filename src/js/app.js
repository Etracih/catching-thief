// Selecting elements
const instructionEl = document.querySelector(".header__instruction");
const modalInstructionEl = document.querySelector(".modal-instruction");
const btnCloseInstructionModalEl = document.querySelector(
  ".close-instruction-modal"
);
const modalResultEl = document.querySelector(".modal");
const modalTossEl = document.querySelector(".modal-toss");
const overlayEl = document.querySelector(".overlay");

const btnCloseTossModalEl = document.querySelector(".close-toss-modal");
const btnCloseModalResultEl = document.querySelector(".close-modal");
const cardsContainer = document.querySelector(".cards-container");
const btnStart = document.querySelector(".btn");
const playerOne = document.querySelector(".player-1");
const playerTwo = document.querySelector(".player-2");

let highscoreEl = document.querySelector(".header__highscore");
let thiefMessage = document.querySelector(".thief-message");
let playerOneScore = document.querySelector(".current_score--0");
let playerTwoScore = document.querySelector(".current_score--1");

// Declaring Variables
let randomNumber, randomNumberEl;
let Players, playerScore;

let activePlayer;
let thiefCard;
let cardNumber;
let highscore = 0;
let hasOneplayer;

btnCloseTossModalEl.addEventListener("click", closeTossModal);
btnCloseModalResultEl.addEventListener("click", closeModal);
instructionEl.addEventListener("click", openModalInstruction);
btnCloseInstructionModalEl.addEventListener("click", closeModalInstruction);

btnStart.addEventListener("click", function () {
  activePlayer = getRandomNumber(0, 2);
  btnStart.classList.add("hidden");
  cardsContainer.classList.toggle("disable");

  openTossModal();
});

function init() {
  initVariables();
  initElement();
}

init();

function initVariables() {
  Players = [];
  randomNumber = [];
  randomNumber.length = 4;
  // Set Score 100 for players
  playerScore = [100, 100];
  playerOneScore.textContent = playerScore[0];
  playerTwoScore.textContent = playerScore[1];
  hasOneplayer = false;
  // Initial value of thief-message
  thiefMessage.firstChild.textContent = `Catch the thief!`;
  // Remove active player
  playerOne.classList.remove("active");
  playerTwo.classList.remove("active");

  cardsContainer.classList.add("disable");
  btnStart.classList.remove("hidden");

  highscoreEl.lastChild.textContent = highscore;
}

function initElement(cards = genarateCards()) {
  for (let i = 0; i < cards.length; i++) {
    cardBackEl = document.createElement("div");
    randomNumberEl = document.createTextNode(cards[i]);
    cardBackEl.appendChild(randomNumberEl);
    cardBackEl.classList.add("card-back");
    cardBackEl.classList.add("flex");

    cardFrontEl = document.createElement("div");
    testText = document.createTextNode("?");
    cardFrontEl.appendChild(testText);
    cardFrontEl.classList.add("card-front");
    cardFrontEl.classList.add("flex");

    cardCon = document.createElement("div");
    cardCon.classList.add("card");
    cardCon.appendChild(cardFrontEl);
    cardCon.appendChild(cardBackEl);
    cardsContainer.appendChild(cardCon);
  }

  addCardFunctionality();
}

function genarateCards() {
  thiefCard = getRandomNumber(0, 4);
  for (let i = 0; i < randomNumber.length; i++) {
    randomNumber[i] = i === thiefCard ? 0 : getRandomNumber(1, 20);
  }

  return randomNumber;
}

function getRandomNumber(start, length) {
  return Math.trunc(Math.random() * length) + start;
}

function changeCardNumber(array) {
  for (let i = 0; i < array.length; i++) {
    cardsContainer.children[i].lastChild.textContent = array[i];
  }
}
function checkCardNumber(cardNumber) {
  if (cardNumber === 0) {
    openModal();
  } else {
    // Decrease Active Player score
    playerScore[activePlayer] -= cardNumber;
    // Set the score for active player
    document.querySelector(`.current_score--${activePlayer}`).textContent =
      playerScore[activePlayer];

    checkPlayerScore(playerScore[activePlayer]);
  }
}

function checkPlayerScore(playerScore) {
  if (playerScore <= 0) {
    // Exclude Player with 0 score
    Players = Players.filter((item) => item !== activePlayer);
    // Set active player's score to 0 if lose
    document.querySelector(`.current_score--${activePlayer}`).textContent = 0;
    // Change thiefMessage element
    thiefMessage.firstChild.textContent = `Player ${
      activePlayer + 1
    } Game Over!`;

    checkActivePlayer();
  } else {
    // Change thiefMessage element
    thiefMessage.firstChild.textContent = `Player ${activePlayer + 1} missed!`;
    switchPlayer();
  }
}

function checkActivePlayer() {
  if (Players.length === 0) {
    activePlayer = "none";
    openModal();
  } else {
    // switch to active player
    activePlayer = Players[0];
    hasOneplayer = true;

    displayActivePlayer();
  }
}

function switchPlayer() {
  if (!hasOneplayer) {
    activePlayer = activePlayer === 0 ? 1 : 0;
  }
  displayActivePlayer();
}

function addPlayer() {
  let hasPlayer = Players.includes(activePlayer, 0);
  if (!hasPlayer) {
    console.log(`${activePlayer + 1} added`);

    Players.push(activePlayer);
  }
  console.log(Players);
}

function displayActivePlayer() {
  if (activePlayer === 0) {
    playerOne.classList.add("active");
    playerTwo.classList.remove("active");
  } else {
    playerTwo.classList.add("active");
    playerOne.classList.remove("active");
  }
}

function toggleThiefImage(cardNumber, card) {
  // Add image to card with zero value
  if (cardNumber === 0) {
    card.lastChild.classList.add("thief");
  } else {
    card.lastChild.classList.remove("thief");
  }
}

function addCardFunctionality() {
  let cards = document.querySelectorAll(".card");

  [...cards].forEach((card) => {
    card.addEventListener("click", function () {
      // Open the card
      card.classList.add("isflip");
      // Add '-' to card number
      card.lastChild.textContent = `-${card.lastChild.textContent}`;
      cardNumber = card.lastChild.textContent;
      // Remove '-' to card number
      cardNumber = Number(cardNumber.substring(1));
      toggleThiefImage(cardNumber, card);
      cardsContainer.classList.add("disable");

      console.log(randomNumber);
      // Display card on 7 milisecond
      setTimeout(() => {
        checkCardNumber(cardNumber);

        randomNumber = genarateCards(); // Reset randomNumber
        thiefCard = getRandomNumber(0, 4); // Reset thiefCard
        //Close the card
        card.classList.remove("isflip");
        // Change value after close the card
        setTimeout(() => {
          cardsContainer.classList.remove("disable");
          changeCardNumber(randomNumber);
          console.log(randomNumber);
        }, 750);
      }, 700);
      // Add element to array Players
      addPlayer();
    });
  });
}

function openModal() {
  modalResultEl.classList.remove("hidden");
  overlayEl.classList.remove("hidden");

  let score = playerScore[activePlayer];
  let modalHeader;
  let modalContent;

  if (score > highscore) {
    highscore = score;
    modalHeader = `player ${activePlayer + 1} wins`;
    modalContent = `😋New Highscore : ${score}`;
  } else if (activePlayer === "none") {
    modalHeader = "Game Over";
    modalContent = "Computer Wins";
  } else {
    modalHeader = `player ${activePlayer + 1} wins`;
    modalContent = `Score : ${score}`;
  }

  modalResultEl.children[1].textContent = modalHeader;
  modalResultEl.children[2].textContent = modalContent;
}

function closeModal() {
  modalResultEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
  initVariables();
}

function openTossModal() {
  modalTossEl.classList.remove("hidden");
  overlayEl.classList.remove("hidden");

  let modalMessage = `player ${activePlayer + 1} goes first`;
  modalTossEl.children[2].textContent = modalMessage;
}

function closeTossModal() {
  modalTossEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
  displayActivePlayer();
}

function openModalInstruction() {
  modalInstructionEl.classList.remove("hidden");
  overlayEl.classList.remove("hidden");
}
function closeModalInstruction() {
  modalInstructionEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
}
