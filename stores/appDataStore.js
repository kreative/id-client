import { atom } from "jotai";

const appDataStore = atom({
  aidn: "",
  name: "",
  callback: "",
});

export { appDataStore };
