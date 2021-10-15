import React, { useContext, useEffect, useState } from 'react';
import { filter, sortBy } from 'underscore';
import { UserContext } from '../../App';
import FeatureRequestDetails from './FeatureRequestDetails';

export default function AllRequest({ openModal, loggedIn, setOpenModal }) {
  const {
    featureRequests,
    setFeatureRequests,
    fixedFeatureRequests,
    setFixedFeatureRequests,
  } = useContext(UserContext);
  const [sorting, setSorting] = useState('az');
  const [searchValue, setSearchValue] = useState('');
  const [afterSearch, setAfterSearch] = useState(false);
  const [allName, setAllName] = useState([]);

  const [allStatus, setAllStatus] = useState([]);
  useEffect(() => {
    fetch('https://mysterious-sands-20308.herokuapp.com/form/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const newAllName = data?.form?.requestForm.map((item) => {
            if (item.name === 'status') {
              setAllStatus(item.options);
            }
            return item.name === 'status' ||
              item.name === 'title' ||
              item.name === 'logo'
              ? null
              : item.name;
          });
          setAllName(newAllName);
        } else {
          console.log({ allReqERr: data.message });
        }
      })
      .catch((err) => {
        console.log({ allReqERr: err });
      });

    loadAllFeature();
  }, []);

  const loadAllFeature = async () => {
    fetch('https://mysterious-sands-20308.herokuapp.com/feature/all')
      .then((res) => res.json())
      .then((result) => {
        setFeatureRequests(sortBy(result.features, 'createdAt').reverse());
        setFixedFeatureRequests(sortBy(result.features, 'createdAt').reverse());
      })
      .catch((err) => {
        console.log({ featureERr: err });
      });
  };

  const handleSorting = async (e) => {
    const value = e.target.value;
    if (value === 'az') {
      setFeatureRequests(sortBy(featureRequests, 'title'));
      setSorting('title');
    }
    if (value === 'comments') {
      setFeatureRequests(sortBy(featureRequests, 'comments').reverse());
      setSorting('comments');
    }
    if (value === 'new') {
      setFeatureRequests(sortBy(featureRequests, 'createdAt').reverse());
      setSorting('createdAt');
    }
    if (value === 'votes') {
      setFeatureRequests(sortBy(featureRequests, 'votes').reverse());
      setSorting('votes');
    }
    if (value === 'random') {
      setFeatureRequests(sortBy(featureRequests, (item) => Math.random()));
    }
  };

  const handleFilleter = (e) => {
    if (e.target.value === 'all') {
      if (afterSearch) {
        loadAllFeature();
        setAfterSearch(false);
      }
      setFeatureRequests(
        sorting === 'comments' || sorting === 'votes'
          ? sortBy(fixedFeatureRequests, sorting).reverse()
          : sortBy(fixedFeatureRequests, sorting)
      );
    } else {
      setFeatureRequests(
        sorting === 'comments' || sorting === 'votes'
          ? sortBy(
              [
                ...filter(
                  fixedFeatureRequests,
                  (item) => item.status === e.target.value
                ),
              ],
              sorting
            ).reverse()
          : sortBy(
              [
                ...filter(
                  fixedFeatureRequests,
                  (item) => item.status === e.target.value
                ),
              ],
              sorting
            )
      );
    }
  };

  const handleSearchFeature = async (e) => {
    e.preventDefault();
    setAfterSearch(true);
    if (searchValue) {
      try {
        const response = await fetch(
          `https://mysterious-sands-20308.herokuapp.com/feature/search/${searchValue}`
        );
        const result = await response.json();
        console.log({ result });
        if (result.success) {
          setFeatureRequests(sortBy(result.features, 'createdAt').reverse());
          setFixedFeatureRequests(
            sortBy(result.features, 'createdAt').reverse()
          );
        } else {
          alert(result.message);
        }
        e.target.reset();
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert('Enter a value and search again');
    }
  };

  return (
    <div className="md:pl-8">
      <div className="flex relative justify-between items-center">
        <div className="flex md:justify-center flex-col md:flex-row md:items-center">
          <div className="capitalize mb-3 md:mb-0">
            Sort by
            <select
              name="sort"
              className="bg-gray-300  text-gray-600 capitalize text-sm rounded mx-2 "
              id="sort"
              onChange={handleSorting}
            >
              <option value="new">new</option>
              <option value="votes">votes</option>
              <option value="comments">comments</option>
              <option value="random">random</option>
              <option value="az">A-Z</option>
            </select>
          </div>
          <div className="capitalize">
            filter by
            <select
              name="sort"
              className="bg-gray-300  text-gray-600 capitalize text-sm rounded mx-2 "
              id="sort"
              onChange={handleFilleter}
              defaultValue="all"
            >
              <option value="all">all</option>
              {allStatus.map((s, i) => (
                <option key={i} value={s.value}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right  ">
          <form action="" onSubmit={handleSearchFeature}>
            <input
              type="text"
              name="search"
              id="search"
              className="bg-gray-300 transition-all rounded px-2 py-1 w-40 focus:absolute right-0 focus:w-full top-0  outline-none focus:outline-none text-gray-500 "
              placeholder="Press Enter fro search"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <input type="submit" hidden />
          </form>
        </div>
      </div>

      <div className="">
        {featureRequests.map((request) => (
          <FeatureRequestDetails
            openModal={openModal}
            setOpenModal={setOpenModal}
            key={request._id}
            request={request}
            loggedIn={loggedIn}
            allName={allName}
          />
        ))}
      </div>
    </div>
  );
}
