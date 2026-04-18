-- Migration: Kanban CRM Schema
-- This script creates the foundational tables for the Nexus Kanban CRM.
-- Note: Replace timestamps and other specific types according to your existing Supabase structure.

-- 1. Criação das tabelas do CRM

-- Pipelines representam os Múltiplos Funis de uma Empresa
CREATE TABLE crm_pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stages representam as Colunas de um Pipeline no Kanban
CREATE TABLE crm_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID NOT NULL REFERENCES crm_pipelines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0, -- Ordem no Kanban (0, 1, 2...)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts representam os Clientes (Leads/Pacientes/Contatos)
CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    custom_fields JSONB, -- Flexibilidade para campos extras em qualquer nicho
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals representam os Negócios (As oportunidades / Cards que se movem no kanban)
CREATE TABLE crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
    stage_id UUID NOT NULL REFERENCES crm_stages(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Qual usuário (funcionário) cuida deste deal
    title TEXT NOT NULL,
    value NUMERIC(10, 2) DEFAULT 0.00,
    position INTEGER NOT NULL DEFAULT 0, -- Posição (ordem) do card dentro da coluna stage_id
    status TEXT DEFAULT 'open', -- 'open', 'won', 'lost'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices de Performance

CREATE INDEX idx_crm_pipelines_company_id ON crm_pipelines(company_id);
CREATE INDEX idx_crm_stages_pipeline_id ON crm_stages(pipeline_id);
CREATE INDEX idx_crm_contacts_company_id ON crm_contacts(company_id);
CREATE INDEX idx_crm_deals_company_id ON crm_deals(company_id);
CREATE INDEX idx_crm_deals_stage_id ON crm_deals(stage_id);

-- 3. Inserção de RLS (Row Level Security) - IMPORTANTE
-- Garante mitigação de acessos: um usuário só pode ver dados atrelados à 'companies' vinculadas a ele.

ALTER TABLE crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;

-- Exemplo RLS Polices (Você deve ajustar se já utiliza políticas customizadas na sua base):
-- A assumindo que o dono acessa verificando 'user_id' na table companies:

CREATE POLICY "Users can manage pipelines of their companies" ON crm_pipelines
    FOR ALL
    USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage stages of their pipelines" ON crm_stages
    FOR ALL
    USING (
        pipeline_id IN (
            SELECT p.id FROM crm_pipelines p
            JOIN companies c ON p.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage contacts of their companies" ON crm_contacts
    FOR ALL
    USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage deals of their companies" ON crm_deals
    FOR ALL
    USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

-- ──────────────────────────────────────────────────────
-- Deal Notes: Timeline de notas/andamento por deal
-- ──────────────────────────────────────────────────────

CREATE TABLE crm_deal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES crm_deals(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_deal_notes_deal_id ON crm_deal_notes(deal_id);

ALTER TABLE crm_deal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage notes of their deals" ON crm_deal_notes
    FOR ALL
    USING (
        deal_id IN (
            SELECT d.id FROM crm_deals d
            JOIN companies c ON d.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );
