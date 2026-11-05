# OnGo Insurance Plan Comparison and Quote Builder

## Project Purpose

This is a React application built as a practical assignment to demonstrate proficiency with React hooks (`useState`, `useEffect`, `useRef`), state management, form validation, localStorage persistence, and simulated asynchronous operations.

The application helps a customer browse insurance plans, compare up to three options, build a quote with add-ons, enter customer details, review the quote, and submit a quote request with a simulated backend interaction. It extends a simple cart counter into a complete customer journey with connected state, saved progress, form validation, and clear feedback.

All prices, benefits, and customer records in this project are fictional training data.

---

## Technologies Used

- **React 18** with TypeScript
- **Vite** (build tool and dev server)
- **Tailwind CSS** (styling)
- **localStorage** (draft persistence)
- **Git** (version control with milestone-based commits)

---

## How to Run

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alimisolution/OnGo_Assignment.git
   cd OnGo_Assignment

  
2. Install dependencies 
  npm install


3. Start the development server:
  npm run dev

4. Open your browser to http://localhost:5173

### Build for Production
  npm run build
  npm run preview



# ⚠️ Important: First-Failure Submission Rule
### The first submission attempt after opening the app or starting a new quote WILL FAIL. This is intentional and deterministic for testing purposes.

## How It Works
- First attempt: Fails after 1.5 seconds with the error message: "We could not send your request. Please try again."
- Second attempt (Retry): Succeeds and shows the confirmation screen with a reference like ONGO-DEMO-002

## Why This Rule Exists
- This allows mentors to predictably test both the error path and success path without needing a real backend. - The attempt counter is module-scoped and resets when the user clicks "Start new quote".


## How to Reproduce
1. Complete the quote journey (choose plan, add-ons, customer details)
2. Click "Submit quote request" → First attempt fails
3. Click "Retry submission" → Second attempt succeeds
4. After success, click "Start new quote" → Attempt counter resets to 0
5. Repeat the journey → First attempt fails again, retry succeeds


### Component Structure
src/
├── App.tsx                          # Main app, owns all quote state
├── main.tsx                         # React entry point
├── index.css                        # Tailwind CSS imports
├── data/
│   ├── plans.json                   # 6 insurance plans (fixed catalogue)
│   └── addons.ts                    # 3 optional add-ons (fixed catalogue)
├── components/
│   ├── PlanCatalogue.tsx            # Search, filter, sort, plan grid
│   ├── PlanCard.tsx                 # Individual plan display
│   ├── ComparisonPanel.tsx          # Shows up to 3 compared plans
│   ├── CoverStep.tsx                # Quantity, add-ons, price breakdown
│   ├── CustomerDetailsStep.tsx      # Form with validation and focus
│   ├── ReviewStep.tsx               # Final summary before submission
│   └── SuccessScreen.tsx            # Confirmation after successful submission
└── utils/
    ├── draft.ts                     # localStorage save/load/validate
    └── submission.ts                # Simulated API with first-failure rule



### State Management Decisions
## What I Stored in State (useState)

| State Variable       | Location                | Purpose                                                |
|----------------------|-------------------------|--------------------------------------------------------|
| comparedPlanIds      | App.tsx                 | Array of up to 3 plan IDs for comparison               |
| showLimitWarning     | App.tsx                 | Controls the 3-plan limit warning banner               |
| currentStep          | App.tsx                 | Current step: 'browse' | 'cover' | 'details' | 'review'| 'success' |
| selectedPlanId       | App.tsx                 | ID of the plan chosen for the quote                    |
| quantity             | App.tsx                 | Integer 1–5 for number of units                        |
| addonIds             | App.tsx                 | Array of selected add-on IDs                           |
| customer             | App.tsx                 | Object with name, email, phone                         |
| isSubmitting         | App.tsx                 | Boolean for submission loading state                   |
| submissionError      | App.tsx                 | Error message from failed submission                   |
| successReference     | App.tsx                 | Reference number after successful submission           |
| storageWarning       | App.tsx                 | Warning message if localStorage is unavailable         |
| catalogueKey         | App.tsx                 | Key to force PlanCatalogue remount on "Start over"     |
| search               | PlanCatalogue.tsx       | Immediate text input value                             |
| appliedSearch        | PlanCatalogue.tsx       | Debounced value used for filtering                     |
| category             | PlanCatalogue.tsx       | 'All' | 'Motor' | 'Health' | 'Travel'                  |
| sort                 | PlanCatalogue.tsx       | 'lowToHigh' | 'highToLow'                              |
| errors               | CustomerDetailsStep.tsx | Validation error messages per field                    |


