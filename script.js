const cardsContainer = document.querySelector(".cards-container");
const score = document.querySelector("#score");
let allowClicks = true;
let card1 = null;
let card2 = null;
score.innerHTML = 0;
let cardsFlipped = 0;

const PLANTS = [
  "plant1",
  "plant2",
  "plant3",
  "plant4",
  "plant5",
  "plant6",
  "plant7",
  "plant8",
  "plant1",
  "plant2",
  "plant3",
  "plant4",
  "plant5",
  "plant6",
  "plant7",
  "plant8",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array that haven't been shuffled
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledPlants = shuffle(PLANTS);
console.log(shuffledPlants);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForPlants(plantArray) {
  for (let plant of plantArray) {
    // create new elements that will build the card
    const cardContainer = document.createElement("div");
    const card = document.createElement("figure");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    const cardImg = document.createElement("img");

    // give elements class attributes
    cardContainer.classList.add("card-container");
    cardContainer.classList.add(`${plant}`);
    card.classList.add("card");
    cardFront.classList.add("card-front");
    cardBack.classList.add("card-back");

    // give card image src attribute
    cardImg.setAttribute(
      "src",
      `./img/memory-game-plant-images-100-times-1_5/${plant}.png`
    );

    cardFront.innerText = "MEMORY";
    // call a function handleCardClick when a div is clicked on
    cardContainer.addEventListener("click", handleCardClick);

    // append the elements together
    cardBack.append(cardImg);
    card.append(cardFront);
    card.append(cardBack);
    cardContainer.append(card);
    cardsContainer.append(cardContainer);
  }
}

function handleCardClick(event) {
  // ***** PREVENT ILLEGAL CLICKS *****
  if (!allowClicks) return;
  if (event.currentTarget.classList.contains("flipped")) return;

  score.innerHTML = parseInt(score.innerHTML) + 1;

  // save the target card container to a variable and add class "flipped"
  let clickedCardContainer = event.currentTarget;
  clickedCardContainer.classList.add("flipped");

  // AT LEAST ONE CARD FLIPPED
  // assign the clicked card to either card1 or card2
  if (!card1 || !card2) {
    card1 = card1 || clickedCardContainer;
    card2 = clickedCardContainer === card1 ? null : clickedCardContainer;
  }

  // TWO CARDS FLIPPED
  if (card1 && card2) {
    allowClicks = false;

    // a match
    if (card1.className === card2.className) {
      // leave them flipped
      cardsFlipped += 2;
      // remove their event handlers
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);
      // set card1 and card2 back to null
      card1 = null;
      card2 = null;
      setTimeout(function () {
        if (cardsFlipped === PLANTS.length) alert("game over!");
      }, 1000);

      // allow clicks
      allowClicks = true;
      // not a match
    } else {
      // mark
      setTimeout(function () {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;
        card2 = null;
        allowClicks = true;
      }, 1000);
    }
  }
}

// when the DOM loads
createDivsForPlants(shuffledPlants);
let cards = document.querySelectorAll("#game > div");
let cardsArr = Array.prototype.slice.call(cards);
