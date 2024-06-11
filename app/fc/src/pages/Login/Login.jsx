import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { useUser } from '../../context/userContext.js';
import axios from "axios";
export default function Login() {

  const [error,setError]=useState(null);
  const {user,setUser}=useUser();

  //credentials to store user input
  const [credentials, setCredentials] = useState({
    username: undefined,
   
    password: undefined
  })

  const navigate=useNavigate();


  //handle user input.
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  //save user input. request to backend.
  const handleSubmit= async(e)=>{
    e.preventDefault();
    
             try {
             const res=await axios.post("/login",credentials);
               
               
               if(res.status==200){
                console.log(res)
                setUser(res.data.user);
                navigate("/");
                
               }
            } catch (error) {
              console.log(error)
              setError(error.response.data.error);
            
        }
         
         
  }
  console.log(user);
  
  return (
    <div className="login-container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username"><CiUser size={25} /></label>
        <input
          type="username"
          id="username"
          defaultValue={credentials.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password"><RiLockPasswordLine size={22}/></label>
        <input
          type="password"
          id="password"
          defaultValue={credentials.password}
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
