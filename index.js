// Library Code
function createStore(reducer){

  // Store should have four parts
  // 1. The State
  // 2. Get the state
  // 3. Listen to changes on state
  // 4. Update the state
  let state;
  const getState = () => state;

  let listener = [];
  const subscribe = (func) => {
    listener.push(func);
  }

  const dispatch = (action) => {
    state = reducer(state, action);
    listener.forEach((listener) => listener())
  }
    
  return {
    getState,
    subscribe,
    dispatch
  }
}


// App Code
// Reducer: must be a pure function
function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.todo]);
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.id);
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case "ADD_GOAL":
      return state.concat([action.goal]);
    case "REMOVE_GOAL":
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

// Redux: Redux uses combineReducers so can delete this.
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
}



// Optional Middleware

function checkAndDispatch(store, action) {
   if (
     action.type === ADD_TODO &&
     action.todo.name.toLowerCase().includes("bitcoin")
   ) {
     return alert("Nope. That's a bad idea.");
   }

   if (
     action.type === ADD_GOAL &&
     action.goal.name.toLowerCase().includes("bitcoin")
   ) {
     return alert("Nope. That's a bad idea.");
   }

   return store.dispatch(action);
}


const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log("The action: ", action);
  const result = next(action);
  console.log("The new state: ", store.getState());
  console.groupEnd();
  return result;
};


// We pass the root reducer to our store because
// the createStore() function can only take in one reducer.

// redux: Redux.createStore(Redux.combineReducers({todos,goals}))
// redux with middleware: Redux.createStore(Redux.combineReducers({todos,goals}), Redux.applyMiddleware(checker, logger))
const store = createStore(app); //pass reducer function

store.subscribe(() => {
  console.log("The new state is: ", store.getState());
});

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 0,
    name: "Walk the dog",
    complete: false,
  },
});
// checkAndDispatch(store, {type.....);

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 1,
    name: "Wash the car",
    complete: false,
  },
});

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 2,
    name: "Go to the gym",
    complete: true,
  },
});

store.dispatch({
  type: "REMOVE_TODO",
  id: 1,
});

store.dispatch({
  type: "TOGGLE_TODO",
  id: 0,
});

store.dispatch({
  type: "ADD_GOAL",
  goal: {
    id: 0,
    name: "Learn Redux",
  },
});

store.dispatch({
  type: "ADD_GOAL",
  goal: {
    id: 1,
    name: "Lose 20 pounds",
  },
});

store.dispatch({
  type: "REMOVE_GOAL",
  id: 0,
});
