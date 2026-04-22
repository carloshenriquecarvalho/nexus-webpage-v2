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
    const supplier = formData.get("supplier") as string || null;
    const notes = formData.get("notes") as string || null;
    
    let penalty = null;
    let interest = null;
    if (status === "Paga") {
      penalty = formData.get("penalty") ? parseFloat(formData.get("penalty") as string) : null;
      interest = formData.get("interest") ? parseFloat(formData.get("interest") as string) : null;
    }

    const overdue_date = formData.get("overdue_date") as string;
    const payment_date = formData.get("payment_date") as string;
    const notification_date = formData.get("notification_date") as string;
    const company_id = formData.get("company_id") as string;

    // RECURRENCE
    const is_recurring = formData.get("is_recurring") === "on";
    const recurrence_count = parseInt(formData.get("recurrence_count") as string) || 1;

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

    // UPLOAD RECEIPT IF PAGA AND EXISTS
    const receiptFile = formData.get("receipt_file") as File;
    let receipt_url: string | null = null;
    if (status === "Paga" && receiptFile && receiptFile.size > 0) {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `receipt_${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('bills-attachments').upload(fileName, receiptFile);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('bills-attachments').getPublicUrl(fileName);
        receipt_url = publicUrl;
      }
    }

    const recurrent_group_id = is_recurring ? crypto.randomUUID() : null;
    const iterations = is_recurring ? Math.max(1, recurrence_count) : 1;
    
    // Helper para adicionar meses à data
    const addMonths = (dateStr: string | null, months: number) => {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1 + months, day);
      // Garantir que não pulou meses por causa de dias 31 -> 30/28
      if (date.getDate() !== day) {
        date.setDate(0); // Volta para o último dia do mês anterior
      }
      return date.toISOString().split('T')[0];
    };

    const billsToInsert = [];

    for (let i = 0; i < iterations; i++) {
      let google_event_id: string | null = null;
      const current_overdue = addMonths(overdue_date || null, i);
      const current_notification = addMonths(notification_date || null, i);

      // 4. INTEGRAÇÃO COM GOOGLE CALENDAR
      if (current_notification && calendarToken) {
        const eventDetails = {
          summary: `💰 Pagamento: ${description} (${i + 1}/${iterations})`,
          description: `Lembrete Nexus Tecnologia\nValor: R$ ${amount.toFixed(2)}\nVencimento: ${current_overdue || "Não informado"}\nCategoria: ${category || "—"}`,
          start: { date: current_notification },
          end: { date: current_notification },
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

      billsToInsert.push({
        company_id,
        user_id: user.id,
        description: is_recurring ? `${description} (${i + 1}/${iterations})` : description,
        amount,
        status,
        category,
        cost_center,
        pdf_url,
        receipt_url,
        overdue_date: current_overdue,
        notification_date: current_notification,
        payment_date: payment_date || null,
        google_event_id,
        recurrent_group_id,
        notes,
        penalty,
        interest,
        supplier,
      });
    }

    // 5. PERSISTÊNCIA NO SUPABASE
    const { error: dbError } = await supabase.from("bills").insert(billsToInsert);


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
    const supplier = (formData.get("supplier") as string)?.trim() || null;
    const notes = (formData.get("notes") as string)?.trim() || null;
    const status = formData.get("status") as string;
    
    let penalty = null;
    let interest = null;
    if (status === "Paga") {
      penalty = formData.get("penalty") ? parseFloat(formData.get("penalty") as string) : null;
      interest = formData.get("interest") ? parseFloat(formData.get("interest") as string) : null;
    }

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

    // UPLOAD NEW RECEIPT IF EXISTS
    const receiptFile = formData.get("receipt_file") as File;
    let receipt_url: string | null = formData.get("existing_receipt_url") as string || null;
    if (status === "Paga" && receiptFile && receiptFile.size > 0) {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `receipt_${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('bills-attachments').upload(fileName, receiptFile);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('bills-attachments').getPublicUrl(fileName);
        receipt_url = publicUrl;
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
        pdf_url,
        receipt_url,
        supplier,
        notes,
        penalty,
        interest
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

/**
 * CATEGORIAS - CRUD
 */
export async function createCategory(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Nome é obrigatório." };

    const { error: dbError } = await supabase.from("categories").insert({
      user_id: user.id,
      name,
    });

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno." };
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const id = formData.get("id") as string;
    const { error: dbError } = await supabase
      .from("categories")
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
 * CENTROS DE CUSTO - CRUD
 */
export async function createCostCenter(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Nome é obrigatório." };

    const { error: dbError } = await supabase.from("cost_centers").insert({
      user_id: user.id,
      name,
    });

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno." };
  }
}

export async function deleteCostCenter(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const id = formData.get("id") as string;
    const { error: dbError } = await supabase
      .from("cost_centers")
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
 * FORNECEDORES - CRUD
 */
export async function createSupplier(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const name = (formData.get("name") as string)?.trim();
    const cnpj_cpf = (formData.get("cnpj_cpf") as string)?.trim() || null;
    const address = (formData.get("address") as string)?.trim() || null;
    const phone = (formData.get("phone") as string)?.trim() || null;

    if (!name) return { error: "Nome é obrigatório." };

    const { error: dbError } = await supabase.from("suppliers").insert({
      user_id: user.id,
      name,
      cnpj_cpf,
      address,
      phone,
    });

    if (dbError) return { error: dbError.message };

    revalidatePath("/gestao");
    return { success: true };
  } catch (error) {
    return { error: "Erro interno." };
  }
}

export async function deleteSupplier(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Usuário não autenticado." };

    const id = formData.get("id") as string;
    const { error: dbError } = await supabase
      .from("suppliers")
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