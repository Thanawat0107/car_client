export interface LoanCreateDto {
  userId: string;
  carId: number;
  downPayment: number;
  installmentTerm: number;
  monthlyIncome: number;
}
