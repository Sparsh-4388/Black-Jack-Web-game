let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";

let initialChips = localStorage.getItem("blackJackChips");

if (initialChips === null || isNaN(parseInt(initialChips))) {
    initialChips = 20;
} else {
    initialChips = parseInt(initialChips);
}

let player = {
    name: "Player",
    chips: initialChips 
};

let gameDeck = []; 

document.getElementById("player-el").textContent = player.name + ": $" + player.chips;

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

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
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


function updateChips(amount) {
    player.chips += amount;
    localStorage.setItem("blackJackChips", player.chips);
    document.getElementById("player-el").textContent = player.name + ": $" + player.chips;

    if (player.chips <= 0) {  
        document.getElementById("start-el").disabled = true;
        document.getElementById("new-card-el").disabled = true;
        
        if (document.getElementById("buy-in-el")) {
            document.getElementById("buy-in-el").disabled = false;
        }
    } 
}

function render_game() {
    if (player.chips <= 0 && sum === 0) {
        return; 
    }
    
    document.getElementById("sum-el").textContent = sum;
    document.getElementById("cards-el").textContent = "Cards: ";
    for (let i = 0; i < cards.length; i++) {
        document.getElementById("cards-el").textContent += cards[i] + " ";
    }

    if (sum < 21) {
        message = "Do you want to draw a new card? 🙂";
        isAlive = true;
        document.getElementById("message-el").textContent = message;
    } else if (sum === 21) {
        message = "Wohooo! You've got BlackJack! 🥳";
        hasBlackJack = true;
        isAlive = false;
        document.getElementById("message-el").textContent = message;
        
        updateChips(100);

        setTimeout(() => {
            if (player.chips > 0) {
                resetGame();
            } else {
                enterDebtState();
            }
        }, 1500);
    } else {
        message = "You are out of the game! 😭";
        isAlive = false;
        document.getElementById("message-el").textContent = message;
        
        updateChips(-100);
        
        setTimeout(() => {
            if (player.chips > 0) {
                resetGame();
            } else {
                enterDebtState();
            }
        }, 1500);
    }
}

function enterDebtState() {
    isAlive = false; 
    document.getElementById("message-el").textContent = "🚫 Sorry, you are in debt! Please use the 'Buy-In' option to add funds and continue playing. 🚫";
    document.getElementById("cards-el").textContent = "Cards: ";
    document.getElementById("sum-el").textContent = "0";
    
    document.getElementById("start-el").disabled = true;
    document.getElementById("new-card-el").disabled = true;
    if (document.getElementById("buy-in-el")) {
        document.getElementById("buy-in-el").disabled = false;
    }
}


function start_game() {
    if (player.chips <= 0) {
        document.getElementById("message-el").textContent = "🚫 You need more chips to play! Use 'Buy-In'.";
        return; 
    }

    cards = [];
    hasBlackJack = false;
    isAlive = true;  

    gameDeck = createDeck();
    shuffleDeck(gameDeck);

    cards.push(getRandomCard(), getRandomCard());

    calculateScore();
    render_game();

    document.getElementById("start-el").disabled = true;
    document.getElementById("new-card-el").disabled = false;
}

function new_card() {
    if (isAlive && sum < 21 && player.chips > 0) {
        let card = getRandomCard();
        cards.push(card);
        
        calculateScore(); 
        render_game();
    } else if (player.chips <= 0) {
        document.getElementById("message-el").textContent = "🚫 You need more chips to play! Use 'Buy-In'.";
    }
}

function resetGame() {
    if (player.chips <= 0) return;

    cards = [];
    sum = 0;
    hasBlackJack = false;
    isAlive = false;
    message = "";

    document.getElementById("cards-el").textContent = "Cards: ";
    document.getElementById("sum-el").textContent = "0";
    document.getElementById("message-el").textContent = "Ready to play?";

    document.getElementById("start-el").disabled = false;
    document.getElementById("new-card-el").disabled = true;
}

function Buy_in() {
    const chipsInput = prompt("Amount to Buy-in: ");

    if (chipsInput === null || chipsInput.trim() === "") {
        alert("Buy-in cancelled!");
        return;
    }

    const newChipsAmount = parseInt(chipsInput.trim());

    if (isNaN(newChipsAmount) || newChipsAmount <= 0) { 
        alert("Please enter a valid amount greater than 0.");
        return;
    }

    player.chips = newChipsAmount;

    localStorage.setItem("blackJackChips", player.chips);
    document.getElementById("player-el").textContent = player.name + ": $" + player.chips;

    document.getElementById("start-el").disabled = false;
    document.getElementById("new-card-el").disabled = true;
    if (document.getElementById("buy-in-el")) {
        document.getElementById("buy-in-el").disabled = false;
    }

    document.getElementById("message-el").textContent = "Welcome back! Ready to play?";
    resetGame(); 
}

document.addEventListener("DOMContentLoaded", function() {
    if (player.chips <= 0) {
        document.getElementById("start-el").disabled = true;
        document.getElementById("new-card-el").disabled = true;
        if (document.getElementById("buy-in-el")) {
            document.getElementById("buy-in-el").disabled = false;
        }
        document.getElementById("message-el").textContent = "🚫 You need more chips to play! Use 'Buy-In'.";
        document.getElementById("cards-el").textContent = "Cards: ";
        document.getElementById("sum-el").textContent = "0";
    } else {
        document.getElementById("start-el").disabled = false;
        document.getElementById("new-card-el").disabled = true;
        if (document.getElementById("buy-in-el")) {
            document.getElementById("buy-in-el").disabled = false;
        }
        document.getElementById("message-el").textContent = "Ready to play?";
    }
});
