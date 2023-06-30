import { Button } from 'react-bootstrap';
import Link from 'next/link';

type THeaderProps = {
  page: 'home' | 'dashboard';
};

const Header: React.FC<THeaderProps> = ({ page }) => {
  async function logout(): Promise<void> {
    await fetch('/api/auth/signout');
  }

  function renderButtons() {
    if (page === 'home') {
      return (
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
      );
    } else if (page === 'dashboard') {
      return (
        <div>
          <Link href="/">
            <Button variant="outline-primary" className="m-2" onClick={logout}>
              Logout
            </Button>
          </Link>
        </div>
      );
    }
  }

  return (
    <header className="d-flex justify-content-between align-items-md-center py-3 m-3 border-bottom">
      <h1 className="h1">
        <span>the office: quote generator</span>
      </h1>
      <div>{renderButtons()}</div>
    </header>
  );
};

export default Header;
