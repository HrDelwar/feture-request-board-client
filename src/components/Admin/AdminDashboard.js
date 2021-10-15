import React, { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  Route,
  Switch,
  Redirect,
  useRouteMatch,
  NavLink,
} from 'react-router-dom';
import { useState } from 'react/cjs/react.development';
import Swal from 'sweetalert2';
import { result, sortBy } from 'underscore';
import AllFeatureRequest from './AllFeatureRequest';

export default function AdminDashboard() {
  const [form, setForm] = useState([]);
  const [reqFormId, setReqFormId] = useState('');

  const { url, path } = useRouteMatch();

  useEffect(() => {
    fetch('https://mysterious-sands-20308.herokuapp.com/form/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm(sortBy(data.form.requestForm, 'sort'));
          setReqFormId(data.form._id);
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.message,
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'https://mysterious-sands-20308.herokuapp.com/form/update',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({ form: form, _id: reqFormId }),
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
        e.target.reset();
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

  const handleAddField = (e) => {
    e.preventDefault();
    setForm([
      ...form,
      {
        title: '',
        type: '',
        placeholder: '',
        name: '',
        options: [],
        required: false,
      },
    ]);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    form[result.source.index].sort = result.destination.index;
    form[result.destination.index].sort = result.source.index;
    setForm(sortBy([...form], 'sort'));
  };

  return (
    <main
      style={{ minHeight: 'calc(100vh - 85px)' }}
      className="container mx-auto px-4"
    >
      <div className="bg-gray-300 mt-3 py-1 flex justify-center">
        <NavLink
          to={url + '/features'}
          className="px-4 py-2 bg-gray-200  hover:bg-gray-400 hover:text-gray-100 font-bold  rounded ml-2 capitalize inline-block "
          activeClassName=" bg-gray-400 text-gray-100  "
        >
          features
        </NavLink>
        <NavLink
          activeClassName=" bg-gray-400 text-gray-100  "
          to={url + '/form-builder'}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-400 hover:text-gray-100 font-bold  rounded ml-2 capitalize inline-block "
        >
          form builder
        </NavLink>
      </div>

      <Switch>
        <Route exact path={path + '/'}>
          <Redirect to={path + '/features'} />
        </Route>
        <Route path={path + '/features'}>
          <>
            <p className="my-2 text-center text-xl">
              Move card to change the status!
            </p>
            <AllFeatureRequest />
          </>
        </Route>
        <Route path={path + '/form-builder'}>
          <>
            <p className="my-2 text-center text-xl">
              Darg and drop for sorting field!'
            </p>

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="formBuilder">
                {(provided) => (
                  <form
                    onSubmit={onSubmit}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {form.map((item, index) => (
                      <Draggable
                        key={item.name}
                        draggableId={item.name}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="flex bg-gray-300 mt-4 shadow-md rounded flex-wrap"
                          >
                            <div className="flex mt-3 flex-col p-2 pb-3 rounded-md">
                              <label
                                htmlFor="title"
                                className="uppercase text-gray-500 text-sm"
                              >
                                Field label
                              </label>
                              <input
                                onChange={(e) => {
                                  item.title = e.target.value;
                                  setForm([...form]);
                                }}
                                type="text"
                                name="title"
                                defaultValue={item.title}
                                id="title"
                                className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                placeholder="field label"
                              />
                            </div>

                            <div className="flex mt-3 flex-col p-2 pb-3 rounded-md">
                              <label
                                htmlFor="name"
                                className="uppercase text-gray-500 text-sm"
                              >
                                field name
                              </label>
                              <input
                                readOnly={
                                  item.name === 'title' ||
                                  item.name === 'status' ||
                                  item.name === 'logo'
                                    ? true
                                    : false
                                }
                                type="text"
                                name="name"
                                onChange={(e) => {
                                  const eValue = e.target.value;
                                  if (
                                    eValue === 'status' ||
                                    eValue === 'title' ||
                                    eValue === 'logo' ||
                                    eValue === 'description'
                                  ) {
                                    alert(eValue + ' is not duplicate');
                                  } else {
                                    item.name = e.target.value;
                                    setForm([...form]);
                                  }
                                }}
                                defaultValue={item.name}
                                id="name"
                                className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                placeholder="field name"
                              />
                            </div>

                            <div className="flex mt-3 flex-col p-2 pb-3 rounded-md">
                              <label
                                htmlFor="type"
                                className="uppercase text-gray-500 text-sm"
                              >
                                filed type
                              </label>
                              <select
                                defaultValue={item.type}
                                onChange={(e) => {
                                  item.type = e.target.value;
                                  setForm([...form]);
                                }}
                                className="text-gray-500 bg-gray-200  capitalize  focus:outline-none  placeholder-gray-400"
                              >
                                <option value="textarea">textarea</option>

                                <option value="text">text</option>
                                <option value="file">file</option>
                                <option value="select">select</option>
                              </select>
                            </div>

                            {item.type === 'select' && (
                              <div className="flex mt-3 flex-col p-2 pb-3 justify-center rounded-md">
                                <label
                                  htmlFor="placeholder"
                                  className="uppercase text-gray-500 text-sm"
                                >
                                  options
                                </label>
                                {item?.options.map((option, index) => (
                                  <div className="" key={index}>
                                    <input
                                      type="text"
                                      defaultValue={option.title}
                                      name="title"
                                      id={option.title}
                                      className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                      placeholder="option label"
                                      onChange={(e) => {
                                        option.title = e.target.value;
                                        setForm([...form]);
                                      }}
                                    />
                                    <input
                                      type="text"
                                      defaultValue={option.value}
                                      name="value"
                                      id={option.value}
                                      className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                      placeholder="option value"
                                      onChange={(e) => {
                                        option.value = e.target.value;
                                        setForm([...form]);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="bg-red-500 text-white px-1 text-sm font-bold hover:bg-red-600 rounded-full"
                                      onClick={() => {
                                        item.options = [
                                          ...item.options.filter(
                                            (op) => op.value !== option.value
                                          ),
                                        ];
                                        setForm([...form]);
                                      }}
                                    >
                                      X
                                    </button>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  className="bg-blue-500 w-9 mx-auto mt-2  inline-block text-white px-1 py-1 text-lg font-bold hover:bg-blue-600 rounded-full"
                                  onClick={() => {
                                    item.options = [
                                      ...item.options,
                                      { value: '', title: '' },
                                    ];
                                    setForm([...form]);
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {item.type === 'select' || item.type === 'file' ? (
                              <></>
                            ) : (
                              <div className="flex mt-3 flex-col p-2 pb-3 rounded-md">
                                <label
                                  htmlFor="placeholder"
                                  className="uppercase text-gray-500 text-sm"
                                >
                                  field placeholder
                                </label>
                                <input
                                  type="text"
                                  name="placeholder"
                                  defaultValue={item.placeholder}
                                  className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                  onChange={(e) => {
                                    item.placeholder = e.target.value;
                                    setForm([...form]);
                                  }}
                                  id="placeholder"
                                  placeholder="field placeholder"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <div className="flex justify-between mt-5">
                      <button
                        onClick={handleAddField}
                        className="px-3  mr-2 bg-indigo-600 font-bold text-white hover:bg-indigo-700 py-2 rounded cursor-pointer uppercase text-sm"
                      >
                        add field
                      </button>
                      <button
                        type="submit"
                        className="px-3 bg-green-600 font-bold text-white hover:bg-green-700 py-2 rounded cursor-pointer uppercase text-sm"
                      >
                        save
                      </button>
                    </div>
                  </form>
                )}
              </Droppable>
            </DragDropContext>
          </>
        </Route>
      </Switch>
    </main>
  );
}
