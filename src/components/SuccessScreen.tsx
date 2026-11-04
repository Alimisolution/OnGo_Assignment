import React, { useEffect, useRef } from 'react';
import {type Plan } from './PlanCard';

interface SuccessScreenProps {
  reference: string;
  selectedPlan: Plan;
  quantity: number;
  monthlyTotal: number;
  customerName: string;
  onStartNewQuote: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  reference,
  selectedPlan,
  quantity,
  monthlyTotal,
  customerName,
  onStartNewQuote,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const formatPrice = (price: number) => `NGN ${price.toLocaleString()}`;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div ref={headingRef} className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Quote Request Submitted!</h2>
        </div>
        
        <p className="text-gray-700 mb-2">
          Thank you, <span className="font-semibold">{customerName}</span>. Your quote request has been received.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Reference: <span className="font-mono font-bold text-green-700">{reference}</span>
        </p>
      </div>

      <div className="bg-white border rounded-lg p-5 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Submitted Summary</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Plan:</span> {selectedPlan.name} ({selectedPlan.category})</p>
          <p><span className="font-semibold">Quantity:</span> {quantity}</p>
          <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold text-blue-700">
            <span>Total Monthly Price</span>
            <span>{formatPrice(monthlyTotal)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onStartNewQuote}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Start new quote
        </button>
      </div>
    </div>
  );
};