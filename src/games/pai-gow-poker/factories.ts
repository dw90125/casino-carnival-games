import { ISeat, IDealer } from "../../types/games/base.js";
import { IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout } from "../../types/games/pai-gow-poker.js";

const createEmptyHand = (): IPaiGowPokerHand => ({
    cards: [],
    top: { cards: [], eqv: 9999 },
    bottom: { cards: [], eqv: 9999 }
});

const createEmptyWager = (): IPaiGowPokerWager => ({
    ante: 0, fortune: 0, acehigh: 0, prog: 0
});

const createEmptyPayout = (): IPaiGowPokerPayout => ({
    ante: 0, fortune: 0, acehigh: 0, prog: 0
});

const createEmptySeat = (): ISeat<IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout> => ({
    taken: false,
    player: false,
    hand: createEmptyHand(),
    wager: createEmptyWager(),
    payout: createEmptyPayout(),
    result: ''
});

const createEmptyDealer = (): IDealer<IPaiGowPokerHand> => ({
    hand: createEmptyHand(),
    qualify: true
});

export const GameFactories = {
    createEmptyHand,
    createEmptyWager,
    createEmptyPayout,
    createEmptySeat,
    createEmptyDealer
};
