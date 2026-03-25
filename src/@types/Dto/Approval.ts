import { Car } from "./Car";

export interface Approval {
  carId: number;
  car?: Car;
  isApproved: boolean;
  approvalRemark?: string;
  approvedAt?: string;
}
