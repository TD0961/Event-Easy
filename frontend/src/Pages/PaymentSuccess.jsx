import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tx_ref = params.get("tx_ref");

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="mb-2">Thank you for your payment.</p>
        <p className="text-sm text-gray-500">Transaction Reference: <span className="font-mono">{tx_ref}</span></p>
      </div>
    </div>
  );
}