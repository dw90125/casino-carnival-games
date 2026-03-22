import * as CasinoGame from "../../types/games/three-card-poker.js";
import { BasicEvaluator } from "../../evaluators/basic.js";
import { BasicConfig } from "../../config/basic/five-card-poker.js";
import { CactusKevEvaluator } from "../../evaluators/cactuskev.js";
import { CactusKevConfig } from "../../config/cactuskev/three-card-poker.js";

const cactuskev = new CactusKevEvaluator(CactusKevConfig);
const basicev = new BasicEvaluator(BasicConfig);

const getHandName = (eqv: number): string => {
    if (eqv <= 12) return "Straight Flush";
    if (eqv <= 25) return "Three of a Kind";
    if (eqv <= 37) return "Straight";
    if (eqv <= 311) return "Flush";
    if (eqv <= 467) return "Pair";
    return "High Card";
};

export const masterDeck = Object.keys(CactusKevConfig.DECK);

export const evaluateHand = (hand: CasinoGame.IHand): CasinoGame.IHand => {
    const eqv = cactuskev.evaluate(hand.cards);

    return {
        ...hand,
        eqv: eqv,
        name: getHandName(eqv)
    };
};

export const play = (seat: CasinoGame.ISeat<CasinoGame.IThreeCardWager, CasinoGame.IThreeCardPayout>, dealer: CasinoGame.IDealer): void => {
    // first, is this hand worthy of play at all?
    // from wizardofodds.com:
    // 1. Make raise with Q-6-4 or higher.
    // 2. Fold all other.

    seat.payout.ante = 0;
    seat.payout.play = 0;

    if (seat.hand.eqv > 621) {
        seat.result = "fold";
        return;
    }

    seat.wager.play = 1 * seat.wager.ante; // raise to continue playing

    if (!dealer.qualify) { // if the dealer doesn't qualify the player gets paid regardless of hand!
        seat.result = "no-qualify";
        seat.payout.ante = (seat.wager.ante * 2);
        seat.payout.play = seat.wager.play;
    } else if (seat.hand.eqv < dealer.hand.eqv) {
        seat.result = "win";
        seat.payout.ante = (seat.wager.ante * 2);
        seat.payout.play = (seat.wager.play * 2);
    } else if (seat.hand.eqv > dealer.hand.eqv) {
        seat.result = "lose";
    } else {
        seat.result = "push";
        seat.payout.ante = seat.wager.ante;
        seat.payout.play = seat.wager.play;
    }

    // ante bonus!  High-rank hands earn a multiple on the ante
    if (seat.hand.eqv <= 12) { // SF 5:1
        seat.payout.ante += (seat.wager.ante * 5);
    } else if (seat.hand.eqv <= 25) { // TRIPS 4:1
        seat.payout.ante += (seat.wager.ante * 4);
    } else if (seat.hand.eqv <= 37) { // STR 1:1
        seat.payout.ante += seat.wager.ante;
    }
};

export const pp = (seat: CasinoGame.ISeat<CasinoGame.IThreeCardWager, CasinoGame.IThreeCardPayout>): void => {
    seat.payout.pp = 0;

    if (seat.hand.eqv > 0) {
        if (seat.hand.eqv <= 12) { // SF 40:1
            seat.payout.pp = (seat.wager.pp * 41);
        } else if (seat.hand.eqv <= 25) { // TRIPS 30:1
            seat.payout.pp = (seat.wager.pp * 31);
        } else if (seat.hand.eqv <= 37) { // STR 5:1
            seat.payout.pp = (seat.wager.pp * 6);
        } else if (seat.hand.eqv <= 311) { // FLUSH 4:1
            seat.payout.pp = (seat.wager.pp * 5);
        } else if (seat.hand.eqv <= 467) { // PAIR 1:1
            seat.payout.pp = (seat.wager.pp * 2);
        }
    }
}

export const six = (seat: CasinoGame.ISeat<CasinoGame.IThreeCardWager, CasinoGame.IThreeCardPayout>, dealer: CasinoGame.IDealer): void => {
    seat.payout.six = 0;

    const six_card_hand = [...seat.hand.cards, ...dealer.hand.cards];

    basicev.set_hand(six_card_hand);
    
    if (basicev.has_royal_flush()) {
        seat.payout.six = (seat.wager.six * 1001);
    } else if (basicev.has_straight_flush()) {
        seat.payout.six = (seat.wager.six * 201);
    } else if (basicev.has_quads()) {
        seat.payout.six = (seat.wager.six * 51);
    } else if (basicev.has_full_house()) {
        seat.payout.six = (seat.wager.six * 26);
    } else if (basicev.has_flush()) {
        seat.payout.six = (seat.wager.six * 21);
    } else if (basicev.has_straight()) {
        seat.payout.six = (seat.wager.six * 11);
    } else if (basicev.has_trips()) {
        seat.payout.six = (seat.wager.six * 6);
    }
}

export const prog = (seat: CasinoGame.ISeat<CasinoGame.IThreeCardWager, CasinoGame.IThreeCardPayout>): void => {
    //TODO: many progressives have an "envy" for the jackpot wagers.  I haven't added that yet.
    seat.payout.prog = 0;

    if (seat.hand.eqv > 0) {
        if (seat.hand.eqv == 1) { // ROYAL 40:1
            if (seat.hand.cards.includes("AS")) { // MAJOR JACKPOT.  Simulate a payout between $5000 and $7500
                seat.payout.prog = Math.ceil(Math.random() * 2500) + 5000;
            } else { // MINOR JACKPOT.  Simulate a payout between $2500 and $5000
                seat.payout.prog = Math.ceil(Math.random() * 2500) + 2500;
            }
        } else if (seat.hand.eqv <= 12) { // SF 70:1
            seat.payout.prog = (seat.wager.prog * 70);
        } else if (seat.hand.eqv <= 25) { // TRIPS 30:1
            seat.payout.prog = (seat.wager.prog * 60);
        } else if (seat.hand.eqv <= 37) { // STR 6:1
            seat.payout.prog = (seat.wager.prog * 6);
        }
    }
}

