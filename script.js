// DOM elements
const cardsContainer = document.querySelector(".cards-container");
const score = document.querySelector("#score");
let allowClicks = true; // Control if clicks are allowed
let card1 = null; // Track first card flipped
let card2 = null; // Track second card flipped
score.innerHTML = 0; // Initialize score
let cardsFlipped = 0; // Track the number of cards flipped

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
        if (cardsFlipped === PLANTS.length) alert("Game Over!");
      }, 1000);

      // Allow clicks again
      allowClicks = true;
    } else {
      // If not a match, flip them back over after a delay
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;
        card2 = null;
        allowClicks = true; // Re-enable clicks
      }, 1000);
    }
  }
}

// Initialize the game by creating the shuffled cards
createDivsForPlants(shuffledPlants);

// Collect all card divs (if needed elsewhere)
let cards = document.querySelectorAll("#game > div");
let cardsArr = Array.prototype.slice.call(cards); 
