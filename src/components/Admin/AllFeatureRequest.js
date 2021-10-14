import moment from 'moment';
import React, { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';
import Swal from 'sweetalert2';
import { groupBy } from 'underscore';

export default function AllFeatureRequest() {
  const [features, setFeatures] = useState([]);
  const [allStatus, setAllStatus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/form/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data?.form?.requestForm);
          data?.form?.requestForm.map((item) => {
            if (item.name === 'status') {
              setAllStatus(item.options.map((op) => op.value));
            }
            return item;
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }, []);

  useEffect(() => {
    loadAllFeature();
  }, []);

  const loadAllFeature = () => {
    fetch('https://mysterious-sands-20308.herokuapp.com/feature/all')
      .then((res) => res.json())
      .then((result) => {
        setFeatures(result.features);
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: err.message,
          confirmButtonText: 'OK',
        });
      });
  };

  const featureObj = groupBy(features, 'status');
  const newFeatureObj = Object.keys(featureObj);

  const handleStatusChange = async (e, _id) => {
    try {
      const response = await fetch(
        'http://localhost:8000/feature/status-update',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({ _id: _id, status: e.target.value }),
        }
      );
      const result = await response.json();
      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        loadAllFeature();
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="flex w-full bg-gray-200 mt-2">
      {allStatus.map((status, i) => (
        <div className="mt-4 px-4 rounded  mr-4">
          <div className=" px-2 text-lg text-gray-700 uppercase text-center">
            {status}
          </div>
          <div className=" ">
            {featureObj[status] &&
              featureObj[status].map((feature) => (
                <div className="mb-4 w-52 bg-gray-100 p-2 rounded-md shadow-lg">
                  {feature.logo && (
                    <div className="w-36 mx-auto h-36 overflow-hidden rounded ">
                      <img
                        className="w-full"
                        src={feature.logo}
                        alt={feature.title}
                        srcset=""
                      />
                    </div>
                  )}
                  <h3 className="text-gray-700 capitalize mt-2">
                    {feature.title}
                  </h3>
                  <small>
                    {moment(feature.createdAt).format(
                      'ddd, DD MMM YYYY. hh:mm a'
                    )}{' '}
                  </small>
                  <div className="">
                    <select
                      name={feature._id}
                      onChange={(e) => handleStatusChange(e, feature._id)}
                      id=""
                    >
                      {allStatus.map((op) => (
                        <option
                          value={op}
                          selected={Boolean(op === feature.status)}
                        >
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
