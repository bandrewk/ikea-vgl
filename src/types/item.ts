export interface IkeaItem {
  key: string;
  id: string;
  name: string;
  priceDE: number;
  pricePLN: number;
  pricePLNInEur: number;
  discountInPercentage: number;
  cheaperInPLN: boolean;
  url: string;
  notFoundDE: boolean;
  notFoundPL: boolean;
  retired: boolean;
}

export interface Statistics {
  totalPriceDE: number;
  totalPricePLEur: number;
  totalDiscountInPercentage: number;
  totalDiscount: number;
  totalItems: number;
}
