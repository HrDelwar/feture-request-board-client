import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';

export default function SignInSignup({
  className,
  setLoggedIn,
  setOpenModal,
  setSubmitFeature,
  isFeature,
}) {
  const [newUser, setNewUser] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const { setUser } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (newUser) {
      handleSignUp(data);
    } else {
      handleSignIn(data);
    }
  };

  const handleSignUp = async (data) => {
    try {
      const response = await fetch(
        'https://mysterious-sands-20308.herokuapp.com/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (result.success) {
        setErrMsg('');
        setNewUser(false);
        handleSignIn(data);
      } else {
        setErrMsg(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignIn = async (data) => {
    try {
      const response = await fetch(
        'https://mysterious-sands-20308.herokuapp.com/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setErrMsg('');
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
        setLoggedIn(true);
        setUser(result.user);
        if (isFeature) {
          setSubmitFeature(true);
        }
        setOpenModal(false);
      } else {
        setErrMsg(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={'bg-gray-200 max-w-sm p-3 rounded-lg ' + className}>
      <div className="flex justify-between">
        <h2 className="text-xl text-center uppercase">
          {newUser ? 'signup' : 'sign in'}
        </h2>
        <button
          className="  "
          onClick={() => setOpenModal(false)}
        >
          <div
            className={
              'h-1  bg-red-500 rounded-lg transition  translate-y-1 w-6 transform rotate-45'
            }
          ></div>
          <div
            className={
              'h-1  bg-red-500 rounded-lg transition w-6 transform -rotate-45'
            }
          ></div>
        </button>
      </div>
      <p className="text-center my-4">
        {newUser ? 'Create ' : 'Login '} your own account
      </p>
      <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
        {newUser ? (
          <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
            <label htmlFor="title" className="uppercase text-gray-500 text-sm">
              name
            </label>
            <input
              {...register('name', { required: true })}
              type="text"
              name="name"
              id="name"
              className="text-gray-500 bg-transparent focus:outline-none placeholder-gray-400  "
              placeholder="Full name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm">Name is required</p>
            )}
          </div>
        ) : (
          <></>
        )}

        <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
          <label htmlFor="details" className="uppercase text-gray-500 text-sm">
            email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            {...register('email', { required: true })}
            className="text-gray-500 bg-transparent   focus:outline-none  placeholder-gray-400"
            placeholder="your email"
          />
          {errors.email && (
            <p className="text-red-400 text-sm">Email is required</p>
          )}
        </div>

        <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
          <label htmlFor="details" className="uppercase text-gray-500 text-sm">
            password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            {...register('password', { required: true })}
            className="text-gray-500 bg-transparent   focus:outline-none  placeholder-gray-400"
            placeholder="your password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">Password is required</p>
          )}
        </div>
        {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}
        <div className="flex justify-between mt-8 items-center">
          <div className="">
            <input
              onChange={() => setNewUser(!newUser)}
              type="checkbox"
              name="checkbox"
              id="checkbox"
              checked={newUser}
            />
            <label htmlFor="checkbox" className="ml-2 capitalize">
              new user
            </label>
          </div>
          <input
            type="submit"
            className="px-3 bg-indigo-600 font-bold text-white hover:bg-indigo-700 py-2 rounded cursor-pointer uppercase text-sm"
            value={newUser ? 'register' : 'login'}
          />
        </div>
      </form>
    </div>
  );
}
