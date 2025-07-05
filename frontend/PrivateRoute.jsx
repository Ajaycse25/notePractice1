import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null: still loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/verify', { withCredentials: true })
      .then(() => {
        setIsAuth(true);
        setLoading(false);
      })
      .catch(() => {
        setIsAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/Login" />;
}

export default PrivateRoute;
