import { loadStripe } from "@stripe/stripe-js";

// ดึงค่า Publishable Key จากไฟล์ .env
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

// โหลด Stripe instance แล้ว export ออกไปให้ Component อื่นใช้งาน
export const stripePromise = loadStripe(stripeKey);