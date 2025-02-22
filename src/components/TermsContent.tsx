// src/components/TermsContent.tsx
export default function TermsContent() {
  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-xl font-semibold">Welcome to fromany.country</h2>
      
      <p>Please read these terms carefully. By accepting, you will create an account with fromany.country and agree to our terms of service:</p>
      
      <ul className="list-disc pl-5 space-y-2">
        <li>fromany.country is a tool designed to help you manage your global mobility. While we strive for accuracy, we cannot guarantee the completeness or accuracy of any information provided.</li>
        <li>The tax calculations and residency assessments provided are for informational purposes only. You should consult with qualified professionals for advice specific to your situation.</li>
        <li>You are responsible for maintaining the confidentiality of your account and all activities that occur under it.</li>
        <li>We store and process your data as outlined in our Privacy Policy to provide and improve our services.</li>
        <li>We may update these terms as our services evolve. Continued use of the service after changes constitutes acceptance of the updated terms.</li>
      </ul>

      <p className="mt-4 text-sm text-text">
        By accepting these terms, you acknowledge that you have read and understood these terms, agree to create an account with fromany.country, and agree to be bound by these terms. If you do not agree to these terms, you should not create an account or use this service.
      </p>
    </div>
  );
}
