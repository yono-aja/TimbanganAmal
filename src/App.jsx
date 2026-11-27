import React, { useEffect, useMemo, useState } from 'react';
import { Scale, House, NotebookPen, ChartNoAxesColumn, Settings, CircleHelp, CalendarDays, UserRound, CheckCircle2, CircleAlert, Plus, ArrowRight, Pencil, Trophy, RotateCcw, Download, HandHeart, Trash2, X, Menu } from 'lucide-react';

const KEY = 'timbangan-diri-v1';
const today = () => new Date().toLocaleDateString('sv-SE');
const dateLabel = () => new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
const initial = [
  { id: 1, type: 'good', category: 'Ibadah', title: 'Salat tepat waktu (Subuh)', date: today() },
  { id: 2, type: 'good', category: 'Keluarga', title: 'Membantu orang tua', date: today() },
  { id: 3, type: 'good', category: 'Sedekah', title: 'Bersedekah kepada tetangga', date: today() },
  { id: 4, type: 'bad', category: 'Akhlak', title: 'Berkata kasar kepada anak', date: today() },
  { id: 5, type: 'bad', category: 'Kebiasaan', title: 'Menunda pekerjaan', date: today() },
  { id: 6, type: 'bad', category: 'Lisan', title: 'Bergunjing tentang orang lain', date: today() },
];
const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function App() {
  const [records, setRecords] = useState(() => {
    try { const saved = localStorage.getItem(KEY); return saved ? JSON.parse(saved) : initial; } catch { return initial; }
  });
  const [page, setPage] = useState('Beranda');
  const [modal, setModal] = useState(null);
  const [kind, setKind] = useState('good');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ibadah');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(records)); }, [records]);
  const todays = useMemo(() => records.filter(r => r.date === today()), [records]);
  const good = todays.filter(r => r.type === 'good');
  const bad = todays.filter(r => r.type === 'bad');
  const total = good.length + bad.length;
  const goodPct = total ? Math.round(good.length / total * 100) : 0;

  // Timbangan refleksi: jumlah catatan menentukan arah kemiringan.
  // Nilai positif berarti condong ke kebaikan, negatif ke kesalahan.
  const balanceDiff = good.length - bad.length;
  const balanceTilt = Math.max(-14, Math.min(14, balanceDiff * 4));
  const balanceLift = Math.min(42, Math.abs(balanceDiff) * 8);
  const sinLift = balanceDiff > 0 ? -balanceLift : balanceDiff < 0 ? balanceLift : 0;
  const goodLift = -sinLift;
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toLocaleDateString('sv-SE');
    return { key, label: days[d.getDay()], good: records.filter(r => r.date === key && r.type === 'good').length, bad: records.filter(r => r.date === key && r.type === 'bad').length, date: `${d.getDate()}/${d.getMonth()+1}` };
  }), [records]);

  function openAdd(type) { setKind(type); setTitle(''); setCategory(type === 'good' ? 'Ibadah' : 'Akhlak'); setModal('add'); }
  function addRecord(e) { e.preventDefault(); if (!title.trim()) return; setRecords(prev => [{ id: Date.now(), type: kind, category, title: title.trim(), date: today() }, ...prev]); setModal(null); }
  function resetToday() { if (confirm('Hapus semua catatan hari ini?')) setRecords(prev => prev.filter(r => r.date !== today())); }
  function removeRecord(id) { setRecords(prev => prev.filter(r => r.id !== id)); }
  function exportData() { const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'catatan-timbangan-diri.json'; a.click(); URL.revokeObjectURL(url); }
  const nav = [{ name: 'Beranda', icon: House }, { name: 'Catatan Harian', icon: NotebookPen }, { name: 'Statistik', icon: ChartNoAxesColumn }, { name: 'Pengaturan', icon: Settings }, { name: 'Tentang', icon: CircleHelp }];

  return <div className="app-shell">
    <style>{`
      .scale-scene .scale-beam {
        transform: rotate(var(--balance-tilt, 0deg));
        transform-origin: 50% 50%;
        transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
      }
      .scale-scene .scale-bowl.sin {
        transform: translateY(var(--sin-lift, 0px));
        transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .scale-scene .scale-bowl.virtue {
        transform: translateY(var(--good-lift, 0px));
        transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        .scale-scene .scale-beam,
        .scale-scene .scale-bowl.sin,
        .scale-scene .scale-bowl.virtue { transition: none; }
      }
    `}</style>
    <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Scale size={44} strokeWidth={1.7}/></div><strong>Timbangan<br/>Amal</strong><em>Evaluasi diri,<br/>menuju hidup lebih baik</em></div>
      <nav>{nav.map(({ name, icon: Icon }) => <button key={name} className={`nav-item ${page === name ? 'active' : ''}`} onClick={() => { setPage(name); setMobileMenu(false); }}><Icon size={20}/><span>{name}</span></button>)}</nav>
      <div className="sidebar-bottom"><span className="tiny-moon">☾</span><p>Mulai dari langkah kecil,<br/>perbaiki diri setiap hari.</p></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu"><Menu/></button><div className="date"><CalendarDays size={18}/><span>{dateLabel()}</span></div><div className="user"><UserRound size={18}/><span>Pengguna</span><span className="chevron">⌄</span></div></header>
      {page === 'Beranda' ? <>
        <section className="hero">
          <div className="hero-heading"><h1>Simulasi Timbangan Amal</h1><p>“Setiap hari adalah kesempatan untuk memperbanyak kebaikan<br className="desktop-only"/> dan memperbaiki kesalahan.”</p></div>
          <div
            className="scale-scene"
            aria-label={`Timbangan refleksi: ${good.length} catatan kebaikan dan ${bad.length} catatan kesalahan`}
            style={{
              "--balance-tilt": `${balanceTilt}deg`,
              "--sin-lift": `${sinLift}px`,
              "--good-lift": `${goodLift}px`,
            }}
          >
            <div className="scale-top">
              <span className="scale-bowl sin">CATATAN<br/>KESALAHAN</span>
              <span className="scale-bowl virtue">CATATAN<br/>KEBAIKAN</span>
            </div>
            <div className="scale-beam" />
            <div className="scale-post" />
            <div className="scale-base" />
          </div>
          <div className="summary-card sin-card"><div className="card-title"><span className="round-icon red"><CircleAlert size={20}/></span><b>Perlu Diperbaiki</b></div><strong className="big-number red-text">{bad.length}</strong><span className="card-sub">Catatan refleksi hari ini</span><button className="soft-button red-soft" onClick={() => { setPage('Catatan Harian'); setFilter('bad'); }}>Lihat Detail <ArrowRight size={16}/></button></div>
          <div className="summary-card good-card"><div className="card-title"><span className="round-icon green"><CheckCircle2 size={20}/></span><b>Amal Hari Ini</b></div><strong className="big-number green-text">{good.length}</strong><span className="card-sub">Kebaikan yang dicatat</span><button className="soft-button green-soft" onClick={() => { setPage('Catatan Harian'); setFilter('good'); }}>Lihat Detail <ArrowRight size={16}/></button></div>
          <div className="intention"><span>✦</span><div><b>Niatkan selalu untuk berbuat baik</b><small>“Setiap langkah kecil menuju kebaikan, bernilai besar di sisi Allah.”</small></div><span>✦</span></div>
        </section>
        <section className="dashboard-grid">
          <article className="panel daily-panel"><h2><Pencil size={20}/> Catatan Hari Ini</h2><div className="list-head good-head"><b><CheckCircle2 size={18}/> Amal Baik</b><button onClick={() => openAdd('good')} aria-label="Tambah amal baik"><Plus size={19}/></button></div><RecordList items={good} onDelete={removeRecord} compact/><div className="list-head bad-head"><b><CircleAlert size={18}/> Perlu Diperbaiki</b><button onClick={() => openAdd('bad')} aria-label="Tambah catatan refleksi"><Plus size={19}/></button></div><RecordList items={bad} onDelete={removeRecord} compact/></article>
          <article className="panel stats-panel"><h2><ChartNoAxesColumn size={20}/> Ringkasan Hari Ini</h2><div className="donut-wrap"><div className="donut" style={{ '--pct': `${goodPct}%` }}><div><strong>{goodPct}%</strong><span>Amal Baik</span></div></div><div className="legend"><p><i className="dot green-dot"/> Amal Baik <b>{good.length}</b></p><p><i className="dot red-dot"/> Refleksi <b>{bad.length}</b></p></div></div><div className="target"><Trophy size={22}/><div><span>Target Hari Ini</span><b>Tambah kebaikan, perbaiki kebiasaan</b></div></div><div className="progress"><span style={{ width: `${goodPct}%` }}/></div><div className="progress-label">{goodPct}% catatan berupa amal baik</div></article>
          <article className="panel chart-panel"><h2><CalendarDays size={20}/> Riwayat 7 Hari</h2><div className="chart-legend"><span><i className="dot green-dot"/> Amal</span><span><i className="dot red-dot"/> Refleksi</span></div><div className="bar-chart">{week.map(d => <div className="bar-day" key={d.key}><div className="bars"><span className="bar good-bar" style={{ height: `${Math.max(3, d.good * 15)}px` }} title={`${d.good} amal`}/><span className="bar bad-bar" style={{ height: `${Math.max(3, d.bad * 15)}px` }} title={`${d.bad} refleksi`}/></div><small>{d.label}<br/>{d.date}</small></div>)}</div></article>
        </section>
        <section className="bottom-row"><div className="reminder"><div className="hands">🤲</div><div><h3>Teruslah beristighfar dan berbuat baik</h3><p>Setiap hari adalah kesempatan untuk memperbaiki diri,<br className="desktop-only"/> sebelum terlambat.</p></div></div><div className="actions"><button className="action-button purple" onClick={resetToday}><RotateCcw size={17}/> Reset Hari Ini</button><button className="action-button blue" onClick={exportData}><Download size={17}/> Export Data</button><p>Semoga catatan ini menjadi pengingat<br/>untuk selalu memperbaiki diri. 🤲</p></div></section>
      </> : page === 'Catatan Harian' ? <section className="page-content"><div className="page-title"><div><h1>Catatan Harian</h1><p>Catat kebaikan dan hal yang ingin diperbaiki.</p></div><div className="page-buttons"><button className="action-button green" onClick={() => openAdd('good')}><Plus size={17}/> Amal Baik</button><button className="action-button red" onClick={() => openAdd('bad')}><Plus size={17}/> Refleksi</button></div></div><div className="filter-row"><button className={filter==='all'?'selected':''} onClick={()=>setFilter('all')}>Semua</button><button className={filter==='good'?'selected':''} onClick={()=>setFilter('good')}>Amal Baik</button><button className={filter==='bad'?'selected':''} onClick={()=>setFilter('bad')}>Refleksi</button></div><div className="panel records-panel"><RecordList items={records.filter(r => filter==='all' || r.type===filter)} onDelete={removeRecord}/></div></section> : page === 'Statistik' ? <section className="page-content"><div className="page-title"><div><h1>Statistik</h1><p>Ringkasan catatan yang tersimpan di perangkat ini.</p></div></div><div className="stat-cards"><div className="panel"><span>Total Amal Baik</span><strong className="green-text">{records.filter(r=>r.type==='good').length}</strong></div><div className="panel"><span>Total Refleksi</span><strong className="red-text">{records.filter(r=>r.type==='bad').length}</strong></div><div className="panel"><span>Total Catatan</span><strong>{records.length}</strong></div></div><article className="panel chart-panel full-chart"><h2><ChartNoAxesColumn size={20}/> Riwayat 7 Hari</h2><div className="bar-chart large">{week.map(d=><div className="bar-day" key={d.key}><div className="bars"><span className="bar good-bar" style={{height:`${Math.max(3,d.good*25)}px`}}/><span className="bar bad-bar" style={{height:`${Math.max(3,d.bad*25)}px`}}/></div><small>{d.label}<br/>{d.date}</small></div>)}</div></article></section> : page === 'Pengaturan' ? <section className="page-content"><div className="page-title"><div><h1>Pengaturan</h1><p>Kelola data refleksi Anda.</p></div></div><div className="panel settings-panel"><h2>Data pribadi</h2><p>Catatan tersimpan di browser perangkat ini (localStorage), bukan dikirim ke server.</p><button className="action-button blue" onClick={exportData}><Download size={17}/> Export Data</button><button className="action-button red" onClick={()=>{if(confirm('Hapus seluruh catatan? Data yang dihapus tidak bisa dipulihkan.'))setRecords([])}}><Trash2 size={17}/> Hapus Semua Catatan</button></div></section> : <section className="page-content"><div className="page-title"><div><h1>Tentang Simulasi Timbangan Amal</h1><p>Aplikasi sederhana untuk introspeksi dan membangun kebiasaan baik.</p></div></div><div className="panel about-panel"><HandHeart size={40}/><h2>Refleksi, bukan penilaian akhir</h2><p>Aplikasi ini hanya membantu mencatat amal baik dan hal-hal yang ingin diperbaiki. Jumlah catatan bukan ukuran pasti dosa atau pahala; penilaian akhir adalah hak Allah. Gunakan sebagai pengingat untuk memperbaiki diri, meminta maaf, dan bertaubat.</p></div></section>}
    </main>
    {modal === 'add' && <div className="modal-backdrop" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-head"><h2>{kind === 'good' ? 'Tambah Amal Baik' : 'Tambah Refleksi'}</h2><button onClick={() => setModal(null)} aria-label="Tutup"><X size={20}/></button></div><form onSubmit={addRecord}><label>Catatan</label><input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder={kind==='good'?'Contoh: membantu orang tua':'Contoh: ingin lebih sabar'} maxLength={140} required/><label>Kategori</label><select value={category} onChange={e=>setCategory(e.target.value)}>{(kind==='good'?['Ibadah','Akhlak','Keluarga','Sedekah','Pekerjaan','Lainnya']:['Akhlak','Lisan','Kebiasaan','Ibadah','Hubungan','Lainnya']).map(c=><option key={c}>{c}</option>)}</select><p className="form-note">Catatan ini untuk refleksi pribadi, bukan penilaian pasti dosa atau pahala.</p><button className={`action-button ${kind==='good'?'green':'red'} submit`} type="submit">Simpan Catatan</button></form></div></div>}
  </div>;
}

function RecordList({ items, onDelete, compact=false }) {
  if (!items.length) return <div className="empty">Belum ada catatan.</div>;
  return <div className={`record-list ${compact?'compact':''}`}>{items.map(r=><div className={`record ${r.type}`} key={r.id}><span className="record-icon">{r.type==='good'?<CheckCircle2 size={17}/>:<CircleAlert size={17}/>}</span><div className="record-text"><span>{r.title}</span>{!compact&&<small>{r.category} · {r.date}</small>}</div><button className="delete-record" onClick={()=>onDelete(r.id)} title="Hapus catatan"><Trash2 size={15}/></button></div>)}</div>;
}

export default App;
