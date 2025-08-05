import React from 'react';

function ShareIcon(props: React.SVGProps<SVGSVGElement>): React.ReactNode {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0v4.5m0-4.5h4.5m-4.5 0H3.375a1.125 1.125 0 0 1-1.125-1.125V6.375a1.125 1.125 0 0 1 1.125-1.125h4.5M16.875 16.125a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0v4.5m0-4.5h4.5m-4.5 0h-4.5M12 9.75v1.5m0 0v1.5m0-1.5h1.5m-1.5 0H9" />
    </svg>
  );
}
export default ShareIcon;
