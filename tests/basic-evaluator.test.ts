import { describe, it, expect, beforeEach } from 'vitest';
import { BasicEvaluator } from "../src/evaluators/basic/engine.js";
import { Enums as BasicEnums } from "../src/enums/basic.js";

describe('BasicEvaluator', () => {
  const engine = new BasicEvaluator(BasicEnums);

  it('identifies a basic 5-card straight', () => {
    const hand = ["6S", "5H", "4D", "3C", "2S"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(true);
  });

  it('identifies a 5-card straight in a 7-card hand', () => {
    // Testing your duplicate rank example
    const hand = ["2S", "2C", "3D", "4H", "5S", "6C", "6D"];
    engine.set_cards(hand);

    // It should find a 5-card straight (2-3-4-5-6)
    expect(engine.has_straight()).toBe(true);
  });

  it('identifies the Ace-low "Wheel" straight', () => {
    const hand = ["AS", "2H", "3D", "4C", "5S"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(true);
  });

  it('detects a Full House correctly (including the double-trips edge case)', () => {
    const hand = ["AS", "AH", "AC", "KS", "KH", "KC", "2D"];
    engine.set_cards(hand);

    expect(engine.has_full_house()).toBe(true);
  });

  it('asserts that a straight and a flush dont necessarily equal a straight-flush', () => {
    const hand = ["KC", "QC", "JC", "TD", "9C", "4C", "3S"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(true);
    expect(engine.has_flush()).toBe(true);
    expect(engine.has_straight_flush()).toBe(false);
  });

  it('asserts that a wheel is accounted for properly', () => {
    const hand = ["5S", "4S", "3S", "2S", "AS", "KH", "QD"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(true);
    expect(engine.has_flush()).toBe(true);
    expect(engine.has_straight_flush()).toBe(true);
  });

  it('asserts that a broadway is accounted for properly', () => {
    const hand = ["AS", "KS", "QS", "JS", "TH", "2D", "3C"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(true);
    expect(engine.has_flush()).toBe(false);
    expect(engine.has_straight_flush()).toBe(false);
  });

  it('asserts that overflows are accounted for properly', () => {
    const hand = ["2D", "4D", "6D", "8D", "TD", "QD", "AD"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(false);
    expect(engine.has_flush()).toBe(true);
  });

  it('asserts that wrap-arounds dont count', () => {
    const hand = ["KS", "AS", "2S", "3S", "4S", "9H", "7D"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(false);
    expect(engine.has_flush()).toBe(true);
    expect(engine.has_straight_flush()).toBe(false);
  });

  it('asserts that a royal is accounted for properly', () => {
    const hand = ["AS", "KS", "QS", "JS", "TH", "TS", "3C"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(true);
    expect(engine.has_flush()).toBe(true);
    expect(engine.has_straight_flush()).toBe(true);
    expect(engine.has_royal_flush()).toBe(true);
  });

  it('asserts that a royal is accounted for properly', () => {
    const hand = ["QC", "AC", "KC"];
    engine.set_cards(hand);

    expect(engine.has_straight()).toBe(true);
    expect(engine.has_flush()).toBe(true);
    expect(engine.has_straight_flush()).toBe(true);
    expect(engine.has_royal_flush()).toBe(true);
  });

});