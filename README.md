# Project: Casino Carnival Games (TypeScript)

A high-performance implementation of the **Cactus Kev Poker Evaluation Algorithm**, specifically ported and optimized for the popular casino game **3-card poker**. This project demonstrates the migration of legacy C-style bitwise logic into a modern, type-safe **TypeScript** environment.

## 🚀 Technical Highlights
* **Legacy Migration:** Successfully ported the classic 32-bit integer card scheme to a modern Node.js/TS architecture.
* **Bit-Level Evaluation:** Utilizes a prime-product lookup system and rank bitmasking for O(1) evaluation speed.
* **Custom Hierarchy:** Engineered specifically for 3-card poker rules where **Straight > Flush**.
* **Test-Driven Development:** Full test suite using **Vitest** to verify edge cases like the "Wheel" (A-2-3 straight).

## 🛠 The "Cactus Kev" Architecture
Each card is represented as a 32-bit integer, using [CactusKev's](http://suffe.cool/poker/evaluator.html) elegant approach of using prime numbers and each card's suit and rank to create unique values from the bits:

```
+--------+--------+--------+--------+
|xxxbbbbb|bbbbbbbb|cdhsrrrr|xxpppppp|
+--------+--------+--------+--------+
```

Where:

* p = prime number of rank (deuce=2,trey=3,four=5,...,ace=41)
* r = rank of card (deuce=0,trey=1,four=2,five=3,...,ace=12)
* cdhs = suit of card (bit turned on based on suit of card)
* b = bit turned on depending on rank of card
* x = unused

For Example:

```
xxxAKQJT 98765432 CDHSrrrr xxpppppp
00001000 00000000 01001011 00100101    King of Diamonds
00000000 00001000 00010011 00000111    Five of Spades
00000010 00000000 10001001 00011101    Jack of Clubs
```

### The Evaluation Pipeline
1. **Bitmask Check:** The engine intercepts Straights and Flushes via the rank bitmask (q_val).
2. **Prime Product:** For Pairs and High Cards, the engine calculates a unique prime product (p_val).
3. **Perfect Hash Lookup:** This product is mapped to a pre-calculated index for an immediate rank.

## 💻 Environment & Tools
* **Runtime:** Node.js
* **Language:** TypeScript (ES6+)
* **Environment:** WSL2 (Ubuntu) / Docker
* **Testing:** Vitest

## 🚧 TODO
* Finish evaluation of "side" bets for 3-card poker
* Create an API so that the engine can send games to a front-end
* Add more games like High-Card Flush and Pai-Gow Poker
