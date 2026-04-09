import { IGameConfig, IBaseWager, IBasePayout, IBaseHand, ISeat, IDealer, IGameOutcome } from "../types/games/base.js";

export abstract class CasinoGame<H extends IBaseHand, T extends IBaseWager, P extends IBasePayout> {
    protected abstract config: IGameConfig;
    protected abstract dealer: IDealer<H>;
    protected abstract seats: ISeat<H, T, P>[];

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
        const player = this.seats.find(seat => seat.player) as ISeat<H, T, P>;

        let base = 0;
        let bonus = 0;

        for (const [key, val] of Object.entries(player.payout)) {
            const amount = val as number;
            if (key == 'ante' || key == 'play') {
                base += amount;
            } else {
                bonus += amount;
            }
        }

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
                payout: {
                    base: base,
                    bonus: bonus,
                    total: base + bonus
                }
            }
        };
    }

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
