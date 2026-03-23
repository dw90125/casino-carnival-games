import { describe, it, expect, beforeEach } from 'vitest';
import { CactusKevEvaluator } from "../src/evaluators/engines/cactuskev.js";
import { CactusKevConfig } from "../src/evaluators/config/cactuskev/five-card-poker.js";

describe('CactusKevEngine Internals', () => {
    const engine = new CactusKevEvaluator(CactusKevConfig) as any;

    it('identifies a 5-card Flush correctly', () => {
        const flushHand = ["KS", "9S", "4S", "TS", "AS"];
        expect(engine.is_flush(flushHand)).toBe(true);
    });

    it('identifies a Non-Flush correctly', () => {
        const mixedHand = ["AS", "9H", "TC", "KS", "3D"];
        expect(engine.is_flush(mixedHand)).toBe(false);
    });

    it('p_val: calculates the correct prime product for [2S, 2H, 3C, 4D, 5S]', () => {
        const mixedHand = ["2S", "2H", "3C", "4D", "5S"];
        const result = engine.p_val(mixedHand);
        expect(result).toBe(26);
    });

    it('q_val: calculates the correct rank bitmask for [2S, 3H, 4C, 5D, 7S]', () => {
        const mixedHand = ["2S", "3H", "4C", "5D", "7S"];
        const result = engine.q_val(mixedHand);
        expect(result).toBe(47);
    });

    it('returns a valid integer for a known hand (Trip Aces)', () => {
        const tripAces = ["AS", "AH", "AC", "KS", "QH"];
        const score = engine.evaluate(tripAces);

        expect(typeof score).toBe('number');
        expect(score).toBeGreaterThan(0);
    });

    it('ranks a Full House higher than a Flush (Lower score is better)', () => {
        const fullHouse = ["AS", "AH", "AC", "KS", "KH"]; // Aces full of Kings
        const flush = ["2S", "5S", "7S", "9S", "JS"];     // Jack-high Flush

        const fhScore = engine.evaluate(fullHouse) as number;
        const flushScore = engine.evaluate(flush) as number;

        // In Cactus Kev, 1 is the best, 7462 is the worst.
        // Full House (ranks 167-322) should be less than Flush (ranks 323-1599)
        expect(fhScore).toBeLessThan(flushScore);
    });

    it('ranks a Straight higher than Three of a Kind', () => {
        const straight = ["TS", "JH", "QC", "KD", "AS"]; // Broadway Straight
        const trips = ["AS", "AH", "AC", "2D", "3S"];    // Trip Aces

        const straightScore = engine.evaluate(straight) as number;
        const tripsScore = engine.evaluate(trips) as number;

        expect(straightScore).toBeLessThan(tripsScore);
    });

    it('correctly identifies the same hand strength regardless of suit (non-flush)', () => {
        const hand1 = ["2S", "2H", "3C", "4D", "5S"];
        const hand2 = ["2C", "2D", "3S", "4H", "5C"];

        expect(engine.evaluate(hand1)).toBe(engine.evaluate(hand2));
    });

    it('identifies a Straight Flush as stronger than a regular Flush', () => {
        // 5-6-7-8-9 of Spades (Straight Flush)
        const straightFlush = ["5S", "6S", "7S", "8S", "9S"];

        // A-K-Q-J-9 of Hearts (Ace-High Flush, no straight)
        const highFlush = ["AH", "KH", "QH", "JH", "9H"];

        const sfScore = engine.evaluate(straightFlush) as number;
        const fScore = engine.evaluate(highFlush) as number;

        // A Straight Flush (ranks 1-10) is significantly stronger 
        // than a regular Flush (ranks 323-1599).
        expect(sfScore).toBeLessThan(fScore);
    });

});