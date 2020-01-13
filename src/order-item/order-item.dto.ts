/**
 * Order item data transfer object expected from controller
 */
export interface OrderItemDTO {
    quantity: number,
    previous_quantity: number,
    orderId: string,
}
