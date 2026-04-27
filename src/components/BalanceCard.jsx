import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration=900) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(()=>{
    const start=prev.current, diff=target-start, t0=performance.now();
    const tick=now=>{
      const t=Math.min((now-t0)/duration,1);
      const ease=1-Math.pow(1-t,3);
      setDisplay(Math.round(start+diff*ease));
      if(t<1) requestAnimationFrame(tick); else prev.current=target;
    };
    requestAnimationFrame(tick);
  },[target]);
  return display;
}

function BalanceCard({ title, amount, icon, type, sub, badge, change }) {
  const animated = useCountUp(Math.abs(amount));
  const formatted = new Intl.NumberFormat('es-AR',{
    style:'currency',currency:'ARS',maximumFractionDigits:0
  }).format(animated);

  const changeColor = change > 0 ? 'var(--green)' : 'var(--red)';
  const changeLabel = change !== null && change !== undefined
    ? `${change > 0 ? '↑' : '↓'} ${Math.abs(change)}% vs mes anterior`
    : null;

  return (
    <div className={`balance-card ${type}`}>
      <div className="card-glow" />
      <div className="card-header">
        <div className="card-label">{title}</div>
        <div className="card-icon">{icon}</div>
      </div>
      <div className="card-amount">{formatted}</div>
      <div className="card-footer">
        <div className="card-sub">{sub}</div>
        {badge && <span className={`card-badge ${badge.cls}`}>{badge.text}</span>}
      </div>
      {changeLabel && (
        <div style={{
          marginTop:'0.5rem', fontSize:'0.68rem', fontWeight:700,
          color: changeColor, opacity:0.85
        }}>
          {changeLabel}
        </div>
      )}
    </div>
  );
}

export default BalanceCard;