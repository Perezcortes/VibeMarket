import { PurchaseHistoryService } from "@/services/seller/catalog/BuysHistorial.service";

export class BuyHistorialPresenter {
  constructor(private readonly service: PurchaseHistoryService) {}

  // Formatea los datos para que el componente no tenga que hacer cálculos
  async getViewModel(userId: string) {
    const history = await this.service.getFullHistory(userId);
    const summary = await this.service.getUserExpenseSummary(userId);

    return {
      orders: history.map(order => ({
        id: order.id.slice(-6).toUpperCase(), // ID corto para la tabla
        date: order.purchaseDate ? new Intl.DateTimeFormat('es-MX').format(new Date(order.purchaseDate)) : 'N/A',
        total: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.total),
        statusLabel: order.status === 'DELIVERED' ? 'Entregado' : 'Procesando',
        payment: order.paymentMethod
      })),
      stats: {
        totalSpent: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(summary.totalSpent),
        avgTicket: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(summary.averageTicket),
        count: summary.totalOrders
      }
    };
  }
}