/******** Reducers ********/

const initialState = {
  data: ''
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_SUCCESS':
      return { ...state, data: action.data };
    case 'SEARCH_OUT':
      return initialState;
    default:
      return state;
  }
}
