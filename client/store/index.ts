import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { inputReducer, dataReducer } from "./reducer";

const reducers = combineReducers({
  inputs: inputReducer,
  data: dataReducer,
});

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;
