import type { NextPage } from 'next';
import Head from 'next/head';
import { Button } from 'react-bootstrap';

const SignUpPage: NextPage = () => {
  async function validateSubmissionForm(e) {
    e.preventDefault();
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirm_password = document.getElementById(
      'confirm-password',
    ) as HTMLInputElement;

    if (password.value !== confirm_password.value) {
      alert('Passwords do not match!');
      return false;
    }

    const payload = {
      email: email.value,
      password: password.value,
    };

    const JSONpayload = JSON.stringify(payload);

    const endpoint = '/api/auth/signup';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONpayload,
    };

    const response = await fetch(endpoint, options);
    if (response.status === 403) {
      alert('Email already in use.');
      return false;
    } else if (response.status !== 201) {
      alert('Something went wrong!');
    } else {
      window.location.href = '/dashboard';
    }
  }

  function SignUpForm() {
    return (
      <div className="p-3 auth_box">
        <Button
          variant="outline-secondary"
          className="mb-4"
          onClick={() => (window.location.href = '/')}
        >
          Back
        </Button>
        <h1 className="display-6 mb-3">Create Account</h1>
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
          <label htmlFor="confirm-password">Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
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
        <title>Signup Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <SignUpForm />
      </main>
    </div>
  );
};

export default SignUpPage;
