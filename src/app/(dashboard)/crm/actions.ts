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

export async function deleteDeal(dealId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('crm_deals')
    .delete()
    .eq('id', dealId);

  if (error) {
    console.error('Error deleting deal:', error);
    return { success: false, error };
  }
  revalidatePath('/crm');
  return { success: true };
}

// ── NOTES ──────────────────────────────────────────

export async function getNotesByDeal(dealId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_deal_notes')
    .select('id, content, created_at')
    .eq('deal_id', dealId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
  return data;
}

export async function addDealNote(dealId: string, content: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_deal_notes')
    .insert([{ deal_id: dealId, content }])
    .select()
    .single();

  if (error) {
    console.error('Error adding note:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function deleteDealNote(noteId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('crm_deal_notes')
    .delete()
    .eq('id', noteId);

  if (error) {
    console.error('Error deleting note:', error);
    return { success: false, error };
  }
  return { success: true };
}

export async function createDeal(data: {
  title: string;
  value: number;
  stage_id: string;
  company_id: string;
  contact_id?: string;
  assigned_to?: string;
  description?: string | null;
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

  const { data: newDeal, error } = await supabase
    .from('crm_deals')
    .insert([{ ...data, position }])
    .select()
    .single();

  if (error) {
    console.error('Error creating deal:', error);
    return { success: false, error };
  }

  revalidatePath('/crm');
  return { success: true, data: newDeal };
}

export async function updateDeal(dealId: string, data: {
  title: string;
  value: number;
  status: string;
  contact_id: string | null;
  description?: string | null;
}) {
  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from('crm_deals')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', dealId)
    .select()
    .single();

  if (error) {
    console.error('Error updating deal:', error);
    return { success: false, error };
  }

  revalidatePath('/crm');
  return { success: true, data: updated };
}

export async function getContacts(companyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('id, name, email, phone, custom_fields, created_at')
    .eq('company_id', companyId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
  return data;
}

export async function createContact(data: {
  company_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  custom_fields?: Record<string, string> | null;
}) {
  const supabase = await createClient();
  const { data: contact, error } = await supabase
    .from('crm_contacts')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    return { success: false, error };
  }
  revalidatePath('/crm');
  return { success: true, data: contact };
}

export async function updateContact(contactId: string, data: {
  name: string;
  email?: string | null;
  phone?: string | null;
  custom_fields?: Record<string, string> | null;
}) {
  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from('crm_contacts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', contactId)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact:', error);
    return { success: false, error };
  }
  revalidatePath('/crm');
  return { success: true, data: updated };
}

export async function deleteContact(contactId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('crm_contacts')
    .delete()
    .eq('id', contactId);

  if (error) {
    console.error('Error deleting contact:', error);
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

  // Buscar novamente o pipeline com os stages criados para retornar ao front
  const { data: fullPipeline, error: fError } = await supabase
    .from('crm_pipelines')
    .select(`
      *,
      crm_stages (*)
    `)
    .eq('id', pipeline.id)
    .single();

  if (fError) return { success: false, error: fError };

  revalidatePath('/crm');
  return { success: true, data: fullPipeline };
}

export async function updatePipeline(pipelineId: string, name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_pipelines')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', pipelineId)
    .select()
    .single();

  if (error) return { success: false, error };
  revalidatePath('/crm');
  return { success: true, data };
}

export async function deletePipeline(pipelineId: string) {
  const supabase = await createClient();
  
  // Check if there are deals in any stage of this pipeline
  const { data: stages } = await supabase
    .from('crm_stages')
    .select('id')
    .eq('pipeline_id', pipelineId);

  if (stages && stages.length > 0) {
    const stageIds = stages.map(s => s.id);
    const { data: deals } = await supabase
      .from('crm_deals')
      .select('id')
      .in('stage_id', stageIds)
      .limit(1);

    if (deals && deals.length > 0) {
      return { success: false, error: { message: "Não é possível excluir um funil que possui oportunidades ativas." } };
    }
  }

  const { error } = await supabase
    .from('crm_pipelines')
    .delete()
    .eq('id', pipelineId);

  if (error) return { success: false, error };
  revalidatePath('/crm');
  return { success: true };
}

export async function createStage(pipelineId: string, name: string, position: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_stages')
    .insert([{ pipeline_id: pipelineId, name, position }])
    .select()
    .single();

  if (error) return { success: false, error };
  revalidatePath('/crm');
  return { success: true, data };
}

export async function updateStage(stageId: string, name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('crm_stages')
    .update({ name })
    .eq('id', stageId)
    .select()
    .single();

  if (error) return { success: false, error };
  revalidatePath('/crm');
  return { success: true, data };
}

export async function deleteStage(stageId: string) {
  const supabase = await createClient();
  const { data: deals } = await supabase
    .from('crm_deals')
    .select('id')
    .eq('stage_id', stageId)
    .limit(1);

  if (deals && deals.length > 0) {
    return { success: false, error: { message: "Não é possível excluir uma etapa que possui oportunidades ativas." } };
  }

  const { error } = await supabase
    .from('crm_stages')
    .delete()
    .eq('id', stageId);

  if (error) return { success: false, error };
  revalidatePath('/crm');
  return { success: true };
}
