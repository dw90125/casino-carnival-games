import { IBaseWager, IBasePayout, IHand, ISeat, IDealer, IGameOutcome } from "./base.js";

export interface IHighCardFlushWager extends IBaseWager {
    ante: number;
    play?: number;
    flush: number;
    sf: number;
}

export interface IHighCardFlushPayout extends IBasePayout {
    ante: number;
    play: number;
    flush: number;
    sf: number;
}
