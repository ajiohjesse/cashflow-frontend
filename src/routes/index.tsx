import banner from "@/assets/banner.png";
import Footer from "@/components/footer";
import GradientText from "@/components/gradient-text";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BanknoteIcon, LogInIcon, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader />
      <main className="min-h-[calc(100dvh-4rem)] px-8 py-14 md:px-16 lg:px-24 lg:py-0">
        <section className="flex flex-col gap-8 min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:items-center min-[900px]:py-8">
          <div className="space-y-6">
            <h1 className="text-balance text-[clamp(2.2rem,4vw,3rem)] font-bold leading-[1.2]">
              The <GradientText>Easiest</GradientText> Way to Keep Track{" "}
              <TrendingUp className="inline size-10 text-primary" /> of Your{" "}
              <BanknoteIcon className="inline size-10 text-primary" />{" "}
              <GradientText> Finances</GradientText>.
            </h1>
            <p className="text-pretty font-medium sm:w-[80%]">
              CashFlow is a minimalist financial management platform that is
              designed to help you effortlessly manage your income and expenses.
              Log in now to take charge of your cash flow!
            </p>
            <div className="grid gap-4 sm:flex">
              <Button className="h-14 px-12" asChild>
                <Link to="/register">
                  Get Started <ArrowRight />
                </Link>
              </Button>
              <Button className="h-14 px-12" variant="outline" asChild>
                <Link to="/login">
                  Login <LogInIcon />
                </Link>
              </Button>
            </div>
          </div>

          <img
            src={banner}
            alt="Image"
            className="max-h-[400px] w-full rounded-2xl object-contain object-top lg:max-h-full"
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
