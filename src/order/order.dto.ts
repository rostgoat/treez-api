/**
 * Order data transfer object expected from controller
 */
export interface OrderDTO {
    order_id: string,
    customer_email: string,
    status: string,
    amount: number,
    quantity: number,
    inventories: [
        {
            name: string,
            quantity_available: number,
            quantity: number,
            previous_quantity: number,
        }
    ]
}
