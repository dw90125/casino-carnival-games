import { CasinoGame } from "../../classes/casinogame.js";
import { IGameConfig, IPlayerIntent, ISeat, IDealer } from "../../types/games/base.js";
import { IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout } from "../../types/games/pai-gow-poker.js";
import { DECK } from "../../decks/52-card-with-joker.js";
import { GameResolvers } from './resolvers.js';
import { GameFactories } from './factories.js';

export class PaiGowPoker extends CasinoGame<IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout> {
    public static readonly gameConfig: IGameConfig = {
        numSeats: 6,
        handSize: 7,
        masterDeck: DECK
    };

    protected config: IGameConfig = PaiGowPoker.gameConfig;
    protected dealer: IDealer<IPaiGowPokerHand>;
    protected seats: ISeat<IPaiGowPokerHand, IPaiGowPokerWager, IPaiGowPokerPayout>[] = [];

    constructor(intent: IPlayerIntent<IPaiGowPokerWager>) {
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
        // Pai-Gow uses a random number generator to determine which "spot" gets dealt first, including the dealer.  "0" is the dealer.
        const first_spot = Math.floor(Math.random() * (this.config.numSeats + 1));

        for (let i = 0; i < (this.config.numSeats + 1); i++) {
            const seat_index = (first_spot + i) % (this.config.numSeats + 1);

            if (seat_index < this.config.numSeats) {
                this.seats[seat_index].hand.cards = this.shoe.splice(0, this.config.handSize);
            } else {
                this.dealer.hand.cards = this.shoe.splice(0, this.config.handSize);
            }
        }
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
                GameResolvers.fortune(this.seats[i]);
                GameResolvers.acehigh(this.seats[i], this.dealer);
                GameResolvers.prog(this.seats[i]);
            }
        }
    }
}