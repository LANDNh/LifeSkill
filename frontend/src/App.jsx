import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import CharacterPage from './components/CharacterPage';
import QuestsListPage from './components/QuestsListPage';
import QuestDetailsPage from './components/QuestDetailsPage';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/quests',
        element: <QuestsListPage />
      },
      {
        path: '/quests/:questId',
        element: <QuestDetailsPage />
      },
      {
        path: '/characters/current',
        element: <CharacterPage />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
