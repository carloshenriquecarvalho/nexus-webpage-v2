import { createClient } from "@/utils/supabase/server";
import { GestaoClient } from "@/components/dashboard/GestaoClient";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  createBill,
  updateBill,
  deleteBill,
} from "@/app/(dashboard)/actions";
import type { Company, Bill } from "@/types/database";

export default async function GestaoPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Busca todas as empresas do usuário logado
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("name", { ascending: true });

  // Busca todos os boletos das empresas do usuário
  const { data: bills } = await supabase
    .from("bills")
    .select("*")
    .in(
      "company_id",
      (companies ?? []).map((c: Company) => c.id)
    )
    .order("overdue_date", { ascending: true });

  return (
    <GestaoClient
      companies={(companies ?? []) as Company[]}
      bills={(bills ?? []) as Bill[]}
      createCompanyAction={createCompany}
      updateCompanyAction={updateCompany}
      deleteCompanyAction={deleteCompany}
      createBillAction={createBill}
      updateBillAction={updateBill}
      deleteBillAction={deleteBill}
    />
  );
}
