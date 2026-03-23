import { IBaseWager, IBasePayout, IGameOutcome } from "../types/games/base.js";

const formatCard = (card: string): string => {
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
    
    const dealerHand = dealer.cards.map(formatCard).join(' ');
    const playerHand = player.cards.map(formatCard).join(' ');
    
    let output = "\n";

    // Dealer
    output += `Dealer Hand: ${dealerHand} (${dealer.name}) [${dealer.qualify ? 'qualifies' : 'no-qualify'}]\n`;

    // Player
    output += `Your Hand:   ${playerHand} (${player.name}) [${player.result}]\n`;
    output += `Paid:    $${player.payout}\n`;

    console.log(output);
};
