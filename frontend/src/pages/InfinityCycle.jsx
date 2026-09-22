import React from 'react';

export default function InfinityCycle() {
  return (
    <iframe
      src="/infinitycycle.html"
      title="Infinity Cycle — Offline Archive (Oct 2008 – Jun 2009)"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        border: 'none',
      }}
    />
  );
}
