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
