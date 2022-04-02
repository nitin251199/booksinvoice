const initialState = {
  user: {},
  home: {},
  status: {
    isLogin: false,
    isSubscribed: false
  },
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
        };
    default:
      return state;
  }
}

