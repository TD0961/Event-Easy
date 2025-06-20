import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EventTicketing() {
  const { id } = useParams();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    amount: ''
  });
  const [auth, setAuth] = useState({ email: '', password: '' }); // For re-authentication
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthChange = e => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Authenticate user
      const loginRes = await axios.post("http://localhost:5000/Event-Easy/users/login", auth);
      const token = loginRes.data.token;
      if (!token) throw new Error("Authentication failed");

      // 2. Initiate payment with token in Authorization header
      const res = await axios.post(
        'http://localhost:5000/api/event/' + id + '/payment/initiate',
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        alert('Payment initiation failed: No checkout URL returned from server.');
      }
    } catch (err) {
      alert('Authentication or payment failed: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-green-200"
      >
        <div className="flex items-center justify-center mb-6">
          <img src="data:image/jpeg;base64,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" alt="Chapa" className="h-8 mr-2" />
          <span className="text-2xl font-bold text-green-600">Chapa</span>
        </div>
        <h2 className="text-xl font-semibold text-center mb-4 text-green-700">Welcome,<br />Let's get you Paid!</h2>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          min="1"
          className="w-full p-3 mb-6 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {/* Re-authentication fields */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={auth.email}
          onChange={handleAuthChange}
          required
          className="w-full p-3 mb-4 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Your Password"
          value={auth.password}
          onChange={handleAuthChange}
          required
          className="w-full p-3 mb-4 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded flex items-center justify-center transition duration-200 disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Pay with Chapa'}
        </button>
      </form>
    </div>
  );
}