import { select, number, confirm } from "@inquirer/prompts";
import { displayOutcome } from "./utilities/cli";

import { IPlayerIntent, IGameOutcome, IBaseWager } from "./types/games/base";

import { IThreeCardPokerWager } from "./types/games/three-card-poker";
import { ThreeCardPoker } from "./games/three-card-poker/game";

import { IHighCardFlushWager } from "./types/games/high-card-flush";
import { HighCardFlush } from "./games/high-card-flush/game";

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

async function HighCardFlushIntent(): Promise<IPlayerIntent<IHighCardFlushWager>> {
    const numSeats = HighCardFlush.gameConfig.numSeats;
    
    const seatIndex = await number({ message: `Select seat [1-${numSeats}]:`, min: 1, max: numSeats, default: 1 }) ?? 1;
    const ante = await number({ message: 'Ante wager:', min: 5, max: 500 }) ?? 5;
    const flush = await number({ message: 'Flush Bonus wager:', default: 0 }) ?? 0;
    const sf = await number({ message: 'Straight-Flush Bonus wager:', default: 0 }) ?? 0;

    const wager: IHighCardFlushWager = {
        ante: ante,
        flush: flush,
        sf: sf
    };

    return {
        seatIndex: seatIndex - 1,
        wager: wager
    };
}

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
    
    let game: ThreeCardPoker | HighCardFlush | undefined;
    let intent: IPlayerIntent<IThreeCardPokerWager> | IPlayerIntent<IHighCardFlushWager> | undefined;

    let bankroll = await number({ message: 'Starting Bankroll:', default: 500 }) ?? 500;
    console.log(`Bankroll: $${bankroll}\n`);

    if (choice === 'TCP') {
        intent = await ThreeCardPokerIntent();
        game = new ThreeCardPoker(intent);
    } else if (choice === 'HCF') {
        intent = await HighCardFlushIntent();
        game = new HighCardFlush(intent);
    }        

    if (intent && game) {
        let playing = true;

        while (playing) {
            let wager: number = Object.values(intent.wager as IBaseWager).reduce((sum, val) => sum + val, 0);            

            bankroll -= wager;

            game.play();

            const outcome: IGameOutcome = game.outcome();

            displayOutcome(outcome);

            bankroll += outcome.player.payout.total;

            console.log(`Bankroll: $${bankroll}\n\n`);

            if (bankroll < wager) {
                console.log('Insufficient Bankroll!\n\n');
                break;
            } else {
                const repeat = await confirm({ message: 'Deal again?', default: true });
                if (!repeat) break;
            }
        }

        console.log('Done\n\n');
    } else {
        console.log('Invalid Game\n\n');
        process.exit(1);
    }
}

main();
