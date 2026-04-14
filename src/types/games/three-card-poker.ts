import { IBaseWager, IBasePayout, IBaseHand } from "./base.js";

export interface IThreeCardPokerHand extends IBaseHand {
    eqv: number;
    name: string;
}

export interface IThreeCardPokerWager extends IBaseWager {
    ante: number;
    play?: number;
    pp: number;
    six: number;
    prog: number;
}

export interface IThreeCardPokerPayout extends IBasePayout {
    ante: number;
    play: number;
    pp: number;
    six: number;
    prog: number;
}
