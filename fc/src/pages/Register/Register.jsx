import React,{useState} from 'react'
import "./Register.css";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useUser } from '../../context/userContext.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Register() {
  
  const [error, setError] = useState('');
  const { user, setUser } = useUser();
  const navigate=useNavigate();

//initilazing credentials variable to store user input.
  const [credentials, setCredentials] = useState({
    username: undefined,
    email:undefined,
    password: undefined
  })

  //handling user input 
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  //handling submit request by sending request for login to backend.
  const handleSubmit= async(e)=>{
    e.preventDefault();
    
             try {
             const res=await axios.post("/register",credentials);
               
               
               if(res.status==200){
                
                setUser(res.data.user);
                //navigating to home page
                navigate("/");
                
               }
            } catch (error) {
             
              setError(error.response.data.error);
            
        }
         
         
  }

  
  return (
    <div className="login-container">
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username"><CiUser size={25} /></label>
        <input
          type="text"
          id="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email"><MdOutlineAlternateEmail size={25}/></label>
        <input
          type="email"
          id="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password"><RiLockPasswordLine size={22}/></label>
        <input
          type="password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit">Submit</button>
    </form>
  </div>
  )
}
