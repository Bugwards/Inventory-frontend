"use client";

export default function OpeningStockSummary({ items = [] }: { items?: any[] }) {
    const total = items.reduce((s, i) => s + (i.qty || i.quantity || 0), 0);

    return (
        <div className="p-3 rounded bg-gray-50 border">
            <h4 className="font-semibold">Summary</h4>
            <p className="text-sm text-gray-600">Items: {items.length}</p>
            <p className="text-sm text-gray-600">Total Quantity: {total}</p>
        </div>
    );
}
