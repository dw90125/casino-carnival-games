import { IBaseWager, IBasePayout, IHand, ISeat, IDealer, ResolverFunction  } from "./base.js";

export { IBaseWager, IBasePayout, IHand, ISeat, IDealer, ResolverFunction };

export interface IThreeCardWager extends IBaseWager {
    ante: number;
    play: number;
    pp: number;
    six: number;
    prog: number;
}

export interface IThreeCardPayout extends IBasePayout {
    ante: number;
    play: number;
    pp: number;
    six: number;
    prog: number;
}
