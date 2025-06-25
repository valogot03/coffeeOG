import { useState } from 'react';
import MenuList from '../components/MenuList';
import Link from 'next/link';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCartMsg, setShowCartMsg] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [total, setTotal] = useState(0);
  const [showProof, setShowProof] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [refCode, setRefCode] = useState('');
  const [uploading, setUploading] = useState(false);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
    setShowCartMsg(true);
    setTimeout(() => setShowCartMsg(false), 1200);
  };

  const removeFromCart = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCheckout = async () => {
    let sum = 0;
    cart.forEach(item => {
      sum += item.price * (item.quantity || 1);
    });
    setTotal(sum);
    // เรียก API ฝั่ง server เพื่อ generate payload
    const res = await fetch(`/api/promptpay?id=0812345678&amount=${sum}`);
    const data = await res.json();
    const payload = data.payload;
    QRCode.toDataURL(payload, (err, url) => {
      setQrUrl(url);
      setShowQr(true);
    });
  };

  const handleConfirmPaid = () => {
    setShowProof(true);
  };

  const handleSendProof = async () => {
    if (!slipFile && !refCode) {
      alert('กรุณาแนบสลิปหรือกรอกเลขอ้างอิงอย่างน้อย 1 อย่าง');
      return;
    }
    setUploading(true);
    let slip_url = '';
    if (slipFile) {
      // อัปโหลดไฟล์ไป Supabase Storage
      const formData = new FormData();
      formData.append('file', slipFile);
      // เรียก API อัปโหลด (ต้องสร้าง /api/upload-slip)
      const res = await fetch('/api/upload-slip', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      slip_url = data.url;
    }
    const order_id = uuidv4();
    // รวมเมนูซ้ำใน cart ให้เป็น 1 แถวที่ quantity รวมกัน
    const mergedCart = [];
    cart.forEach(item => {
      const found = mergedCart.find(
        i => i.menu === item.menu && i.price === item.price && i.category === item.category
      );
      if (found) {
        found.quantity += item.quantity || 1;
      } else {
        mergedCart.push({ ...item });
      }
    });
    for (const item of mergedCart) {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, slip_url, ref_code: refCode, order_id }),
      });
    }
    setCart([]);
    setShowQr(false);
    setShowProof(false);
    setSlipFile(null);
    setRefCode('');
    setUploading(false);
    alert('ส่งหลักฐานสำเร็จ!');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <Link href="/staff">
          <button style={{ padding: '10px 20px', fontSize: 16, background: '#ffbe0b', color: '#22223b', fontWeight: 'bold', border: 'none', borderRadius: 8, boxShadow: '0 2px 8px #0002', letterSpacing: 1 }}>สำหรับพนักงาน</button>
        </Link>
      </div>
      <h1 style={{ textAlign: 'center', marginTop: 48 }}>เมนูกาแฟ</h1>
      <MenuList addToCart={addToCart} />
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 20, maxWidth: 350 }}>
        {showCartMsg && (
          <div style={{ background: '#b7e4c7', color: '#22223b', padding: 12, borderRadius: 8, marginBottom: 8, boxShadow: '0 2px 8px #0002', fontWeight: 'bold' }}>
            เพิ่มเมนูลงตะกร้าแล้ว!
          </div>
        )}
        {cart.length > 0 && !showQr && (
          <div style={{ background: '#fff', border: '1px solid #b7e4c7', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16 }}>
            <b>ตะกร้าสินค้า</b>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cart.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 4 }}>
                  {item.menu}
                  {item.quantity > 1 ? ` x${item.quantity}` : ''}
                  <button onClick={() => removeFromCart(idx)} style={{ marginLeft: 8, background: '#e63946', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 12 }}>ลบ</button>
                </li>
              ))}
            </ul>
            <div style={{ margin: '8px 0', fontWeight: 'bold' }}>ยอดรวม: {cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)} บาท</div>
            <button onClick={handleCheckout} style={{ marginTop: 8, width: '100%' }}>ชำระเงิน (QR Code)</button>
          </div>
        )}
        {showQr && !showProof && (
          <div style={{ background: '#fff', border: '1px solid #b7e4c7', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, textAlign: 'center' }}>
            <b>สแกนจ่ายด้วยพร้อมเพย์</b>
            <div style={{ margin: '12px 0' }}>
              <img src={qrUrl} alt="QR PromptPay" style={{ width: 200, height: 200 }} />
            </div>
            <div style={{ marginBottom: 8 }}>ยอดเงิน: {total} บาท</div>
            <button onClick={handleConfirmPaid} style={{ width: '100%' }}>ยืนยันชำระเงินแล้ว</button>
            <button onClick={() => setShowQr(false)} style={{ width: '100%', marginTop: 8, background: '#b7e4c7', color: '#22223b' }}>ย้อนกลับ</button>
          </div>
        )}
        {showProof && (
          <div style={{ background: '#fff', border: '1px solid #b7e4c7', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, textAlign: 'center' }}>
            <b>แนบสลิปหรือกรอกเลขอ้างอิง</b>
            <div style={{ margin: '12px 0' }}>
              <input type="file" accept="image/*" onChange={e => setSlipFile(e.target.files[0])} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input type="text" placeholder="เลขอ้างอิง (ถ้ามี)" value={refCode} onChange={e => setRefCode(e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc', width: '90%' }} />
            </div>
            <button onClick={handleSendProof} style={{ width: '100%' }} disabled={uploading}>{uploading ? 'กำลังส่ง...' : 'ส่งหลักฐาน'}</button>
            <button onClick={() => setShowProof(false)} style={{ width: '100%', marginTop: 8, background: '#b7e4c7', color: '#22223b' }}>ย้อนกลับ</button>
          </div>
        )}
      </div>
    </div>
  );
} 