import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { groupBy } from 'underscore';

export default function AllFeatureRequest() {
  const [features, setFeatures] = useState([]);
  const [allStatus, setAllStatus] = useState([]);

  useEffect(() => {
    fetch('https://mysterious-sands-20308.herokuapp.com/form/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          data.form.requestForm.map((item) => {
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

  const handleStatusChange = async (status, _id, oldStatus) => {
    try {
      const response = await fetch(
        'https://mysterious-sands-20308.herokuapp.com/feature/status-update',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({ _id: _id, status }),
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        loadAllFeature();
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
        const dragItem = features.find((i) => i._id === _id);
        dragItem.status = oldStatus;
        setFeatures([...features]);
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      const dragItem = features.find((i) => i._id === _id);
      dragItem.status = oldStatus;
      setFeatures([...features]);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId !== result.destination.droppableId) {
      const dragItem = features.find((i) => i._id === result.draggableId);
      dragItem.status = result.destination.droppableId;
      setFeatures([...features]);
      handleStatusChange(
        result.destination.droppableId,
        result.draggableId,
        result.source.droppableId
      );
    }
  };

  return (
    <>
      <p className="my-2 text-center text-xl">
        Move card to change the status!
      </p>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex flex-wrap justify-center lg:justify-start sm:justify-between items-center lg:items-start w-full  mt-2">
          {allStatus.map((status, i) => (
            <div
              style={{ minWidth: 240, minHeight: 120 }}
              className="mt-4 px-4   rounded bg-gray-200  mr-4"
              key={i}
            >
              <div className=" px-2 text-lg text-gray-700 uppercase text-center">
                {status}
              </div>

              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    className=" "
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {featureObj[status] &&
                      featureObj[status].map((feature, index) => (
                        <Draggable
                          key={feature._id}
                          draggableId={feature._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="mb-4 w-52 bg-gray-100 p-2 rounded-md shadow-lg"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
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
                                  onChange={(e) =>
                                    handleStatusChange(
                                      e.target.value,
                                      feature._id
                                    )
                                  }
                                  defaultValue={feature.status}
                                >
                                  {allStatus.map((op, i) => (
                                    <option key={i} value={op}>
                                      {op}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
