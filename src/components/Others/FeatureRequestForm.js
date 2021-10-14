import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMAGE_BB_KEY } from '../../env';
import { UserContext } from '../../App';

export default function FeatureRequestForm({
  setOpenModal,
  setIsFeature,
  submitFeature,
}) {
  const [errMsg, setErrMsg] = useState('');
  const [formData, setFormData] = useState({
    data: {},
    e: null,
  });
  const [uploadedImage, setUploadedImage] = useState({ display_url: '' });
  const { loggedIn, featureRequests, setFeatureRequests } =
    useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const errorElement = (item) => (
    <p className="text-red-400 text-sm">{item} is required</p>
  );

  const onSubmit = async (data, e) => {
    const newData = { ...data, logo: uploadedImage.display_url };
    setFormData({ data: newData, e });
    if (loggedIn) {
      try {
        const response = await fetch('http://localhost:8000/feature/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token'),
          },
          body: JSON.stringify(newData),
        });
        const result = await response.json();
        if (result.success) {
          setErrMsg('');
          setFeatureRequests([result.savedFeature, ...featureRequests]);
          setIsFeature(false);
          setUploadedImage({ display_url: '' });
          e.target.reset();
        } else {
          setErrMsg(result.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setOpenModal(true);
      setIsFeature(true);
    }
  };

  useEffect(() => {
    if (submitFeature) {
      onSubmit(formData.data, formData.e);
    }
  }, [submitFeature]);

  const uploadImage = (event) => {
    const imageData = new FormData();
    imageData.set('key', IMAGE_BB_KEY);
    imageData.append('image', event.target.files[0]);
    axios
      .post('https://api.imgbb.com/1/upload', imageData)
      .then(function (res) {
        setUploadedImage(res.data.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };
  console.log({ uploadedImage });

  return (
    <div className="bg-gray-200 max-w-sm p-3 rounded-lg">
      <h2 className="text-xl text-center">Feature Request</h2>
      <p className="text-center my-4">
        Let us know what features you'd like to see on web!
      </p>
      <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
          <label htmlFor="title" className="uppercase text-gray-500 text-sm">
            title
          </label>
          <input
            {...register('title', { required: true })}
            type="text"
            name="title"
            id="title"
            className="text-gray-500 bg-transparent focus:outline-none placeholder-gray-400  "
            placeholder="Short title"
          />
          {errors.title && errorElement('Title')}
        </div>
        <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
          <label htmlFor="title" className="uppercase text-gray-500 text-sm">
            status
          </label>
          <select
            {...register('status')}
            className="text-gray-500 bg-transparent  capitalize  focus:outline-none  placeholder-gray-400"
          >
            <option selected value="under-review">
              under review
            </option>
            <option value="planned">planned</option>
            <option value="in-progress">in progress</option>
            <option value="complete">complete</option>
          </select>
          {errors.status && errorElement('Status')}
        </div>
        <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
          <label
            htmlFor="description"
            className="uppercase text-gray-500 text-sm"
          >
            details
          </label>
          <textarea
            {...register('description', { required: true })}
            rows="3"
            name="description"
            id="description"
            className="text-gray-500 bg-transparent   focus:outline-none  placeholder-gray-400"
            placeholder="Any additional details"
          ></textarea>
          {errors.description && errorElement('Description')}
        </div>
        {uploadedImage.display_url && (
          <div className="w-48 h-48 rounded-md shadow-lg text-center mx-auto overflow-hidden mt-4">
            <img className="w-full" src={uploadedImage.display_url} alt="" />
          </div>
        )}
        <div className="flex justify-center mt-8 items-center">
          <input type="file" onChange={uploadImage} name="logo" id="logo" />
          {uploadedImage.display_url ? (
            <input
              type="submit"
              className="px-3 bg-indigo-600 font-bold text-white hover:bg-indigo-700 py-2 rounded cursor-pointer uppercase text-sm"
              value="request feature"
            />
          ) : (
            <input
              type="submit"
              disabled
              className="px-3 cursor-not-allowed   bg-indigo-600 font-bold text-white hover:bg-indigo-700 py-2 rounded  uppercase text-sm"
              value="request feature"
            />
          )}
        </div>
      </form>
      {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}
    </div>
  );
}
