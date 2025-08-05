import { Group } from '../types';
import { api } from './api';

export const getMyGroups = async (): Promise<Group[]> => {
    return api.get('/groups/my-groups');
};

export const getPublicGroups = async (): Promise<Group[]> => {
    return api.get('/groups/public');
};

export const createGroup = async (name: string, description: string, isPrivate: boolean): Promise<Group> => {
    return api.post('/groups', { name, description, isPrivate });
};

export const joinGroup = async (groupId: string): Promise<Group> => {
    return api.post(`/groups/${groupId}/join`, {});
};
