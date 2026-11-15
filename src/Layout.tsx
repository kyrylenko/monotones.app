import type { ReactNode } from 'react';
import Header from './components/Header';
import './App.css';

// Full-height app: the header on top, the page below. The sound screen shows the name of the mix in the header.
const Layout = ({ children, isSoundScreen }: { children: ReactNode; isSoundScreen: boolean }) => (
  <div className={`app${isSoundScreen ? ' app-sounds' : ''}`}>
    <Header showMixTitle={isSoundScreen} />
    <main className='app-main'>
      {children}
    </main>
  </div>
);

export default Layout;
