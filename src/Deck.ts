/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/* eslint-disable no-duplicate-imports */
import Card from "./Card";
import { NUM_CARDS, Suit } from "./constants/deck";
import type { PileId } from "./constants/table";
import { TABLEAU_PILES } from "./constants/table";

const NUM_VALUES = 13;

export default class Deck {
  public cards: Card[] = [];

  public constructor(scene: Phaser.Scene) {
    for (let i = 1; i < NUM_VALUES + 1; i += 1) {
      Object.values(Suit).forEach((t) => {
        this.cards.push(new Card(scene, t, i));
      });
    }

    this.cards = this.shuffle(this.cards, 476);
    this.deal(scene);
  }

  public deal(scene: Phaser.Scene): void {
    // Flip all back
    this.cards.forEach((card: Card) => {
      card.flip(scene);
    });

    for (let cardIndex = 0; cardIndex < NUM_CARDS; cardIndex += 1) {
      const col = cardIndex % 8;
      const row = Math.floor(cardIndex / 8);
      this.cards[cardIndex].reposition(TABLEAU_PILES[col], row);
    }

    // Set positions
    /*
     *Let x = 0;
     *for (let i = 0; i < TABLEAU_PILES.length; i += 1) {
     *  for (let t = 0; t < i + 1; t += 1) {
     *    this.cards[x].reposition(TABLEAU_PILES[i], t);
     *
     *    if (i === t) {
     *      this.cards[x].flip(scene);
     *    }
     *
     *    x += 1;
     *  }
     *}
     *
     * // Rest go in stack
     *for (let i = x; i < NUM_CARDS; i += 1) {
     *  this.cards[i].reposition(PileId.Stock, i - x);
     *}
     */
  }

  public shuffle(deck: Card[], seed: number): Card[] {
    const a = 214013;
    const c = 2531011;
    const m = 2147483648;
    let rng = seed >>> 0;

    for (let i = 51; i > 0; i--) {
      rng = (a * rng + c) % m >>> 0;
      const j = Math.floor((rng / 65536) % (i + 1));

      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }

    deck.reverse();
    return deck;
  }

  public cardChildren(card: Card): Card[] {
    return this.cards
      .filter(
        (curr: Card) =>
          curr.pile === card.pile && curr.position >= card.position
      )
      .sort((a: Card, b: Card) => a.position - b.position);
  }

  public topCard(pile: PileId): Card | null {
    return (
      this.cards
        .filter((curr: Card) => curr.pile === pile)
        .sort((a: Card, b: Card) => a.position - b.position)
        .pop() ?? null
    );
  }

  public countCards(pile: PileId): number {
    return this.cards.reduce(
      (acc: number, card: Card) => (card.pile === pile ? acc + 1 : acc),
      0
    );
  }
}
