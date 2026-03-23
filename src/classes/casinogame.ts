import { IGameConfig, IBaseWager, IBasePayout, IHand, ISeat, IDealer, IGameOutcome } from "../types/games/base.js";

export abstract class CasinoGame<T extends IBaseWager, P extends IBasePayout> {
    protected abstract config: IGameConfig;
    protected abstract dealer: IDealer;
    protected abstract seats: ISeat<T, P>[];

    protected shoe: string[] = [];

    constructor() {}

    /**
     * The Main Orchestrator. 
     * Every game follows this flow, but defines the steps differently.
     */

    public play(): void {
        // Shuffle the Deck into a "shoe" for this deal.
        this.shuffle();

        // Deal out the cards to the seats
        this.deal();

        // Calculate the results
        this.resolve();
    }

    public outcome(): IGameOutcome {
        const player = this.seats.find(seat => seat.player) as ISeat<T, P>;

        return {
            dealer: {
                cards:this.dealer.hand.cards,
                name: this.dealer.hand.name,
                qualify: this.dealer.qualify
            },
            player: {
                cards: player.hand.cards,
                name: player.hand.name,
                result: player.result,
                payout: Object.values(player.payout).reduce((sum, val) => sum + val, 0)
            }
        };
    }

    // --- Internal Helpers (Common to all games) ---
    protected abstract createEmptyHand(): IHand;
    protected abstract createEmptyDealer(): IDealer;
    protected abstract createEmptySeat(): ISeat<T, P>;
    protected abstract createEmptyWager(): IBaseWager;
    protected abstract createEmptyPayout(): IBasePayout;

    // --- The Life-Cycle "Contract" ---

    /** Handle the shuffle and distribution of cards */
    protected abstract deal(): void;

    /** Calculate the winners and return the primary player's payout */
    protected abstract resolve(): void;

    /** Shuffling is common for all games.  No need to abstract it out **/
    protected shuffle(): void {
        // Create a fresh copy of the master deck
        this.shoe = [...this.config.masterDeck];
        
        // Fisher-Yates Shuffle
        for (let i = this.shoe.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shoe[i], this.shoe[j]] = [this.shoe[j], this.shoe[i]];
        }
    }
}
