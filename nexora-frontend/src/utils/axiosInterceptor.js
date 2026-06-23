import axios from 'axios';
import store from '../features/store/index'; // Import your Redux store
import { openSubscriptionModal } from '../features/ui/uiSlice'; // Import the action

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the error is an Axios error and has a response with status 402
    if (error.response && error.response.status === 402) {
      console.log('Axios Interceptor caught 402 error:', error.response.data);
      // Dispatch the action to open the subscription expired modal
      const message = error.response.data?.message || 'Your subscription has expired. Please renew your subscription to continue using our services.';
      store.dispatch(openSubscriptionModal(message));
    }
    // For other errors, or if no 402 status, reject the promise
    return Promise.reject(error);
  }
);

// You can optionally export axios if you need to import the configured instance elsewhere
// export default axios; 