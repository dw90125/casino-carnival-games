import { IBaseWager, IBasePayout, IBaseHand } from "./base.js";

export interface IPaiGowPokerSplit {
    top: {
        cards: string[];
        eqv: number;
    },
    bottom: {
        cards: string[];
        eqv: number;
    }
}

export interface IPaiGowPokerHand extends IBaseHand, IPaiGowPokerSplit { }

export interface IPaiGowPokerWager extends IBaseWager {
    ante: number;
    fortune: number;
    acehigh: number;
    prog: number;
}

export interface IPaiGowPokerPayout extends IBasePayout {
    ante: number;
    fortune: number;
    acehigh: number;
    prog: number;
}
