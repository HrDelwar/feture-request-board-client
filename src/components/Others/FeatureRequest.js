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
          className="absolute left-0 top-0 bottom-0  right-0 z-50 flex justify-center flex-col items-center"
          style={{ background: '#0000004a' }}
        >
          <SignInSignup
            className="absolute top-24 "
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
