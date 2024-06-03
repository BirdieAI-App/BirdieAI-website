import Image from "next/image";
import config from "@/config";

const CTA = () => {
  return (
   
    <section className="relative hero overflow-hidden min-h-screen bg-lime-600">
     
      <div className="relative hero-overlay bg-lime-600"></div>
      <div className="relative hero-content text-center text-accent-content p-8">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
          Say goodbye to endless searching
          </h2>
          <p className="text-base-200 mb-12 md:mb-16">
          your AI-powered dietitian is just a fingertip away
          </p>

          <button className="btn btn-primary btn-wide btn-orange-solid">
            Get {config.appName}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
