"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * BOLETOS - CREATE
 */
export async function createBill(formData: FormData) {
  try {
    const supabase = await createClient();

    // 1. VALIDAÇÃO DE IDENTIDADE
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Usuário não autenticado." };

    // 2. RECUPERAÇÃO DO TOKEN
    const { data: { session } } = await supabase.auth.getSession();
    const calendarToken = session?.provider_token;

    // 3. EXTRAÇÃO E VALIDAÇÃO DE DADOS
    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const status = formData.get("status") as string || "Pendente";
    const category = formData.get("category") as string || null;
    const cost_center = formData.get("cost_center") as string || null;
    const overdue_date = formData.get("overdue_date") as string;
    const notification_date = formData.get("notification_date") as string;
    const company_id = formData.get("company_id") as string;

    // PDF ATTACHMENT
    const file = formData.get("pdf_file") as File;
    let pdf_url: string | null = null;

    if (!description || isNaN(amount) || !company_id) {
      return { error: "Campos obrigatórios (Descrição, Valor, Empresa) faltando." };
    }

    // UPLOAD PDF IF EXISTS
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bills-attachments')
        .upload(fileName, file);

      if (uploadError) {
        console.error("[createBill] Upload Error:", uploadError);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('bills-attachments')
          .getPublicUrl(fileName);
        pdf_url = publicUrl;
      }
    }

    let google_event_id: string | null = null;

    // 4. INTEGRAÇÃO COM GOOGLE CALENDAR
    if (notification_date && calendarToken) {
      const eventDetails = {
        summary: `💰 Pagamento: ${description}`,
        description: `Lembrete Nexus Tecnologia\nValor: R$ ${amount.toFixed(2)}\nVencimento: ${overdue_date || "Não informado"}\nCategoria: ${category || "—"}`,
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
        }
      } catch {
        console.error("[createBill] Erro de rede Google");
      }
    }

    // 5. PERSISTÊNCIA NO SUPABASE
    const { error: dbError } = await supabase.from("bills").insert({
      company_id,
      user_id: user.id,
      description,
      amount,
      status,
      category,
      cost_center,
      pdf_url,
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
  } catch {
    console.error("[createBill] Critical Error");
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
    const description = (formData.get("description") as string)?.trim();
    const amount = parseFloat(formData.get("amount") as string);
    const category = (formData.get("category") as string)?.trim() || null;
    const cost_center = (formData.get("cost_center") as string)?.trim() || null;
    const status = formData.get("status") as string;
    const overdue_date = (formData.get("overdue_date") as string) || null;
    const notification_date = (formData.get("notification_date") as string) || null;
    const payment_date = (formData.get("payment_date") as string) || null;

    // PDF ATTACHMENT
    const file = formData.get("pdf_file") as File;
    let pdf_url: string | null = formData.get("existing_pdf_url") as string || null;

    if (!id || !description || isNaN(amount)) return { error: "Dados obrigatórios faltando." };

    // UPLOAD NEW PDF IF EXISTS
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('bills-attachments')
        .upload(fileName, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('bills-attachments')
          .getPublicUrl(fileName);
        pdf_url = publicUrl;
      }
    }

    const { error: dbError } = await supabase
      .from("bills")
      .update({
        description,
        amount,
        category,
        cost_center,
        status,
        overdue_date,
        notification_date,
        payment_date,
        pdf_url
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch {
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