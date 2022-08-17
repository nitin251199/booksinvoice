import {removeDatasync, storeDatasync} from './AsyncStorage';

const initialState = {
  user: {},
  cart: {},
  home: {},
  language: '',
  status: {
    isLogin: false,
    isSubscribed: false,
  },
  currentSong: {},
  theme: 'dark',
};

export default function RootReducer(state = initialState, action) {
  const setCart = cart => {
    storeDatasync('cart', cart);
  };
  const setLanguage = language => {
    storeDatasync('languageid', language);
  };
  const setStatus = status => {
    storeDatasync('isSubscribed', status.isSubscribed);
    storeDatasync('isLogin', status.isLogin);
  };
  const setTheme = theme => {
    storeDatasync('theme', theme);
  }

  switch (action.type) {
    case 'SET_THEME':
      state.theme = action.payload;
      setTheme(action.payload);
      return {
        ...state,
        theme: state.theme,
      };
    case 'ADD_USER':
      state.user[action.payload[0]] = action.payload[1];
      return {
        ...state,
        user: state.user,
      };
    case 'REMOVE_USER':
      delete state.user[action.payload];
      return {
        ...state,
        user: state.user,
      };
    case 'SET_HOME':
      state.home = action.payload;
      return {
        ...state,
        home: state.home,
      };
    case 'SET_STATUS':
      state.status = action.payload;
      setStatus(action.payload);
      return {
        ...state,
        isLogin: state.status.isLogin,
        isSubscribed: state.status.isSubscribed,
      };
    case 'SET_CURRENT_SONG':
      state.currentSong = action.payload;
      return {
        ...state,
        currentSong: state.currentSong,
      };
    case 'SET_LANG':
      state.language = action.payload;
      setLanguage(action.payload);
      return {
        ...state,
        language: state.language,
      };
    case 'ADD_CART':
      state.cart[action.payload[0]] = action.payload[1];
      setCart(state.cart);
      return {
        ...state,
        cart: state.cart,
      };
    case 'ADD_ALL_CART':
      state.cart = action.payload;
      return {
        ...state,
        cart: state.cart,
      };
    case 'REMOVE_CART':
      delete state.cart[action.payload];
      removeDatasync('cart');
      setCart(state.cart);
      return {
        ...state,
        cart: state.cart,
      };
    case 'REMOVE_ALL_CART':
      state.cart = {};
      removeDatasync('cart');
      return {
        ...state,
        cart: state.cart,
      };
    default:
      return state;
  }
}
