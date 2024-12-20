// DOM elements
const cardsContainer = document.querySelector(".cards-container");
const score = document.querySelector("#score");
const timerDisplay = document.createElement("div"); // New element for the timer display
timerDisplay.classList.add("timer-display"); // Add class for styling
document.body.insertBefore(timerDisplay, cardsContainer); // Insert timer display above the cards container
let allowClicks = true; // Control if clicks are allowed
let card1 = null; // Track first card flipped
let card2 = null; // Track second card flipped
score.innerHTML = 0; // Initialize score
let cardsFlipped = 0; // Track the number of cards flipped
let wrongAttempts = 0; // Track the number of wrong attempts
let timer; // Timer variable
let timeLeft = 15; // Time in seconds for the game

// Array of plant names (duplicates to match pairs)
const PLANTS = [
  "plant1", "plant2", "plant3", "plant4", "plant5", "plant6", "plant7", "plant8",
  "plant1", "plant2", "plant3", "plant4", "plant5", "plant6", "plant7", "plant8"
];

// Fisher-Yates shuffle function to randomize the array
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array that haven't been shuffled
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter); // Pick a random index
    counter--; // Decrease counter
    // Swap the last element with the randomly chosen one
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// Shuffle the PLANTS array
let shuffledPlants = shuffle(PLANTS);
console.log(shuffledPlants);

// Function to create the card elements and append them to the container
function createDivsForPlants(plantArray) {
  plantArray.forEach(plant => {
    // Create divs for the card layout
    const cardContainer = document.createElement("div");
    const card = document.createElement("figure");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    const cardImg = document.createElement("img");

    // Add class names for styling and identification
    cardContainer.classList.add("card-container", `${plant}`);
    card.classList.add("card");
    cardFront.classList.add("card-front");
    cardBack.classList.add("card-back");

    // Set the image source dynamically
    cardImg.setAttribute("src", `./img/memory-game-plant-images-100-times-1_5/${plant}.png`);

    // Add text to the front of the card
    cardFront.innerText = "MEMORY";

    // Add event listener for the card click
    cardContainer.addEventListener("click", handleCardClick);

    // Append elements together
    cardBack.append(cardImg);
    card.append(cardFront, cardBack);
    cardContainer.append(card);
    cardsContainer.append(cardContainer);
  });
}

// Function to handle card flip and matching logic
function handleCardClick(event) {
  // Prevent illegal clicks when cards are already flipped or clicks are disabled
  if (!allowClicks || event.currentTarget.classList.contains("flipped")) return;

  // Increment the score for each card flip
  score.innerHTML = parseInt(score.innerHTML) + 1;

  // Mark the clicked card as flipped
  let clickedCardContainer = event.currentTarget;
  clickedCardContainer.classList.add("flipped");

  // Assign the clicked card to card1 or card2 (track two flipped cards)
  if (!card1 || !card2) {
    card1 = card1 || clickedCardContainer;
    card2 = clickedCardContainer === card1 ? null : clickedCardContainer;
  }

  // If two cards have been flipped
  if (card1 && card2) {
    allowClicks = false; // Disable clicks temporarily

    // Check if the cards match
    if (card1.className === card2.className) {
      // If it's a match, keep them flipped
      cardsFlipped += 2;

      // Remove event listeners for matched cards
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);

      // Reset card variables
      card1 = null;
      card2 = null;

      // Check if all cards are flipped (game over)
      setTimeout(() => {
        if (cardsFlipped === PLANTS.length) {
          clearInterval(timer); // Stop the timer
          alert("Game Over! You matched all pairs.");
        }
      }, 1000);

      // Allow clicks again
      allowClicks = true;
    } else {
      // If not a match, increment wrong attempts and flip them back over after a delay
      wrongAttempts++;
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;
        card2 = null;
        allowClicks = true; // Re-enable clicks

        // Check if wrong attempts exceed 6
        if (wrongAttempts >= 6) {
          alert("Maximum wrong attempts reached. Resetting game...");
          resetGame();
        }
      }, 1000);
    }
  }
}

// Function to reset the game
function resetGame() {
  // Reset variables
  wrongAttempts = 0;
  cardsFlipped = 0;
  score.innerHTML = 0;
  allowClicks = true;
  card1 = null;
  card2 = null;
  timeLeft = 15; // Reset timer

  // Remove all card elements
  cardsContainer.innerHTML = "";

  // Shuffle the PLANTS array and recreate the cards
  shuffledPlants = shuffle(PLANTS);
  createDivsForPlants(shuffledPlants);

  // Restart the timer
  startTimer();
}

// Function to start the timer
function startTimer() {
  timeLeft = 15;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time left: ${timeLeft}s`; // Update the timer display
    console.log(`Time left: ${timeLeft}s`);
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Resetting game...");
      resetGame();
    }
  }, 1000);
}

// Initialize the game by creating the shuffled cards and starting the timer
createDivsForPlants(shuffledPlants);
startTimer();
