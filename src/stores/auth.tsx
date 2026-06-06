import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IApi } from "@/apis";

// Auth State
export interface AuthState {
	isOnline: boolean;
	userInfo: IApi.UserInfo | null;
	menus: IApi.MenuItem[];
}

// Auth Actions
interface AuthActions {
	setUserInfo: (info: IApi.UserInfo | null) => void;
	setMenus: (menus: IApi.MenuItem[]) => void;
	setIsOnline: (status: boolean) => void;
	resetAuth: () => void;
}

const initialAuthState: AuthState = {
	isOnline: false,
	userInfo: null,
	menus: [],
};

export const useAuthStore = create<AuthState & AuthActions>()(
	devtools(
		(set) => ({
			...initialAuthState,

			setUserInfo: (info) => set({ userInfo: info }),

			setMenus: (menus) => set({ menus }),

			setIsOnline: (status) => set({ isOnline: status }),

			resetAuth: () => set({ isOnline: false, userInfo: null, menus: [] }),
		}),
		{
			name: "auth",
		},
	),
);
