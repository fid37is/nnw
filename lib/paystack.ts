// /lib/paystack.ts

/**
 * Creates a Paystack payment configuration object
 * to be passed into <PaystackButton /> in your UI component.
 */
export const initializePaystackPayment = (
  email: string,
  amount: number,
  onSuccess: (reference: any) => void,
  onClose: () => void
) => {
  if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
    throw new Error("Missing Paystack public key");
  }

  return {
    email,
    amount: Math.round(amount * 100), // convert naira → kobo safely
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    text: "Pay Now",
    onSuccess,
    onClose,
  };
};

/**
 * Verifies a Paystack payment using the secret key.
 * Should be used inside your Next.js API route or backend.
 */
export const verifyPaystackPayment = async (reference: string) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error("Missing Paystack secret key");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify Paystack payment");
  }

  return await response.json();
};
