import axios from 'axios';
import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { IMAGE_BB_KEY } from '../../env';

const errorElement = (item) => (
  <p className="text-red-400 text-sm">{item} is required</p>
);

export default function InputFields() {
  return <div>''</div>;
}

export const TextInput = ({ formSchema, register, errors }) => {
  return (
    <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
      <label
        htmlFor={formSchema.name}
        className="uppercase text-gray-500 text-sm"
      >
        {formSchema.title}
      </label>
      <input
        {...register(formSchema.name, {
          required: formSchema.required || false,
        })}
        type={formSchema.type}
        name={formSchema.name}
        id={formSchema.name}
        className="text-gray-500 bg-transparent focus:outline-none placeholder-gray-400  "
        placeholder={formSchema.placeholder}
      />
      {errors[formSchema.name] && errorElement(formSchema.title)}
    </div>
  );
};

export const FileInput = ({ formSchema, register, errors }) => {
  const { uploadedImage, setUploadedImage } = useContext(UserContext);
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
  return (
    <div className="">
      {uploadedImage.display_url && (
        <div className="w-48 h-48 rounded-md shadow-lg text-center mx-auto overflow-hidden mt-4">
          <img className="w-full" src={uploadedImage.display_url} alt="" />
        </div>
      )}
      <div className="">
        <input type="file" onChange={uploadImage} name="logo" id="logo" />
      </div>
    </div>
  );
};

export const TextArea = ({ formSchema, register, errors }) => {
  return (
    <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
      <label
        htmlFor={formSchema.name}
        className="uppercase text-gray-500 text-sm"
      >
        {formSchema.title}
      </label>
      <textarea
        {...register(formSchema.name, {
          required: formSchema.required || false,
        })}
        rows={formSchema.rows}
        name={formSchema.name}
        id={formSchema.name}
        className="text-gray-500 bg-transparent   focus:outline-none  placeholder-gray-400"
        placeholder="Any additional details"
      ></textarea>
      {errors[formSchema.name] && errorElement(formSchema.title)}
    </div>
  );
};

export const SelectInput = ({ formSchema, register, errors }) => {
  console.log({ formSchema });
  return (
    <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
      <label
        htmlFor={formSchema.name}
        className="uppercase text-gray-500 text-sm"
      >
        {formSchema.title}
      </label>
      <select
        {...register(formSchema.name)}
        className="text-gray-500 bg-transparent  capitalize  focus:outline-none  placeholder-gray-400"
      >
        {formSchema.options.map((option) => (
          <option selected={option.selected} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
      {errors[formSchema.name] && errorElement(formSchema.title)}
    </div>
  );
};
