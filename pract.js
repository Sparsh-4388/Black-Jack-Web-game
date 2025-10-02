
let cards = []

let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

let player = {
    name: "Player",
    chips: 145
}
document.getElementById("player-el").textContent = player.name + ": $" + player.chips



function getRandomCard() {
    let random = Math.floor(Math.random() * 13) + 1
    
    if(random === 1) {
        return 11
    }
    else if(random > 10){
        return 10
    }
    else{
        return random
    }
}

function start_game(){
    isAlive = true
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()

    cards.push(firstCard, secondCard)
    sum += cards[0] + cards[1]
    location.
    render_game()
    
}

function render_game(){

    if (sum <= 20) {
        message = "Do you want to draw a new card? 🙂"
    }
    else if(sum === 21) {
        message = "Wohooo! You've got BlackJack! 🥳"
        hasBlackJack = true
    }
    else {
        message = "YOu are out of the game! 😭"
        isAlive = false
    }

    document.getElementById("message-el").textContent = message
    document.getElementById("sum-el").textContent = sum

    document.getElementById("cards-el").textContent = "Cards: "
    for(let i = 0; i < cards.length; i++){
        document.getElementById("cards-el").textContent += cards[i] + " "
    }
}


function new_card(){

    if(isAlive == true && sum <= 20){
        let card = getRandomCard()
        sum += card
        cards.push(card)
        render_game()
    }
}
