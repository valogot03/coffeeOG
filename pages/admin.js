import { useEffect, useState } from 'react';
import OrderTable from '../components/OrderTable';

export default function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <div>
      <h1>รายการสั่งซื้อทั้งหมด</h1>
      <OrderTable orders={orders} />
    </div>
  );
} 