import React, { useEffect, useRef } from 'react';
import { type Plan } from './PlanCard';
import { addons } from '../data/addons';

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface ReviewStepProps {
  selectedPlan: Plan;
  quantity: number;
  addonIds: string[];
  customer: Customer;
  monthlyTotal: number;
  onEditCover: () => void;
  onEditDetails: () => void;
  onSubmit: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  selectedPlan,
  quantity,
  addonIds,
  customer,
  monthlyTotal,
  onEditCover,
  onEditDetails,
  onSubmit,
}) => {
  // useRef to target the heading element for scrolling
  const headingRef = useRef<HTMLHeadingElement>(null);

  // useEffect runs once when the component mounts to scroll to the top
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const selectedAddons = addons.filter(a => addonIds.includes(a.id));
  const formatPrice = (price: number) => `NGN ${price.toLocaleString()}`;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 ref={headingRef} className="text-2xl font-bold text-gray-800 mb-6">
        Review Your Quote
      </h2>

      {/* Cover Summary */}
      <div className="bg-white border rounded-lg p-5 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">Cover Details</h3>
          <button
            onClick={onEditCover}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Edit cover
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Plan:</span> {selectedPlan.name} ({selectedPlan.category})</p>
          <p><span className="font-semibold">Quantity:</span> {quantity}</p>
          <p><span className="font-semibold">Add-ons:</span> {selectedAddons.length > 0 ? selectedAddons.map(a => a.name).join(', ') : 'None'}</p>
          <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold text-blue-700">
            <span>Total Monthly Price</span>
            <span>{formatPrice(monthlyTotal)}</span>
          </div>
        </div>
      </div>

      {/* Customer Summary */}
      <div className="bg-white border rounded-lg p-5 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">Customer Details</h3>
          <button
            onClick={onEditDetails}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Edit details
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Name:</span> {customer.name}</p>
          <p><span className="font-semibold">Email:</span> {customer.email}</p>
          <p><span className="font-semibold">Phone:</span> {customer.phone}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-bold text-lg"
        >
          Submit quote request
        </button>
      </div>
    </div>
  );
};