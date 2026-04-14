import { ISeat, IDealer } from "../../types/games/base.js";
import { IPaiGowPokerSplit, IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout } from "../../types/games/pai-gow-poker.js";

import { CactusKevEvaluator } from "../../evaluators/cactuskev/engine.js";
import { PaiGowPokerEnums } from "../../enums/pai-gow-poker.js";

const evaluateHand = (hand: IPaiGowPokerHand): IPaiGowPokerHand => {
    // Pai-Gow requires splitting the 7-card hand into a 5-card bottom ("back") hand and a 2-card top ("front") hand.
    // **The bottom hand must be stronger than the top hand.**

    // There are 12 ways to split 7 cards into a 5-card hand and a 2-card hand.  We need to evaluate all 12 splits and determine
    // which one is best for the player while conforming to this rule.

    const cactuskev5 = new CactusKevEvaluator(PaiGowPokerEnums);

    const candidates: IPaiGowPokerSplit[] = [];

    for (let i = 0; i < 7; i++) {
        for (let j = i + 1; j < 7; j++) {
            const top: string[] = [hand.cards[i], hand.cards[j]];
            const bottom: string[] = hand.cards.filter((_, index) => (index !== i && index !== j));

            // Evaluate the strength of the top and bottom hands
            const top_eqv = PaiGowPokerEnums.TWO_CARD_EQVS[rank_tokens(top)] || 9999;
            const bottom_eqv = cactuskev5.evaluate(bottom);

            if (bottom_eqv > top_eqv) continue; // this split is invalid since the bottom hand must be stronger than the top hand
            const c: IPaiGowPokerSplit = { top: { cards: top, eqv: top_eqv }, bottom: { cards: bottom, eqv: bottom_eqv } };
            candidates.push(c);
        }
    }

    const best = election(candidates);

    return {
        ...hand,
        top: best.top,
        bottom: best.bottom
    };
};

const dealerQualifies = (hand: IPaiGowPokerHand,): boolean => {
    return true; // dealer always qualifies in this game
};

const play = (seat: ISeat<IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout>, dealer: IDealer<IPaiGowPokerHand>): void => {
    // first, is this hand worthy of play at all?
    // from wizardofodds.com:
    // 1. Make raise with T-8-6 flush or better.
    // 2. Fold all other.

    seat.payout.ante = 0;

    if (false) { // TODO: implement the actual logic for this decision
        seat.result = "fold";
        return;
    }

    // if (seat.hand.eqv < dealer.hand.eqv) {
    //     seat.result = "win";
    //     seat.payout.ante = (seat.wager.ante * 2);
    // } else if (seat.hand.eqv > dealer.hand.eqv) {
    //     seat.result = "lose";
    // } else {
    //     seat.result = "push";
    //     seat.payout.ante = seat.wager.ante;
    // }
};

const fortune = (seat: ISeat<IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout>): void => {
    seat.payout.fortune = 0;

    // if (seat.hand.eqv >= 0) {
    //     //seat.payout.fortune = seat.wager.fortune;
    // }
}

const acehigh = (seat: ISeat<IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout>, dealer: IDealer<IPaiGowPokerHand>): void => {
    seat.payout.acehigh = 0;

    // if (seat.hand.eqv >= 0) {
    //     //seat.payout.acehigh = seat.wager.acehigh;
    // }
}

const prog = (seat: ISeat<IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout>): void => {
    seat.payout.prog = 0;

    // if (seat.hand.eqv >= 0) {
    //     //seat.payout.prog = seat.wager.prog;
    // }
}

const rank_tokens = (cards: string[]): string => {
    const RANKMAP: string[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

    const ranks: Record<string, number> = {};
    RANKMAP.forEach(r => ranks[r] = 0);

    for (const card of cards) {
        if (card == "*") continue;

        const r = card[0];
        if (r in ranks) ranks[r]++;
    }

    let tokens: string = (cards.includes("*")) ? "*" : "";
    for (const r of RANKMAP) {
        tokens += (ranks[r] > 0 ? r.repeat(ranks[r]) : '');
    }

    return tokens;
}

const election = (candidates: IPaiGowPokerSplit[]): IPaiGowPokerSplit => {
    candidates.sort((a, b) => a.top.eqv - b.top.eqv);

    //TODO: "House way" determinations go here.


    return candidates[0];
}

export const GameResolvers = {
    evaluateHand,
    dealerQualifies,
    play,
    fortune,
    acehigh,
    prog
};
