import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bbb from '../assets/b.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';

const Login = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: 'bottom-right',
    theme: 'dark',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
  };
  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, username } = values;

    if (username === '' || password === '') {
      toast.error('Username and Password is required!!', toastOptions);
      return false;
    }
    return true;
  };

  //redirect to chat page if localstaorage has the login user

  useEffect(() => {
    if (localStorage.getItem('banterBox-user')) {
      navigate('/'); //to chat container
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log('abcd');
    if (handleValidation()) {
      // console.log('in validation', loginRoute);

      //call the api from backend
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      // console.log(data);
      if (data.status === false) {
        toast.error(data.message, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem('banterBox-user', JSON.stringify(data.user));
        navigate('/'); //to chat container
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action='' onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            <img src={bbb} alt='Logo' />
            <h1>Banter Box</h1>
          </div>
          <input
            type='text'
            placeholder='Username'
            name='username'
            min='3'
            onChange={(e) => handleChange(e)}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={(e) => handleChange(e)}
          />

          <button type='submit'>Login</button>
          <span>
            Don't have an account? <Link to='/register'>Sign Up</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    border-radius: 0.4rem;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      font-weight: bold;
      text-decoration: none;
    }
  }
`;

export default Login;
