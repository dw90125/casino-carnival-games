import { ISeat, IDealer } from "@/types/games/base";
import { IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout } from "@/types/games/three-card-poker";

import { CactusKevEvaluator } from "@/evaluators/cactuskev/engine";
import { Enums as CactusKevEnums3 } from "@/enums/three-card-poker";
import { Enums as CactusKevEnums5 } from "@/enums/five-card-poker";

const evaluateHand = (hand: IThreeCardPokerHand): IThreeCardPokerHand => {
	const cactuskev3 = new CactusKevEvaluator(CactusKevEnums3);

    const eqv = cactuskev3.evaluate(hand.cards);

    return {
        ...hand,
        name: CactusKevEnums3.HAND_NAMES(eqv),
        eqv: eqv
    };
};

const dealerQualifies = (hand: IThreeCardPokerHand): boolean => {
    return (hand.eqv <= 629); // Q-3-2 or better
};

const play = (seat: ISeat<IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout>, dealer: IDealer<IThreeCardPokerHand>): void => {
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

const pp = (seat: ISeat<IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout>): void => {
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

const six = (seat: ISeat<IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout>, dealer: IDealer<IThreeCardPokerHand>): void => {
    const cactuskev5 = new CactusKevEvaluator(CactusKevEnums5);

    seat.payout.six = 0;
    
    const six_card_hand = [...seat.hand.cards, ...dealer.hand.cards];

    let best_eqv = 9999;
    for (let i = 0; i < 6; i++) {
        const five_card_hand = [...six_card_hand.slice(0, i), ...six_card_hand.slice(i + 1)];
        const eqv = cactuskev5.evaluate(five_card_hand);
        if (eqv < best_eqv) {
            best_eqv = eqv;
        }
    }
    
    if (best_eqv > 0) {
        if (best_eqv == 1) { // ROYAL 1000:1
            seat.payout.six = (seat.wager.six * 1001);
        } else if (best_eqv <= 10) { // SF 200:1
            seat.payout.six = (seat.wager.six * 201);
        } else if (best_eqv <= 166) { // QUADS 50:1
            seat.payout.six = (seat.wager.six * 51);
        } else if (best_eqv <= 322) { // FULL HOUSE 25:1
            seat.payout.six = (seat.wager.six * 26);
        } else if (best_eqv <= 1599) { // FLUSH 20:1
            seat.payout.six = (seat.wager.six * 21);
        } else if (best_eqv <= 1609) { // STRAIGHT 10:1
            seat.payout.six = (seat.wager.six * 11);
        } else if (best_eqv <= 2467) { // TRIPS 5:1}
            seat.payout.six = (seat.wager.six * 6);
        }
    }
}

export const prog = (seat: ISeat<IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout>): void => {
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

export const GameResolvers = {
    evaluateHand,
    dealerQualifies,
    play,
    pp,
    six,
    prog
};
