import {configureStore} from '@reduxjs/toolkit'
import productsReducer from './productsSlice'
import filtersReducer from './filtersSlice'

const store = configureStore({
    reducer: {
        products: productsReducer,
        filters: filtersReducer
    }
})

export type AppDispatch = typeof store.dispatch

export default store