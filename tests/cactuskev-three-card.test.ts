import { describe, it, expect, beforeEach } from 'vitest';
import { CactusKevEvaluator } from "../src/evaluators/cactuskev/engine.js";
import { Config as CactusKevConfig } from "../src/evaluators/cactuskev/three-card-poker.js";

describe('CactusKevEngine Internals', () => {
    const engine = new CactusKevEvaluator(CactusKevConfig) as any;

    it('identifies a 3-card Flush correctly', () => {
        const flushHand = ["KS", "9S", "4S"];
        expect(engine.is_flush(flushHand)).toBe(true);
    });

    it('identifies a Non-Flush correctly', () => {
        const mixedHand = ["AS", "9H", "TC"];
        expect(engine.is_flush(mixedHand)).toBe(false);
    });

    it('p_val: calculates the correct prime product for [2S, 2H, 3C]', () => {
        const mixedHand = ["2S", "2H", "3C"];
        const result = engine.p_val(mixedHand);
        expect(result).toBe(1);
    });

    it('q_val: calculates the correct rank bitmask for [2S, 3H, 7C]', () => {
        const mixedHand = ["2S", "3H", "7C"];
        const result = engine.q_val(mixedHand);
        expect(result).toBe(35);
    });

    it('identifies a 3-card Straight Flush correctly', () => {
        const flushHand = ["AS", "KS", "QS"];
        const result = engine.evaluate(flushHand);
        expect(engine.is_flush(flushHand)).toBe(true);
        expect(result).toBe(1);
    });

    it('returns a valid integer for a known hand (Trip Aces)', () => {
        const tripAces = ["AS", "AH", "AC"];
        const score = engine.evaluate(tripAces);

        expect(typeof score).toBe('number');
        expect(score).toBeGreaterThan(0);
    });

    it('ranks a Straight higher than a Flush (Lower score is better)', () => {
        const straight = ["AS", "KH", "QC"];
        const flush = ["5S", "7S", "JS"];

        const straightScore = engine.evaluate(straight) as number;
        const flushScore = engine.evaluate(flush) as number;

        expect(straightScore).toBeLessThan(flushScore);
    });

    it('ranks a Three of a Kind higher than a Straight', () => {
        const trips = ["AS", "AH", "AC"];
        const straight = ["TS", "JH", "QC"];

        const straightScore = engine.evaluate(straight) as number;
        const tripsScore = engine.evaluate(trips) as number;

        expect(tripsScore).toBeLessThan(straightScore);
    });

    it('correctly identifies the same hand strength regardless of suit (non-flush)', () => {
        const hand1 = ["2S", "2H", "5S"];
        const hand2 = ["2C", "2D", "5C"];

        expect(engine.evaluate(hand1)).toBe(engine.evaluate(hand2));
    });

    it('identifies a Straight Flush as stronger than a regular Flush', () => {
        const straightFlush = ["5S", "6S", "7S"];
        const highFlush = ["QH", "JH", "9H"];

        const sfScore = engine.evaluate(straightFlush) as number;
        const fScore = engine.evaluate(highFlush) as number;

        expect(sfScore).toBeLessThan(fScore);
    });

    it('The Real Wheel Test: A-2-3 vs Pair of Aces', () => {
        const wheel = ["AS", "2H", "3D"];
        const pairAces = ["AS", "AH", "2D"];

        const wheelScore = engine.evaluate(wheel);
        const pairAcesScore = engine.evaluate(pairAces);

        console.log(`Wheel Score: ${wheelScore}`);
        console.log(`Pair of Aces Score: ${pairAcesScore}`);

        // In 3-Card Poker, a Straight (Wheel) MUST beat a Pair.
        // Lower score = Stronger hand.
        expect(wheelScore).toBeLessThan(pairAcesScore);
    });

});