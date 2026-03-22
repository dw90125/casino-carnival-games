import * as CasinoGame from "../../types/games/three-card-poker.js";
import * as Init from './initializers.js';
import * as Resolver from './resolvers.js';

// ============================================================================================================================================================================
// PLAYER settings

// NOTES -- it's interesting to me that $300 usually ends poorly, but rebuying to $500 (total) yields better outcomes....
let stack = 300; // what is our initial bank?

const max_games = 50; // how many time will we play, regardless of bank?
const chicken = false; // if we get the big hit, do we run away?

const base_ante_bet = 10; // ante bet
const base_pp_bet = 10; // Pair Plus bet
const base_six_bet = 10; // 6-card bet
const base_prog_bet = 5; // progressive bet

const my_seat = 0; // num from 0 to 6 clockwise.
const my_other_seat = -1;

// ============================================================================================================================================================================
// GAME settings

const hand_size = 3; // cards per hand
const num_seats = 6;

// initialize the seats for this run.  Assume nobody sits down or gets up during the run.
const seats: CasinoGame.ISeat<CasinoGame.IThreeCardWager, CasinoGame.IThreeCardPayout>[] = [];

for (let i = 0; i < num_seats; i++) {
    seats[i] = Init.createEmptySeat();

    if (i == my_seat) {
        seats[i].taken = true;
    } else if (i == my_other_seat) {
        seats[i].taken = true;
    } else if (Math.random() >= .666667) { // 33% chance a seat is taken
        seats[i].taken = true;
    }
}

const dealer: CasinoGame.IDealer = { hand: Init.createEmptyHand(), qualify: false };

// ============================================================================================================================================================================
// Play the game!

console.log("======================================================================");
console.log(`Starting Three-Card Poker with \$${stack}`);
console.log("");

console.log(`Ante: \$${base_ante_bet}`);
console.log(`Pair Plus: \$${base_pp_bet}`);
console.log(`Six-Card: \$${base_six_bet}`);
console.log(`Progressive: \$${base_prog_bet}`);
console.log("");

let game: number;
for (game = 0; game < max_games; game++) {
    // reset dealer:
    dealer.hand = Init.createEmptyHand();
    dealer.qualify = false;

    // reset players:
    let wager = 0;
    for (let i = 0; i < seats.length; i++) {
        seats[i].hand = Init.createEmptyHand();
        seats[i].wager = Init.createEmptyWager();
        seats[i].payout = Init.createEmptyPayout();
        seats[i].result = '';

        // how much is wagered this game by the player?
        if (seats[i].taken) {
            seats[i].wager.ante = base_ante_bet;
            seats[i].wager.pp = base_pp_bet;
            seats[i].wager.six = base_six_bet;
            seats[i].wager.prog = base_prog_bet;
            seats[i].wager.play = 0;

            if (i == my_seat || i == my_other_seat) {
                wager += Object.values(seats[i].wager).reduce((sum, val) => sum + val, 0);
            }
        }
    }

    if (stack < wager) break; // uh oh!  We can't afford to play.

    // debit the bank to play the game
    stack -= wager;

    // create and shuffle the shoe
    const shoe = [...Resolver.masterDeck];

    for (let i = shoe.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
    }

    // deal the cards!
    for (let i = 0; i < seats.length; i++) {
        if (seats[i].taken) {
            seats[i].hand.cards = shoe.splice(0, hand_size);
        }
    }

    // lastly the dealer
    dealer.hand.cards = shoe.splice(0, hand_size);

    // now evaluate all hands:
    dealer.hand = Resolver.evaluateHand(dealer.hand);
    dealer.qualify = (dealer.hand.eqv <= 629);

    let payout = 0;
    for (let i = 0; i < seats.length; i++) {
        if (seats[i].taken) {
            seats[i].hand = Resolver.evaluateHand(seats[i].hand);
            Resolver.play(seats[i], dealer);
            Resolver.pp(seats[i]);
            Resolver.six(seats[i], dealer);
            Resolver.prog(seats[i]);

            if (i == my_seat || i == my_other_seat) {
                payout += Object.values(seats[i].payout).reduce((sum, val) => sum + val, 0);
            }
        }
    }

    // credit the bank with any payouts
    stack += payout;

    console.log("======================================================================");
    console.log("");
    console.log(`hand ${game + 1}`);
    console.log("");

    for (let i = 0; i < seats.length; i++) {
        let outcome = "";
        if (i == my_seat || i == my_other_seat) {
            outcome += "ME   : ";
        } else {
            outcome += `${i}    : `;
        }

        if (seats[i].taken) {
            outcome += `${JSON.stringify(seats[i].hand.cards)} -- `;
            outcome += `${seats[i].hand.name} -- `;
            outcome += `${JSON.stringify(seats[i].wager)} -- `;
            outcome += `${seats[i].result} -- `;
            outcome += `${JSON.stringify(seats[i].payout)}`;
        }

        console.log(outcome);
    }

    let house = "HOUSE: ";
    house += `${JSON.stringify(dealer.hand.cards)} -- `;
    house += `${dealer.hand.name} (${dealer.qualify ? "qualifies" : "no qualify"})`;
    console.log(house);
}

