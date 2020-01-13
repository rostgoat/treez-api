/**
 * Order data transfer object expected from controller
 */
export interface OrderDTO {
    status: string,
    quantity_available: number,
    amount: number,
    name: string,
    customer_email: string,
}
