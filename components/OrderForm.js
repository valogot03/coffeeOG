import { useState } from 'react';

const sizes = ['เล็ก', 'กลาง', 'ใหญ่'];
const sweetnessLevels = [
  { label: 'หวานมาก', value: 'extra_sweet' },
  { label: 'หวานปกติ', value: 'normal_sweet' },
  { label: 'หวานน้อย', value: 'less_sweet' },
];

export default function OrderForm({ menu, onClose, addToCart }) {
  const [size, setSize] = useState(sizes[0]);
  const [sweetness, setSweetness] = useState(sweetnessLevels[1].value); // default หวานปกติ
  const [success, setSuccess] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      menu: menu.name,
      price: menu.price,
      category: menu.category,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <form onSubmit={handleAddToCart} style={{
        background: '#f1faee',
        padding: 32,
        borderRadius: 16,
        boxShadow: '0 2px 12px #0002',
        minWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h2 style={{ margin: 0 }}>สั่งซื้อ: {menu.name}</h2>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit">เพิ่มในตะกร้า</button>
          <button type="button" onClick={onClose} style={{ background: '#b7e4c7', color: '#22223b' }}>ยกเลิก</button>
        </div>
        {success && <div style={{ color: 'green', marginTop: 8 }}>เพิ่มในตะกร้าแล้ว!</div>}
      </form>
    </div>
  );
} 