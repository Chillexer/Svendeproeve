import { atom, AtomEffect, selector } from "recoil";
import Basket from "../models/Basket";
import VariantDto from "../models/VariantDto";

export const menuState = atom<boolean>({
  key: "menuState",
  default: false,
});

export const bagState = atom<boolean>({
  key: "bagState",
  default: false,
});

export const searchState = atom<boolean>({
  key: "searchState",
  default: false,
});

export const searchProducts = atom<VariantDto[]>({
  key: "products",
  default: [],
});




const localStorageEffect: (key: string) => AtomEffect<Basket> = (key: string) => ({ setSelf, onSet }) => {
  if (typeof window !== 'undefined') {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  }

  onSet((newValue, _, isReset) => {
    if (typeof window !== 'undefined') {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};

export const BasketData = atom<Basket>({
  key: 'BasketData',
  default: { items: [] },
  effects_UNSTABLE: [
    localStorageEffect('BasketData'),
  ]
});
