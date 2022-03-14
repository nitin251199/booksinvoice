const initialState = {
  user: {},
  home: {},
  isLogin: false
};

export default function RootReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_USER':
      state.user[action.payload[0]]=action.payload[1]
      return {
        user: state.user,
        home: state.home,
        isLogin: state.isLogin
      };
    case 'REMOVE_USER':
      delete state.user[action.payload]
      return {
        user: state.user,
        home: state.home,
        isLogin: state.isLogin
      };
    case 'SET_HOME' :
      state.home = action.payload
      return {
        user: state.user,
        home: state.home,
        isLogin: state.isLogin
      };
    case 'SET_LOGIN':
      state.isLogin = action.payload
      return {
        user: state.user,
        home: state.home,
        isLogin: state.isLogin
      };
    default:
      return state;
  }
}
