import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Navigate, Routes, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from './Layout';
import Home from './screens/Home';
import SoundPlayers from './components/SoundPlayers';
import GlobalPlayPause from './components/GlobalPlayPause';
import useSpaceToggle from './hooks/useSpaceToggle';
import useSleepTimer from './hooks/useSleepTimer';
import { categories } from './constants/soundIds';
import { mainActions } from './store/mainSlice';
import { decodeShareCode } from './utils/shareCode';

const About = lazy(() => import('./screens/About'));
const Terms = lazy(() => import('./screens/Terms'));

// Applies the sounds from a shared link (e.g. /share/kbce) and goes home
const ShareRoute = () => {
  const dispatch = useDispatch();
  const { sounds } = useParams();

  useEffect(() => {
    if (sounds !== undefined) {
      dispatch(mainActions.setSounds(decodeShareCode(sounds)));
    }
  }, [sounds, dispatch]);

  return <Navigate to='/' replace />;
};

const App = () => {
  useSpaceToggle();
  useSleepTimer();

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          {Object.keys(categories).map(category => (
            <Route key={category} path={`/${category}`} element={<Home category={category} />} />
          ))}
          <Route path='/about' element={<About />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/share/:sounds?' element={<ShareRoute />} />
        </Routes>
      </Suspense>
      <SoundPlayers />
      <GlobalPlayPause />
    </Layout>
  );
};

export default App;
