let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""


let initialChips = localStorage.getItem("blackJackChips")

if(initialChips === null || isNaN(parseInt(initialChips))){
    initialChips = 20
}
else{
    initialChips = parseInt(initialChips)
}

let player = {
    name: "Player",
    chips: initialChips 
}

let gameDeck = []; 

document.getElementById("player-el").textContent = player.name + ": $" + player.chips

function createDeck() {
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    let deck = [];

    for (let i = 0; i < 4; i++) {
        for (const rankValue of ranks) {
            deck.push(rankValue); 
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    let currentIndex = deck.length;
    let randomIndex;

    while(currentIndex !== 0){
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex --

        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]]
    }
}

function getRandomCard() {
    return gameDeck.shift(); 
}


function calculateScore() {
    let score = 0;
    let aceCount = 0;

    for (const cardValue of cards) {
        score += cardValue;
        if (cardValue === 11) {
            aceCount++;
        }
    }

    while (score > 21 && aceCount > 0) {
        score -= 10; 
        aceCount--;
    }

    sum = score;
}

function updateChips(amount){
    player.chips += amount;

    localStorage.setItem("blackJackChips", player.chips)
    
    document.getElementById("player-el").textContent = player.name + ": $" + player.chips;
}


function resetGame() {
    document.getElementById("cards-el").textContent = "Cards: ";

    document.getElementById("sum-el").textContent = 0; 

    cards = [];
    sum = 0;
    hasBlackJack = false;
    isAlive = false; 
    
    document.getElementById("start-el").disabled = false;

    document.getElementById("message-el").textContent = "Click 'START GAME' to play a new round!";
}

function start_game(){
    cards = []
    hasBlackJack = false
    
    gameDeck = createDeck();
    shuffleDeck(gameDeck);

    cards.push(getRandomCard(), getRandomCard());

    calculateScore(); 
    render_game();

    document.getElementById("start-el").disabled = true 
}

function render_game(){

    if (sum < 21) {
        message = "Do you want to draw a new card? 🙂"
        isAlive = true
    }
    else if(sum === 21) {
        message = "Wohooo! You've got BlackJack! 🥳"
        hasBlackJack = true
        isAlive = false
        updateChips(100); 
        setTimeout(resetGame, 1500);
    }
    else {
        message = "You are out of the game! 😭"
        isAlive = false
        updateChips(-10); 
        setTimeout(resetGame, 1500);
    }

    document.getElementById("message-el").textContent = message
    document.getElementById("sum-el").textContent = sum
    
    document.getElementById("cards-el").textContent = "Cards: "
    for(let i = 0; i < cards.length; i++){
        document.getElementById("cards-el").textContent += cards[i] + " "
    }
}


function new_card(){

    if(isAlive == true && sum < 21){
        let card = getRandomCard()
        cards.push(card)
        
        calculateScore(); 
        render_game();
    }
}

function Buy_in() {
    const chipsInput = prompt("Amount Buy-in: ")

    if(chipsInput === null || chipsInput.trim() === ""){
        alert("Buy in cancelled!!")
        return
    }

    const newchipsAmount = parseInt(chipsInput)

    if(isNaN(chipsInput) || chipsInput <= 0){
        alert("Please enter the valid amount")
        return
    }

    player.chips = newchipsAmount

    localStorage.setItem("blackJackChips", player.chips)
    document.getElementById("player-el").textContent = player.name + ": $" + player.chips;
    
}