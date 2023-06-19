import { Injectable, NotFoundException } from '@nestjs/common';
import { from, of, toArray } from 'rxjs';

const QUOTES = [
  { id: 1, quote: 'Lorem Ipsum', character: 'Mr. A' },
  { id: 2, quote: 'Dolore Sit', character: 'Mr. A' },
  { id: 3, quote: 'Ame', character: 'Mr. A' },
];

@Injectable()
export class AppService {
  getQuotes() {
    return from(QUOTES).pipe(toArray());
  }

  getQuote(postId: number) {
    const quote = QUOTES.find(({ id }) => id === postId);

    if (!quote) {
      throw new NotFoundException();
    }

    return of(quote);
  }
}
