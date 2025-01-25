import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-use")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader />
      <main className="prose mx-auto px-4 py-4">
        <h1>Terms of Use</h1>

        <p className="font-bold">Effective date: January 25, 2025</p>

        <p>
          Welcome to CashFlow! By accessing or using our application, you agree
          to comply with these Terms of Use. If you do not agree, please do not
          use our application.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Use constitute a legally binding agreement between you
          and CashFlow. By using our services, you acknowledge that you have
          read, understood, and agree to be bound by these terms.
        </p>

        <h2>2. User Responsibilities</h2>
        <ul>
          <li>You agree to provide accurate and up-to-date information.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account and cookies used for authentication.
          </li>
          <li>
            You will not misuse the application or engage in any unauthorized
            activities.
          </li>
        </ul>

        <h2>3. Disclaimer of Warranties</h2>
        <p>
          CashFlow is provided "as is" and without warranties of any kind. We do
          not guarantee the accuracy, reliability, or completeness of the
          information provided through the application.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          Under no circumstances shall CashFlow be liable for any direct,
          indirect, incidental, or consequential damages resulting from your use
          or inability to use the application.
        </p>

        <h2>5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Use at any time. Changes
          will be effective upon posting, and continued use of the application
          constitutes acceptance of the revised terms.
        </p>

        <h2>6. Contact</h2>
        <p>
          If you have any questions about these Terms of Use, please contact us
          at <a href="mailto:me@rehx.name.ng">me@rehx.name.ng</a>.
        </p>
      </main>

      <Footer />
    </>
  );
}
