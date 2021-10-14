import moment from 'moment';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import CommentsDetails from './CommentsDetails';
import { useForm } from 'react-hook-form';
import ModalImage from 'react-modal-image';
import { Lightbox } from 'react-modal-image';

export default function FeatureRequestDetails({
  request,
  setOpenModal,
  loggedIn,
}) {
  const [showComment, setShowComment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, setFeatureRequests, featureRequests } = useContext(UserContext);

  const { title, description, votes, comments, logo, createdAt, status, _id } =
    request;

  const statusColor =
    status === 'complete'
      ? ' text-green-700'
      : status === 'in-progress'
      ? ' text-yellow-700 '
      : status === 'planned'
      ? ' text-purple-600'
      : ' text-red-300';

  const onSubmit = async (data, e) => {
    const newComments = [
      { message: data.comment, user: user._id, createdAt: new Date() },
      ...comments,
    ];
    try {
      const response = await fetch('http://localhost:8000/feature/comment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: newComments, _id }),
      });
      const result = await response.json();
      if (result.success) {
        setFeatureRequests([
          ...featureRequests.map((item) => {
            if (item._id === _id) {
              item.comments = result.feature.comments;
            }
            return item;
          }),
        ]);
        e.target.reset();
      }
    } catch (err) {
      console.log({ commentERR: err });
    }
  };

  const handleVote = async () => {
    if (loggedIn) {
      const newVotes = votes.find((item) => item === user._id)
        ? votes.filter((item) => item !== user._id)
        : [...votes, user._id];
      try {
        const response = await fetch('http://localhost:8000/feature/vote', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ votes: newVotes, _id }),
        });
        const result = await response.json();
        if (result.success) {
          setFeatureRequests([
            ...featureRequests.map((item) => {
              if (item._id === _id) {
                item.votes = result.feature.votes;
              }
              return item;
            }),
          ]);
        }
      } catch (err) {
        console.log({ voteERR: err });
      }
    } else {
      setOpenModal(true);
    }
  };

  return (
    <div className="py-2  bg-gray-200 my-3 px-2 pr-4 relative rounded">
      {logo && (
        <div className="w-24 shadow-md h-24 overflow-hidden rounded-md cursor-pointer">
          <ModalImage small={logo} alt={title} large={logo} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2 relative">
            <button className="" onClick={handleVote}>
              {votes.find((item) => item === user._id) ? '❤️' : '🖤'}
            </button>
            <span className="md:text-gray-500 absolute md:static -top-1 left-3 bg-indigo-500 md:bg-transparent text-white  rounded-full px-1 md:px-0 text-xs md:text-base ">
              {votes.length}
            </span>
          </div>
          <div className="flex  items-center">
            <h3 className="capitalize text-gray-800 mr-2">{title}</h3>
            <small className="text-gray-500">
              {moment(createdAt).format('ddd, DD MMM YYYY')}
            </small>
          </div>
        </div>
        <div className="">
          <button
            onClick={() => {
              if (loggedIn) {
                setShowComment(!showComment);
              } else {
                setOpenModal(true);
              }
            }}
            className="relative"
          >
            <span>🗨️</span>
            <span className="absolute -top-1 left-3 bg-red-500 text-white rounded-full px-1 text-xs">
              {comments.length}
            </span>
          </button>
        </div>
      </div>

      <p className={'md:pl-9 uppercase text-sm ' + statusColor}>{status}</p>

      <div className=" md:pl-9">
        <p className="text-gray-600">{description}</p>
      </div>
      {showComment ? (
        <div>
          {comments.map((comment, index) => (
            <CommentsDetails key={index} comment={comment} />
          ))}
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex mt-3 flex-col p-2 pb-3 rounded-md bg-gray-100">
              <label
                htmlFor="comment"
                className="uppercase text-gray-500 text-sm"
              >
                comment
              </label>
              <textarea
                {...register('comment', { required: true })}
                rows="3"
                name="comment"
                id="comment"
                className="text-gray-500 bg-transparent   focus:outline-none  placeholder-gray-400"
                placeholder="Wright a comment.."
              ></textarea>
              {errors.comment && (
                <p className="text-center text-red-500">Comment is required</p>
              )}
            </div>
            <div className="flex justify-center mt-3 items-center">
              <input
                type="submit"
                className="px-3 bg-indigo-600 font-bold text-white hover:bg-indigo-700 py-2 rounded cursor-pointer uppercase text-sm"
                value="comment"
              />
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
