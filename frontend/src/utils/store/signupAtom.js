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

// Instead of using formDataAtom directly, handle each field separately
export const formFieldSelectorFamily = selectorFamily({
  key: "formFieldSelector",
  get: (fieldName) => ({ get }) => get(formDataAtom)[fieldName],  // Get single field value
  set: (fieldName) => ({ set }, newValue) => {
    set(formDataAtom, (prevState) => {
      // Only update the changed field, preventing unnecessary re-renders
      if (prevState[fieldName] === newValue) return prevState;
      return { ...prevState, [fieldName]: newValue };
    });
  },
});
