import { Car } from "./Car";
import { User } from "./User";

export interface Loan {
  id: number;
  userId: string;
  user?: User;
  carId: number;
  car?: Car;
  downPayment: number;
  installmentTerm: number;
  monthlyIncome: number;
  loanStatus: string;
  createdAt: string;
}
