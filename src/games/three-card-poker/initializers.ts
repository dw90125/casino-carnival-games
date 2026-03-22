import * as CasinoGame from "../../types/games/three-card-poker.js";

export const createEmptyHand = (): CasinoGame.IHand => ({
    cards: [], name: '', eqv: 9999
});

export const createEmptyWager = (): CasinoGame.IThreeCardWager => ({
    ante: 0, play: 0, pp: 0, six: 0, prog: 0
});

export const createEmptyPayout = (): CasinoGame.IThreeCardPayout => ({
    ante: 0, play: 0, pp: 0, six: 0, prog: 0
});

export const createEmptySeat = (): CasinoGame.ISeat<CasinoGame.IThreeCardWager, CasinoGame.IThreeCardPayout> => ({
    taken: false,
    hand: createEmptyHand(),
    wager: createEmptyWager(),
    payout: createEmptyPayout(),
    result: ''
});
