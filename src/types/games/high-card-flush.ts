import { IBaseWager, IBasePayout, IBaseHand } from "./base.js";

export interface IHighCardFlushHand extends IBaseHand {
    eqv: number;
} 

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
