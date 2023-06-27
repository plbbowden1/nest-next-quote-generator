import { GetServerSideProps } from 'next';
import { FC, useState } from 'react';
import { Quote } from 'src/shared/types/quote';
import { fetch } from 'src/shared/utils/fetch';
import { Container, Button } from 'react-bootstrap';
import DashboardHeader from 'src/components/DashboardHeader';
import QuoteCard from 'src/components/QuoteCard';

type TDashboardProps = {
  quotes: Quote[];
};

const Dashboard: FC<TDashboardProps> = ({ quotes = [] as Quote[] }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [quoteData, setQuoteData] = useState<Quote[]>(quotes);

  async function updateQuotePage(newPageNumber: number) {
    const newQuote = await fetch(`/api/quote/page=${newPageNumber}`);
    setPageNumber(newPageNumber);
    setQuoteData(newQuote);
  }

  function renderNavButtons() {
    return (
      <Container className="d-flex justify-content-around w-50 my-4">
        <Button
          variant="primary"
          onClick={() => updateQuotePage(pageNumber - 1)}
          className="m-2"
          disabled={pageNumber === 1}
        >
          {'<<<'}
        </Button>
        <Button
          variant="primary"
          onClick={() => updateQuotePage(pageNumber + 1)}
          className="m-2"
          disabled={quoteData.length < 10}
        >
          {'>>>'}
        </Button>
        {/* </Card.Body>
        </Card> */}
      </Container>
    );
  }

  return (
    <>
      <DashboardHeader />
      {renderNavButtons()}
      <Container className="d-flex flex-column justify-content-center align-items-center">
        {quoteData?.map(
          (quoteObject: { id: number; quote: string; character: string }) => {
            return (
              <QuoteCard
                key={quoteObject.id}
                quote={quoteObject}
                enableButton={false}
              />
            );
          },
        )}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<TDashboardProps> = async (
  context,
) => {
  const quoteString: string = JSON.stringify(context.query.quotes);
  const quotesObject: Quote[] = JSON.parse(quoteString);
  return { props: { quotes: quotesObject } };
};

export default Dashboard;
