import { Button } from 'react-bootstrap';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="d-flex justify-content-between align-items-md-center py-3 m-3 border-bottom">
      <h1 className="h1">
        <span>the office: quote generator</span>
      </h1>
      <div>
        <Link href="/login">
          <Button variant="outline-primary" className="m-2">
            Login{' '}
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline-primary" className="m-2">
            Create Account{' '}
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
