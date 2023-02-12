import { atom } from "jotai";

const appDataStore = atom({
  aidn: 0,
  name: "",
  callback: "",
  appchain: "",
  homepage: "",
  description: "",
  logoUrl: "",
  iconUrl: "",
});

export { appDataStore };
