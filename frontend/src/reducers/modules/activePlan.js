/******** Reducers ********/


const initialState = {
  activePlan: null, 

};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ACTIVE_PLAN_SUCCESS':
      return {
        ...state,
        activePlan: action.data  
      };
    
    case 'CLEAR_ACTIVE_PLAN':
      return {
        ...state,
        activePlan: null  
      };

    case 'LOG_OUT':
      localStorage.removeItem('token');
      return initialState; 

    default:
      return state;
  }
}