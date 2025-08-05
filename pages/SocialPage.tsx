import React from 'react';
import Feed from '../components/social/Feed';
import GroupList from '../components/social/GroupList';
import { SocialUser } from '../types';

interface SocialPageProps {
  currentUser: SocialUser | null;
}

function SocialPage({ currentUser }: SocialPageProps): React.ReactNode {
  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 overflow-hidden">
      <main className="md:col-span-2 lg:col-span-3 h-full overflow-y-auto pr-4">
        <Feed currentUser={currentUser} />
      </main>
      <aside className="h-full flex flex-col">
        <GroupList />
      </aside>
    </div>
  );
}

export default SocialPage;