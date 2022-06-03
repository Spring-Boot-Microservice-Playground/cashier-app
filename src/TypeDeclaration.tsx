export interface Product {
    id: string;
    name: string;
    price: number;
    amount: number;
}

export interface Transaction {
    id: string,
    customer_name: string;
    date: string;
    cash: number;
    change: number;
    products: Product[];
}

export interface Receipt {
    transaction: Transaction;
    totalPrice: number;
}