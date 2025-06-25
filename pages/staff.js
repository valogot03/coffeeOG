import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const statusOptions = [
  { label: 'รอดำเนินการ', value: 'pending' },
  { label: 'เสร็จสิ้น', value: 'done' },
];

const sweetnessMap = {
  extra_sweet: 'หวานมาก',
  normal_sweet: 'หวานปกติ',
  less_sweet: 'หวานน้อย',
};

export default function Staff() {
  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuImage, setMenuImage] = useState('');
  const [menuCategory, setMenuCategory] = useState('2');
  const [editMenuId, setEditMenuId] = useState(null);
  const [editMenuName, setEditMenuName] = useState('');
  const [editMenuPrice, setEditMenuPrice] = useState('');
  const [editMenuImage, setEditMenuImage] = useState('');
  const [editMenuCategory, setEditMenuCategory] = useState('2');

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders);
  };
  const fetchMenus = () => {
    fetch('/api/menus')
      .then(res => res.json())
      .then(setMenus);
  };

  useEffect(() => {
    fetchOrders();
    fetchMenus();
    const interval = setInterval(() => {
      fetchOrders();
      fetchMenus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('ยืนยันการลบออเดอร์นี้?')) return;
    await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    fetchOrders();
  };

  const addMenu = async (e) => {
    e.preventDefault();
    if (!menuName || !menuPrice) return alert('กรอกชื่อและราคาด้วย');
    await fetch('/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: menuName,
        price: Number(menuPrice),
        image: menuImage || '/placeholder.jpg',
        category: menuCategory,
      }),
    });
    setMenuName('');
    setMenuPrice('');
    setMenuImage('');
    setMenuCategory('2');
    fetchMenus();
    alert('เพิ่มเมนูสำเร็จ!');
  };

  const deleteMenu = async (id) => {
    if (!window.confirm('ยืนยันการลบเมนูนี้?')) return;
    await fetch(`/api/menus/${id}`, {
      method: 'DELETE',
    });
    fetchMenus();
  };

  const startEditMenu = (menu) => {
    setEditMenuId(menu.id);
    setEditMenuName(menu.name);
    setEditMenuPrice(menu.price);
    setEditMenuImage(menu.image || '');
    setEditMenuCategory(menu.category || '2');
  };

  const cancelEditMenu = () => {
    setEditMenuId(null);
    setEditMenuName('');
    setEditMenuPrice('');
    setEditMenuImage('');
    setEditMenuCategory('2');
  };

  const saveEditMenu = async (id) => {
    await fetch(`/api/menus/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editMenuName,
        price: Number(editMenuPrice),
        image: editMenuImage || '/placeholder.jpg',
        category: editMenuCategory,
      }),
    });
    cancelEditMenu();
    fetchMenus();
  };

  const getRowStyle = (status) => {
    if (status === 'pending') {
      return { background: '#ffe5e5' };
    }
    if (status === 'done') {
      return { background: '#e5ffe5' };
    }
    return {};
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      groupedOrders.map(group => ({
        เวลา: new Date(group.created_at).toLocaleString(),
        เมนู: group.items.map(item => item.menu).join(', '),
        สถานะ: statusOptions.find(opt => opt.value === group.status)?.label || group.status,
        Slip: group.slip_url ? group.slip_url : '-',
        เลขอ้างอิง: group.ref_code || '-',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders_report.xlsx');
  };

  // Group orders by order_id
  const groupedOrders = Object.values(orders.reduce((acc, order) => {
    if (!acc[order.order_id]) acc[order.order_id] = { ...order, items: [] };
    acc[order.order_id].items.push(order);
    return acc;
  }, {}));

  // ฟังก์ชันเปลี่ยนสถานะ/ลบ ทุกแถวในกลุ่ม
  const updateGroupStatus = async (order_id, status) => {
    const group = orders.filter(o => o.order_id === order_id);
    for (const order of group) {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    }
    fetchOrders();
  };

  const deleteGroupOrder = async (order_id) => {
    if (!window.confirm('ยืนยันการลบออเดอร์นี้?')) return;
    const group = orders.filter(o => o.order_id === order_id);
    for (const order of group) {
      await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
      });
    }
    fetchOrders();
  };

  return (
    <div>
      <h1>จัดการออเดอร์ (พนักงาน)</h1>
      <form onSubmit={addMenu} style={{ marginBottom: 24, background: '#fffbe6', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px #0001', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <b>เพิ่มเมนูใหม่:</b>
        <input value={menuName} onChange={e => setMenuName(e.target.value)} placeholder="ชื่อเมนู" style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
        <input value={menuPrice} onChange={e => setMenuPrice(e.target.value)} placeholder="ราคา" type="number" style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', width: 80 }} />
        <input value={menuImage} onChange={e => setMenuImage(e.target.value)} placeholder="URL รูป (ไม่บังคับ)" style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', width: 180 }} />
        <button type="submit">เพิ่มเมนู</button>
      </form>
      <h2>เมนูทั้งหมด</h2>
      <table border="1" cellPadding="8" style={{ marginBottom: 32 }}>
        <thead>
          <tr>
            <th>ชื่อเมนู</th>
            <th>ราคา</th>
            <th>รูป</th>
            <th>แก้ไข/ลบ</th>
          </tr>
        </thead>
        <tbody>
          {menus.map(menu => (
            <tr key={menu.id}>
              <td>
                {editMenuId === menu.id ? (
                  <input value={editMenuName} onChange={e => setEditMenuName(e.target.value)} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }} />
                ) : menu.name}
              </td>
              <td>
                {editMenuId === menu.id ? (
                  <input value={editMenuPrice} onChange={e => setEditMenuPrice(e.target.value)} type="number" style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc', width: 70 }} />
                ) : menu.price}
              </td>
              <td>
                {editMenuId === menu.id ? (
                  <input value={editMenuImage} onChange={e => setEditMenuImage(e.target.value)} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc', width: 120 }} />
                ) : (
                  <img src={menu.image || '/placeholder.jpg'} alt={menu.name} width={60} style={{ borderRadius: 6 }} />
                )}
              </td>
              <td>
                {editMenuId === menu.id ? (
                  <>
                    <button style={{ background: '#3a86ff', color: '#fff', borderRadius: 6, marginRight: 4 }} onClick={() => saveEditMenu(menu.id)} type="button">บันทึก</button>
                    <button style={{ background: '#b7e4c7', color: '#22223b', borderRadius: 6 }} onClick={cancelEditMenu} type="button">ยกเลิก</button>
                  </>
                ) : (
                  <>
                    <button style={{ background: '#ffbe0b', color: '#22223b', borderRadius: 6, marginRight: 4 }} onClick={() => startEditMenu(menu)} type="button">แก้ไข</button>
                    <button style={{ background: '#e63946', color: '#fff', borderRadius: 6 }} onClick={() => deleteMenu(menu.id)} type="button">ลบ</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>ออเดอร์ทั้งหมด</h2>
      <button
        onClick={exportToExcel}
        style={{
          background: '#3a86ff',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 'bold',
          marginBottom: 16,
          marginRight: 8
        }}
      >
        Report (Excel)
      </button>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>เวลา</th>
            <th>เมนู</th>
            <th>สถานะ</th>
            <th>Slip</th>
            <th>เลขอ้างอิง</th>
            <th>เปลี่ยนสถานะ</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {groupedOrders.map(group => (
            <tr key={group.order_id} style={getRowStyle(group.status)}>
              <td>{new Date(group.created_at).toLocaleString()}</td>
              <td>
                {group.items.map((item, idx) => (
                  <div key={idx}>{item.menu}</div>
                ))}
              </td>
              <td>{statusOptions.find(opt => opt.value === group.status)?.label || group.status}</td>
              <td>
                {group.slip_url ? (
                  <a href={group.slip_url} target="_blank" rel="noopener noreferrer">ดูสลิป</a>
                ) : (
                  '-'
                )}
              </td>
              <td>{group.ref_code || '-'}</td>
              <td>
                {group.status === 'pending' ? (
                  <button style={{ background: '#3a86ff', color: '#fff', borderRadius: 6, padding: '4px 12px' }} onClick={() => updateGroupStatus(group.order_id, 'done')}>
                    ทำเสร็จแล้ว
                  </button>
                ) : (
                  <button style={{ background: '#ffbe0b', color: '#22223b', borderRadius: 6, padding: '4px 12px' }} onClick={() => updateGroupStatus(group.order_id, 'pending')}>
                    กลับไปรอดำเนินการ
                  </button>
                )}
              </td>
              <td>
                <button style={{ background: '#e63946', color: '#fff', borderRadius: 6, padding: '4px 12px' }} onClick={() => deleteGroupOrder(group.order_id)}>
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 