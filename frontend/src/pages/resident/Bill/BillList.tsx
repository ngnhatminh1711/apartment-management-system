import type { Bill } from "../../../types/bill";
import BillCard from "./BillCard";

type Props = {
  bills: Bill[];
};

export default function BillList({ bills }: Props) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </div>
  );
}
