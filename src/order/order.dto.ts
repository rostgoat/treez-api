/**
 * Order data transfer object expected from controller
 */
export interface OrderDTO {
    customer_email: string,
    status: string,
    amount: number,
    quantity: number,
    inventories: [
        {
            name: string,
            quantity_available: number,
            quantity: number,
        }
    ]
}
