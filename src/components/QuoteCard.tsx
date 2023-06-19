import { FC, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { fetch } from 'src/shared/utils/fetch';
import { Quote } from 'src/server/quote/entities';

type TQuoteCardProps = {
  quote: Quote;
  enableButton: boolean;
};

const QuoteCard: FC<TQuoteCardProps> = ({
  quote = {} as Quote,
  enableButton,
}) => {
  const [quoteData, setQuoteData] = useState<Quote>(quote);

  async function refreshQuote() {
    const newQuote = await fetch('/api/quote/random');
    setQuoteData(newQuote);
  }

  const renderButton = () => {
    if (enableButton) {
      return (
        <Button
          variant="primary"
          onClick={refreshQuote}
          className="text-right position-absolute top-0 end-0 m-2"
        >
          New Quote!
        </Button>
      );
    }
  };

  return (
    <Card className="w-75 my-4 align-self-center">
      <Card.Body>
        <Card.Title className="character">
          {`${quoteData.character} says...`}
          {renderButton()}
        </Card.Title>
        <Card.Text className="lead px-3 py-3 mt-3">{quoteData.quote}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default QuoteCard;
