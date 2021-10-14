import React, { useContext } from 'react';
import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom';
import { UserContext } from '../../App';
import AdminDashboard from '../Admin/AdminDashboard';
import UserDashboard from '../User/UserDashboard';

export default function Dashboard() {
  const { path } = useRouteMatch();
  const { loggedIn, user } = useContext(UserContext);
  return (
    <Switch>
      {loggedIn && (
        <>
          <Route exact path={path + '/'}>
            <Redirect
              to={user.role === 'admin' ? path + '/admin' : path + '/user'}
            />
          </Route>
          {user.role === 'admin' ? (
            <Route path={path + '/admin'}>
              <AdminDashboard />
            </Route>
          ) : (
            <Route path={path + '/user'}>
              <UserDashboard />
            </Route>
          )}
        </>
      )}
      <Route path={path + '/*'}>
        <h1>404</h1>
      </Route>
    </Switch>
  );
}
