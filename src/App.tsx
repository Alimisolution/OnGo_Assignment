import { useState } from 'react';
import plansData from './data/plans.json';
import { PlanCatalogue } from './components/PlanCatalogue';
import { type Plan } from './components/PlanCard';
import { CoverStep } from './components/CoverStep';

const plans: Plan[] = plansData as Plan[];

type Step = 'browse' | 'cover' | 'details' | 'review';

function App() {
  // Catalogue State
  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // Quote State
  const [currentStep, setCurrentStep] = useState<Step>('browse');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addonIds, setAddonIds] = useState<string[]>([]);

  // Derived: Get the actual plan object from the ID
  const selectedPlan = plans.find(p => p.id === selectedPlanId) || null;

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

  // Quote Handlers
  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setCurrentStep('cover');
  };

  const handleChangePlan = () => {
    setCurrentStep('browse');
  };

  const handleUpdateQuantity = (newQty: number) => {
    // Enforce 1 to 5 limit strictly
    if (newQty >= 1 && newQty <= 5) {
      setQuantity(newQty);
    }
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

  const handleContinueToDetails = () => {
    // For now, we'll just alert. We will build the Details step next!
    alert("Moving to Customer Details step (coming in Milestone 3)!");
    // setCurrentStep('details'); // Uncomment this in the next milestone
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
      </main>
    </div>
  );
}

export default App;