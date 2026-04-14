/*
* Implementation of the "CactusKev" approach to poker hand evaluation
*
* (http://suffe.cool/poker/evaluator.html)
* 
* Essentially, he innovated a bitwise approach to determining the value of a hand
* using prime numbers to build a byte per card like so:
*
* +--------+--------+--------+--------+
* |xxxbbbbb|bbbbbbbb|cdhsrrrr|xxpppppp|
* +--------+--------+--------+--------+
*
* Where:
* 
* p = prime number of rank (deuce=2,trey=3,four=5,...,ace=41)
* r = rank of card (deuce=0,trey=1,four=2,five=3,...,ace=12)
* cdhs = suit of card (bit turned on based on suit of card)
* b = bit turned on depending on rank of card
*
* Examples:
*
* xxxAKQJT 98765432 CDHSrrrr xxpppppp
* 00001000 00000000 01001011 00100101    King of Diamonds
* 00000000 00001000 00010011 00000111    Five of Spades
* 00000010 00000000 10001001 00011101    Jack of Clubs
*
* Evaluating a hand is done by using bitwise multiplication on all the cards in the hand,
* and then taking the resultant large number against a lookup table of hand ranks.  Special
* lookups are used for straights and flushes, which are much simpler to evaluate.
*/

import { ICactusKevEnums } from "../../types/enums/icactuskevenums.js";

export class CactusKevEvaluator {
  private enums: ICactusKevEnums;

  constructor(enums: ICactusKevEnums) {
    this.enums = enums;
  }

  public evaluate(cards: string[]): number {
    const q = this.q_val(cards);
    if (q === false) return 9999;

    if (this.is_flush(cards)) {
      return this.enums.FLUSHES[q] ?? false;
    }

    const u = this.enums.UNIQUES[q];
    if (u) {
      return u;
    }

    const p = this.p_val(cards);
    if ((p !== false) && (p > -1)) {
      return this.enums.VALUES[p];
    }

    return 9999;
  }

  private is_flush(cards: string[]): boolean {
    let val: number = 0xf000;

    for (const card of cards) {
      const cardBitmask = this.enums.CARD_VALUES[card];

      if (cardBitmask === undefined) return false;

      val &= cardBitmask;
    }

    return (val !== 0);
  }

  private q_val(cards: string[]): number | false {
    let val: number = 0;

    for (const card of cards) {
      const cardBitmask = this.enums.CARD_VALUES[card];

      if (cardBitmask === undefined) return false;

      val |= cardBitmask;
    }

    return val >> 0x10;
  }

  private p_val(cards: string[]): number | false {
    let product: number = 0x01;

    for (const card of cards) {
      const cardBitmask = this.enums.CARD_VALUES[card];

      if (cardBitmask === undefined) return false;

      product *= (0xff & cardBitmask);
    }

    const idx = this.enums.PRODUCTS.indexOf(product);
    return (idx !== -1) ? idx : false;
  }
}