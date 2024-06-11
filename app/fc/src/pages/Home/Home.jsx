import React from 'react'
import "./Home.css";
import Logo from "../../assets/Logo.jpg";
import { Link,useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext.js';
export default function Home() {
  const { user, setUser } = useUser();
  const navigate=useNavigate();
console.log(user)
  return (
    <div className='container'>
      <div className="nav">
        <img className='logo' src={Logo} alt="" />
        {user._id ? (
          <div className="user" onClick={()=> navigate("/profile")}>
            <img className='pimage' src={user.image} alt="" />
            <p>{user.username}</p>
          </div>

        ) : (
          <div className="btns">
            <Link to={'/login'}> <button className="btn">Login</button></Link>
            <Link to={"/register"}> <button className="btn">Sign Up</button></Link>
          </div>)}
      </div>
      <div className="hero">
        <p className='heading1'>Discover Your Career Opportunities</p>
        <p className='heading2'>Find the perfect job near you and take the first step towards your dream career.</p>
        <div className="btns">
          <button className="btn1">Search Jobs</button>
          <button className="btn2">Explore Opportunities</button>
        </div>
      </div>
    </div>
  )
}
