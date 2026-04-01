"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * BOLETOS - CREATE
 */
export async function createBill(formData: FormData) {
  try {
    const supabase = await createClient();

    // 1. VALIDAÇÃO DE IDENTIDADE (Segura - getUser)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Usuário não autenticado." };

    // 2. RECUPERAÇÃO DO TOKEN (Funcional - getSession)
    // Usamos a sessão apenas para extrair o provider_token do Google
    const { data: { session } } = await supabase.auth.getSession();
    const calendarToken = session?.provider_token;

    // 3. EXTRAÇÃO E VALIDAÇÃO DE DADOS
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const status = formData.get("status") as string || "Pendente";
    const overdue_date = formData.get("overdue_date") as string;
    const notification_date = formData.get("notification_date") as string;
    const company_id = formData.get("company_id") as string;

    if (!title || isNaN(amount) || !company_id) {
      return { error: "Campos obrigatórios (Título, Valor, Empresa) faltando." };
    }

    let google_event_id: string | null = null;

    // 4. INTEGRAÇÃO COM GOOGLE CALENDAR
    if (notification_date && calendarToken) {
      const eventDetails = {
        summary: `💰 Pagamento: ${title}`,
        description: `Lembrete Nexus Tecnologia\nValor: R$ ${amount.toFixed(2)}\nVencimento: ${overdue_date || "Não informado"}`,
        start: { date: notification_date },
        end: { date: notification_date },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 60 },
            { method: "email", minutes: 1440 },
          ],
        },
      };

      try {
        const calResponse = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${calendarToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventDetails),
          }
        );

        if (calResponse.ok) {
          const calData = await calResponse.json();
          google_event_id = calData.id;
        } else {
          const errorData = await calResponse.json();
          console.error("[createBill] Google API Error:", errorData);
        }
      } catch (err) {
        console.error("[createBill] Erro de rede Google:", err);
      }
    }

    // 5. PERSISTÊNCIA NO SUPABASE
    const { error: dbError } = await supabase.from("bills").insert({
      company_id,
      user_id: user.id, // Usando o ID validado do getUser()
      title,
      amount,
      status,
      overdue_date: overdue_date || null,
      notification_date: notification_date || null,
      google_event_id,
    });

    if (dbError) {
      console.error("[createBill] DB Error:", dbError);
      return { error: `Erro no banco: ${dbError.message}` };
    }

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    console.error("[createBill] Critical Error:", error);
    return { error: "Erro interno no servidor." };
  }
}

/**
 * BOLETOS - UPDATE
 */
export async function updateBill(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const id = formData.get("id") as string;
    const title = (formData.get("title") as string)?.trim();
    const amount = parseFloat(formData.get("amount") as string);
    const tag = (formData.get("tag") as string)?.trim() || null;
    const status = formData.get("status") as string;
    const overdue_date = (formData.get("overdue_date") as string) || null;
    const notification_date = (formData.get("notification_date") as string) || null;
    const payment_date = (formData.get("payment_date") as string) || null;

    if (!id || !title || isNaN(amount)) return { error: "Dados obrigatórios faltando." };

    const { error: dbError } = await supabase
      .from("bills")
      .update({ title, amount, tag, status, overdue_date, notification_date, payment_date })
      .eq("id", id)
      .eq("user_id", user.id); // Segurança: só atualiza se for o dono

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno no servidor." };
  }
}

/**
 * BOLETOS - DELETE
 */
export async function deleteBill(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const id = formData.get("id") as string;
    if (!id) return { error: "ID não informado." };

    const { error: dbError } = await supabase
      .from("bills")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno." };
  }
}

/**
 * EMPRESAS - CRUD
 */
export async function createCompany(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const name = (formData.get("name") as string)?.trim();
    const logo_url = (formData.get("logo_url") as string)?.trim() || null;

    if (!name) return { error: "Nome é obrigatório." };

    const { error: dbError } = await supabase.from("companies").insert({
      user_id: user.id,
      name,
      logo_url,
    });

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno." };
  }
}

export async function updateCompany(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    const logo_url = (formData.get("logo_url") as string)?.trim() || null;

    const { error: dbError } = await supabase
      .from("companies")
      .update({ name, logo_url })
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno." };
  }
}

export async function deleteCompany(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const id = formData.get("id") as string;
    const { error: dbError } = await supabase
      .from("companies")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno." };
  }
}