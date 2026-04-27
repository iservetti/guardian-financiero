import { useState } from 'react';

function SavingsGoals({ transactions, selectedMonth }) {
  const [goals, setGoals] = useState(() => {
    const s = localStorage.getItem('goals');
    return s ? JSON.parse(s) : [
      { id:1, name:'Viaje a Bariloche 🏔️',  target:200000, saved:45000,  emoji:'✈️' },
      { id:2, name:'Fondo de emergencia 🛡️', target:500000, saved:120000, emoji:'🛡️' },
    ];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', target:'', emoji:'🎯' });

  const saveGoals = (g) => {
    setGoals(g); localStorage.setItem('goals', JSON.stringify(g));
  };

  const addGoal = () => {
    if (!form.name || !form.target) return;
    const updated = [...goals, { id:Date.now(), ...form, target:Number(form.target), saved:0 }];
    saveGoals(updated); setShowForm(false); setForm({name:'',target:'',emoji:'🎯'});
  };

  const addToGoal = (id, amount) => {
    saveGoals(goals.map(g => g.id===id ? {...g, saved: Math.min(g.saved+amount, g.target)} : g));
  };

  const deleteGoal = id => saveGoals(goals.filter(g => g.id!==id));

  const monthIncome  = transactions.filter(t=>new Date(t.date).getMonth()===selectedMonth&&t.type==='income').reduce((s,t)=>s+t.amount,0);
  const monthExpense = transactions.filter(t=>new Date(t.date).getMonth()===selectedMonth&&t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const monthSavings = Math.max(0, monthIncome - monthExpense);

  const fmt = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);

  return (
    <div className="goals-section">
      <div className="section-header">
        <div className="section-title">🏆 Metas de ahorro</div>
        <button className="btn-add-goal" onClick={()=>setShowForm(s=>!s)}>
          {showForm ? '✕ Cancelar' : '+ Nueva meta'}
        </button>
      </div>

      {showForm && (
        <div className="goal-form">
          <input placeholder="Nombre de la meta..." value={form.name}
            onChange={e=>setForm(f=>({...f,name:e.target.value}))}
            style={{flex:2,padding:'0.5rem 0.75rem',borderRadius:'10px',
                    border:'1px solid var(--border)',background:'var(--card)',
                    color:'var(--text)',fontSize:'0.85rem',outline:'none'}} />
          <input placeholder="$ Objetivo" type="number" value={form.target}
            onChange={e=>setForm(f=>({...f,target:e.target.value}))}
            style={{flex:1,padding:'0.5rem 0.75rem',borderRadius:'10px',
                    border:'1px solid var(--border)',background:'var(--card)',
                    color:'var(--text)',fontSize:'0.85rem',outline:'none'}} />
          <button onClick={addGoal} style={{padding:'0.5rem 1rem',borderRadius:'10px',
            background:'linear-gradient(135deg,#b8a4f8,#f9a8d4)',color:'white',
            border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.82rem'}}>
            Crear
          </button>
        </div>
      )}

      <div className="goals-grid">
        {goals.map(goal => {
          const pct     = Math.min((goal.saved/goal.target)*100, 100);
          const remaining = goal.target - goal.saved;
          const months  = monthSavings > 0 ? Math.ceil(remaining/monthSavings) : null;

          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <span className="goal-emoji">{goal.emoji}</span>
                <div className="goal-info">
                  <div className="goal-name">{goal.name}</div>
                  <div className="goal-amounts">{fmt(goal.saved)} de {fmt(goal.target)}</div>
                </div>
                <button onClick={()=>deleteGoal(goal.id)}
                  style={{background:'none',border:'none',color:'var(--muted)',
                          cursor:'pointer',fontSize:'0.8rem',opacity:0.6}}>✕</button>
              </div>
              <div className="budget-bar-track" style={{margin:'0.75rem 0 0.4rem'}}>
                <div className="budget-bar-fill"
                  style={{width:`${pct}%`,
                          background: pct>=100?'#34c78a':'linear-gradient(90deg,#b8a4f8,#f9a8d4)'}} />
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'0.72rem',color:'var(--muted)'}}>
                  {pct>=100 ? '🎉 ¡Meta cumplida!' : `${Math.round(pct)}% completado`}
                  {months && pct<100 && ` · ~${months} mes${months>1?'es':''} al ritmo actual`}
                </span>
                {pct<100 && monthSavings>0 && (
                  <button onClick={()=>addToGoal(goal.id, Math.round(monthSavings*0.2))}
                    style={{fontSize:'0.7rem',padding:'0.2rem 0.6rem',borderRadius:'50px',
                            background:'#ede9fe',color:'#7c3aed',border:'none',
                            cursor:'pointer',fontWeight:700}}>
                    + Aportar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SavingsGoals;