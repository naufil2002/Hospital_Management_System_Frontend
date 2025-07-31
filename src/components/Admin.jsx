import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin({ setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // prevent form reload

    try {
      const res = await axios.post('http://localhost:8080/admin/login', null, {
        params: { username, password },
      });

      if (res.data === 'success') {
        localStorage.setItem('isAdmin', 'true');
        setIsAdmin(true); // update App instantly
        setMessage('✅ Login Successful!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage('❌ Login Failed!');
      }
    } catch (error) {
      setMessage('⚠️ Server error. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-36 bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}

export default Admin;
