"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// FETCHERS

export async function getPipelines() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Primeiro pegamos a empresa do usuário
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!company) return [];

  const { data, error } = await supabase
    .from('crm_pipelines')
    .select(`
      *,
      crm_stages (*)
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pipelines:', error);
    return [];
  }

  return data;
}

export async function getStages(pipelineId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_stages')
    .select('*')
    .eq('pipeline_id', pipelineId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching stages:', error);
    return [];
  }

  return data;
}

export async function getDeals(companyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_deals')
    .select(`
      *,
      crm_contacts (*)
    `)
    .eq('company_id', companyId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching deals:', error);
    return [];
  }

  return data;
}

// MUTATIONS

export async function updateDealStage(dealId: string, stageId: string, position: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('crm_deals')
    .update({ 
      stage_id: stageId, 
      position: position,
      updated_at: new Date().toISOString()
    })
    .eq('id', dealId);

  if (error) {
    console.error('Error updating deal stage:', error);
    return { success: false, error };
  }

  revalidatePath('/crm');
  return { success: true };
}

export async function createDeal(data: {
  title: string;
  value: number;
  stage_id: string;
  company_id: string;
  contact_id?: string;
  assigned_to?: string;
}) {
  const supabase = await createClient();
  
  // Pegar a última posição para adicionar ao final
  const { data: lastDeal } = await supabase
    .from('crm_deals')
    .select('position')
    .eq('stage_id', data.stage_id)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const position = lastDeal ? lastDeal.position + 1 : 0;

  const { error } = await supabase
    .from('crm_deals')
    .insert([{ ...data, position }]);

  if (error) {
    console.error('Error creating deal:', error);
    return { success: false, error };
  }

  revalidatePath('/crm');
  return { success: true };
}

export async function createPipeline(name: string, companyId: string) {
  const supabase = await createClient();
  const { data: pipeline, error: pError } = await supabase
    .from('crm_pipelines')
    .insert([{ name, company_id: companyId }])
    .select()
    .single();

  if (pError) return { success: false, error: pError };

  // Criar stages padrão
  const defaultStages = [
    { name: 'Novo Lead', position: 0, pipeline_id: pipeline.id },
    { name: 'Qualificado', position: 1, pipeline_id: pipeline.id },
    { name: 'Proposta Enviada', position: 2, pipeline_id: pipeline.id },
    { name: 'Negociação', position: 3, pipeline_id: pipeline.id },
    { name: 'Fechado', position: 4, pipeline_id: pipeline.id },
  ];

  const { error: sError } = await supabase
    .from('crm_stages')
    .insert(defaultStages);

  if (sError) return { success: false, error: sError };

  revalidatePath('/crm');
  return { success: true, data: pipeline };
}
