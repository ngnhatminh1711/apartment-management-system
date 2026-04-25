import { useState } from "react";
import type { ServiceType } from "../../../types/serviceRegistration";
import Registration from "./Registration";
import type { ServiceRegistrationCreateRequest } from "../../../types/serviceRegistration";

type Props = {
  data: ServiceType;
  createService: (data: ServiceRegistrationCreateRequest) => void;
};
const ServiceTypeCard = ({ data, createService }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="group bg-surface-container rounded-xl border border-outline shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt="modern luxury fitness center"
          src={`${data?.iconUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBULTI9mkENgI7bF0uaXlw3psGtbZhrvvflF2x6r3whlkcqJkCRhJagki5nuXK6IZYhaLPBfNNOLJFxJ8zVjmYnnREL2TgdXXvlkKozRAQiP34Cq6uJW-dRB1-4Rip2GDRdDPDRSK2So25T3wPARIymnxv5MXih4m7VX3wx1xxpib_8TXsgZ2p7B5GwIv70OrPRdRaMeo7EpeV6QKg2vVD21JlcHDHjH08DM4GUq4B6jj9l7vHeWZUNBhsuKpfd0yk55kVOSSz7kVSO"}`}
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-on-surface">{data?.name}</h3>
        </div>

        <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">
          {data?.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-primary font-bold">
            {data?.monthlyFee?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
            <span className="text-xs text-on-surface-variant font-normal">
              /tháng
            </span>
          </p>

          <button
            onClick={() => setOpen(true)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all${
              data?.isRegistered
                ? "bg-gray-300 text-gray-500 bg-sky-500 text-white"
                : "bg-primary-container text-primary bg-primary text-white"
            }
  `}
          >
            {data?.isRegistered ? "Đã đăng ký" : "Đăng ký"}
          </button>
          {open && (
            <Registration
              data={data}
              onclose={() => setOpen(false)}
              createService={createService}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeCard;
