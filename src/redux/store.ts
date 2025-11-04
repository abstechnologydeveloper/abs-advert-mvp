import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { authServiceApis } from "./auth/auth-apis";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [authServiceApis.reducerPath]: authServiceApis.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
