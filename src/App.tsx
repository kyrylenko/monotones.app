import { Suspense, lazy, useEffect } from 'react';
import { Route, Navigate, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import Home from './screens/Home';
import SoundPlayers from './components/SoundPlayers';
import useSpaceToggle from './hooks/useSpaceToggle';
import useSleepTimer from './hooks/useSleepTimer';
import { categories } from './constants/soundIds';
import { useAppDispatch } from './store/hooks';
import { mainActions } from './store/mainSlice';
import { decodeShareCode } from './utils/shareCode';
import defaultValues from './constants/defaultValues';

const About = lazy(() => import('./screens/About'));
const Terms = lazy(() => import('./screens/Terms'));

// Applies the sounds and volumes from a shared link (e.g. /share/kb6ce8?name=Evening, old links: /share/kbce) and goes home
const ShareRoute = () => {
  const dispatch = useAppDispatch();
  const { sounds } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name')?.trim().slice(0, defaultValues.mixtureNameMaxLength) || null;

  useEffect(() => {
    if (sounds !== undefined) {
      dispatch(mainActions.setSounds(decodeShareCode(sounds)));
      dispatch(mainActions.setSharedMixName(name));
    }
  }, [sounds, name, dispatch]);

  return <Navigate to='/' replace />;
};

// One set of sounds: /sleep, /relax and /focus show the same screen, the URLs stay for search engines (issue #39)
const SOUND_PATHS = ['/', ...Object.keys(categories).map(category => `/${category}`)];

const App = () => {
  useSpaceToggle();
  useSleepTimer();
  const { pathname } = useLocation();

  return (
    <Layout isSoundScreen={SOUND_PATHS.includes(pathname)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          {SOUND_PATHS.slice(1).map(path => <Route key={path} path={path} element={<Home />} />)}
          <Route path='/about' element={<About />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/share/:sounds?' element={<ShareRoute />} />
        </Routes>
      </Suspense>
      <SoundPlayers />
    </Layout>
  );
};

export default App;
