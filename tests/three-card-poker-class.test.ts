// tests/three-card-poker.test.ts
import { describe, it, expect } from 'vitest';
import { ThreeCardPoker } from '../src/games/three-card-poker/game.js';

describe('Three Card Poker - Payout Logic', () => {
    it('should pay 40:1 on Pair Plus for a Straight Flush', () => {
        // 1. Setup Intent
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, pp: 10, six: 5, prog: 5 }
        };

        const game = new ThreeCardPoker(intent);

        // 2. Initial Play (Deals random cards)
        game.play();

        // 3. THE HACK: Manually override the private hands for the test
        // We use (game as any) to bypass TypeScript's private/protected locks
        const internal = game as any;

        // Give the dealer a losing high card
        internal.dealer.hand.cards = ['4H', '7D', '9C'];

        // Let's give the player the Steel Wheel (A-2-3 of Spades)
        // Using your cactusDeck strings
        internal.seats[0].hand.cards = ['AS', '2S', '3S'];

        // 4. Resolve the rigged state
        const result = internal.resolve();

        // 5. Assertions
        // Pair Plus: $10 wager * 40:1 payout = $400 profit + $10 return = $410
        expect(internal.seats[0].payout.pp).toBe(410);
        //expect(internal.seats[0].result).toBe('win');
    });

    it('should pay 1000:1 on the 6-Card Bonus for a Royal Flush', () => {
        // 1. Set the Intent with a $5 6-card wager
        const intent = {
            seatIndex: 0,
            wager: { ante: 10, pp: 10, six: 5, prog: 5 }
        };

        const game = new ThreeCardPoker(intent);

        game.play();
        
        const internal = game as any;

        // Dealer has the finishers
        internal.dealer.hand.cards = ['JS', 'TS', '9H']; // 9H is a throwaway

        // 2. THE RIG: Split a Royal Flush across both hands
        // Player has the Broadway starters
        internal.seats[0].hand.cards = ['AS', 'KS', 'QS'];

        // 3. Resolve
        internal.resolve();

        // 4. Assertions
        // BasicEvaluator should see: AS, KS, QS, JS, TS (Royal Flush)
        // Payout: $5 wager * 1000:1 = $5000 profit + $5 return = $5005
        expect(internal.seats[0].payout.six).toBe(5005);
    });
});