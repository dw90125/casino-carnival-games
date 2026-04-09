import { ISeat, IDealer } from "@/types/games/base";
import { IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout } from "@/types/games/three-card-poker";

const createEmptyHand = (): IThreeCardPokerHand => ({
    cards: [], name: '', eqv: 9999
});

const createEmptyWager = (): IThreeCardPokerWager => ({
    ante: 0, play: 0, pp: 0, six: 0, prog: 0
});

const createEmptyPayout = (): IThreeCardPokerPayout => ({
    ante: 0, play: 0, pp: 0, six: 0, prog: 0
});

const createEmptySeat = (): ISeat<IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout> => ({
    taken: false,
    player: false,
    hand: createEmptyHand(),
    wager: createEmptyWager(),
    payout: createEmptyPayout(),
    result: ''
});

const createEmptyDealer = (): IDealer<IThreeCardPokerHand> => ({
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

