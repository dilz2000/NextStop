export interface PaymentRequest {
    userId: number;
    scheduleId: number;
    travelDate: string;
    amount: number;
    paymentMethodId: string;
    currency: string;
  }
  
  export interface PaymentResponse {
    success: boolean;
    message: string;
    paymentIntentId: string;
    clientSecret: string;
  }
  
  export const processPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
        const modifiedPaymentData = {
            ...paymentData,
            travelDate: paymentData.travelDate // Keep as is, but ensure it's formatted correctly in PaymentStep
          };
      const response = await fetch('http://localhost:8765/payment-service/api/payments/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedPaymentData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: PaymentResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };
  


