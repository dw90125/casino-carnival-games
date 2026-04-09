import { ISeat, IDealer } from "../../types/games/base.js";
import { IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout } from "../../types/games/high-card-flush.js";

import { BasicEvaluator } from "../../evaluators/basic/engine.js";
import { Enums as HCFEnums } from  "../../enums/high-card-flush.js";

const evaluateHand = (hand: IHighCardFlushHand): IHighCardFlushHand => {
    const basicev = new BasicEvaluator(hand.cards);

    let best_eqv: number = 9999;
    let best_len: number = 0; // really you'll never have worse than a two-card flush, though.

    const suit_tokens: Record<string, string> = basicev.suit_tokens();

    for (const token of Object.values(suit_tokens)) {
        const eqv = HCFEnums.FLUSHES.indexOf(token);
        if ((eqv > -1) && (eqv < best_eqv)) {
            best_eqv = eqv;
            best_len = token.length;
        }
    }

    return {
        ...hand,
        name: `${best_len}-Card Flush`,
        eqv: best_eqv
    };
};

const dealerQualifies = (hand: IHighCardFlushHand): boolean => {
    return (hand.eqv <= 5684); // 9-3-2 or better
};

const play = (seat: ISeat<IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout>, dealer: IDealer<IHighCardFlushHand>): void => {
    // first, is this hand worthy of play at all?
    // from wizardofodds.com:
    // 1. Make raise with T-8-6 flush or better.
    // 2. Fold all other.

    seat.payout.ante = 0;
    seat.payout.play = 0;

    // High-Card Flush "allows" a pressed raise for longer flushes.
    // I say *allows* because there's no way the player wouldn't take advantage of the 2x or 3x.
    if (seat.hand.eqv <= 3431) { // 6 card flush or better
        seat.wager.play = 3 * seat.wager.ante;
    } else if (seat.hand.eqv <= 4718) { // 5 card flush or better
        seat.wager.play = 2 * seat.wager.ante;
    } else if (seat.hand.eqv <= 5644) { // T86 or better
        seat.wager.play = 1 * seat.wager.ante;
    } else {
        seat.result = "fold";
        return;
    }

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
};

const flush = (seat: ISeat<IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout>): void => {
    seat.payout.flush = 0;

    if (seat.hand.eqv >= 0) {
        if (seat.hand.eqv <= 1715) { // 7-card 300:1
            seat.payout.flush = (seat.wager.flush * 301);
        } else if (seat.hand.eqv <= 3431) { // 6-card 100:1
            seat.payout.flush = (seat.wager.flush * 101);
        } else if (seat.hand.eqv <= 4718) { // 5-card 10:1
            seat.payout.flush = (seat.wager.flush * 11);
        } else if (seat.hand.eqv <= 5433) { // 4-card 1:1
            seat.payout.flush = (seat.wager.flush * 2);
        }
    }
}

const sf = (seat: ISeat<IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout>): void => {
    const basicev = new BasicEvaluator(seat.hand.cards);
    
    // the "straight-flush bonus" doesn't really care about the larger game.
    // if your hand has a straight-flush of 3 or more, then you get the bonus,
    // even if you FOLD the hand.
    //    
    // So, let's run a second separate evaluation just for this bonus.
    seat.payout.sf = 0;

    const PAYOUTS = [
        { len: 7, mult: 8001 },
        { len: 6, mult: 1001 },
        { len: 5, mult: 101 },
        { len: 4, mult: 61 },
        { len: 3, mult: 8 }
    ] as const;

    const suit_bits: Record<string, string> = basicev.suit_bits();

    const bitStrings = Object.values(suit_bits);
    const winningTier = PAYOUTS.find(({ len }) => 
        // since an Ace can be part of both Ace-high and Ace-low straights, copy its bit to the end for efficiency
        bitStrings.some(bits => (bits + bits.charAt(0)).includes('1'.repeat(len)))
    );

    if (winningTier) {
        seat.payout.sf = seat.wager.sf * winningTier.mult;
    }
}

export const GameResolvers = {
    evaluateHand,
    dealerQualifies,
    play,
    flush,
    sf
};
