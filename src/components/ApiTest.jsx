import React, { useState, useEffect } from 'react';
import { healthCheck, getUsers, createUser } from '../utils/api';

const ApiTest = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });

  // Test health check
  const testHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await healthCheck();
      setHealthStatus(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUsers();
      setUsers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await createUser(newUser);
      setNewUser({ username: '', email: '', password: '' });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealth();
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">API Connection Test</h2>
      
      {/* Health Check */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Backend Health Check</h3>
        <button
          onClick={testHealth}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Health'}
        </button>
        
        {healthStatus && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <pre className="text-sm">{JSON.stringify(healthStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Users List</h3>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-4"
        >
          {loading ? 'Loading...' : 'Refresh Users'}
        </button>
        
        {users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <strong>Username:</strong> {user.username} | 
                <strong>Email:</strong> {user.email} | 
                <strong>Wallet:</strong> ${user.wallet}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No users found</p>
        )}
      </div>

      {/* Create User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* API Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">API Information</h4>
        <p className="text-sm text-gray-600">
          <strong>Backend URL:</strong> {import.meta.env.VITE_API_URL || 'https://menix-backend.vercel.app'}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Frontend URL:</strong> https://menix.vercel.app
        </p>
      </div>
    </div>
  );
};

export default ApiTest; 