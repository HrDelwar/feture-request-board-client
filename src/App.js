import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './components/Pages/Dashboard';
import Home from './components/Pages/Home';
import NotFound from './components/Pages/NotFound';
import Footer from './components/Shared/Footer';
import Header from './components/Shared/Header';
import './App.css';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [featureRequests, setFeatureRequests] = useState([]);
  const [fixedFeatureRequests, setFixedFeatureRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const initUser = JSON.parse(sessionStorage.getItem('user')) || {};
    setUser(initUser);
    setLoggedIn(sessionStorage.getItem('token') ? true : false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        openModal,
        featureRequests,
        setFeatureRequests,
        setOpenModal,
        setLoggedIn,
        user,
        setUser,
        fixedFeatureRequests,
        setFixedFeatureRequests,
      }}
    >
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
