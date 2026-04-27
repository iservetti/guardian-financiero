import { useState } from 'react';
import { CATEGORIES } from './CategoryBadge';

const DEFAULT_BUDGETS = {
  comida:          50000,
  transporte:      15000,
  entretenimiento: 10000,
  servicios:       20000,
  ropa:            30000,
};

function BudgetSection({ transactions }) {
  const [budgets, setBudgets] = useState(() => {
    const s = localStorage.getItem('budgets');
    return s ? JSON.parse(s) : DEFAULT_BUDGETS;
  });
  const [editing, setEditing] = useState(null);
  const [tempVal, setTempVal] = useState('');

  const save = (cat) => {
    const updated = { ...budgets, [cat]: Number(tempVal) };
    setBudgets(updated);
    localStorage.setItem('budgets', JSON.stringify(updated));
    setEditing(null);
  };

  const fmt = n => new Intl.NumberFormat('es-AR',{
    style:'currency',currency:'ARS',maximumFractionDigits:0
  }).format(n);

  const catTotals = {};
  transactions.filter(t=>t.type==='expense').forEach(t=>{
    catTotals[t.category]=(catTotals[t.category]||0)+t.amount;
  });

  return (
    <div className="budget-section">
      <div className="section-header">
        <div className="section-title">🎯 Presupuestos mensuales</div>
        <span style={{fontSize:'0.72rem',color:'var(--muted)'}}>Click para editar</span>
      </div>
      <div className="budget-list">
        {Object.entries(budgets).map(([cat, limit]) => {
          const spent   = catTotals[cat] || 0;
          const pct     = Math.min((spent/limit)*100, 100);
          const over    = spent > limit;
          const cat_info= CATEGORIES[cat] || CATEGORIES['otros'];
          const barColor= pct>=100?'#f87171':pct>=75?'#fbbf24':'#34c78a';

          return (
            <div key={cat} className="budget-item">
              <div className="budget-item-header">
                <span className="budget-cat-label">
                  {cat_info.icon} {cat_info.label}
                </span>
                {editing === cat ? (
                  <div style={{display:'flex',gap:'0.4rem',alignItems:'center'}}>
                    <input
                      type="number"
                      value={tempVal}
                      onChange={e=>setTempVal(e.target.value)}
                      style={{width:'90px',padding:'0.2rem 0.5rem',borderRadius:'8px',
                              border:'1px solid var(--border)',background:'var(--card)',
                              color:'var(--text)',fontSize:'0.8rem',outline:'none'}}
                      autoFocus
                    />
                    <button onClick={()=>save(cat)}
                      style={{background:'var(--green)',color:'white',border:'none',
                              borderRadius:'8px',padding:'0.2rem 0.6rem',cursor:'pointer',fontSize:'0.78rem'}}>
                      ✓
                    </button>
                    <button onClick={()=>setEditing(null)}
                      style={{background:'none',color:'var(--muted)',border:'none',cursor:'pointer',fontSize:'0.78rem'}}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <button className="budget-edit-btn"
                    onClick={()=>{ setEditing(cat); setTempVal(limit); }}>
                    {fmt(spent)} / {fmt(limit)}
                    {over && ' ⚠️'}
                  </button>
                )}
              </div>
              <div className="budget-bar-track">
                <div className="budget-bar-fill"
                  style={{width:`${pct}%`, background:barColor}} />
              </div>
              {over && (
                <div style={{fontSize:'0.68rem',color:'#f87171',marginTop:'0.2rem',fontWeight:700}}>
                  Superaste el límite por {fmt(spent-limit)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetSection;