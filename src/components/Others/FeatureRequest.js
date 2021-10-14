import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import SignInSignup from '../Shared/SignInSignup';
import AllRequest from './AllRequest';
import FeatureRequestForm from './FeatureRequestForm';

export default function FeatureRequest() {
  const [submitFeature, setSubmitFeature] = useState(false);
  const [isFeature, setIsFeature] = useState(false);
  const { loggedIn, setLoggedIn, openModal, setOpenModal } =
    useContext(UserContext);

  return (
    <>
      <section className="flex flex-wrap pt-12 justify-center lg:justify-start">
        <div className=" max-w-md md:w-full lg:w-4/12">
          <FeatureRequestForm
            openModal={openModal}
            setOpenModal={setOpenModal}
            submitFeature={submitFeature}
            setIsFeature={setIsFeature}
          />
        </div>
        <div className="w-full mt-8 lg:mt-0 lg:w-8/12">
          <AllRequest
            loggedIn={loggedIn}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
      </section>
      {openModal && (
        <div
          className="absolute left-0 top-0 bottom-0 h-full right-0 z-50 flex justify-center flex-col items-center"
          style={{ background: '#0000004a' }}
        >
          <button
            className=" p-2 absolute top-4 left-1/2 transform -translate-x-1/2 "
            onClick={() => setOpenModal(false)}
          >
            <div
              className={
                'h-1  bg-white rounded-lg transition  translate-y-1 w-7 transform rotate-45'
              }
            ></div>
            <div
              className={
                'h-1  bg-white rounded-lg transition w-7 transform -rotate-45'
              }
            ></div>
          </button>
          <SignInSignup
            className="opacity-100 "
            setOpenModal={setOpenModal}
            setLoggedIn={setLoggedIn}
            setSubmitFeature={setSubmitFeature}
            isFeature={isFeature}
          />
        </div>
      )}
    </>
  );
}
