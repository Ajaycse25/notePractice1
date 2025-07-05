import { useState } from 'react'
import SignUp from '../Components/SignUp/SignUp'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router'
import { RouterProvider } from 'react-router-dom'
import Login from '../Components/Login.jsx/Login'
import Home from '../Components/Home/Home'
import PrivateRoute from '../PrivateRoute.jsx/'

  


function App() {



  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="" element = {<SignUp/>} />
      <Route path="/login" element = {<Login/>} />
      <Route path="/home" element = {
        <PrivateRoute>
          <Home/>
        </PrivateRoute>
      } />
      </>
    )
  )


  return (
    <>
    <RouterProvider router = {router}/>
  
    </>
  )
}

export default App
