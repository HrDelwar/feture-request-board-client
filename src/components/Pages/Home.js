import React from 'react';
import FeatureRequest from '../Others/FeatureRequest';

export default function Home() {
  return (
    <main
      style={{ minHeight: 'calc(100vh - 85px)' }}
      className="container mx-auto px-4"
    >
      <FeatureRequest />
    </main>
  );
}
