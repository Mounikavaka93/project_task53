export const PLATFORM_FEE = 29;
export const GST_RATE = 0.05;

export function quoteFare({ price, seatCount, promo = "", departure = "00:00" }) {
  const base = Math.max(0, price) * Math.max(0, seatCount);
  const code = promo.trim().toUpperCase();
  let discount = 0;
  let promoError = "";

  if (code) {
    if (code === "FIRST10") {
      discount = Math.round(base * 0.1);
    } else if (code === "NIGHT15") {
      const hour = Number(String(departure).slice(0, 2));
      if (hour >= 21 || hour < 6) discount = Math.round(base * 0.15);
      else promoError = "NIGHT15 applies to departures from 9 PM to 6 AM";
    } else {
      promoError = "That code is not active";
    }
  }

  if (promoError) discount = 0;
  const taxable = base - discount;
  const gst = Math.round(taxable * GST_RATE);
  const fee = seatCount > 0 ? PLATFORM_FEE : 0;
  return {
    base,
    discount,
    gst,
    fee,
    total: taxable + gst + fee,
    code: discount > 0 ? code : "",
    promoError,
  };
}
