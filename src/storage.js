// load state from localStorage
export const loadState = async () => {
    try {
      const serializedState = localStorage.getItem('state');
       if (serializedState === null) {
         return undefined; // reducer will return Redux state, as localstorage is null.
       }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };
  
  export const saveToLocalStorage = async (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (err) {
      console.log("Error!!")
      // ignore error
    }
  };
