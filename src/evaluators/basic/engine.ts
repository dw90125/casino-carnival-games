/*
* Basic Poker Hand Evaluator.
* 
* Performs minimal checks on a poker hand by sorting the hand by ranks, suits,
* or both to establish matches with basic rules of poker.
* 
*/

export class BasicEvaluator {
    private readonly RANKS: string[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    private readonly SUITS: string[] = ['S', 'H', 'D', 'C'];

    private cards: string[] = [];

    constructor(cards: string[]) {
        this.cards = cards;
    }

    public identify(): string {
        if (this.has_five_aces()) {
            return "Five Aces";
        } else if (this.has_royal_flush()) {
            return "Royal Flush";
        } else if (this.has_straight_flush()) {
            return "Straight Flush";
        } else if (this.has_quads()) {
            return "Quads";
        } else if (this.has_full_house()) {
            return "Full House";
        } else if (this.has_flush()) {
            return "Flush";
        } else if (this.has_straight()) {
            return "Straight";
        } else if (this.num_trips() > 0) {
            return "Trips";
        } else if (this.num_pairs() >= 2) {
            return "Two Pair";
        } else if (this.num_pairs() == 1) {
            return "Pair";
        }

        return "High-Card";
    }

    public num_pairs(): number {
        const ranks = this.sort_ranks(true);
        return Object.values(ranks).filter(n => n === 2).length;
    }

    public num_trips(): number {
        const ranks = this.sort_ranks(true);
        return Object.values(ranks).filter(n => n === 3).length;
    }

    public has_trips(): boolean {
        const ranks = this.sort_ranks(true);
        return Object.values(ranks).includes(3);
    }

    public has_quads(): boolean {
        const ranks = this.sort_ranks(true);
        return Object.values(ranks).includes(4);
    }

    public has_full_house(): boolean {
        const trips = this.num_trips();
        const pairs = this.num_pairs();

        if (trips > 1) return true;
        return ((trips == 1) && (pairs > 0));
    }

    //----------------------------------------------------------------------------------------------------------------------
    // straights are where we get tough, especially with lots of cards (like 7).  a hand like A-9-8-7-6-5-2 is hard
    // to detect, and 5-4-3-2-A needs a special check.  Just slide a 5-card window across the rank_bits and check for 5 nonzero
    // ranks in a row.  If we have a wildcard, then we can allow for one gap in the sequence.

    public has_straight(): boolean {
        const hand_size = Math.min(this.cards.length, 5);

        const bits = this.rank_bits(true);

        for (let i = 0; i <= (bits.length - hand_size); i++) {
            const chk = bits.substring(i, i + hand_size).split('').reduce((a, b) => a + Number(b), 0);

            if (chk === hand_size) {
                return true;
            } else if ((chk === hand_size - 1) && this.cards.includes("*")) {
                return true;
            }
        }

        return false;
    }

    //----------------------------------------------------------------------------------------------------------------------
    // flush is "kinda" easy.  If there are 5 cards or less, then the suit count must equal the card count.
    // if there are MORE than 5 cards, then one suit needs at least 5 to qualify
    // JOKER SUPPORT -- if there are 4 cards, and the joker is in the hand, then we still have a flush

    public has_flush(): boolean {
        const hand_size = Math.min(this.cards.length, 5);

        const suits = this.sort_suits();

        for (const suit of this.SUITS) {
            const chk = suits[suit];

            if (chk >= hand_size) {
                return true;
            } else if ((chk === hand_size - 1) && this.cards.includes("*")) {
                return true;
            }
        }

        return false;
    }

    //----------------------------------------------------------------------------------------------------------------------
    // straight flushes are harder than has_straight and has_flush, because of 7-card hands.  Imagine KC-QC-JC-TD-9C-4C-3S.
    // There's a straight and a flush there, but not a straight flush.  Again, just slide a 5-card window across the suit bits
    // and check for a straight in there.  If we have a wildcard, then we can allow for one gap in the sequence.

    public has_straight_flush(): boolean {
        const hand_size = Math.min(this.cards.length, 5);

        for (const [suit, bits] of Object.entries(this.suit_bits(true))) {
            for (let i = 0; i <= (bits.length - hand_size); i++) {
                const chk = bits.substring(i, i + hand_size).split('').reduce((a, b) => a + Number(b), 0);

                if (chk === hand_size) {
                    return true;
                } else if ((chk === hand_size - 1) && this.cards.includes("*")) {
                    return true;
                }
            }
        }

        return false;
    }

    //----------------------------------------------------------------------------------------------------------------------
    // royal flushes may be the easiest.  you MUST have specific cards.  Look at the first 5 bits in each suit and see if
    // they total 5 (or 4 with a wildcard).

    public has_royal_flush(): boolean {
        const hand_size = Math.min(this.cards.length, 5);

        for (const [suit, bits] of Object.entries(this.suit_bits())) {
            const chk = bits.substring(0, hand_size).split('').reduce((a, b) => a + Number(b), 0);

            if (chk === hand_size) {
                return true;
            } else if ((chk === hand_size - 1) && this.cards.includes("*")) {
                return true;
            }
        }

        return false;
    }

    //----------------------------------------------------------------------------------------------------------------------
    // five aces is a fun part of wild-card poker
    public has_five_aces(): boolean {
        const ranks = this.sort_ranks(true);
        return (ranks['A'] === 5);
    }

    //---------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------
    // "tokens" can be useful sometimes for some games:
    public suit_tokens(): Record<string, string> {
        const matrix = this.sort_matrix();

        const tokens: Record<string, string> = {};

        this.SUITS.forEach(s => tokens[s] = "");

        for (const s of this.SUITS) {
            tokens[s] = this.RANKS.map(r => matrix[s][r] > 0 ? r : '').join('');
        }

        return tokens;
    }

    public suit_bits(wrap: boolean = false): Record<string, string> {
        const matrix = this.sort_matrix();

        const bits: Record<string, string> = {};

        this.SUITS.forEach(s => bits[s] = "");

        for (const s of this.SUITS) {
            bits[s] = this.RANKS.map(r => matrix[s][r] > 0 ? '1' : '0').join('').padStart(13, "0");

            if (wrap) {
                bits[s] = bits[s].concat(bits[s].charAt(0)); // for the ace-low straight.
            }
        }

        return bits;
    }

    //---------------------------------------------------------------------------------------------------------------------

    public rank_tokens(): string {
        let tokens: string = "";
        
        const ranks = this.sort_ranks();

        for (const r of this.RANKS) {
            tokens += (ranks[r] > 0 ? r.repeat(ranks[r]) : '');
        }

        return tokens;
    }

    public rank_bits(wrap: boolean = false): string {
        let bits: string = "";
        
        const ranks = this.sort_ranks();

        for (const r of this.RANKS) {
            bits += (ranks[r] > 0 ? '1' : '0');
        }

        bits = bits.padStart(13, "0");

        if (wrap) {
            bits = bits.concat(bits.charAt(0)); // for the ace-low straight.
        }

        return bits;
    }

    //---------------------------------------------------------------------------------------------------------------------
    // These methods solely count how many of each type we have.

    private sort_ranks(count_wildcard_as_ace: boolean = false): Record<string, number> {
        const ranks: Record<string, number> = {};

        this.RANKS.forEach(r => ranks[r] = 0);

        for (const card of this.cards) {
            if (card == "*") {
                if (count_wildcard_as_ace) ranks['A'] ++;
			    continue;
		    }
            
            const r = card[0];
            if (r in ranks) ranks[r]++;
        }

        return ranks;
    }

    private sort_suits(): Record<string, number> {
        const suits: Record<string, number> = {};

        this.SUITS.forEach(s => suits[s] = 0);

        for (const card of this.cards) {
            if (card == "*") continue;

            const s = card[1];
            if (s in suits) suits[s]++;
        }

        return suits;
    }

    private sort_matrix(): Record<string, Record<string, number>> {
        const matrix: Record<string, Record<string, number>> = {};

        this.SUITS.forEach(s => {
            matrix[s] = {};
            this.RANKS.forEach(r => matrix[s][r] = 0);
        });

        for (const card of this.cards) {
            if (card == "*") continue;

            let r = card[0];
            let s = card[1];

            if ((s in matrix) && (r in matrix[s])) {
                matrix[s][r]++;
            }
        }

        return matrix;
    }
}
