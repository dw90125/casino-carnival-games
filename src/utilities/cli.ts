import { IBaseWager, IBasePayout, IGameOutcome } from "@/types/games/base";

const sortHand = (cards: string[]): string[] => {
    const sorted: string[] = [];

    if (cards.includes("*")) {
        sorted.push("*");
    }

    for (const s of ['S', 'H', 'D', 'C']) {
        for (const r of ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']) {
            const token:string = '' + r + s;

            if (cards.includes(token)) {
                sorted.push(token);
            }
        }
    }

    return sorted;
}

const formatCard = (card: string): string => {
    if (card == "*") return '\u2605'; // ★

    const suitMap: Record<string, string> = {
        'S': '\u2660', // ♠
        'H': '\u2665', // ♥
        'D': '\u2666', // ♦
        'C': '\u2663'  // ♣
    };

    const rank = card[0];
    const suit = card[1];
    const symbol = suitMap[suit] || suit;
    return `${rank}${symbol}`;
};

export const displayOutcome = <T extends IBaseWager, P extends IBasePayout>(outcome: IGameOutcome): void => {
    const { dealer, player } = outcome;

    // this is a bit of a cheat.  Each game has a logical display order for cards that is more than "suit and rank order."
    dealer.cards = sortHand(dealer.cards);
    player.cards = sortHand(player.cards);
    
    const dealerHand = dealer.cards.map(formatCard).join(' ');
    const playerHand = player.cards.map(formatCard).join(' ');
    
    let output = "\n";

    // Dealer
    //output += `Dealer Hand: ${dealerHand} (${dealer.name}) [${dealer.qualify ? 'qualifies' : 'no-qualify'}]\n`;
    output += `Dealer Hand: ${dealerHand} (${dealer.name})\n`;

    // Player
    output += `Your Hand:   ${playerHand} (${player.name}) [${player.result}]\n`;
    output += `Payout:      $${player.payout.total}  (Main Game: $${player.payout.base} / Bonuses: $${player.payout.bonus})\n`;

    console.log(output);
};
