export default function SellerDashboard() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Roaster Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Sales</h3>
                    <p className="text-3xl font-bold">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Orders to Fulfill</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Low Stock Items</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
            </div>
        </div>
    );
}
