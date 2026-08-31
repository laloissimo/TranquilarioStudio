import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Sessions from './components/Sessions';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import IntakeForm from './pages/IntakeForm';
import FeedbackForm from './pages/FeedbackForm';
import CirkBooking from './pages/CirkBooking';
import CirkTerms from './pages/CirkTerms';

const Home = () => (
  <div className="App bg-sand text-ink">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Sessions />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
  </div>
);

// Blank page at / — invisible, noindex, no title
const BlankPage = () => {
  useEffect(() => {
    document.title = '';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow, noarchive');
  }, []);
  return null;
};

// Wrapper that injects noindex into /lalo and all child routes
const NoIndex = ({ children }) => {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow, noarchive');
    return () => { meta.setAttribute('content', ''); };
  }, []);
  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BlankPage />} />
          <Route path="/lalo" element={<NoIndex><Home /></NoIndex>} />
          <Route path="/intake" element={<IntakeForm />} />
          <Route path="/lalo/intake" element={<NoIndex><IntakeForm /></NoIndex>} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/lalo/feedback" element={<NoIndex><FeedbackForm /></NoIndex>} />
          <Route path="/cirk" element={<CirkBooking />} />
          <Route path="/cirkterms" element={<CirkTerms />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
