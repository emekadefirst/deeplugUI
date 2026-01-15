import { create } from 'zustand';
import { userService, type UserResponse } from '../services/user-service';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UserState {
    users: UserResponse[];
    total: number;
    page: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
    searchTerm: string;

    fetchUsers: (params?: { page?: number; page_size?: number; search?: string; force?: boolean }) => Promise<void>;
    refresh: () => Promise<void>;
    setPage: (page: number) => void;
    setSearchTerm: (term: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    total: 0,
    page: 1,
    pageSize: 20,
    isLoading: false,
    error: null,
    lastFetched: null,
    searchTerm: '',

    fetchUsers: async (params) => {
        const { lastFetched, isLoading, searchTerm, page, pageSize } = get();
        const now = Date.now();

        const isFresh = lastFetched && (now - lastFetched < CACHE_DURATION);
        const hasSearchParam = !!params?.search;
        const hasPaginationParam = params?.page !== undefined || params?.page_size !== undefined;
        const isForced = !!params?.force;

        if (isLoading) return;
        if (!isForced && isFresh && !hasSearchParam && !hasPaginationParam) return;

        set({ isLoading: true, error: null });
        try {
            const currentParams = {
                page: params?.page || page,
                page_size: params?.page_size || pageSize,
                search: params?.search !== undefined ? params.search : searchTerm,
                ...params
            };

            if ('force' in currentParams) delete (currentParams as any).force;

            const response = await userService.getUsers(currentParams);

            set({
                users: response.items,
                total: response.total,
                page: response.page,
                pageSize: response.page_size,
                isLoading: false,
                lastFetched: now
            });
        } catch (error) {
            set({ isLoading: false, error: 'Failed to fetch users' });
            console.error(error);
        }
    },

    refresh: async () => {
        await get().fetchUsers({ force: true });
    },

    setPage: (page: number) => {
        set({ page });
        get().fetchUsers({ force: true });
    },

    setSearchTerm: (term: string) => {
        if (get().searchTerm === term) return;
        set({ searchTerm: term, page: 1 });
        get().fetchUsers({ search: term, force: true });
    }
}));
