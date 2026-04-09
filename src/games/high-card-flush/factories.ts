import { ISeat, IDealer } from "../../types/games/base.js";
import { IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout } from "../../types/games/high-card-flush.js";

const createEmptyHand = (): IHighCardFlushHand => ({
    cards: [], name: '', eqv: 9999
});

const createEmptyWager = (): IHighCardFlushWager => ({
    ante: 0, play: 0, flush: 0, sf: 0
});

const createEmptyPayout = (): IHighCardFlushPayout => ({
    ante: 0, play: 0, flush: 0, sf: 0
});

const createEmptySeat = (): ISeat<IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout> => ({
    taken: false,
    player: false,
    hand: createEmptyHand(),
    wager: createEmptyWager(),
    payout: createEmptyPayout(),
    result: ''
});

const createEmptyDealer = (): IDealer<IHighCardFlushHand> => ({
    hand: createEmptyHand(),
    qualify: false
});

export const GameFactories = {
    createEmptyHand,
    createEmptyWager,
    createEmptyPayout,
    createEmptySeat,
    createEmptyDealer
};
