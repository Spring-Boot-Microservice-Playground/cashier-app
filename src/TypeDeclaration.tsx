export interface Product {
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