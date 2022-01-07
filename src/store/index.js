import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import menuTreeReducer from "./reducers/menutree_reducer";
import userReducer from "./reducers/user_reducer";
import orgTreeReducer from "./reducers/orgtree_reducer";

import thunk from "redux-thunk";
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(
	combineReducers({
		menuTree: menuTreeReducer, //租户完整菜单树
		orgTree: orgTreeReducer, //租户组织架构树
		userInfo: userReducer,
	}),
	composeEnhancer(applyMiddleware(thunk))
);
