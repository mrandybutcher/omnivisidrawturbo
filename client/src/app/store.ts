import {Action, configureStore, getDefaultMiddleware, ThunkAction} from "@reduxjs/toolkit";
import rootReducer, {RootState} from "./rootReducer";
import createSagaMiddleware from "redux-saga"
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(), sagaMiddleware]
});

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').rootReducer;
        store.replaceReducer(newRootReducer)
    })
}


export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store

sagaMiddleware.run(rootSaga)

