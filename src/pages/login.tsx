import type { NextPage } from 'next';
import Head from 'next/head';
import { Button } from 'react-bootstrap';

const LoginPage: NextPage = () => {
  async function validateSubmissionForm(e) {
    e.preventDefault();
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    const payload = {
      email: email.value,
      password: password.value,
    };

    const JSONpayload = JSON.stringify(payload);
    const endpoint = '/api/auth/signin';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONpayload,
      credentials: 'include',
    });
    if (response.status === 403) {
      alert('Invalid credentials');
      return false;
    } else if (response.status !== 200) {
      alert('Something went wrong!');
    } else {
      window.location.href = '/dashboard';
    }
  }

  function LoginForm() {
    return (
      <div className="p-3 auth_box">
        <Button
          variant="outline-secondary"
          className="mb-4"
          onClick={() => (window.location.href = '/')}
        >
          Back
        </Button>
        <h1 className="display-6 mb-3">Login</h1>
        <form onSubmit={validateSubmissionForm} className="mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            required
          />
          <div className="d-flex align-items-center justify-content-center">
            <Button type="submit" variant="primary" className="mt-4">
              Submit
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Login Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
