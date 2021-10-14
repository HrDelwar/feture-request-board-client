import React from 'react';

export default function Footer() {
  return (
    <footer>
      <p className="text-center text-xl capitalize">
        <span className="text-indigo-500 ">
          &copy;{' '}
          <a
            href="https://linkedin.com/in/hrdelwar"
            rel="noreferrer"
            target="_blank"
          >
            HrDelwar
          </a>
        </span>{' '}
        all right reversed {new Date().getFullYear()}.
      </p>
    </footer>
  );
}
