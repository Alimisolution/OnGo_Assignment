import { useState, useMemo } from 'react';
import plansData from './data/plans.json';
import { PlanCatalogue } from './components/PlanCatalogue';
import {type Plan } from './components/PlanCard';
import { CoverStep } from './components/CoverStep';
import { CustomerDetailsStep } from './components/CustomerDetailsStep';
import { ReviewStep } from './components/ReviewStep';
import { addons } from './data/addons';

const plans: Plan[] = plansData as Plan[];

type Step = 'browse' | 'cover' | 'details' | 'review';

interface Customer {
  name: string;
  email: string;
  phone: string;
}

function App() {
  // Catalogue State
  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // Quote State
  const [currentStep, setCurrentStep] = useState<Step>('browse');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  
  // Customer State
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
  });

  // Derived: Get the actual plan object from the ID
  const selectedPlan = plans.find(p => p.id === selectedPlanId) || null;

  // Derived: Calculate monthly total using useMemo for performance
  const monthlyTotal = useMemo(() => {
    if (!selectedPlan) return 0;
    const selectedAddons = addons.filter(a => addonIds.includes(a.id));
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const unitSubtotal = selectedPlan.monthlyPrice + addonsTotal;
    return unitSubtotal * quantity;
  }, [selectedPlan, addonIds, quantity]);

  // Catalogue Handlers
  const handleAddToCompare = (id: string) => {
    if (comparedPlanIds.length >= 3 && !comparedPlanIds.includes(id)) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
      return;
    }
    if (!comparedPlanIds.includes(id)) {
      setComparedPlanIds([...comparedPlanIds, id]);
    }
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparedPlanIds(comparedPlanIds.filter(planId => planId !== id));
  };

  // Quote Navigation Handlers
  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setCurrentStep('cover');
  };

  const handleChangePlan = () => setCurrentStep('browse');
  const handleUpdateQuantity = (newQty: number) => {
    if (newQty >= 1 && newQty <= 5) setQuantity(newQty);
  };

  const handleToggleAddon = (addonId: string) => {
    if (addonIds.includes(addonId)) {
      setAddonIds(addonIds.filter(id => id !== addonId));
    } else {
      setAddonIds([...addonIds, addonId]);
    }
  };

  const handleResetCover = () => {
    setQuantity(1);
    setAddonIds([]);
  };

  const handleContinueToDetails = () => setCurrentStep('details');
  const handleBackToCover = () => setCurrentStep('cover');
  const handleContinueToReview = () => setCurrentStep('review');
  const handleEditDetails = () => setCurrentStep('details');

  const handleSubmitQuote = () => {
    // We will build the actual submission logic in Milestone 5!
    alert('Quote submitted! (Submission logic coming in Milestone 5)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center gap-3">
          <img src="/Picture1.png" alt="OnGo Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">OnGo Insurance</h1>
        </div>
      </header>

      <main className="py-8">
        {showLimitWarning && (
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm" role="alert">
              <p className="font-bold">Comparison Limit Reached</p>
              <p className="text-sm">You can only compare up to 3 plans at a time. Please remove a plan to add another.</p>
            </div>
          </div>
        )}

        {currentStep === 'browse' && (
          <PlanCatalogue 
            plans={plans}
            comparedPlanIds={comparedPlanIds}
            onAddToCompare={handleAddToCompare}
            onRemoveFromCompare={handleRemoveFromCompare}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentStep === 'cover' && selectedPlan && (
          <CoverStep
            selectedPlan={selectedPlan}
            quantity={quantity}
            addonIds={addonIds}
            onChangePlan={handleChangePlan}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleAddon={handleToggleAddon}
            onResetCover={handleResetCover}
            onContinue={handleContinueToDetails}
          />
        )}

        {currentStep === 'details' && (
          <CustomerDetailsStep
            customer={customer}
            onUpdateCustomer={setCustomer}
            onBack={handleBackToCover}
            onContinue={handleContinueToReview}
          />
        )}

        {currentStep === 'review' && selectedPlan && (
          <ReviewStep
            selectedPlan={selectedPlan}
            quantity={quantity}
            addonIds={addonIds}
            customer={customer}
            monthlyTotal={monthlyTotal}
            onEditCover={handleChangePlan}
            onEditDetails={handleEditDetails}
            onSubmit={handleSubmitQuote}
          />
        )}
      </main>
    </div>
  );
}

export default App;