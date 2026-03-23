import { select, number, confirm } from '@inquirer/prompts';
import { displayOutcome } from './utilities/cli.js';

import { IPlayerIntent, IGameOutcome } from "./types/games/base.js";

import { IThreeCardPokerWager } from "./types/games/three-card-poker.js";
import { ThreeCardPoker } from './games/three-card-poker/game.js';

async function ThreeCardPokerIntent(): Promise<IPlayerIntent<IThreeCardPokerWager>> {
    const numSeats = ThreeCardPoker.gameConfig.numSeats;
    
    const seatIndex = await number({ message: `Select seat [1-${numSeats}]:`, min: 1, max: numSeats, default: 1 }) ?? 1;
    const ante = await number({ message: 'Ante wager:', min: 5, max: 500, default: 5}) ?? 5;
    const pp = await number({ message: 'Pair Plus wager:', default: 0 }) ?? 0;
    const six = await number({ message: '6-Card Bonus wager:', default: 0 }) ?? 0;
    const prog = await confirm({ message: 'Progressive?', default: false }) ?? false;

    const wager: IThreeCardPokerWager = {
        ante: ante,
        pp: pp,
        six: six,
        prog: prog ? 5 : 0
    };

    return {
        seatIndex: seatIndex - 1,
        wager: wager
    };
}

/*
async function HighCardFlushIntent(): Promise<IPlayerIntent<IHighCardFlushWager>> {
    const seatIndex = await number({ message: 'Select seat [1-7]:', min: 1, max: 7 }) ?? 1;
    const ante = await number({ message: 'Ante wager:', min: 5, max: 500 }) ?? 5;
    const flush = await number({ message: 'Flush Bonus wager:', default: 0 }) ?? 0;
    const sf = await number({ message: 'Straight-Flush Bonus wager:', default: 0 }) ?? 0;

    const wager: IHighCardFlushWager = {
        ante: ante,
        flush: flush,
        sf: sf
    };

    return {
        seatIndex: seatIndex,
        wager: wager
    };
}
*/

async function main() {
    console.clear();
    console.log('Casino Carnival Games\n');

    const choice = await select({
        message: 'Select Game',
        choices: [
            { name: 'Three-Card Poker', value: 'TCP' },
            { name: 'High-Card Flush', value: 'HCF' },
        ],
    });
    
    let playing = true;
    let intent: any;

    console.clear();
    if (choice === 'TCP') {
        let bankroll = await number({ message: 'Starting Bankroll:', default: 500 }) ?? 500;

        console.log(`Bankroll: $${bankroll}\n`);

        const intent = await ThreeCardPokerIntent();
        const game = new ThreeCardPoker(intent);
        
        while (playing) {
            let wager = Object.values(intent.wager).reduce((sum, val) => sum + val, 0)            

            bankroll -= wager;

            game.play();
            const outcome: IGameOutcome = game.outcome();
            displayOutcome(outcome);

            bankroll += outcome.player.payout;

            console.log(`Bankroll: $${bankroll}\n\n`);

            if (bankroll < wager) {
                console.log('Insufficient Bankroll!\n\n');
                break;
            } else {
                const repeat = await confirm({ message: 'Deal again?', default: true });
                if (!repeat) break;
            }
        }
    } else if (choice === 'HCF') {
        console.log('Coming Soon!\n\n');
        process.exit(1);

        // const intent = await HighCardFlushIntent();
        // const game = new HigCardFlush(intent);
        // game.play();
        // const outcome = game.outcome();
        // displayOutcome(outcome);
    } else {
        console.log('Invalid Game\n\n');
        process.exit(1);
    }

    console.log('Done\n\n');
}

main();
