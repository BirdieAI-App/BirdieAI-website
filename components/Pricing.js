"use client";
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";
import { useEffect, useState } from "react";
import { usePayment } from "@/hooks/usePayment";

const Pricing = () => {
  const { handleStripeProductList, handleGetStripPRice } = usePayment();
  const [products, setProducts] = useState([]);

  const sortProduct = (list) => {
    return [...list].sort((a, b) => {
      return a.metadata.order > b.metadata.order ? 1 : -1;
    })
  }

  useEffect(() => {
    sessionStorage.removeItem("checkoutSessionID");

    const fetchProducts = async () => {
      try {
        const response = await handleStripeProductList();
        const data = sortProduct(response.data)
        const fieldsToKeep = ['default_price', 'description', 'metadata', 'name', 'id',];
        const filteredData = await Promise.all(data.map(async item => {
          const cleanedObject = {};

          for (const field of fieldsToKeep) {
            if (item.hasOwnProperty(field)) {
              if (field === 'description') {
                cleanedObject['features'] = item[field].split(', ');
              } else if (field === 'default_price') {
                cleanedObject['priceId'] = item[field];
                const priceResponse = await handleGetStripPRice(item[field]);
                cleanedObject['price'] = Number(priceResponse.unit_amount) / 100;
              } else {
                cleanedObject[field] = item[field];
              }
            }
          }
          return cleanedObject;
        }));
        setProducts(filteredData);
      } catch (err) {
        console.log(err.message)
      }
    }
    //getting the product from stripe
    fetchProducts();
  }, [handleStripeProductList]);
  return (
    <section className="bg-base-200 overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">Pricing</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            We've made Birdie afforable so everyone can access their own Diet Coach
          </h2>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          <div className="relative w-full max-w-lg">
            <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-lg lg:text-l font-bold">Try Birdie for Free</p>
                </div>
              </div>
              <div className="flex gap-2">
                <p className={`text-5xl tracking-tight font-extrabold`}>
                  $0
                </p>
                <div className="flex flex-col justify-end mb-[4px]">
                  <p className="text-xs text-base-content/60 uppercase font-semibold">
                    USD
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] opacity-80 shrink-0">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>3 conversations/Day</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] opacity-80 shrink-0">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Personalized Meal plan</span>
                </li>
              </ul>

              <div className="space-y-2">
                <ButtonCheckout />
              </div>
            </div>
          </div>

          {products.map((plan) => (
            <div key={plan.id} className="relative w-full max-w-lg">
              {plan.metadata.isRecommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span
                    className={`badge text-xs text-primary-content font-semibold border-0 bg-primary`}
                  >
                    RECOMMENDED
                  </span>
                </div>
              )}

              {plan.metadata.isRecommended && (
                <div
                  className={`absolute -inset-[1px] rounded-[9px] bg-primary z-10`}
                ></div>
              )}

              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="text-lg lg:text-l font-bold">{plan.name}</p>
                    {plan.description && (
                      <p className="text-base-content/80 mt-2">
                        {plan.description}
                      </p>
                    )}
                  </div>
                </div>
                {/* price Anchor is the price before the discount */}
                <div className="flex gap-2">
                  {plan.priceAnchor && (
                    <div className="flex flex-col justify-end mb-[4px] text-lg ">
                      <p className="relative">
                        <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[53%]"></span>
                        <span className="text-base-content/80">
                          ${plan.priceAnchor}
                        </span>
                      </p>
                    </div>
                  )}
                  <p className={`text-5xl tracking-tight font-extrabold`}>
                    ${plan.price}
                  </p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-base-content/60 uppercase font-semibold">
                      USD
                    </p>
                  </div>
                </div>

                {plan.features && (
                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-[18px] h-[18px] opacity-80 shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature} </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-2">
                  <ButtonCheckout priceId={plan.priceId} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
