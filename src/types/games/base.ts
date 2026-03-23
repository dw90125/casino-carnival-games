export interface IGameConfig {
    numSeats: number;
    handSize: number;
    masterDeck: string[];
}

export interface IBaseWager {}

export interface IBasePayout {}

export interface IHand {
    cards: string[];
    name: string;
    eqv: number;
}

export interface IDealer {
    hand: IHand;
    qualify: boolean;
}

export interface ISeat<T extends IBaseWager, P extends IBasePayout> {
    taken: boolean;
    player: boolean;
    hand: IHand;
    wager: T;
    payout: P;
    result:string;
}

export interface IPlayerIntent<T extends IBaseWager> {
    seatIndex: number;
    wager: T;
}

export interface IGameOutcome {
    dealer: {
        cards: string[];
        name: string;
        qualify: boolean;
    };
    player: {
        cards: string[];
        name: string;
        result: string;
        payout: number;
    }
}
