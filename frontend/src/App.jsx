import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    // Get the offset position of the header. This is where it will become "sticky".
    const stickyPoint = headerEl.offsetTop;

    const handleScroll = () => {
      // Add the sticky class to the header when user reaches its scroll position.
      // Remove "sticky" when user leaves the scroll position.
      if (window.scrollY > stickyPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100">
      <Header ref={headerRef} isSticky={isSticky} />
      <main style={{ paddingTop: isSticky ? headerRef.current?.offsetHeight || 0 : 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App