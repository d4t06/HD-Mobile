import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
   cartItems: cartItemDetail[];
   payMethod: "cash" | "momo";
   deliveryMethod: "at-store" | "home";
   selectedCartItemId: number[];
};

const initialState: StateType = {
   cartItems: [],
   deliveryMethod: "home",
   payMethod: "cash",
   selectedCartItemId: [],
};

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      setCart(
         state: StateType,
         action: PayloadAction<
            | {
                 variant: "replace";
                 cartItems: cartItemDetail[];
              }
            | {
                 variant: "update";
                 cartItem: Partial<CartItemSchema>;
                 index: number;
                 price: number;
                 change: "whole";
              }
            | {
                 variant: "update";
                 cartItem: Partial<CartItemSchema>;
                 index: number;
                 change: "amount";
              }
            | {
                 variant: "delete";
                 index: number;
              }
         >
      ) {
         const payload = action.payload;

         switch (payload.variant) {
            case "replace":
               state.cartItems = payload.cartItems;
               break;
            case "update": {
               const { change, cartItem, index } = payload;

               Object.assign(state.cartItems[index].item, cartItem);

               if (change === "whole") {
                  state.cartItems[index].price = payload.price;
               }
               break;
            }
            case "delete":
               state.cartItems.splice(payload.index, 1);
               break;
         }
      },
      selectCartItem(
         state: StateType,
         action: PayloadAction<StateType["selectedCartItemId"]>
      ) {
         const payload = action.payload;

         payload.forEach((id) => {
            const index = state.selectedCartItemId.findIndex((i) => id === i);
            if (index === -1) state.selectedCartItemId.push(id);
            else state.selectedCartItemId.splice(index, 1);
         });
      },
      setPayMethod(state: StateType, action: PayloadAction<StateType["payMethod"]>) {
         state.payMethod = action.payload;
      },
      setDeliveryMethod(
         state: StateType,
         action: PayloadAction<StateType["deliveryMethod"]>
      ) {
         state.deliveryMethod = action.payload;
      },
   },
});

export default cartSlice.reducer;

export const { setCart, setDeliveryMethod, setPayMethod, selectCartItem } =
   cartSlice.actions;

export const selectCart = (state: { cart: StateType }) => state.cart;
