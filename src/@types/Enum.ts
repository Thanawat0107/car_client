export enum SD_Roles {
  Role_Admin = "admin",
  Role_Seller = "seller",
  Role_Buyer = "buyer",
}

export enum EngineType {
  Gasoline = 0,
  Diesel = 1,
  Electric = 2,
  Hybrid = 3,
}

export enum GearType {
  Manual = 0,
  Automatic = 1,
}

export enum CarType {
  FourDoorSedan = 0,
  PickUpTruck = 1,
  CarSUV = 2,
  CarVan = 3,
}

export enum Status {
  Available = 0,
  Sold = 1,
  Reserved = 2,
}

export const sortOptions = [
  { value: "id", label: "ล่าสุด" },
  { value: "price", label: "ราคาต่ำ -> สูง" },
  { value: "price_desc", label: "ราคาสูง -> ต่ำ" },
  { value: "year", label: "ปีน้อย -> มาก" },
  
  { value: "yearDesc", label: "ปีมาก -> น้อย" },
  { value: "mileageAsc", label: "ไมล์น้อย -> มาก" },
  { value: "mileageDesc", label: "ไมล์มาก -> น้อย" },
];
