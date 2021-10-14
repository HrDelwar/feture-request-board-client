import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMAGE_BB_KEY } from '../../env';
import { UserContext } from '../../App';
import {
  FileInput,
  SelectInput,
  TextArea,
  TextInput,
} from '../Shared/InputFields';

export default function FeatureRequestForm({
  setOpenModal,
  setIsFeature,
  submitFeature,
}) {
  const [errMsg, setErrMsg] = useState('');
  const [form, setForm] = useState([]);
  const [formData, setFormData] = useState({
    data: {},
    e: null,
  });

  const {
    loggedIn,
    featureRequests,
    setFeatureRequests,
    uploadedImage,
    setUploadedImage,
  } = useContext(UserContext);
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
    console.log({ newData });
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

  useEffect(() => {
    fetch('http://localhost:8000/form/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm(data.form.requestForm);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  return (
    <div className="bg-gray-200 max-w-sm p-3 rounded-lg">
      <h2 className="text-xl text-center">Feature Request</h2>
      <p className="text-center my-4">
        Let us know what features you'd like to see on web!
      </p>

      <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
        {form.map((formSchema) => {
          if (formSchema.type === 'text') {
            return (
              <TextInput
                formSchema={formSchema}
                register={register}
                errors={errors}
              />
            );
          }
          if (formSchema.type === 'select') {
            return (
              <SelectInput
                formSchema={formSchema}
                register={register}
                errors={errors}
              />
            );
          }

          if (formSchema.type === 'textarea') {
            return (
              <TextArea
                formSchema={formSchema}
                register={register}
                errors={errors}
              />
            );
          }

          if (formSchema.type === 'file') {
            return (
              <FileInput
                formSchema={formSchema}
                register={register}
                errors={errors}
              />
            );
          }

          return <></>;
        })}

        <div className="flex justify-center mt-8 items-center">
          <input
            type="submit"
            className="px-3 bg-indigo-600 font-bold text-white hover:bg-indigo-700 py-2 rounded cursor-pointer uppercase text-sm"
            value="request feature"
          />
        </div>
      </form>

      {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}
    </div>
  );
}
