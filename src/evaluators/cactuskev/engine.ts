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

import { ICactusKevEnums } from "@/types/enums/icactuskev";

export class CactusKevEvaluator {
  private readonly CARD_VALUES: Record<string, number> = {
    "AS": 0x10001C29, "KS": 0x08001B25, "QS": 0x04001A1F, "JS": 0x0200191D, "TS": 0x01001817, "9S": 0x00801713, "8S": 0x00401611, "7S": 0x0020150D, "6S": 0x0010140B, "5S": 0x00081307, "4S": 0x00041205, "3S": 0x00021103, "2S": 0x00011002,
    "AH": 0x10002C29, "KH": 0x08002B25, "QH": 0x04002A1F, "JH": 0x0200291D, "TH": 0x01002817, "9H": 0x00802713, "8H": 0x00402611, "7H": 0x0020250D, "6H": 0x0010240B, "5H": 0x00082307, "4H": 0x00042205, "3H": 0x00022103, "2H": 0x00012002,
    "AD": 0x10004C29, "KD": 0x08004B25, "QD": 0x04004A1F, "JD": 0x0200491D, "TD": 0x01004817, "9D": 0x00804713, "8D": 0x00404611, "7D": 0x0020450D, "6D": 0x0010440B, "5D": 0x00084307, "4D": 0x00044205, "3D": 0x00024103, "2D": 0x00014002,
    "AC": 0x10008C29, "KC": 0x08008B25, "QC": 0x04008A1F, "JC": 0x0200891D, "TC": 0x01008817, "9C": 0x00808713, "8C": 0x00408611, "7C": 0x0020850D, "6C": 0x0010840B, "5C": 0x00088307, "4C": 0x00048205, "3C": 0x00028103, "2C": 0x00018002
  };

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
      const cardBitmask = this.CARD_VALUES[card];

      if (cardBitmask === undefined) return false;

      val &= cardBitmask;
    }

    return (val !== 0);
  }

  private q_val(cards: string[]): number | false {
    let val: number = 0;

    for (const card of cards) {
      const cardBitmask = this.CARD_VALUES[card];

      if (cardBitmask === undefined) return false;

      val |= cardBitmask;
    }

    return val >> 0x10;
  }

  private p_val(cards: string[]): number | false {
    let product: number = 0x01;

    for (const card of cards) {
      const cardBitmask = this.CARD_VALUES[card];

      if (cardBitmask === undefined) return false;

      product *= (0xff & cardBitmask);
    }

    const idx = this.enums.PRODUCTS.indexOf(product);
    return (idx !== -1) ? idx : false;
  }
}