import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import CharacterPage from './components/CharacterPage';
import QuestsListPage from './components/QuestsListPage';
import QuestDetailsPage from './components/QuestDetailsPage';
import CharactersListPage from './components/CharactersListPage';
import FriendsListPage from './components/FriendsListPage';
import AboutLinks from './components/AboutLinks';
import ItemShopPage from './components/ItemShop';
import GlobalChat from './components/GlobalChat';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const currentCharacter = useSelector(state => state.characters.userCharacter);
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
      {isLoaded && <AboutLinks />}
      {isLoaded && <GlobalChat currentCharacter={currentCharacter} />}
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
      {
        path: '/characters/:characterId',
        element: <CharacterPage />
      },
      {
        path: '/characters',
        element: <CharactersListPage />
      },
      {
        path: '/friends',
        element: <FriendsListPage />
      },
      {
        path: '/items',
        element: <ItemShopPage />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