### What I Calculated (Derived State)
| Derived Value  | Location                 | Formula                                           |
|----------------|--------------------------|---------------------------------------------------|
| monthlyTotal   | App.tsx                  | (plan.monthlyPrice + sum(addon prices)) × quantity|
| filteredPlans  | PlanCatalogue.tsx        | Plans filtered by search/category, then sorted    |
| comparedPlans  | PlanCatalogue.tsx        | Full plan objects looked up from comparedPlanIds  |
| selectedPlan   | App.tsx                  | Full plan object looked up from selectedPlanId    |
| selectedAddons | CoverStep.tsx, ReviewStep| Full add-on objects looked up from addonIds       |
| unitSubtotal   | CoverStep.tsx            | plan.monthlyPrice + sum(addon prices)             |


### What Each Ref Points To (useRef)
| Ref Name         | Location                | Purpose                                                |
|------------------|-------------------------|--------------------------------------------------------|
| nameRef          | CustomerDetailsStep.tsx | Direct access to the name input for focus management   |
| emailRef         | CustomerDetailsStep.tsx | Direct access to the email input for focus management  |
| phoneRef         | CustomerDetailsStep.tsx | Direct access to the phone input for focus management  |
| headingRef       | ReviewStep.tsx          | Access to the review heading for scrollIntoView()      |
| searchTimeoutRef | PlanCatalogue.tsx       | Holds the setTimeout ID for debounce cleanup           |
| isSubmittingRef  | App.tsx                 | Guard against double-clicks without causing re-renders |



### What Each Effect Synchronizes (useEffect)
  ## Effect 1: Debounce Search (PlanCatalogue.tsx)
- Dependencies: [search]
- Responsibility: Updates appliedSearch after 400ms of inactivity
- Cleanup: Clears pending timeout when search changes or component unmounts
- Why: Prevents expensive filtering on every keystroke, keeps UI responsive

  ## Effect 2: Auto-Save Draft (App.tsx)
- Dependencies: [comparedPlanIds, selectedPlanId, quantity, addonIds, customer, currentStep]
- Responsibility: Saves draft to localStorage whenever quote state changes
- Cleanup: None needed (localStorage operations are synchronous)
- Why: Persists user progress across page refreshes

  ## Effect 3: Scroll to Review Heading (ReviewStep.tsx)
- Dependencies: [] (runs once on mount)
- Responsibility: Scrolls the review heading into view when the step loads
- Cleanup: None needed
- Why: Ensures user sees the summary immediately when entering the Review step



### Draft Restoration Without Overwriting Defaults
The loadDraft() function in src/utils/draft.ts validates the saved JSON before using it. This prevents the initial default state from overwriting meaningful saved progress.

## Validation Steps
1. Version check: Only accepts version: 1
2. Field type validation: Checks each field is the correct type (string, number, array, object)
3. ID validation: Verifies plan IDs exist in the catalogue, add-on IDs are known
4. Constraint validation: Ensures quantity is an integer 1–5, max 3 comparisons, unique IDs
5. Step prerequisites:
- Won't restore 'cover' step without a valid plan
- Won't restore 'review' step without valid customer details
- Falls back to 'details' or 'browse' if prerequisites fail
- Error handling: Catches malformed JSON and falls back to defaults with a warning



### Example: Invalid JSON Recovery
If the localStorage contains { invalid json }, the JSON.parse() throws an error, which is caught by the try-catch block. The app returns the default draft and shows an orange warning banner: "Could not read saved draft (invalid JSON). Starting fresh."


