import { StatusTestDrive } from "../Enum";

export interface TestDiveSearchParams {
  userId: string;
  carId: string;

  appointmentFrom: string;
  appointmentTo: string;

  status: StatusTestDrive;

  sortBy: string;
  pageNumber: number;
  pageSize: number;
}
