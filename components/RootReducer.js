import { removeDatasync, storeDatasync } from "./AsyncStorage";

const initialState = {
  user: {},
  cart:{},
  home: {},
  status: {
    isLogin: false,
    isSubscribed: false
  },
  currentSong: {},
};

export default function RootReducer(state = initialState, action) {
  const setCart=(cart)=>{
    storeDatasync('cart',cart);
  }

  switch (action.type) {
    case 'ADD_USER':
      state.user[action.payload[0]]=action.payload[1]
      return {
        ...state,
          user: state.user,
        };
    case 'REMOVE_USER':
      delete state.user[action.payload]
      return {
        ...state,
          user: state.user,
        };
    case 'SET_HOME' :
      state.home = action.payload
      return {
        ...state,
          home: state.home,
        };
    case 'SET_STATUS' :
      state.status = action.payload
      return {
        ...state,
          isLogin: state.status.isLogin,
          isSubscribed: state.status.isSubscribed,
        };
      case 'SET_CURRENT_SONG':
        state.currentSong = action.payload
        return {
          ...state,
          currentSong: state.currentSong,
        };
      case 'ADD_CART':
        state.cart[action.payload[0]]=action.payload[1]
        setCart(state.cart)
        return {
          ...state,
          cart: state.cart
        };
      case 'ADD_ALL_CART':
        state.cart = action.payload
        return {
          ...state,
          cart: state.cart
        };
      case 'REMOVE_CART':
        delete state.cart[action.payload]
        removeDatasync('cart')
        setCart(state.cart)
        return {
          ...state,
          cart: state.cart
        };
        case 'REMOVE_ALL_CART':
          state.cart = {}
          removeDatasync('cart')
          return {
            ...state,
            cart: state.cart
          };
    default:
      return state;
  }
}