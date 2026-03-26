import { CasinoGame } from "../../classes/casinogame.js";
import { IGameConfig, IPlayerIntent, IHand, ISeat, IDealer } from "../../types/games/base.js";
import { IHighCardFlushWager, IHighCardFlushPayout } from "../../types/games/high-card-flush.js";
import { BasicConfig } from "../../evaluators/config/basic/five-card-poker.js";
import * as GameResolver from './resolvers.js';

export class HighCardFlush extends CasinoGame<IHighCardFlushWager, IHighCardFlushPayout> {
    public static readonly gameConfig: IGameConfig = {
        numSeats: 6,
        handSize: 7,
        masterDeck: BasicConfig.DECK
    };

    protected config: IGameConfig = HighCardFlush.gameConfig;
    protected dealer: IDealer;
    protected seats: ISeat<IHighCardFlushWager, IHighCardFlushPayout>[] = [];

    constructor(intent: IPlayerIntent<IHighCardFlushWager>) {
        super();
        
        this.dealer = this.createEmptyDealer();

        for (let i = 0; i < this.config.numSeats; i++) {
            this.seats[i] = this.createEmptySeat();

            if (i == intent.seatIndex) {
                this.seats[i].taken = true;
                this.seats[i].player = true;
                this.seats[i].wager = intent.wager;
            } else if (Math.random() >= .666667) { // 33% chance a seat is taken 
                this.seats[i].taken = true;
            }
        }
    }

    protected deal(): void {
        // deal to ALL slots, taken or not!
        for (let i = 0; i < this.seats.length; i++) {
            this.seats[i].hand.cards = this.shoe.splice(0, this.config.handSize);
        }

        // lastly the dealer
        this.dealer.hand.cards = this.shoe.splice(0, this.config.handSize);
    }

    protected resolve():void {
        // evaluate the dealer first.
        this.dealer.hand = GameResolver.evaluateHand(this.dealer.hand);
        this.dealer.qualify = GameResolver.dealerQualifies(this.dealer.hand);

        // now each "taken" seat.
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i].taken) {
                this.seats[i].hand = GameResolver.evaluateHand(this.seats[i].hand);

                GameResolver.play(this.seats[i], this.dealer);
                GameResolver.flush(this.seats[i]);
                GameResolver.sf(this.seats[i]);
            }
        }
    }

    // ------------------------------------------------------------------------------------------------
    // FACTORIES

    protected createEmptyHand = (): IHand => ({
        cards: [], name: '', eqv: 9999
    });

    protected createEmptyWager = (): IHighCardFlushWager => ({
        ante: 0, play: 0, flush: 0, sf: 0
    });

    protected createEmptyPayout = (): IHighCardFlushPayout => ({
        ante: 0, play: 0, flush: 0, sf: 0
    });

    protected createEmptySeat = (): ISeat<IHighCardFlushWager, IHighCardFlushPayout> => ({
        taken: false,
        player: false,
        hand: this.createEmptyHand(),
        wager: this.createEmptyWager(),
        payout: this.createEmptyPayout(),
        result: ''
    });

    protected createEmptyDealer = (): IDealer => ({
        hand: this.createEmptyHand(),
        qualify: false
    });
}