### Acceptance Check Results
## All 14 acceptance checks from Section 10 of the brief were tested manually. Results:
| ID | Action                                                    | Result | Observation                                                                 |
|----|-----------------------------------------------------------|--------|-----------------------------------------------------------------------------|
| 01 | Open fresh application                                    | ✅ Pass | Shows 6 plans, All category selected, price low to high, no comparison      |
| 02 | Search "MOTOR", choose Motor, sort high to low            | ✅ Pass | After 400ms delay, shows 2 Motor plans with Motor Plus before Motor Starter |
| 03 | Search unmatched word, then Clear filters                 | ✅ Pass | Shows "No plans match your search"; clearing restores all 6 plans           |
| 04 | Compare M01 twice, add H01/T01, then try M02              | ✅ Pass | Each ID appears once; 4th unique plan is blocked with yellow warning        |
| 05 | Remove H01 from comparison; choose a plan directly        | ✅ Pass | Slot becomes available; direct quote selection works independently          |
| 06 | Try quantities 0, 6, and a fraction                       | ✅ Pass | Quantity remains integer 1–5; limits enforced in buttons and manual input   |
| 07 | Use M01, qty 2, add-ons A01/A02; change to M02            | ✅ Pass | Totals: NGN 11,600 then NGN 17,600; selections retained after plan change   |
| 08 | Continue with all customer fields empty                   | ✅ Pass | Red errors appear under each field; name field is auto-focused              |
| 09 | Enter valid details, review, then edit quantity           | ✅ Pass | Review heading scrolls into view; values persist; new total shown           |
| 10 | Type m, mo, mot rapidly; choose plan before delay         | ✅ Pass | Only the latest delayed search applies; leaving cancels pending work        |
| 11 | Refresh on Details; then place invalid JSON in draft key  | ✅ Pass | Valid progress restores; invalid JSON opens safe defaults with warning      |
| 12 | Double-click Submit; retry after first failure            | ✅ Pass | Only one attempt starts; failure retains data; retry succeeds after 1.5s    |
| 13 | Refresh after success; separately test Start over         | ✅ Pass | Saved quote stays cleared after refresh; Start over returns to empty Browse |
| 14 | Use Tab and Enter through the journey on phone-width      | ✅ Pass | Labels visible, focus rings clear, layouts readable, actions accessible     |


### Additional Tests
| Test                                              | Result | Observation                                                                 |
|---------------------------------------------------|--------|-----------------------------------------------------------------------------|
| Reset cover                                       | ✅ Pass | Preserves chosen plan and customer details; resets qty to 1, removes add-ons|
| Start over                                        | ✅ Pass | Confirms with dialog; clears everything; removes draft; app stays empty     |
| Restore Review draft with invalid customer details| ✅ Pass | Returns to Details step instead of Review; user can correct the fields      |
| Storage full / disabled                           | ✅ Pass | Shows orange warning banner; in-memory form remains usable                  |



### Key Design Decisions
1. Debounce Implementation
I separated search (immediate input value) from appliedSearch (debounced value). The useEffect watches search and sets a 400ms timeout. If the user types again before 400ms, the cleanup function clears the old timeout and starts a new one. Only appliedSearch triggers filtering, so the UI stays responsive.

2. useRef vs useState for Timeout
I used useRef for searchTimeoutRef because I need to access and clear the same timer ID across multiple renders without causing re-renders. If I used useState for the timer ID, updating it would trigger unnecessary re-renders.

3. Preventing Double-Clicks
I used both useState (isSubmitting) for UI feedback (disabling the button) and useRef (isSubmittingRef) as a guard in the handler. The ref persists across renders without causing re-renders, and I check it at the very start of handleSubmitQuote to ensure only one submission can be in-flight at a time.

4. Draft Validation
I didn't just trust the localStorage data. I validated every single field: checked if plan IDs actually exist in the catalogue, ensured quantity is an integer between 1 and 5, and verified step prerequisites (like not allowing the 'review' step if the customer details are empty). If the JSON was malformed, I caught the error and fell back to defaults with a warning.

5. Derived State for Pricing
Instead of storing monthlyTotal in useState, I calculate it directly during rendering based on quantity and addonIds. This follows React best practices and prevents the total from ever getting out of sync with the inputs.

6. Focus Management with useRef
I used useRef to get direct access to the DOM input elements. When validation fails, I use the .focus() method on the ref of the first invalid field to guide the user's attention exactly where they need to fix it.

7. Auto-Scroll on Review
I attached a ref to the review heading and used useEffect with an empty dependency array []. This ensures that as soon as the Review component mounts, it automatically scrolls that heading into the user's view using scrollIntoView().



### Known Limitations
- No backend integration: Submission is simulated with a 1.5s delay
- Basic email validation: Uses a simple regex; does not verify domain existence
- No phone formatting: Does not format phone numbers or support country codes
- No screen reader testing: Only keyboard navigation (Tab/Enter) was tested
- No real network errors: Simulated errors are deterministic, not random
- No offline support: localStorage is used, but no Service Worker for offline functionality
- No analytics or tracking: No event tracking or user behavior logging
- No multi-language support: English only
- No dark mode: Light theme only
- No real image upload: Logo is a static file in /public



### Git Commit History
## Each milestone was committed separately as required by the brief:

1. Initial commit: Initialize project and also added plans dummy data
2. Milestone 1.1: Milestone 1.1: Build Plan Catalogue, basic filtering, sorting, and comparison panel foundation
3. Milestone 1.2: Milestone 1.2: Add 400ms debounce search with useEffect/useRef, enforce 3-plan comparison limit, and implement clear filters
4. Milestone 2: Milestone 2: Build Cover Step with quantity limits (1-5), add-on toggles, and dynamic itemised price calculation
5. Milestone 3: Milestone 3: Build Customer Details with validation and useRef focus, and Review Step with auto-scroll
6. Milestone 4: Milestone 4: Add localStorage persistence, draft validation, auto-save, and Start over functionality
7. Milestone 4 fix: Milestone 4: Fix TypeScript type inference for draft validation arrays
8. Milestone 5: Milestone 5: Add submission simulation with first-failure rule, retry logic, success screen, and draft cleanup
9. Cleanup: Remove unused Customer interface from App.tsx


### Demonstration Scenarios
## When demonstrating the app to a mentor, show these key scenarios in order:

# Scenario 1: Browse and Compare
1. Show all 6 plans on initial load
2. Search for "Motor" → wait 400ms → show 2 plans
3. Add M01, H01, T01 to comparison → show comparison panel
4. Try to add M02 → show yellow warning banner


# Scenario 2: Build a Quote
1. Choose M01 (Motor Starter)
2. Set quantity to 2
3. Check A01 (Priority support) and A02 (Document assistance)
4. Show price breakdown: (5,000 + 500 + 300) × 2 = NGN 11,600
4. Click "Change plan" → choose M02 → show total updates to NGN 17,600


# Scenario 3: Form Validation
1. Go to Customer Details
2. Leave all fields empty → click Continue
3. Show red errors, name field auto-focused
4. Enter valid details: Demo Learner, learner@example.com, 08000000000
5. Click Continue → Review heading scrolls into view


# Scenario 4: Persistence
1. On Review screen, refresh the page
2. Show that all progress is restored
3. Open DevTools → Application → Local Storage
4. Change the draft JSON to { invalid json }
5. Refresh → show orange warning, app loads with defaults


# Scenario 5: Submission
1. Click "Submit quote request" → show "Sending your quote request..."
2. After 1.5s → show red error message
3. Click "Retry submission" → after 1.5s → show green success screen with reference
4. Refresh page → show empty Browse screen (draft cleared)


### Scenario 6: Start Over
1. Click "Start over" → confirm dialog
2. Show empty Browse screen
3. Refresh → still empty


### Assessment Areas (Self-Evaluation)
| Area                                              | Marks | Confidence |
|---------------------------------------------------|-------|------------|
| Catalogue, comparison, pricing and complete journey | 25    | ✅ High    |
| Appropriate state, effects, refs and working cleanup| 30    | ✅ High    |
| Validation, focus, labels and keyboard behaviour  | 15    | ✅ High    |
| Draft reliability, submission states and recovery | 15    | ✅ High    |
| Readable components, README and live explanation  | 15    | ✅ High    |
| **Total**                                         | **100**|            |


### Useful References
- React You Might Not Need an Effect
- React useEffect reference
- React Manipulating the DOM with Refs
- MDN localStorage
- React Updating Arrays in State
- React useState reference


### Author
- Built by Alimi as part of the OnGo React practical assignment.
- Repository: https://github.com/Alimisolution/OnGo_Assignment
- Date: November 2026
