let card = document.getElementsByClassName("card");
/*Spread operator allows iterable to expand where 0+ arguments are expected*/
let cards = [...card];
let deck = document.getElementsByClassName("card-deck")[0];
let moves = 0;
let counter = document.querySelector(".moves");
let stars = document.querySelectorAll(".fa-star");
let starsList = document.querySelectorAll(".stars li");
let matchingCard = document.getElementsByClassName("matching");
let closeicon = document.querySelector(".close");
let modal = document.getElementById("myModal");
let openedCards = [];
let second = 0, minute = 0, hour = 0;
let timer = document.querySelector(".timer");
let interval;
const Repeatbutton = document.querySelector(".Repeat");
const modalPlayAgainButton = document.querySelector(".play-again");

/*shuffle function*/
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
  }

/*Shuffles cards upon page load*/
document.body.onload = startGame();

/*Calls startGame() function when user clicks restart icon*/
Repeatbutton.addEventListener("click", startGame);

/*Calls reset() function when user clicks "play again" button in modal*/
modalPlayAgainButton.addEventListener("click", reset);

function startGame() {
/*Shuffles deck*/
  cards = shuffle(cards);
/*Loops through shuffled cards,removes any existing classes from each card*/
  for (let i = 0; i < cards.length; i++) {
  cards.forEach(i => deck.appendChild(i));
  cards[i].classList.remove("show", "open", "matching", "disabled");
  }
  openedCards = [];
/*Resets number of moves*/
  moves = 0;
  counter.innerHTML = moves;
/*Resets star rating*/
  for (let i = 0; i < stars.length; i++) {
    stars[i].style.color = "#ffd700";
    stars[i].style.display = "inline";
  }
/*Resets timer*/
  let second = 0;
  let minute = 0;
  let hour = 0;
  let timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);
}

/*Function toggles open and show classes to display cards. Class 'open' changes the card color and triggers an animation, while 'show' displays the icon*/
let displayCard = function() {
  this.classList.toggle("open");
  this.classList.toggle("show");
  this.classList.toggle("disabled");
};

/*Add flipped cards to openedCards array, and checks if cards are a match or not*/
function cardOpen() {
  openedCards.push(this);
  let len = openedCards.length;
/*Once a card has been opened, starts timer and moves will be '0' (moves is set to one only after two cards have been flipped)*/
  if (len == 1 && moves == 0) {
    second = 0;
    minute = 0;
    hour = 0;
    startTimer();
  } else if (len === 2) {
    moveCounter();
    if (openedCards[0].type === openedCards[1].type) {
      matching();
    } else {
      notMatching();
    }
  }
}

/*When cards match, add/remove relevant classes and clears the two cards arrays*/
function matching() {
  openedCards[0].classList.add("matching", "disabled");
  openedCards[1].classList.add("matching", "disabled");
  openedCards[0].classList.remove("show", "open");
  openedCards[1].classList.remove("show", "open");
  openedCards = [];
}

/*When cards don't match, adds class "not-matching" to both and calls disable() function to disable flipping of other cards. After that, removes "not-matching" class, call enable() function to make flipping cards possible again, and clears the two cards arrays*/
function notMatching() {
  openedCards[0].classList.add("not-matching");
  openedCards[1].classList.add("not-matching");
  disable();
  setTimeout(function() {
    openedCards[0].classList.remove("show", "open", "not-matching");
    openedCards[1].classList.remove("show", "open", "not-matching");
    enable();
    openedCards = [];
  }, 500);
}

/*Disables all cards temporarily (while two cards are flipped)*/
function disable() {
  cards.forEach(card => card.classList.add("disabled"));
}

/*Enables flipping of cards, disables matching cards*/
function enable() {
  Array.prototype.filter.call(cards, function(card) {
    card.classList.remove("disabled");
    for (let i = 0; i < matchingCard.length; i++) {
      matchingCard[i].classList.add("disabled");
    }
  });
}

/*Increases "moves" by one*/
function moveCounter() {
  moves++;
  counter.innerHTML = moves;
/*Set star rating based on number of moves. (Note: using display: none for removed stars)*/
  if (moves > 8 && moves < 12) {
    for (i = 0; i < 3; i++) {
      if (i > 1) {
        stars[i].style.display = "none";
      }
    }
  }
  else if (moves > 13) {
    for (i = 0; i < 3; i++) {
      if (i > 0) {
        stars[i].style.display = "none";
      }
    }
  }
}

/*Game timer*/
function startTimer() {
  interval = setInterval(function() {
    timer.innerHTML = minute + ' mins ' + second + ' secs';
    second++;
    if (second == 60) {
      minute++;
      second = 0;
    }
    if (minute == 60) {
      hour++;
      minute = 0;
    }
  }, 1000);
}

/*Congratulate player when all cards match and shows modal, moves, time*/
function congratulations() {
  if (matchingCard.length == 16) {
    clearInterval(interval); /*Stops the setInterval()*/
    let finalTime = timer.innerHTML;

/*Shows congratulations modal*/
  modal.classList.add("show");
  modal.style.display = "flex";

/*Declare star rating variable*/
  let starRating = document.querySelector(".stars").innerHTML;

/*Shows number of moves made, time, and rating on modal*/
  document.getElementsByClassName("final-moves")[0].innerHTML = moves;
  document.getElementsByClassName("total-time")[0].innerHTML = finalTime;
  document.getElementsByClassName("starRating")[0].innerHTML = starRating;

/*Add event listener for modal's close button*/
  closeModal();
  }
}

/*Close modal upon clicking its close icon*/
function closeModal() {
  closeicon.addEventListener("click", function() {
    modal.classList.remove("show");
    modal.style.display = "none";
    startGame();
  });
}

/*Called when user hits "play again" button*/
function reset() {
  modal.classList.remove("show");
  modal.style.display = "none";
  startGame();
}

/*Add event listeners to each card*/
for (let i = 0; i < cards.length; i++) {
  card = cards[i];
  card.addEventListener("click", displayCard);
  card.addEventListener("click", cardOpen);
  card.addEventListener("click", congratulations);
}
