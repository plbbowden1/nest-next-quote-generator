import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FC } from 'react';
import { Quote } from 'src/shared/types/quote';

type TQuoteProps = {
  quote: Quote;
};

const Quote: FC<TQuoteProps> = ({ quote = {} as Quote }) => {
  return (
    <div>
      <Link href={'/'}>Home</Link>
      <h1>Quote {quote.quote}</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<TQuoteProps> = async (
  ctx,
) => {
  const quoteString: string = JSON.stringify(ctx.query.quote);
  const quoteObject: Quote = JSON.parse(quoteString);
  return { props: { quote: quoteObject } };
};

export default Quote;
