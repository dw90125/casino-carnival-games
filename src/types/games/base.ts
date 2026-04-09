export interface IGameConfig {
    numSeats: number;
    handSize: number;
    masterDeck: string[];
}

export interface IBaseWager {}

export interface IBasePayout {}

export interface IBaseHand {
    cards: string[];
    name: string;
}

export interface IDealer<H extends IBaseHand> {
    hand: H;
    qualify: boolean;
}

export interface ISeat<H extends IBaseHand, T extends IBaseWager, P extends IBasePayout> {
    taken: boolean;
    player: boolean;
    hand: H;
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
        payout: {base: number, bonus: number, total: number};
    }
}
