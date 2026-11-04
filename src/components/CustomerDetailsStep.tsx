import React, { useState, useRef } from 'react';

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface CustomerDetailsStepProps {
  customer: Customer;
  onUpdateCustomer: (customer: Customer) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CustomerDetailsStep: React.FC<CustomerDetailsStepProps> = ({
  customer,
  onUpdateCustomer,
  onBack,
  onContinue,
}) => {
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  
  // useRef gives us direct access to the DOM elements (the input fields)
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof Customer, value: string) => {
    onUpdateCustomer({ ...customer, [field]: value });
    // Clear the error for this specific field as soon as the user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    // 1. Name validation: Trim and check length
    const trimmedName = customer.name.trim();
    if (trimmedName.length < 2) {
      newErrors.name = 'Enter a name with at least 2 characters.';
    }

    // 2. Email validation: Basic regex check for name@domain.tld with no spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    // 3. Phone validation: Exactly 11 digits after trimming
    const trimmedPhone = customer.phone.trim();
    const isPhoneValid = /^\d{11}$/.test(trimmedPhone);
    if (!isPhoneValid) {
      newErrors.phone = 'Enter an 11-digit phone number.';
    }

    setErrors(newErrors);

    // If there are errors, focus the FIRST invalid field in order: name, email, phone
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.phone) phoneRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onContinue();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Details</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            ref={nameRef}
            value={customer.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            ref={emailRef}
            value={customer.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            ref={phoneRef}
            value={customer.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-red-600 text-sm mt-1" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
};