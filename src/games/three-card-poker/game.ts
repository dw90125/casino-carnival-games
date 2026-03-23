import { CasinoGame } from "../../classes/casinogame.js";
import { IGameConfig, IPlayerIntent, IHand, ISeat, IDealer } from "../../types/games/base.js";
import { IThreeCardPokerWager, IThreeCardPokerPayout } from "../../types/games/three-card-poker.js";
import * as Resolver from './resolvers.js';

export class ThreeCardPoker extends CasinoGame<IThreeCardPokerWager, IThreeCardPokerPayout> {
    public static readonly gameConfig: IGameConfig = {
        numSeats: 6,
        handSize: 3,
        masterDeck: Resolver.cactusDeck
    };

    protected config: IGameConfig = ThreeCardPoker.gameConfig;
    protected dealer: IDealer;
    protected seats: ISeat<IThreeCardPokerWager, IThreeCardPokerPayout>[] = [];

    constructor(intent: IPlayerIntent<IThreeCardPokerWager>) {
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
        this.dealer.hand = Resolver.evaluateHand(this.dealer.hand);
        this.dealer.qualify = (this.dealer.hand.eqv <= 629);

        // now each "taken" seat.
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i].taken) {
                this.seats[i].hand = Resolver.evaluateHand(this.seats[i].hand);

                Resolver.play(this.seats[i], this.dealer);
                Resolver.pp(this.seats[i]);
                Resolver.six(this.seats[i], this.dealer);
                Resolver.prog(this.seats[i]);
            }
        }
    }

    // ------------------------------------------------------------------------------------------------
    // FACTORIES

    protected createEmptyHand = (): IHand => ({
        cards: [], name: '', eqv: 9999
    });

    protected createEmptyWager = (): IThreeCardPokerWager => ({
        ante: 0, play: 0, pp: 0, six: 0, prog: 0
    });

    protected createEmptyPayout = (): IThreeCardPokerPayout => ({
        ante: 0, play: 0, pp: 0, six: 0, prog: 0
    });

    protected createEmptySeat = (): ISeat<IThreeCardPokerWager, IThreeCardPokerPayout> => ({
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
