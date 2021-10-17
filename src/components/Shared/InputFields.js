import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { IMAGE_BB_KEY } from '../../env';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';

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
  const [loading, setLoading] = useState(false);

  const uploadImage = (event) => {
    setLoading(true);
    const imageData = new FormData();
    imageData.set('key', IMAGE_BB_KEY);
    imageData.append('image', event.target.files[0]);
    axios
      .post('https://api.imgbb.com/1/upload', imageData)
      .then(function (res) {
        setUploadedImage(res.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Image upload failed for internal issue!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        setLoading(false);
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
      {loading && (
        <div className="mt-3">
          <ReactLoading
            type="spinningBubbles"
            color="rgb(27, 188, 225)"
            height={40}
            width={40}
          />
        </div>
      )}
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
  return formSchema.name === 'status' ? (
    <></>
  ) : (
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
        {formSchema.options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
      {errors[formSchema.name] && errorElement(formSchema.title)}
    </div>
  );
};
