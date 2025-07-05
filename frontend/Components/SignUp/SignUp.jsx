import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';




function SignUp() {
   const navigate = useNavigate(); 
 
      const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('https://notepractice1-1.onrender.com/submit', formData, 
      {withCredentials: true});
   
    setFormData({ username: '', email: '', password: '' });
   // alert(data.message);
    navigate('/Login')
  } catch (error) {
    console.error(error);
   
  }
};



  return (
    <div className='bg-gray-600 mt-10 mx-10 p-3 '>
        <h2 className='text-2xl'>Sign Up</h2>
        <form onSubmit={handleSubmit} className='mt-5 space-y-4'>
            <div>
                <label htmlFor="username">Username:</label>
                <input className='border-none mx-2 rounded-md outline-1' 
                onChange={handleChange}
                 type="text"
                  id="username"
                   name="username"
                   value={formData.username}
                    required placeholder='Your username'/>
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input 
                className='border-none mx-2 rounded-md outline-1'
                onChange={handleChange}
                 placeholder='email'
                  type="email"
                   id="email" 
                   name="email" 
                   value={formData.email}
                   required 
                   />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input className='border-none mx-2 rounded-md outline-1'
                onChange={handleChange}  
                placeholder='password' type="password" 
                id="password" 
                name="password"
                value={formData.password}
                 required />
            </div>
            <button  className='bg-blue-700 text-white rounded-md px-1 active:scale-90' type="submit">Sign Up</button>
        </form>
        <div className='mt-5'>
        <h1 >Already have account</h1>
        <NavLink to="/Login" className='bg-blue-700 text-white rounded-md  px-1 active:scale-90'>Login </NavLink>
        </div>
       
    </div>
  )
}

export default SignUp
