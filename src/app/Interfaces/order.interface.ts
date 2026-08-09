export interface Order {}

export interface CheckoutSession {
    url: string;
    success_url: string;
    cancel_url: string;
}

export interface CheckoutResponse {
    status: string;
    session: CheckoutSession;
}
