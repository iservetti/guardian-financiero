import { useState } from 'react';
import { CATEGORIES } from './CategoryBadge';

function AIAdvisor({ income, expense, balance, savingsPct, topCats, catTotals }) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [tips, setTips]       = useState([]);

  const fmt = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);

  const generateTips = () => {
    setLoading(true);
    setOpen(true);
    setTimeout(() => {
      const generated = [];

      if (savingsPct < 20) {
        generated.push({
          icon:'💡',
          title:'Aumentá tu tasa de ahorro',
          text:`Estás ahorrando el ${savingsPct}% de tus ingresos. La regla 50/30/20 recomienda al menos 20%. Con tus ingresos actuales (${fmt(income)}), deberías ahorrar ${fmt(income * 0.2)} por mes.`,
          color:'#b8a4f8',
        });
      }

      if (topCats.length > 0) {
        const [topCat, topAmt] = topCats[0];
        const catInfo = CATEGORIES[topCat] || {};
        const topPct = income > 0 ? Math.round((topAmt/income)*100) : 0;
        generated.push({
          icon:'📊',
          title:`Tu mayor gasto: ${catInfo.label || topCat}`,
          text:`Gastaste ${fmt(topAmt)} en ${catInfo.label || topCat}, que representa el ${topPct}% de tus ingresos. ${topPct > 25 ? `Reducir un 20% en esta categoría te ahorraría ${fmt(topAmt * 0.2)} este mes.` : 'Está dentro de un rango saludable. ¡Bien!'}`,
          color:'#f9a8d4',
        });
      }

      if (balance > 0) {
        generated.push({
          icon:'📈',
          title:'Invertí tu excedente',
          text:`Tenés un saldo positivo de ${fmt(balance)}. Considerá destinar el 50% (${fmt(balance*0.5)}) a una billetera virtual o FCI para que genere rendimientos mientras lo tenés disponible.`,
          color:'#34c78a',
        });
      }

      if (catTotals['entretenimiento'] && income > 0 && (catTotals['entretenimiento']/income) > 0.1) {
        generated.push({
          icon:'🎮',
          title:'Revisá entretenimiento',
          text:`Gastaste ${fmt(catTotals['entretenimiento'])} en entretenimiento (${Math.round(catTotals['entretenimiento']/income*100)}% del ingreso). Revisá suscripciones activas — es común tener servicios que ya no usás.`,
          color:'#fbbf24',
        });
      }

      if (generated.length === 0) {
        generated.push({
          icon:'🏆',
          title:'¡Finanzas en excelente estado!',
          text:`Tus finanzas están muy bien balanceadas. Ahorrás el ${savingsPct}% y tus gastos están distribuidos correctamente. Seguí así y considerá aumentar tu fondo de emergencia.`,
          color:'#34c78a',
        });
      }

      setTips(generated);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="ai-section">
      <div className="section-header">
        <div className="section-title">🧠 Consejero IA</div>
        <button className="btn-ai" onClick={generateTips} disabled={loading}>
          {loading ? '⏳ Analizando...' : '✨ Analizar mis finanzas'}
        </button>
      </div>

      {loading && (
        <div className="ai-loading">
          <div className="ai-dots"><span/><span/><span/></div>
          <p>Analizando tus patrones de gasto...</p>
        </div>
      )}

      {!loading && open && tips.length > 0 && (
        <div className="ai-tips">
          {tips.map((tip, i) => (
            <div key={i} className="ai-tip" style={{borderLeftColor: tip.color, animationDelay:`${i*0.12}s`}}>
              <div className="ai-tip-header">
                <span className="ai-tip-icon">{tip.icon}</span>
                <span className="ai-tip-title">{tip.title}</span>
              </div>
              <p className="ai-tip-text">{tip.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIAdvisor;