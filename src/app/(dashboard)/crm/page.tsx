import { createClient } from "@/utils/supabase/server";
import { getPipelines, getContacts } from "./actions";
import CRMClient from "./CRMClient";
import CRMSetup from "./CRMSetup";
import { redirect } from "next/navigation";

export default async function CRMPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Pegar a empresa do usuário
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!company) {
    return <CRMSetup />;
  }

  const pipelines = await getPipelines();
  const contacts = await getContacts(company.id);
  
  // Buscar todos os deals da empresa para popular o kanban inicial
  const { data: deals, error } = await supabase
    .from('crm_deals')
    .select(`
      *,
      crm_contacts (*)
    `)
    .eq('company_id', company.id)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching initial deals:', error);
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
      <CRMClient 
        initialPipelines={pipelines || []} 
        initialDeals={deals || []}
        initialContacts={contacts || []}
        companyId={company.id} 
      />
    </div>
  );
}
