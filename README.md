# Black-Jack-Web-game

# Single Player Blackjack

A simplified, single-player version of Blackjack where the challenge is to reach 21 without going over. The game also includes a **buy-in system** where players start with chips and use them to play rounds.

## Features

* Single-player Blackjack (no dealer).
* Buy-in system with starting chips.
* Random card draws with correct Blackjack values:

  * Number cards = face value
  * Face cards = 10
  * Ace = 1 or 11 (whichever fits best).
* Automatic bust detection (over 21 = instant loss).
* Instant win if the player hits exactly 21.
* Player balance updates after each round.

## Rules

1. Player buys in with chips before starting.
2. Each round begins with two random cards.
3. Player can *Hit* (draw another card) or *Stand* (end the round).
4. If the player’s total exceeds 21, they bust and lose their buy-in for that round.
5. If the player hits 21, they instantly win and their balance increases.
6. If the player stands below 21, the outcome depends on how close they are to 21.

## Objective

Play strategically, manage your chips wisely, and aim to hit 21 without going over.

## Tech Stack

* HTML, CSS, JavaScript

## How to Run

1. Clone the repository.
2. Open `index.html` in your browser.
3. Buy in, play your hand, and test your luck with 21!
