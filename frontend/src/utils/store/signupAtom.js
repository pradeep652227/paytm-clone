import { atom, selector, selectorFamily } from "recoil";

export const formDataAtom = atom({
  key: "signup",
  default: {
    firstName: "",
    lastName: "",
    username: "",
    email : "",
    password: ""
  }
});

export const formFieldSelectorFamily = selectorFamily({
  key: "formFieldSelector",
  get: (fieldName) => ({ get }) => get(formDataAtom)[fieldName],
  set: (fieldName) => ({ set }, newValue) => {
    set(formDataAtom, (prevState) => ({ ...prevState, [fieldName]: newValue }))
  }
})
