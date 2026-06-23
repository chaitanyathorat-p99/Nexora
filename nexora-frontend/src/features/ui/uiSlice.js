import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubscriptionModalOpen: false,
  subscriptionModalMessage: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSubscriptionModal: (state, action) => {
      state.isSubscriptionModalOpen = true;
      state.subscriptionModalMessage = action.payload;
    },
    closeSubscriptionModal: (state) => {
      state.isSubscriptionModalOpen = false;
      state.subscriptionModalMessage = '';
    },
  },
});

export const { openSubscriptionModal, closeSubscriptionModal } = uiSlice.actions;

export default uiSlice.reducer; 