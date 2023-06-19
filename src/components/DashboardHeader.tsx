import { Button } from 'react-bootstrap';

const DashboardHeader: React.FC = () => {
  async function logout() {
    const response = await fetch('/api/auth/signout');
    if (response.ok) {
      window.location.href = '/';
    }
  }

  return (
    <header className="d-flex justify-content-between align-items-md-center py-3 m-3 border-bottom">
      <h1 className="h1">
        <span>The Office: Quote Generator</span>
      </h1>
      <div>
        <Button
          variant="outline-primary"
          onClick={() => logout()}
          className="m-2"
        >
          Logout{' '}
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
