const initialState = {
  user: {},
  home: {},
  status: {
    isLogin: false,
    isSubscribed: false
  },
  currentSong: {},
  cart:[]
};

export default function RootReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_USER':
      state.user[action.payload[0]]=action.payload[1]
      return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
          cart: state.cart
        };
    case 'REMOVE_USER':
      delete state.user[action.payload]
      return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
          cart: state.cart
        };
    case 'SET_HOME' :
      state.home = action.payload
      return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
          cart: state.cart
        };
    case 'SET_STATUS' :
      state.status = action.payload
      return {
          user: state.user,
          home: state.home,
          isLogin: state.status.isLogin,
          isSubscribed: state.status.isSubscribed,
          currentSong: state.currentSong,
        };
      case 'SET_CURRENT_SONG':
        state.currentSong = action.payload
        return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
          cart: state.cart
        };
      case 'ADD_CART':
        state.cart.push(action.payload)
        console.log('state cart',state.cart);
        return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
          cart: state.cart
        };
      case 'REMOVE_CART':
        delete state.cart[action.payload]
        return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
          cart: state.cart
        };
    default:
      return state;
  }
}

