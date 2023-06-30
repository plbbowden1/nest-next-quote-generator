import { GetServerSideProps } from 'next';
import { Quote } from 'src/shared/types';
import { Container } from 'react-bootstrap';
import { Header, QuoteCard } from 'src/components/';
import { fetch } from 'src/shared/utils/fetch';

type THomeProps = {
  quote: Quote;
};

const Home: React.FC<THomeProps> = ({ quote = {} as Quote }) => {
  return (
    <>
      <Header page="home" />
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <QuoteCard quote={quote} enableButton={true} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<THomeProps> = async (
  ctx,
) => {
  if (!ctx.query.quote) {
    const fetchedQuote = await fetch('/api/quote/random');
    return { props: { quote: fetchedQuote } };
  }
  const quoteString: string = JSON.stringify(ctx.query.quote);
  const quoteObject: Quote = quoteString ? JSON.parse(quoteString) : undefined;
  return { props: { quote: quoteObject } };
};

export default Home;
