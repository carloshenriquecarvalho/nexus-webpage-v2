import { Bill, BillStatus } from "@/types/database";

/**
 * Retorna o status efetivo de um boleto.
 * Se o status for 'Pendente' mas a data de vencimento já passou, retorna 'Vencido'.
 */
export function getEffectiveStatus(bill: Bill): BillStatus {
  if (bill.status === "Paga") return "Paga";
  
  if (bill.status === "Pendente" && bill.overdue_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // overdue_date é "YYYY-MM-DD"
    const dueDate = new Date(bill.overdue_date + "T00:00:00");
    
    if (today > dueDate) {
      return "Vencido";
    }
  }
  
  return bill.status;
}

/**
 * Filtra uma lista de boletos por intervalo de data (baseado no vencimento)
 */
export function filterBillsByDate(bills: Bill[], startDate?: string, endDate?: string): Bill[] {
  return bills.filter(bill => {
    if (!bill.overdue_date) return true; // Se não tem data, mantém na lista (ou pode-se decidir ocultar)
    
    if (startDate && bill.overdue_date < startDate) return false;
    if (endDate && bill.overdue_date > endDate) return false;
    
    return true;
  });
}

/**
 * Retorna a diferença em dias entre a data atual e a data de vencimento.
 */
export function getDaysUntilDue(dueDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dueDateStr + "T00:00:00");
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Retorna uma mensagem de aviso para boletos que estão perto de vencer.
 */
export function getImminentWarning(bill: Bill): string | null {
  if (bill.status === "Paga" || !bill.overdue_date) return null;
  
  const days = getDaysUntilDue(bill.overdue_date);
  
  if (days < 0) return null; // Já vencido (já tem status Vencido)
  if (days === 0) return "Vence hoje";
  if (days === 1) return "Vence amanhã";
  if (days <= 3) return `A vencer em ${days} dias`;
  
  return null;
}
