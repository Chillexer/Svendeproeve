export default function FormatPrice(price: number): string {
    return (Math.round(price * 100) / 100).toFixed(2).replace(".", ",");
}