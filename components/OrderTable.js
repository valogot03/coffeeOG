export default function OrderTable({ orders }) {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>เวลา</th>
          <th>เมนู</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{new Date(order.created_at).toLocaleString()}</td>
            <td>{order.menu}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 