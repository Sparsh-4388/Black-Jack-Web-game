
let gameDeck = [];
let playerCards = [];
let dealerCards = [];
let playerSum = 0;
let dealerSum = 0;
let playerAlive = false;
let dealerAlive = false;

let initialChips = parseInt(localStorage.getItem("blackJackChips"));
if (isNaN(initialChips)) initialChips = 20;

let player = {
  name: "Player",
  chips: initialChips
};


const startBtn = document.getElementById("start-el");
const hitBtn   = document.getElementById("new-card-el");
const standBtn = document.getElementById("stand-el");
const buyBtn   = document.getElementById("buy-in-el");

document.getElementById("player-el").textContent = player.name + ": $" + player.chips;


function createDeck() {
  const ranks = [
    {rank: "A", value: 11},{rank: "2", value: 2},{rank: "3", value: 3},
    {rank: "4", value: 4},{rank: "5", value: 5},{rank: "6", value: 6},
    {rank: "7", value: 7},{rank: "8", value: 8},{rank: "9", value: 9},
    {rank: "10", value: 10},{rank: "J", value: 10},{rank: "Q", value: 10},
    {rank: "K", value: 10}
  ];
  let deck = [];
  for (let i = 0; i < 4; i++) {
    ranks.forEach(r => deck.push({...r}));
  }
  return deck;
}


function shuffleDeck(deck){
  let currentIndex = deck.length, randomIndex;
  while (currentIndex !== 0){
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
  }
}

function drawCard(){
  return gameDeck.shift();
}

// calculate sum with Ace adjustments
function calculateSum(hand){
  let sum = 0, aceCount = 0;
  hand.forEach(c => {
    sum += c.value;
    if (c.rank === "A") aceCount++;
  });
  while (sum > 21 && aceCount > 0){
    sum -= 10;
    aceCount--;
  }
  return sum;
}

// render player & dealer hands
function renderHands(showDealer = false){
  // player
  document.getElementById("cards-el").textContent = "Cards: " + (playerCards.length ? playerCards.map(c => c.rank).join(" ") : "");
  playerSum = calculateSum(playerCards);
  document.getElementById("sum-el").textContent = "Sum: " + playerSum;

  // dealer
  if (showDealer){
    document.getElementById("dealer-cards").textContent = "Cards: " + (dealerCards.length ? dealerCards.map(c => c.rank).join(" ") : "");
    dealerSum = calculateSum(dealerCards);
    document.getElementById("dealer-sum").textContent = "Sum: " + dealerSum;
  } else {
    let first = dealerCards[0] ? dealerCards[0].rank : "";
    document.getElementById("dealer-cards").textContent = "Cards: " + first + (dealerCards.length > 1 ? " 🂠" : "");
    document.getElementById("dealer-sum").textContent = "Sum: ?";
  }
}

// start a new round
function startGame(){
  if (player.chips <= 0){
    document.getElementById("message-el").textContent = "🚫 You need more chips to play! Use 'BUY-IN'.";
    return;
  }

  gameDeck = createDeck();
  shuffleDeck(gameDeck);

  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];

  playerAlive = true;
  dealerAlive = false;

  renderHands(false);

  playerSum = calculateSum(playerCards);
  if (playerSum === 21) {
    document.getElementById("message-el").textContent = "🃏 Blackjack! You win instantly!";
    updateChips(100);
    hitBtn.disabled = true;
    standBtn.disabled = true;
    startBtn.disabled = false;
    return;
  }

  hitBtn.disabled = false;
  standBtn.disabled = false;
  startBtn.disabled = true;

  document.getElementById("message-el").textContent = "Your turn: Hit or Stand";
}


// player hits
function playerHit() {
  if (!playerAlive) return;
  playerCards.push(drawCard());
  renderHands(false);

  playerSum = calculateSum(playerCards);

  if (playerSum === 21) {
    document.getElementById("message-el").textContent = "🎉 Blackjack! You win instantly!";
    playerAlive = false;
    updateChips(100);
    hitBtn.disabled = true;
    standBtn.disabled = true;
    startBtn.disabled = false;
    return;
  }

  if (playerSum > 21) {
    playerAlive = false;
    endRound();
  }
}


// player stands - dealer plays
function playerStand(){
  if (!playerAlive) return;
  playerAlive = false;
  dealerPlay();
}

// dealer automaton
function dealerPlay(){
  dealerAlive = true;
  renderHands(true);
  dealerSum = calculateSum(dealerCards);

  // Dealer hits until 17 or more (soft 17 policy here: stops at 17)
  while (dealerSum < 17){
    dealerCards.push(drawCard());
    dealerSum = calculateSum(dealerCards);
    renderHands(true);
  }
  dealerAlive = false;
  endRound();
}

// determine winner and update chips
function endRound(){
  renderHands(true);

  playerSum = calculateSum(playerCards);
  dealerSum = calculateSum(dealerCards);

  let message = "";

  if (playerSum > 21){
    message = "Busted! Dealer wins 😭";
    updateChips(-100);
  } else if (dealerSum > 21){
    message = "Dealer busted! You win 🥳";
    updateChips(100);
  } else if (playerSum > dealerSum){
    message = "You win 🥳";
    updateChips(100);
  } else if (playerSum < dealerSum){
    message = "Dealer wins 😭";
    updateChips(-100);
  } else {
    message = "Push! It's a tie 🤝";
  }

  document.getElementById("message-el").textContent = message;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  startBtn.disabled = false;

  // if out of money, disable start/hit/stand and enable buy-in
  if (player.chips <= 0){
    startBtn.disabled = true;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    document.getElementById("message-el").textContent = "🚫 Out of chips. Use BUY-IN to continue.";
  }
}

function updateChips(amount){
  player.chips += amount;
  localStorage.setItem("blackJackChips", player.chips);
  document.getElementById("player-el").textContent = player.name + ": $" + player.chips;
}

function buyIn(){
  const input = prompt("Amount to Buy-in:");
  if (input === null) return;
  const num = parseInt(input.trim());
  if (isNaN(num) || num <= 0){
    alert("Please enter a valid amount greater than 0.");
    return;
  }
  player.chips += num;
  localStorage.setItem("blackJackChips", player.chips);
  document.getElementById("player-el").textContent = player.name + ": $" + player.chips;
  document.getElementById("message-el").textContent = "Buy-in added! Ready to play.";
  if (player.chips > 0) startBtn.disabled = false;
}

startBtn.addEventListener("click", startGame);
hitBtn.addEventListener("click", playerHit);
standBtn.addEventListener("click", playerStand);
buyBtn.addEventListener("click", buyIn);


(function initUI(){
  renderHands(false);
  if (player.chips <= 0){
    startBtn.disabled = true;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    document.getElementById("message-el").textContent = "🚫 You need more chips to play! Use 'BUY-IN'.";
  } else {
    startBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
  }
})();
