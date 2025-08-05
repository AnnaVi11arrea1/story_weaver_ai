import React, { useState, useEffect } from 'react';
import { Group } from '../../types';
import { getMyGroups, getPublicGroups } from '../../services/groupService';
import UsersIcon from '../icons/UsersIcon';

const GroupItem = ({ group }: { group: Group }) => (
    <div className="p-3 bg-brand-surface rounded-md hover:bg-brand-border transition-colors cursor-pointer">
        <p className="font-semibold text-brand-text">{group.name}</p>
        <p className="text-xs text-brand-text-muted">{group.description}</p>
    </div>
);

function GroupList(): React.ReactNode {
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [publicGroups, setPublicGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                const [userGroups, discoverGroups] = await Promise.all([
                    getMyGroups(),
                    getPublicGroups()
                ]);
                setMyGroups(userGroups);
                setPublicGroups(discoverGroups);
            } catch (error) {
                console.error("Failed to fetch groups", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div className="bg-brand-secondary rounded-lg shadow-lg flex flex-col h-full overflow-hidden border border-brand-border">
            <div className="p-4 border-b border-brand-border flex items-center gap-2">
                <UsersIcon className="w-6 h-6 text-brand-accent" />
                <h2 className="text-xl font-bold">Groups</h2>
            </div>
            {loading ? <p className="p-4 text-brand-text-muted">Loading groups...</p> : (
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-brand-text mb-2">My Groups</h3>
                    <div className="space-y-2">
                        {myGroups.map(group => <GroupItem key={group._id} group={group}/>)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-brand-text mb-2">Discover</h3>
                    <div className="space-y-2">
                        {publicGroups.map(group => <GroupItem key={group._id} group={group}/>)}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default GroupList;
