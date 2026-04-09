import { CasinoGame } from "@/classes/casinogame";
import { IGameConfig, IPlayerIntent, ISeat, IDealer } from "@/types/games/base";
import { IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout } from "@/types/games/three-card-poker";
import { DECK } from "@/decks/52-card";
import { GameResolvers } from './resolvers';
import { GameFactories } from './factories';

export class ThreeCardPoker extends CasinoGame<IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout> {
    public static readonly gameConfig: IGameConfig = {
        numSeats: 6,
        handSize: 3,
        masterDeck: DECK
    };

    protected config: IGameConfig = ThreeCardPoker.gameConfig;
    protected dealer: IDealer<IThreeCardPokerHand>;
    protected seats: ISeat<IThreeCardPokerHand, IThreeCardPokerWager, IThreeCardPokerPayout>[] = [];

    constructor(intent: IPlayerIntent<IThreeCardPokerWager>) {
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
        // deal only to occupied slots
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i].taken) {
                this.seats[i].hand.cards = this.shoe.splice(0, this.config.handSize);
            }
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
                GameResolvers.pp(this.seats[i]);
                GameResolvers.six(this.seats[i], this.dealer);
                GameResolvers.prog(this.seats[i]);
            }
        }
    }
}
