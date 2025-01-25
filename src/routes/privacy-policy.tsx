import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader />
      <main className="prose mx-auto py-4">
        <h1>Privacy Policy</h1>
        <p className="font-bold">Effective date: January 25, 2025</p>
        <p>
          Your privacy is important to us at CashFlow. This Privacy Policy
          explains how we collect, use, and safeguard your personal information.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect essential information such as your email address and
          financial data that you voluntarily provide while using the CashFlow
          application.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          Your data is used to provide, maintain, and enhance our services,
          ensuring accurate tracking of your income and expenses.
        </p>

        <h2>3. Cookies</h2>
        <p>
          CashFlow uses cookies strictly for authentication purposes to ensure a
          secure login experience. No tracking or advertising cookies are used.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We employ industry-standard security measures to protect your personal
          information. However, no method of transmission over the internet is
          100% secure.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal data at
          any time through your account settings.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Your continued
          use of the service after any modifications constitutes acceptance of
          the updated policy.
        </p>
      </main>

      <Footer />
    </>
  );
}
