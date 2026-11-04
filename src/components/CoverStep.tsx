import React from 'react';
import {type Plan } from './PlanCard';
import { addons } from '../data/addons';

interface CoverStepProps {
  selectedPlan: Plan;
  quantity: number;
  addonIds: string[];
  onChangePlan: () => void;
  onUpdateQuantity: (newQty: number) => void;
  onToggleAddon: (addonId: string) => void;
  onResetCover: () => void;
  onContinue: () => void;
}

export const CoverStep: React.FC<CoverStepProps> = ({
  selectedPlan,
  quantity,
  addonIds,
  onChangePlan,
  onUpdateQuantity,
  onToggleAddon,
  onResetCover,
  onContinue,
}) => {
  // DERIVED STATE: Calculate prices dynamically based on current selections
  const selectedAddons = addons.filter(a => addonIds.includes(a.id));
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const unitSubtotal = selectedPlan.monthlyPrice + addonsTotal;
  const monthlyTotal = unitSubtotal * quantity;

  const formatPrice = (price: number) => `NGN ${price.toLocaleString()}`;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{selectedPlan.name}</h2>
          <p className="text-gray-600">{selectedPlan.category} Plan</p>
        </div>
        <button 
          onClick={onChangePlan}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Change plan
        </button>
      </div>

      {/* Quantity Controls */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (1–5)</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={5}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                onUpdateQuantity(Math.min(5, Math.max(1, val)));
              }
            }}
            className="w-20 text-center border rounded py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => onUpdateQuantity(quantity + 1)}
            disabled={quantity >= 5}
            className="w-10 h-10 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Add-ons */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Optional Add-ons (per unit)</label>
        <div className="space-y-3">
          {addons.map(addon => (
            <label key={addon.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={addonIds.includes(addon.id)}
                onChange={() => onToggleAddon(addon.id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-800">{addon.name}</span>
                <span className="text-sm text-gray-500 ml-2">(+ {formatPrice(addon.price)} / month)</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Itemised Price Breakdown */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <h3 className="font-bold text-gray-800 mb-3">Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Base plan (per unit)</span>
            <span>{formatPrice(selectedPlan.monthlyPrice)}</span>
          </div>
          {selectedAddons.map(addon => (
            <div key={addon.id} className="flex justify-between text-gray-600">
              <span>+ {addon.name} (per unit)</span>
              <span>{formatPrice(addon.price)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Subtotal per unit</span>
            <span>{formatPrice(unitSubtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>× Quantity</span>
            <span>{quantity}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-lg font-bold text-blue-700">
            <span>Total Monthly Price</span>
            <span>{formatPrice(monthlyTotal)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={onResetCover}
          className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium"
        >
          Reset cover
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Continue to Details
        </button>
      </div>
    </div>
  );
};