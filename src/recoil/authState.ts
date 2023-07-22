import { atom, selector } from "recoil";
import { SignInResponse } from "../api/mutationFns/signin.mutation";

type User = Omit<SignInResponse, 'token'>;

const authState = atom<{
  user: User | null;
  isPending: boolean;
}>({
  key: 'authState',
  default: {
    isPending: false,
    user: null,
  },
});

export const isLoggedIn = selector({
  key: 'isLoggedIn',
  get: ({ get }) => {
    const { user } = get(authState);

    return !!user;
  }
});

export const isLoggedOut = selector({
  key: 'isLoggedOut',
  get: ({ get }) => {
    const { user, isPending } = get(authState);

    return !user && !isPending;
  }
});

export const UserSelector = selector({
  key: 'User',
  get: ({ get }) => {
    const { user } = get(authState);

    return user;
  }
});

export default authState;
