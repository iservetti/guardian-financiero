import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { CATEGORIES } from './CategoryBadge';

const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt = n => new Intl.NumberFormat('es-AR', {
    style:'currency', currency:'ARS', maximumFractionDigits:0
  }).format(n);
  return (
    <div style={{
      background:'rgba(15,15,30,0.95)', border:'1px solid rgba(255,255,255,0.1)',
      borderRadius:12, padding:'0.75rem 1rem', fontSize:'0.8rem'
    }}>
      {label && <div style={{color:'rgba(255,255,255,0.5)', marginBottom:'0.35rem'}}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{color: p.color, fontWeight:700}}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

function Charts({ allTransactions, selectedMonth }) {
  const [tab, setTab] = useState('barras');

  const monthTx = allTransactions.filter(t => new Date(t.date).getMonth() === selectedMonth);

  // Datos para gráfico de barras por categoría
  const barData = useMemo(() => {
    const cats = {};
    monthTx.filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats)
      .map(([cat, amount]) => ({
        name: CATEGORIES[cat]?.icon + ' ' + (CATEGORIES[cat]?.label || cat),
        amount,
        color: CATEGORIES[cat]?.color || '#636e72',
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [monthTx]);

  // Datos para torta Ingreso vs Gasto
  const totalIncome  = monthTx.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
  const totalExpense = monthTx.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);
  const pieData = [
    { name: 'Ingresos',  value: totalIncome,  color: '#00d68f' },
    { name: 'Gastos',    value: totalExpense,  color: '#ff4d6d' },
  ].filter(d => d.value > 0);

  // Datos para línea mensual del año
  const lineData = useMemo(() => {
    return MONTHS_SHORT.map((month, i) => {
      const txs = allTransactions.filter(t => new Date(t.date).getMonth() === i);
      return {
        month,
        Ingresos: txs.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0),
        Gastos:   txs.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0),
      };
    });
  }, [allTransactions]);

  const tickStyle = { fill: 'rgba(255,255,255,0.35)', fontSize: 11 };

  return (
    <div className="charts-section">
      <div className="section-header">
        <div className="section-title">📊 Análisis visual</div>
        <div className="chart-tabs">
          {[
            { key:'barras', label:'Categorías' },
            { key:'torta',  label:'Distribución' },
            { key:'linea',  label:'Año' },
          ].map(t => (
            <button
              key={t.key}
              className={`chart-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          {tab === 'barras' ? (
            <BarChart data={barData} barSize={28}
              margin={{ top:4, right:8, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="amount" name="Gasto" radius={[8,8,0,0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          ) : tab === 'torta' ? (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius={65} outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={v => (
                  <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.78rem' }}>{v}</span>
                )}
              />
            </PieChart>
          ) : (
            <LineChart data={lineData}
              margin={{ top:4, right:8, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => (
                <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.78rem' }}>{v}</span>
              )} />
              <Line type="monotone" dataKey="Ingresos"
                stroke="#00d68f" strokeWidth={2.5} dot={{ r:3, fill:'#00d68f' }}
                activeDot={{ r:6, fill:'#00d68f' }} />
              <Line type="monotone" dataKey="Gastos"
                stroke="#ff4d6d" strokeWidth={2.5} dot={{ r:3, fill:'#ff4d6d' }}
                activeDot={{ r:6, fill:'#ff4d6d' }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;