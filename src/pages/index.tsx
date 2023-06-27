import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { Quote } from 'src/shared/types/quote';
import { Container } from 'react-bootstrap';
import Header from 'src/components/HomeHeader';
import QuoteCard from 'src/components/QuoteCard';

type THomeProps = {
  quote: Quote;
};

const Home: FC<THomeProps> = ({ quote = {} as Quote }) => {
  return (
    <>
      <Header />
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <QuoteCard quote={quote} enableButton={true} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<THomeProps> = async (
  ctx,
) => {
  const quoteString: string = JSON.stringify(ctx.query.quote);
  const quoteObject: Quote = JSON.parse(quoteString);
  return { props: { quote: quoteObject } };
};

export default Home;
