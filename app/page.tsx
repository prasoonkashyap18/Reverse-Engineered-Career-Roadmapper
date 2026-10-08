import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { BackgroundField } from "@/components/landing/BackgroundField";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <MarketingLayout>
      <BackgroundField />
      <Hero />
      <HowItWorks />
      <FeatureSection />
      <FinalCTA />
    </MarketingLayout>
  );
}
