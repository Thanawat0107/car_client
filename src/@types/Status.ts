export enum SD_Roles {
  Role_Admin = "admin",
  Role_Seller = "seller",
  Role_Buyer = "buyer",
}

export enum EngineType {
  Gasoline = "Gasoline",
  Diesel = "Diesel",
  Electric = "Electric",
  Hybrid = "Hybrid",
}

export enum GearType {
  Manual = "Manual",
  Automatic = "Automatic",
}

export enum CarType {
  FourDoorSedan = "FourDoorSedan",
  PickUpTruck = "PickUpTruck",
  CarSUV = "CarSUV",
  CarVan = "CarVan",
}

export enum CarStatus {
  Available = "Available",
  Booked = "Booked",
  Sold = "Sold",
}

export enum BookingStatus {
  Pending = "Pending",
  PendingPayment = "PendingPayment",
  Confirmed = "Confirmed",
  Expired = "Expired",
  Canceled = "Canceled",
}

export enum PaymentStatus {
  Pending = "Pending",
  Verifying = "Verifying",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded",
}

export enum PaymentMethod {
  QR = "QR",
  PromptPay = "PromptPay",
  CreditCard = "CreditCard",
  BankTransfer = "BankTransfer",
}

export enum StatusTestDrive {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancel = "Cancel",
}

export enum LoanStatus {
  Pending = "Pending",
  Contacted = "Contacted",
  Rejected = "Rejected",
}