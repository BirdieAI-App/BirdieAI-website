import Pricing from "@/components/Pricing";
import LayoutPrivate from "../dashboard/layout";
import ButtonAccount from "@/components/ButtonAccount";

export default function PlansPage() {
    return (
      <LayoutPrivate>
        <ButtonAccount />
        <Pricing />
      </LayoutPrivate>
    );
}