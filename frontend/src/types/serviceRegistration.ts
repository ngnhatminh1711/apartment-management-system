import type { RegistrationStatus } from "./common";

export interface MyServiceRegistration {
  id: number;
  status: RegistrationStatus;
  startDate: string;
  endDate: string;
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  monthlyFee: number;
  iconUrl: string;
  isRegistered: boolean;
  myRegistration: MyServiceRegistration | null;
}

export interface ServiceTypeRef {
  id: number;
  name: string;
  monthlyFee: number;
}

export interface ServiceRegistration {
  id: number;
  serviceType: ServiceTypeRef;
  status: RegistrationStatus;
  registeredAt: string;
  startDate: string;
  endDate: string;
}

export interface ServiceRegistrationCreateRequest {
  serviceTypeId: number;
  notes: string;
}

export type ServiceRegistrationUpdateRequest = {
  status: RegistrationStatus;
};
