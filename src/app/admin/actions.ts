"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
}

// ─── Donations ────────────────────────────────────────────────────────────────

export async function createDonation(formData: FormData) {
  await requireAuth();
  const supabase = createServiceClient();

  const donationDate = formData.get("donation_date") as string;

  await supabase.from("donations").insert({
    donor_name: formData.get("donor_name") as string,
    amount_usd: parseFloat(formData.get("amount_usd") as string),
    message: (formData.get("message") as string) || null,
    is_anonymous: formData.get("is_anonymous") === "on",
    ...(donationDate && {
      created_at: new Date(donationDate + "T12:00:00").toISOString(),
    }),
  });

  revalidatePath("/");
  revalidatePath("/admin/donations");
  redirect("/admin/donations");
}

export async function updateDonation(id: string, formData: FormData) {
  await requireAuth();
  const supabase = createServiceClient();

  const donationDate = formData.get("donation_date") as string;

  await supabase
    .from("donations")
    .update({
      donor_name: formData.get("donor_name") as string,
      amount_usd: parseFloat(formData.get("amount_usd") as string),
      message: (formData.get("message") as string) || null,
      is_anonymous: formData.get("is_anonymous") === "on",
      ...(donationDate && {
        created_at: new Date(donationDate + "T12:00:00").toISOString(),
      }),
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/donations");
  redirect("/admin/donations");
}

export async function deleteDonation(id: string) {
  await requireAuth();
  const supabase = createServiceClient();
  await supabase.from("donations").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/donations");
}

// ─── Equipment ────────────────────────────────────────────────────────────────

export async function updateEquipment(id: string, formData: FormData) {
  await requireAuth();
  const supabase = createServiceClient();

  await supabase
    .from("equipment")
    .update({
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      price_usd: parseFloat(formData.get("price_usd") as string),
      status: formData.get("status") as string,
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/equipment");
  redirect("/admin/equipment");
}

// ─── Payment Methods ──────────────────────────────────────────────────────────

function parseFields(formData: FormData): Record<string, string> {
  try {
    return JSON.parse(formData.get("fields_json") as string) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function createPaymentMethod(formData: FormData) {
  await requireAuth();
  const supabase = createServiceClient();

  await supabase.from("payment_methods").insert({
    category: formData.get("category") as string,
    name: formData.get("name") as string,
    icon: (formData.get("icon") as string) || null,
    fields: parseFields(formData),
    notes: (formData.get("notes") as string) || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
  });

  revalidatePath("/");
  revalidatePath("/admin/payment-methods");
  redirect("/admin/payment-methods");
}

export async function updatePaymentMethod(id: string, formData: FormData) {
  await requireAuth();
  const supabase = createServiceClient();

  await supabase
    .from("payment_methods")
    .update({
      category: formData.get("category") as string,
      name: formData.get("name") as string,
      icon: (formData.get("icon") as string) || null,
      fields: parseFields(formData),
      notes: (formData.get("notes") as string) || null,
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/payment-methods");
  redirect("/admin/payment-methods");
}

export async function deletePaymentMethod(id: string) {
  await requireAuth();
  const supabase = createServiceClient();
  await supabase.from("payment_methods").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/payment-methods");
}

export async function togglePaymentMethodActive(id: string, isActive: boolean) {
  await requireAuth();
  const supabase = createServiceClient();
  await supabase.from("payment_methods").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/payment-methods");
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function updateSettings(formData: FormData) {
  await requireAuth();
  const supabase = createServiceClient();

  const entries = [
    { key: "goal_amount_usd", value: formData.get("goal_amount_usd") as string },
    { key: "project_name", value: formData.get("project_name") as string },
    {
      key: "project_description",
      value: formData.get("project_description") as string,
    },
  ];

  await Promise.all(
    entries.map((e) =>
      supabase.from("site_config").upsert({ key: e.key, value: e.value })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
