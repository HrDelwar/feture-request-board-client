import moment from 'moment';
import React from 'react';

export default function CommentsDetails({ comment }) {
  console.log({ comment });
  return (
    <div className="bg-gray-300 rounded-md text-gray-600 p-2 pt-1 my-2">
      <div className="">
        <div className="uppercase bg-purple-500 rounded-full inline-block px-3 py-1 text-2xl font-bold text-white ">
          {comment?.user?.name[0]}
        </div>
        <p></p>
      </div>
      <p className="bg-gray-200 rounded px-2 py-1 md:ml-12">
        {comment.message}
      </p>
      <small>{moment(comment.createdAt).startOf().fromNow()}</small>
    </div>
  );
}
