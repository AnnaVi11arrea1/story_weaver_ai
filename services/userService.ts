import { SocialUser } from '../types';
import { api } from './api';

export const getMe = async (): Promise<SocialUser> => {
    return api.get('/users/me');
};

export const getUserProfile = async (userId: string): Promise<SocialUser> => {
    return api.get(`/users/${userId}`);
};

export const followUser = async (userId: string): Promise<{ following: string[] }> => {
    return api.post(`/users/${userId}/follow`, {});
};

export const unfollowUser = async (userId: string): Promise<{ following: string[] }> => {
    return api.post(`/users/${userId}/follow`, {});
};