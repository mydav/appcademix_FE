import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import userReducer from '../Reducers/userReducer'
import loaderReducer from '../Reducers/loaderReducer'
import errorReducer from '../Reducers/errorReducer'
import loginReducer from '../Reducers/loginReducer'

const initialState = { 
    accessToken: '',
    userInfo:[],
    loading: false,
    errorMessage: ''

}

const combinedReducers = combineReducers({
    accessToken: loginReducer,
    userInfo: userReducer,
    loading: loaderReducer,
    errorMessage: errorReducer
  
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const configureStore = () =>{
    return createStore(
        combinedReducers,
        initialState,
        composeEnhancers(applyMiddleware(thunk))
    )
}