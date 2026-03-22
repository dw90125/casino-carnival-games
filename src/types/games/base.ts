export interface IBaseWager {}

export interface IBasePayout {}

export interface IHand {
    cards: string[];
    name: string;
    eqv: number;
}

export interface ISeat<T extends IBaseWager, P extends IBasePayout> {
    taken: boolean;
    hand: IHand;
    wager: T;
    payout: P;
    result:string;
}

export interface IDealer {
    hand: IHand;
    qualify: boolean;
}

export type ResolverFunction<T> = (wager: T, hand: IHand, dealer?: IDealer) => number;

