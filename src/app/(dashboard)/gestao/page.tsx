import { createClient } from "@/utils/supabase/server";
import { GestaoClient } from "@/components/dashboard/GestaoClient";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  createBill,
  updateBill,
  deleteBill,
  createCategory,
  deleteCategory,
  createCostCenter,
  deleteCostCenter,
  createSupplier,
  deleteSupplier,
} from "@/app/(dashboard)/actions";
import type { Company, Bill, Category, CostCenter, Supplier } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contas a Pagar | Nexus",
  description: "Gestão financeira e controle de lançamentos.",
};

export default async function GestaoPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Busca todas as empresas do usuário logado
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("name", { ascending: true });

  // Busca todas as contas das empresas do usuário
  const { data: bills } = await supabase
    .from("bills")
    .select("*")
    .in(
      "company_id",
      (companies ?? []).map((c: Company) => c.id)
    )
    .order("overdue_date", { ascending: true });

  // Busca Categorias e Centros de Custo do usuário
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("name", { ascending: true });

  const { data: costCenters } = await supabase
    .from("cost_centers")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("name", { ascending: true });

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("name", { ascending: true });

  return (
    <GestaoClient
      companies={(companies ?? []) as Company[]}
      bills={(bills ?? []) as Bill[]}
      categories={(categories ?? []) as Category[]}
      costCenters={(costCenters ?? []) as CostCenter[]}
      suppliers={(suppliers ?? []) as Supplier[]}
      createCompanyAction={createCompany}
      updateCompanyAction={updateCompany}
      deleteCompanyAction={deleteCompany}
      createBillAction={createBill}
      updateBillAction={updateBill}
      deleteBillAction={deleteBill}
      createCategoryAction={createCategory}
      deleteCategoryAction={deleteCategory}
      createCostCenterAction={createCostCenter}
      deleteCostCenterAction={deleteCostCenter}
      createSupplierAction={createSupplier}
      deleteSupplierAction={deleteSupplier}
    />
  );
}
