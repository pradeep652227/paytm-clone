import { atom, selector } from "recoil";
import api from "../api";
export const errorAtom = atom({
    key: "error",
    default: {},
});

export const authAtom = atom({
    key: "auth",
    default: {
        isAuthenticated: false,
        token: "",
        user: {}
    }
});

const dummyUser = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    profilePic: '',
    balance: 0
};
export const userAtom = atom({
    key: "user",
    default: selector({
        key: "userSelector",
        get: getUser

    })
});

export const resetUserSelector = selector({
    key: "resetUser",
    get: ({ get }) => get(userAtom), // Reads the current value of userAtom
    set: async ({ set }) => {
      try {
        const res = await api.get('/api/v1/user');
        const apiData = res.data?.data;
        set(userAtom, { ...apiData.user, balance: apiData.balance }); // ✅ Updates userAtom
      } catch {
        set(userAtom, dummyUser);
      }
    }
  });

async function getUser() {
    return api.get('/api/v1/user')
        .then(res => res.data)
        .then(apiData => {
            const responseData = apiData.data;
            return { ...responseData.user, balance: responseData.balance }
        })
        .catch(() => dummyUser)
}