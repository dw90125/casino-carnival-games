import { CasinoGame } from "../../classes/casinogame.js";
import { IGameConfig, IPlayerIntent, ISeat, IDealer } from "../../types/games/base.js";
import { IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout } from "../../types/games/high-card-flush.js";
import { DECK } from "../../decks/52-card.js";
import { GameResolvers } from "./resolvers.js";
import { GameFactories } from "./factories.js";

export class HighCardFlush extends CasinoGame<IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout> {
    public static readonly gameConfig: IGameConfig = {
        numSeats: 6,
        handSize: 7,
        masterDeck: DECK
    };

    protected config: IGameConfig = HighCardFlush.gameConfig;
    protected dealer: IDealer<IHighCardFlushHand>;
    protected seats: ISeat<IHighCardFlushHand, IHighCardFlushWager, IHighCardFlushPayout>[] = [];

    constructor(intent: IPlayerIntent<IHighCardFlushWager>) {
        super();
        
        this.dealer = GameFactories.createEmptyDealer();

        for (let i = 0; i < this.config.numSeats; i++) {
            this.seats[i] = GameFactories.createEmptySeat();

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
        this.dealer.hand = GameResolvers.evaluateHand(this.dealer.hand);
        this.dealer.qualify = GameResolvers.dealerQualifies(this.dealer.hand);

        // now each "taken" seat.
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i].taken) {
                this.seats[i].hand = GameResolvers.evaluateHand(this.seats[i].hand);

                GameResolvers.play(this.seats[i], this.dealer);
                GameResolvers.flush(this.seats[i]);
                GameResolvers.sf(this.seats[i]);
            }
        }
    }
}