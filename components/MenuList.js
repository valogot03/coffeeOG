import { useState, useEffect } from 'react';
import OrderForm from './OrderForm';
import CartModal from './CartModal';

export default function MenuList({ addToCart }) {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    fetch('/api/menus')
      .then(res => res.json())
      .then(setMenus);
  }, []);

  return (
    <div className="menu-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 24 }}>
      {menus.map((menu) => (
        <div className="menu-card" key={menu.id} style={{
          border: '1px solid #b7e4c7',
          borderRadius: 12,
          padding: 16,
          width: 220,
          background: '#fff',
          boxShadow: '0 2px 8px #0001',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <img src={menu.image || '/placeholder.jpg'} alt={menu.name} width={180} height={120} style={{ borderRadius: 8, marginBottom: 8 }} />
          <h3>{menu.name}</h3>
          <p style={{ color: '#3a5a40', fontWeight: 'bold' }}>ราคา: {menu.price} บาท</p>
          <button onClick={() => setSelectedMenu(menu)}>เลือก</button>
        </div>
      ))}
      {selectedMenu && (
        <CartModal menu={selectedMenu} onClose={() => setSelectedMenu(null)} addToCart={addToCart} />
      )}
    </div>
  );
} 