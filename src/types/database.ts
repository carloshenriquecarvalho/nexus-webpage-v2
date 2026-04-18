export type BillStatus = 'Paga' | 'Pendente' | 'Vencido';

export interface Company {
  id: string; // uuid
  user_id: string; // uuid
  name: string;
  logo_url?: string | null;
}

export interface Bill {
  id: string; // uuid
  company_id: string; // fk
  description: string;
  amount: number;
  category?: string | null;
  status: BillStatus;
  overdue_date?: string | null; // date
  notification_date?: string | null; // date
  payment_date?: string | null; // date
  google_event_id?: string | null;
  cost_center?: string | null;
  pdf_url?: string | null;
}
