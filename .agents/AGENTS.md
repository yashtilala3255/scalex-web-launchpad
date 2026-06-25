# Workspace Customization Rules

These rules govern the development of code, components, and pages within this workspace to ensure compliance with legal and security standards.

## Legal Guide for Vibecoding Compliance

### 1. Terms of Service (ToS)
- **Permitted use**: Clearly describe allowed and disallowed activities (e.g., no scraping, no malware transmission).
- **Liability disclaimer**: Limit liability for data loss, downtime, or security breaches.
- **Dispute resolution**: Specify Gujarat/Ahmedabad courts for arbitration or legal proceedings.
- **Account termination**: State authority to suspend/terminate accounts violating terms.
- **Right to modify**: Reserve the right to update ToS at any time with continued use representing acceptance.
- **User-generated content**: Define rules and license grants for user form submissions.

### 2. Privacy Policy
- **Data inventory**: List collected data points explicitly (name, email, phone, company, inquiry text).
- **Purpose of collection**: Explain data use (inquiry response, analytics, service delivery).
- **Third-party disclosure**: Explicitly list subprocessors (Formspree, Supabase, Google Analytics, Stripe).
- **Retention period**: Define retention (e.g., 12 months for lead logs, or active contract duration).
- **User rights**: Document access, correction, deletion, and restriction rights.

### 3. IP & Trademark Checks
- Verify asset commercial licenses before shipping.
- Do not sound confusingly similar to established brands.
- Avoid embedding GPL-licensed snippets in proprietary code.

### 4. Data Safety & Compliance
- Maintain alignment between app forms, website footer policies, and app store configurations.
- Declare city-level location, camera, or photo library permissions if requested.
- Implement cookie consent banner if targeting EU visitors.

### 5. Data Security & Storage
- Always encrypt data in transit (HTTPS) and at rest (Supabase).
- Never store raw passwords. Use BCrypt, Argon2, or secure providers.
- Apply role-based access controls to the database.

### 6. Payment Compliance
- Use compliant, third-party processors (Stripe, Razorpay) — never write custom payment logic.
- Provide clear billing transparency, renewal dates, and cancellation options.

### 7. Children's Privacy (COPPA)
- Enforce age gates if attracting under-13/16 users.
- Never profile or track minor user behavior.

### 8. Email Marketing (GDPR/CAN-SPAM)
- Enforce explicit opt-in (no pre-checked boxes).
- Ensure every marketing email has an unsubscribe link.

### 9. AI Disclosure
- Label AI-generated output clearly.
- Provide human oversight for automated decisions.

### 10. Accessibility (WCAG 2.1 AA)
- Provide image `alt` attributes.
- Support keyboard-only navigation.
- Maintain at least 4.5:1 text color contrast ratios.
