import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  Route,
  Switch,
  Redirect,
  useRouteMatch,
  NavLink,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { result } from 'underscore';
import AllFeatureRequest from './AllFeatureRequest';
import { v4 as uuidv4 } from 'uuid';

export default function AdminDashboard() {
  const [reqFormId, setReqFormId] = useState('');
  const [form, setForm] = useState([]);
  const [initForm, setInitForm] = useState([]);

  const { url, path } = useRouteMatch();

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = async () => {
    try {
      const response = await fetch(
        'https://mysterious-sands-20308.herokuapp.com/form/'
      );
      const data = await response.json();
      if (data.success) {
        setForm(data.form.requestForm);
        setInitForm(data.form.requestForm);
        setReqFormId(data.form._id);
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

  const onSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Discard Change`,
    }).then((result) => {
      if (result.isConfirmed) {
        saveForm(e);
      } else if (result.isDenied) {
        setForm([...initForm]);
        toast.info('Your changes is discarded!');
      }
    });
  };

  const saveForm = async (e) => {
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
        dragId: uuidv4(),
        options: [],
        required: false,
      },
    ]);
  };


  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newForm = Array.from(form);
    const [removed] = newForm.splice(result.source.index, 1);
    newForm.splice(result.destination.index, 0, removed);
    setForm([...newForm]);
  };

  const handleOnChange = (e, item) => {
    if (e.target.name === 'title') {
      item.title = e.target.value;
      setForm([...form]);
    }
    if (e.target.name === 'name') {
      const eValue = e.target.value;
      if (
        eValue === 'status' ||
        eValue === 'title' ||
        eValue === 'logo' ||
        eValue === 'description'
      ) {
        toast.info(eValue + ' is not duplicate');
      } else {
        item.name = e.target.value;
        setForm([...form]);
      }
    }
    if (e.target.name === 'type') {
      item.type = e.target.value;
      setForm([...form]);
    }
    if (e.target.name === 'placeholder') {
      item.placeholder = e.target.value;
      setForm([...form]);
    }
  };

  const handleOptionOnChange = (e, option, item) => {
    if (e.target.name === 'title') {
      option.title = e.target.value;
      setForm([...form]);
    }

    if (e.target.name === 'value') {
      if (item.options.some((i) => i.value === e.target.value)) {
        Swal.fire({
          title: 'Info!',
          text:
            `"${e.target.value}"` +
            ' has already in option value. Enter unique value!',
          icon: 'info',
        });
      } else {
        option.value = e.target.value;
        setForm([...form]);
      }
    }
  };

  const handleAddOption = (item) => {
    if (item.options.length > 0) {
      if (item.options[item.options.length - 1].value === '') {
        Swal.fire({
          title: 'Info!',
          text: 'Enter a value for option!',
          icon: 'info',
        });
      } else {
        item.options = [...item.options, { value: '', title: '' }];
        setForm([...form]);
      }
    } else {
      item.options = [...item.options, { value: '', title: '' }];
      setForm([...form]);
    }
  };

  const handleOptionDelete = (item, option) => {
    item.options = [...item.options.filter((op) => op.value !== option.value)];
    console.log({
      options: item.options,
      option: option.value,
    });
    setForm([...form]);
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
          <AllFeatureRequest />
        </Route>
        <Route path={path + '/form-builder'}>
          <div>
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
                        key={item.dragId}
                        draggableId={item.dragId}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className={
                              'flex bg-gray-300 justify-center sm:justify-start   flex-col md:flex-row mt-4 shadow-md rounded flex-wrap ' +
                              (item.type === 'select' ? '' : ' md:items-center')
                            }
                          >
                            <div className="flex mt-3 flex-col p-2 pb-3 rounded-md">
                              <label
                                htmlFor="title"
                                className="uppercase text-gray-500 text-sm"
                              >
                                Field label
                              </label>
                              <input
                                onChange={(e) => handleOnChange(e, item)}
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
                                  handleOnChange(e, item);
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
                                name="type"
                                defaultValue={item.type ? item.type : 'text'}
                                onChange={(e) => {
                                  handleOnChange(e, item);
                                }}
                                className="text-gray-500 bg-gray-200  capitalize  focus:outline-none  placeholder-gray-400"
                              >
                                {item.name === 'status' ? (
                                  <option value="select">select</option>
                                ) : item.name === 'logo' ? (
                                  <option value="file">file</option>
                                ) : (
                                  <>
                                    <option value="text">text</option>
                                    <option value="textarea">textarea</option>
                                    <option value="file">file</option>
                                    <option value="select">select</option>
                                  </>
                                )}
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
                                      id={
                                        option.title
                                          ? option.title
                                          : index.toString()
                                      }
                                      className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                      placeholder="option label"
                                      onChange={(e) =>
                                        handleOptionOnChange(e, option, item)
                                      }
                                    />
                                    <input
                                      type="text"
                                      defaultValue={option.value}
                                      value={option.value}
                                      name="value"
                                      id="value"
                                      className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                      placeholder="option value"
                                      onChange={(e) =>
                                        handleOptionOnChange(e, option, item)
                                      }
                                    />
                                    <button
                                      type="button"
                                      className="bg-red-500 text-white px-1 text-sm font-bold hover:bg-red-600 rounded-full"
                                      onClick={() =>
                                        handleOptionDelete(item, option)
                                      }
                                    >
                                      X
                                    </button>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  className="bg-blue-500 w-9 mx-auto mt-2  inline-block text-white px-1 py-1 text-lg font-bold hover:bg-blue-600 rounded-full"
                                  onClick={() => handleAddOption(item)}
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
                                  defaultValue={
                                    item.placeholder
                                      ? item.placeholder
                                      : 'Enter A value'
                                  }
                                  className="bg-gray-200 mb-1 mr-1 px-1 py-1 text-gray-600 rounded "
                                  onChange={(e) => {
                                    handleOnChange(e, item);
                                  }}
                                  id="placeholder"
                                  placeholder="field placeholder"
                                />
                              </div>
                            )}

                            <div
                              className={
                                ' md:ml-auto mx-auto mb-2 md:mb-0  md:mr-5 ' +
                                (item.type === 'select' ? ' self-center' : ' ')
                              }
                            >
                              {item.name === 'title' ||
                              item.name === 'status' ||
                              item.name === 'logo' ? (
                                <></>
                              ) : (
                                <button
                                  onClick={() => {
                                    const newForm = form.filter(
                                      (p) => p.dragId !== item.dragId
                                    );
                                    setForm(newForm);
                                  }}
                                  type="button"
                                  className="px-4 py-2 text-gray-200 font-bold uppercase rounded-full  inline-block bg-red-500"
                                >
                                  delete
                                </button>
                              )}
                            </div>
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
          </div>
        </Route>
      </Switch>
    </main>
  );
}
