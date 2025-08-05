import React from 'react';

function UsersIcon(props: React.SVGProps<SVGSVGElement>): React.ReactNode {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.57-1.002 1.536-1.811 2.628-2.22m-6.38 5.694a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1 4.682-2.72M12 12.75a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm-9 6c0-1.06.311-2.062.842-2.903M15 12.75a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
    </svg>
  );
}
export default UsersIcon;
