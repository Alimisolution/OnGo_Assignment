import { type Plan } from '../components/PlanCard';
import { addons } from '../data/addons';
import plansData from '../data/plans.json';

const plans: Plan[] = plansData as Plan[];

export const DRAFT_KEY = 'ongo-quote-draft-v1';

export interface Draft {
  version: number;
  comparedPlanIds: string[];
  selectedPlanId: string | null;
  quantity: number;
  addonIds: string[];
  customer: { name: string; email: string; phone: string };
  step: 'browse' | 'cover' | 'details' | 'review';
}

export const defaultDraft: Draft = {
  version: 1,
  comparedPlanIds: [],
  selectedPlanId: null,
  quantity: 1,
  addonIds: [],
  customer: { name: '', email: '', phone: '' },
  step: 'browse',
};

export function loadDraft(): { draft: Draft; warning: string | null } {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return { draft: defaultDraft, warning: null };

    const parsed = JSON.parse(raw);
    
    // 1. Check version and basic shape
    if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
      return { draft: defaultDraft, warning: 'Invalid draft version or format. Starting fresh.' };
    }

    // 2. Validate and sanitize each field
     const comparedPlanIds: string[] = Array.isArray(parsed.comparedPlanIds) 
      ? parsed.comparedPlanIds.filter((id: any): id is string => typeof id === 'string' && plans.some(p => p.id === id))
      : [];
      
    const uniqueCompared = Array.from(new Set(comparedPlanIds)).slice(0, 3); // Max 3

    const selectedPlanId = typeof parsed.selectedPlanId === 'string' && plans.some(p => p.id === parsed.selectedPlanId)
      ? parsed.selectedPlanId
      : null;

    const quantity = typeof parsed.quantity === 'number' && Number.isInteger(parsed.quantity) && parsed.quantity >= 1 && parsed.quantity <= 5
      ? parsed.quantity
      : 1;

    const addonIds: string[] = Array.isArray(parsed.addonIds)
      ? Array.from(new Set(parsed.addonIds.filter((id: any): id is string => typeof id === 'string' && addons.some(a => a.id === id))))
      : [];

    const customer = parsed.customer && typeof parsed.customer === 'object'
      ? {
          name: typeof parsed.customer.name === 'string' ? parsed.customer.name : '',
          email: typeof parsed.customer.email === 'string' ? parsed.customer.email : '',
          phone: typeof parsed.customer.phone === 'string' ? parsed.customer.phone : '',
        }
      : { name: '', email: '', phone: '' };

    // 3. Validate step and prerequisites
    const validSteps = ['browse', 'cover', 'details', 'review'];
    let step = validSteps.includes(parsed.step) ? parsed.step : 'browse';

    if (step !== 'browse' && !selectedPlanId) step = 'browse';
    if (step === 'review' && (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim())) step = 'details';
    if (step === 'details' && !selectedPlanId) step = 'browse';

    return {
      draft: { version: 1, comparedPlanIds: uniqueCompared, selectedPlanId, quantity, addonIds, customer, step },
      warning: null
    };
  } catch (e) {
    // Catches malformed JSON or localStorage access errors
    return { draft: defaultDraft, warning: 'Could not read saved draft (invalid JSON). Starting fresh.' };
  }
}

export function saveDraft(draft: Draft): string | null {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return null;
  } catch (e) {
    return 'Could not save your progress. Storage might be full or disabled.';
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    // ignore
  }
}