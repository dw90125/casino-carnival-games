export abstract class CasinoGame {
  public abstract readonly name: string;
  protected shoe: string[] = [];
  
  protected abstract deck: Record<string, string>;

  public abstract shuffle(): void;
  public abstract deal(): { player: string[], dealer: string[] };
  public abstract resolveMainHand(p: string[], d: string[], ante: number, raise: number): number;
}