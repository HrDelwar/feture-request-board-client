import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../App';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { setOpenModal, loggedIn, setLoggedIn, setUser } =
    useContext(UserContext);

  const navLink =
    'text-center md:px-4 w-full py-3 inline-block text-gray-100 hover:bg-gray-700 text-lg  uppercase ';

  return (
    <nav className=" bg-gradient-to-r to-purple-500 from-blue-500 transition">
      <div className="container mx-auto px-4 flex flex-col md:flex-row  justify-start md:justify-between md:items-center">
        <div className="flex justify-between w-full">
          <a
            href="/"
            className="py-1 inline-block text-gray-100   text-lg  uppercase"
          >
            FRQ-BOARd
          </a>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <div
              className={
                'h-1  bg-white rounded-lg transition ' +
                (open ? ' translate-y-1 w-7 transform rotate-45' : ' mt-1 w-8')
              }
            ></div>
            <div
              className={
                'transition transform rotate-180 ' +
                (open ? ' hidden' : 'h-1 mt-1 bg-white w-8 rounded-lg ')
              }
            ></div>
            <div
              className={
                'h-1  bg-white  rounded-lg transition ' +
                (open ? ' transform  w-7 -rotate-45 ' : ' mt-1 w-8')
              }
            ></div>
          </button>
        </div>
        <ul
          className={
            ' md:flex flex-col md:flex-row items-center justify-center transition ' +
            (open ? ' flex' : ' hidden')
          }
        >
          <li className="w-full">
            <NavLink
              activeClassName="bg-gray-700"
              to="/home"
              className={navLink}
            >
              Home
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              activeClassName="bg-gray-700"
              to="/about"
              className={navLink}
            >
              About
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/contact"
              activeClassName="bg-gray-700"
              className={navLink}
            >
              Contact
            </NavLink>
          </li>
          {loggedIn && (
            <li className="w-full">
              <NavLink
                to="/dashboard"
                activeClassName="bg-gray-700"
                className={navLink}
              >
                dashboard
              </NavLink>
            </li>
          )}

          {loggedIn ? (
            <li className="w-full">
              <button
                className={navLink}
                onClick={() => {
                  setLoggedIn(false);
                  setUser({});
                  sessionStorage.removeItem('user');
                  sessionStorage.removeItem('token');
                }}
              >
                logout
              </button>
            </li>
          ) : (
            <li className="w-full">
              <button className={navLink} onClick={() => setOpenModal(true)}>
                login
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
