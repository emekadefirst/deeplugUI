import axios from 'axios';

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY || '';
const PAYSTACK_URL = import.meta.env.VITE_PAYSTACK_URL || '';


interface PaymentPayload {
  email: string;
  amount: number; // Paystack expects amount in Kobo (integer)
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

/**
 * Initializes a Paystack transaction.
 * @param payload - The payment details (email and amount in Kobo).
 * @returns The Paystack response containing the authorization URL.
 */
export const initializePayment = async (payload: PaymentPayload): Promise<PaystackResponse | null> => {
  try {
    const response = await axios.post<PaystackResponse>(
      `${PAYSTACK_URL}/transaction/initialize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Payment Initialized:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Paystack Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    return null;
  }
};