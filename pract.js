
let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

let player = {
    name: "Player",
    chips: 20
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
    document.getElementById("player-el").textContent = player.name + ": $" + player.chips;
}

function refresh(){
    location.reload(); 
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
        updateChips(10); 
        setTimeout(refresh, 1000);
    }
    else {
        message = "You are out of the game! 😭"
        isAlive = false
        updateChips(-10); 
        setTimeout(refresh, 1000);
    }

    document.getElementById("message-el").textContent = message
    document.getElementById("sum-el").textContent = sum
    
    document.getElementById("cards-el").textContent = "Cards: "
    for(let i = 0; i < cards.length; i++){
        document.getElementById("cards-el").textContent += cards[i] + " "
    }

    if (!isAlive) {
        document.getElementById("start-el").disabled = false;
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