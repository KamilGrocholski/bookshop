export default function formatPrice(price: number, currency = '$'): string {
    return price.toFixed(2) + currency
}
