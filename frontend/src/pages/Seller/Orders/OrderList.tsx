import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
// import { Order } from '../../../api/types'; // Need Order type

// Quick type def if not in types.ts (should be updated there)
interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    customer_id: string; // expanded usually
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function OrderList() {
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['roaster-orders'],
        queryFn: async () => {
            const { data } = await api.get<Order[]>('/orders/roaster');
            return data;
        }
    });

    const mutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            return api.patch(`/orders/${id}/status`, { status_in: status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roaster-orders'] });
        }
    });

    const handleStatusChange = (orderId: string, newStatus: string) => {
        if (confirm(`Change status to ${newStatus}?`)) {
            mutation.mutate({ id: orderId, status: newStatus });
        }
    };

    if (isLoading) return <div>Loading orders...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage your incoming orders.</p>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {orders?.map((order) => (
                                        <tr key={order.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order.id.substring(0, 8)}...</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${order.total_amount}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <select
                                                    className="text-sm border-gray-300 rounded-md"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="packed">Packed</option>
                                                    <option value="shipped">Shipped</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
