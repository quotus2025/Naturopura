import { loadStripe } from '@stripe/stripe-js';

// Ensure environment variable is defined
if (!import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY) {
  throw new Error('VITE_STRIPE_TEST_PUBLISHABLE_KEY is not defined in environment variables');
}

// Initialize Stripe with test key
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY);

// Test card numbers for development
export const TEST_CARDS = {
  success: '4242 4242 4242 4242',
  authenticationRequired: '4000 0027 6000 3184',
  declined: '4000 0000 0000 0002',
  expiry: '12/25',
  cvc: '123'
};