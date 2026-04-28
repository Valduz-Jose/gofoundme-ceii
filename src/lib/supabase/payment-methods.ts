import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/types";

export async function getActivePaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []) as PaymentMethod[];
}
