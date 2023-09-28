import { useRouter } from 'next/router';
import React from 'react';

const CmsPages = () => {
  const router = useRouter();
  const { url } = router.query;

  return (
    <div>
      {url ? (
        <h1>{url}</h1>
      ) : (
        <p>No URL specified</p>
      )}
    </div>
  );
};

export default CmsPages;