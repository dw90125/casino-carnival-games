// tests/three-card-poker.test.ts
import { describe, it, expect } from 'vitest';
import { ThreeCardPoker } from '../src/games/three-card-poker/game.js';

describe('Three Card Poker - Payout Logic', () => {
    it('should pay 40:1 on Pair Plus for a Straight Flush', () => {
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, pp: 10, six: 5, prog: 5 }
        };

        const game = new ThreeCardPoker(intent);
        
        const internal = game as any;
        
        internal.play();

        internal.dealer.hand.cards = ['4H', '7D', '9C'];

        internal.seats[0].hand.cards = ['AS', '2S', '3S'];

        const result = internal.resolve();

        expect(internal.seats[0].payout.pp).toBe(410);
        //expect(internal.seats[0].result).toBe('win');
    });

    it('should pay 1000:1 on the 6-Card Bonus for a Royal Flush', () => {
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, pp: 10, six: 5, prog: 5 }
        };

        const game = new ThreeCardPoker(intent);

        const internal = game as any;
        
        internal.play();

        internal.dealer.hand.cards = ['JS', 'TS', '9H']; // 9H is a throwaway

        internal.seats[0].hand.cards = ['AS', 'KS', 'QS'];

        internal.resolve();

        expect(internal.seats[0].payout.six).toBe(5005);
    });
});