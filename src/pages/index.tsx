import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { Quote } from 'src/shared/types/quote';
import { fetch } from 'src/shared/utils/fetch';
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

export const getServerSideProps: GetServerSideProps<THomeProps> = async () => {
  const quote = await fetch('/api/quote/random');
  return { props: { quote } };
};

export default Home;
