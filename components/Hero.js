'use client'

// import Image from "next/image";
import config from "@/config";
// import ButtonGradient from "./ButtonGradient";
import { useRouter } from 'next/navigation'

const Hero = () => {
  const router = useRouter();
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-center">
        
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          <div>Diet Coach</div>
          <div>for prenatal, postpartum, and pediatric care</div>
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Get answers to your dietary questions, access personalized nutrition advice, and receive a custom meal plan from our AI, expertly trained using reputable medical sources and scientific journals.
        </p>
        <div className="flex flex-col lg:flex-row gap-4"> {/* Use flex row for side-by-side buttons */}
          <button className="btn btn-primary btn-wide btn-orange-solid" onClick={() => router.push('/api/auth/signup')}>
            Try {config.appName}
          </button>
          <a href="#faq" className="btn btn-secondary btn-wide btn-orange-border">
            See How it works
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
