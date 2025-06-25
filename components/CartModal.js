import { useState } from 'react';

export default function CartModal({ menu, onClose, addToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);
  const [decreaseActive, setDecreaseActive] = useState(false);
  const [increaseActive, setIncreaseActive] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart({ menu: menu.name, price: menu.price, category: menu.category, quantity });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 900);
  };

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => q + 1);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <form onSubmit={handleAdd} style={{
        background: '#f1faee',
        padding: 32,
        borderRadius: 16,
        boxShadow: '0 2px 12px #0002',
        minWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h2 style={{ margin: 0 }}>เพิ่ม {menu.name} ลงตะกร้า</h2>
        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center', margin: '16px 0' }}>
          <span>จำนวน:</span>
          <button
            type="button"
            onClick={() => { setDecreaseActive(true); handleDecrease(); setTimeout(() => setDecreaseActive(false), 120); }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: 'none',
              background: decreaseActive ? '#e63946' : '#457b9d',
              color: '#fff',
              fontSize: 32,
              fontWeight: 'bold',
              boxShadow: decreaseActive ? '0 0 0 4px #f1faee' : '0 2px 8px #0002',
              transition: 'background 0.15s, box-shadow 0.15s',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            –
          </button>
          <span style={{ minWidth: 40, textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#222', background: '#fff', borderRadius: 12, padding: '4px 18px', border: '1px solid #ddd', boxShadow: '0 1px 4px #0001' }}>{quantity}</span>
          <button
            type="button"
            onClick={() => { setIncreaseActive(true); handleIncrease(); setTimeout(() => setIncreaseActive(false), 120); }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: 'none',
              background: increaseActive ? '#e63946' : '#1d3557',
              color: '#fff',
              fontSize: 32,
              fontWeight: 'bold',
              boxShadow: increaseActive ? '0 0 0 4px #f1faee' : '0 2px 8px #0002',
              transition: 'background 0.15s, box-shadow 0.15s',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            +
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit">เพิ่มลงตะกร้า</button>
          <button type="button" onClick={onClose} style={{ background: '#b7e4c7', color: '#22223b' }}>ยกเลิก</button>
        </div>
        {success && <div style={{ color: 'green', marginTop: 8 }}>เพิ่มในตะกร้าแล้ว!</div>}
      </form>
    </div>
  );
} 