/*
* Basic Poker Hand Evaluator.
* 
* Performs minimal checks on a poker hand by sorting the hand by ranks, suits,
* or both to establish matches with basic rules of poker.
* 
*/

export class BasicEvaluator {
    private RANK_ORDER:string[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
    private SUIT_ORDER:string[] = ["S", "H", "D", "C"];

    private hand:string[];
    private ranks:Record<string, number>;
    private suits:Record<string, number>;
    private matrix:Record<string, Record<string, number>>;

    constructor(hand: string[]) {
        this.hand = hand;

        this.ranks = this.sort_ranks();
        this.suits = this.sort_suits();
        this.matrix = this.sort_matrix();
    }

    public num_pairs():number {
        return Object.values(this.ranks).filter(n => n === 2).length;
    }

    public num_trips():number {
        return Object.values(this.ranks).filter(n => n === 3).length;
    }

    public has_trips():boolean {
        return Object.values(this.ranks).includes(3);
    }

    public has_quads():boolean {
        return Object.values(this.ranks).includes(4);
    }

    public has_full_house():boolean {
        const trips = this.num_trips();
        const pairs = this.num_pairs();

        if (trips > 1) return true;
        return ((trips == 1) && (pairs > 0));
    }

    //----------------------------------------------------------------------------------------------------------------------
    // straights are where we get tough, especially with lots of cards (like 7).  a hand like A-9-8-7-6-5-2 is hard
    // to detect, and 5-4-3-2-A needs a special check.

    public has_straight():boolean {
        const hand_size = Math.min(this.hand.length, 5);
        const bits = this.RANK_ORDER.map(r => this.ranks[r] > 0 ? '1' : '0');
        bits.push(bits[0]); // for the ace-low straight.

        return bits.join('').includes('1'.repeat(hand_size));
    }


    //----------------------------------------------------------------------------------------------------------------------
    // flush is "kinda" easy.  If there are 5 cards or less, then the suit count must equal the card count.
    // if there are MORE than 5 cards, then one suit needs at least 5 to qualify:
    public has_flush():boolean {
        const hand_size = Math.min(this.hand.length, 5);
        return Object.values(this.suits).some(n => n >= hand_size);
    }

    //----------------------------------------------------------------------------------------------------------------------
    // straight flushes are harder than has_straight and has_flush, because of 7-card hands.  Imagine KC-QC-JC-TD-9C-4C-3S.  There's a straight and a flush there, but not a straight flush.
    public has_straight_flush():boolean {
        const hand_size = Math.min(this.hand.length, 5);

        for (const [suit, ranks] of Object.entries(this.matrix)) {
            const bits = this.RANK_ORDER.map(r => ranks[r] > 0 ? '1' : '0');
            bits.push(bits[0]); // for the ace-low straight.

            if (bits.join('').includes('1'.repeat(hand_size))) return true;
        }

        return false;
    }

    //---------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------

    private sort_ranks(): Record<string, number> {
        const ranks: Record<string, number> = {};

        this.RANK_ORDER.forEach(r => ranks[r] = 0);

        for (const card of this.hand) {
            const r = card[0];
            if (r in ranks) ranks[r]++;
        }

        return ranks;
    }

    private sort_suits(): Record<string, number> {
        const suits: Record<string, number> = {};

        this.SUIT_ORDER.forEach(s => suits[s] = 0);

        for (const card of this.hand) {
            const s = card[1];
            if (s in suits) suits[s]++;
        }

        return suits;
    }

    private sort_matrix(): Record<string, Record<string, number>> {
        const matrix: Record<string, Record<string, number>> = {};

        this.SUIT_ORDER.forEach(s => {
            matrix[s] = {};
            this.RANK_ORDER.forEach(r => matrix[s][r] = 0);
        });

        for (const card of this.hand) {
            let r = card[0];
            let s = card[1];
            
            if ((s in matrix) && (r in matrix[s])) {
                matrix[s][r] += 1;
            }
        }

        return matrix;
    }
}