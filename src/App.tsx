import { Suspense, lazy, useEffect, useRef } from 'react';
import { Route, Navigate, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import Home from './screens/Home';
import SoundPlayers from './components/SoundPlayers';
import useSpaceToggle from './hooks/useSpaceToggle';
import useSleepTimer from './hooks/useSleepTimer';
import usePageMeta from './hooks/usePageMeta';
import useUrlLanguage, { useLocalizedPath } from './hooks/useUrlLanguage';
import { mixPath, starterMixBySlug } from './constants/starterMixes';
import { LEGACY_PAGES, stripLanguage } from './seo';
import { selectActiveStarterMix } from './store/selectors';
import { useAppDispatch, useAppSelector } from './store/hooks';
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

// A starter mix page, e.g. /mix/rainy-evening: the sound screen with that mix in the orbit, paused until play.
// Once the user changes the mix (or picks another one) the page is left for the home page.
const MixRoute = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mix = starterMixBySlug(useParams().slug);
  const activeStarterMix = useAppSelector(selectActiveStarterMix);
  const wasOpened = useRef(false);
  const home = useLocalizedPath()('/');

  useEffect(() => {
    if (mix) {
      dispatch(mainActions.openStarterMix(mix.id));
    }
  }, [mix, dispatch]);

  useEffect(() => {
    if (mix && activeStarterMix === mix.id) {
      wasOpened.current = true;
    } else if (wasOpened.current) {
      navigate(home, { replace: true });
    }
  }, [mix, activeStarterMix, navigate, home]);

  return mix ? <Home /> : <Navigate to={home} replace />;
};

const isSoundScreen = (pathname: string) => {
  const page = stripLanguage(pathname);
  return page === '/' || page.startsWith('/mix/');
};

const App = () => {
  useSpaceToggle();
  useSleepTimer();
  useUrlLanguage();
  usePageMeta();
  const { pathname } = useLocation();

  return (
    <Layout isSoundScreen={isSoundScreen(pathname)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Every page also exists under /uk in Ukrainian (see useUrlLanguage) */}
          <Route path='/uk?' element={<Home />} />
          <Route path='/uk?/mix/:slug' element={<MixRoute />} />
          {Object.entries(LEGACY_PAGES).map(([path, id]) => <Route key={path} path={path} element={<Navigate to={mixPath(id)} replace />} />)}
          <Route path='/uk?/about' element={<About />} />
          <Route path='/uk?/terms' element={<Terms />} />
          <Route path='/share/:sounds?' element={<ShareRoute />} />
        </Routes>
      </Suspense>
      <SoundPlayers />
    </Layout>
  );
};

export default App;
