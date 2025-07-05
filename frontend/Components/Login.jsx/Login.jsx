import React, { useState } from 'react'
import { NavLink , useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
const [formData, setFormData] = useState({ email: '', password: '' });
  const [formKey, setFormKey] = useState(0); 
  const navigate = useNavigate();


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleClick = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('https://notepractice1-1.onrender.com/login', formData , {   withCredentials: true});
    console.log('Login successful:', res.data);
    
    setFormData({ email: '', password: '' });

      const verifyRes = await axios.get('https://notepractice1-1.onrender.com/verify', {
      withCredentials: true
    });

    console.log('Verify success:', verifyRes.data);
    navigate('/Home')
        setFormKey(prev => prev + 1); // reset form
  } catch (error) {
    console.error('Error during login:', error);
    
  }
};




  return (
  <div className='bg-gray-600 mt-10 mx-10 p-3 '>
        <h2 className='text-2xl'>Login</h2>
        <form  key={formKey} onSubmit={handleClick} className='mt-5 space-y-4'>
           
            <div>
                <label htmlFor="email">Email:</label>
                <input className='border-none mx-2 rounded-md outline-1'
                 placeholder='email'
                  type="email"
                   id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                     required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input className='border-none mx-2 rounded-md outline-1'
                value={formData.password}
                onChange={handleChange}
                placeholder='password' type="password" id="password" name="password" required />
            </div>
            <button className='bg-blue-700 text-white rounded-md px-1 active:scale-90' type="submit">Login</button>
        </form>
         <div className='mt-5'>
                <h1 >Create One</h1>
                <NavLink to="/" className='bg-blue-700 text-white rounded-md  px-1 active:scale-90'>Sign Up</NavLink>
                </div>
    </div>
  )
}

export default Login
