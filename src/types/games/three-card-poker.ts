import { IBaseWager, IBasePayout, IHand, ISeat, IDealer, IGameOutcome } from "./base.js";

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
