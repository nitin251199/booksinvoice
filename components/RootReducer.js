const initialState = {
  user: {},
  home: {},
  isLogin: false,
  isSubscribed: false,
  currentSong: {},
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
        };
    case 'REMOVE_USER':
      delete state.user[action.payload]
      return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
        };
    case 'SET_HOME' :
      state.home = action.payload
      return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
        };
    case 'SET_LOGIN':
      state.isLogin = action.payload
      return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
        };
      case 'SET_SUB':
        state.isSubscribed = action.payload
        return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
        };
      case 'SET_CURRENT_SONG':
        state.currentSong = action.payload
        return {
          user: state.user,
          home: state.home,
          isLogin: state.isLogin,
          isSubscribed: state.isSubscribed,
          currentSong: state.currentSong,
        };
    default:
      return state;
  }
}
