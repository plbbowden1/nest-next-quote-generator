import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FC } from 'react';
import { Quote } from 'src/shared/types/quote';
import { fetch } from 'src/shared/utils/fetch';

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
  const id = ctx.query.id;
  const quote = await fetch(`/api/quote/id=${id}`).catch((error) =>
    console.log(error),
  );

  return { props: { quote } };
};

export default Quote;
