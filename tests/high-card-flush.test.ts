import { describe, it, expect, beforeEach } from 'vitest';
import { HighCardFlush } from "../src/games/high-card-flush/game.js";

describe('High Card Flush - Payout Logic', () => {
    it('should see a 5-card Flush beats a 4-card Flush', () => {
        // 1. Setup Intent
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, flush: 10, sf: 5 }
        };

        const game = new HighCardFlush(intent);

        const internal = game as any;
        
        internal.play();

        internal.dealer.hand.cards = ["KC", "QC", "JC", "TD", "9C", "4C", "3D"];

        internal.seats[0].hand.cards = ["KS", "AS", "2S", "3S", "4S", "9H", "7D"];

        const result = internal.resolve();

        expect(internal.seats[0].result).toBe('win');
    });

    it('should pay 10:1 on Flush Bonus for a 5-card Flush', () => {
        // 1. Setup Intent
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, flush: 10, sf: 5 }
        };

        const game = new HighCardFlush(intent);

        const internal = game as any;
        
        internal.play();

        internal.dealer.hand.cards = ["KC", "QC", "JC", "TD", "9C", "4C", "3D"];

        internal.seats[0].hand.cards = ["KS", "AS", "2S", "3S", "4S", "9H", "7D"];

        const result = internal.resolve();

        expect(internal.seats[0].payout.flush).toBe(110);
    });

    it('should pay 60:1 on Straight-Flush Bonus for a 4-card Straight-Flush', () => {
        // 1. Setup Intent
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, flush: 10, sf: 5 }
        };

        const game = new HighCardFlush(intent);

        const internal = game as any;
        
        internal.play();

        internal.seats[0].hand.cards = ["KC", "AS", "2S", "3S", "4S", "9H", "7D"];

        const result = internal.resolve();

        expect(internal.seats[0].payout.sf).toBe(305);
    });

    it('should prioritize the 4-card Straight-Flush in a hand with a 4-card and a 3-card SF.', () => {
        // 1. Setup Intent
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, flush: 10, sf: 5 }
        };

        const game = new HighCardFlush(intent);

        const internal = game as any;
        
        internal.play();

        internal.seats[0].hand.cards = ["KC", "AC", "2S", "3S", "4S", "QC", "JC"];

        const result = internal.resolve();

        expect(internal.seats[0].payout.sf).toBe(305);
    });

});