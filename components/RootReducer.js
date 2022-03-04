const initialState = {
  user: {},
  banner: {},
  categories: {},
  books: {
    newArrivals: {},
    topRated: {},
    popularBooks: {},
    premium: {},
  },
  otherCategory: {},
  advertise: {},
};

export default function RootReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_USER':
      // state.user = action.payload
      state.user[action.payload[0]]=action.payload[1]
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'REMOVE_USER':
      delete state.user[action.payload]
    case 'SET_BANNER':
      state.banner = action.payload;
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'SET_CATEGORY':
      state.categories = action.payload
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'SET_NEWARRIVAL':
      state.books.newArrivals = action.payload
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'SET_TOPRATED':
      state.books.topRated = action.payload
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'SET_POPULAR':
      state.books.popularBooks = action.payload
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'SET_PREMIUM':
      state.books.premium = action.payload
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'SET_OTHERCATEGORY':
      state.otherCategory = action.payload
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    case 'SET_ADVERTISE':
      state.advertise = action.payload
      return {
        user: state.user,
        banner: state.banner,
        categories: state.categories,
        books: state.books,
        otherCategory: state.otherCategory,
        advertise: state.advertise,
      };
    default:
      return state;
  }
}
