import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';

const SetAvatar = () => {
  const api = 'https://api.multiavatar.com/';
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const navigate = useNavigate();
  const toastOptions = {
    position: 'bottom-right',
    theme: 'dark',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
  };

  useEffect(() => {
    if (!localStorage.getItem('banterBox-user')) {
      navigate('/login');
    }
  }, []);

  const setProfilePicture = async () => {
    if (!selectedAvatar) {
      toast(`Please select a profile picture.`, toastOptions);
    } else {
      //call the api from backend...

      const user = await JSON.parse(localStorage.getItem('banterBox-user'));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          'banterbox-avatar',
          avatars[selectedAvatar] + '.png'
        );
        localStorage.setItem('banterbox-user', JSON.stringify(user));

        navigate('/');
      } else {
        toast('Error setting avatar.Please try again!', toastOptions);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 100000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString('base64'));
      }
      setAvatars(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt='loader' className='loader' />
        </Container>
      ) : (
        <Container>
          <div className='title-container'>
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className='avatars'>
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? 'selected' : ''
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt='avatar'
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <div className='submit-btn' onClick={setProfilePicture}>
            Set as Profile picture
          </div>
        </Container>
      )}
      <ToastContainer />
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 1rem;
    .avatar {
      border: 0.4rem solid transparent;
      cursor: pointer;
      padding: 4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;
export default SetAvatar;
