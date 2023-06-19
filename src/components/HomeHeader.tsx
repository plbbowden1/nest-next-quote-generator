import { Button } from 'react-bootstrap';

const Header: React.FC = () => {
  return (
    <header className="d-flex justify-content-between align-items-md-center py-3 m-3 border-bottom">
      <h1 className="h1">
        <span>the office: quote generator</span>
      </h1>
      <div>
        <Button
          variant="outline-primary"
          onClick={() => (window.location.href = '/login')}
          className="m-2"
        >
          Login{' '}
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => (window.location.href = '/signup')}
          className="m-2"
        >
          Create Account{' '}
        </Button>
      </div>
    </header>
  );
};

export default Header;
