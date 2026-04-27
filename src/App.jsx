import { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import SavingsGoals from './components/SavingsGoals';
import BudgetSection from './components/BudgetSection';
import AIAdvisor from './components/AIAdvisor';
import { CATEGORIES } from './components/CategoryBadge';

const DEMO = [
  { id:1,  type:'income',  desc:'Sueldo',           amount:350000, category:'salario',          date:'2026-04-05', account:'banco' },
  { id:2,  type:'income',  desc:'Proyecto React',   amount:80000,  category:'freelance',         date:'2026-04-12', account:'mercadopago' },
  { id:3,  type:'expense', desc:'Supermercado',     amount:42000,  category:'comida',            date:'2026-04-08', account:'efectivo' },
  { id:4,  type:'expense', desc:'Uber',             amount:8500,   category:'transporte',        date:'2026-04-10', account:'mercadopago' },
  { id:5,  type:'expense', desc:'Netflix+Spotify',  amount:7200,   category:'entretenimiento',   date:'2026-04-01', account:'banco' },
  { id:6,  type:'expense', desc:'Luz y gas',        amount:18000,  category:'servicios',         date:'2026-04-03', account:'banco' },
  { id:7,  type:'expense', desc:'Ropa deportiva',   amount:25000,  category:'ropa',              date:'2026-04-15', account:'efectivo' },
  { id:8,  type:'income',  desc:'Dividendos',       amount:15000,  category:'inversiones',       date:'2026-04-20', account:'banco' },
  { id:9,  type:'income',  desc:'Sueldo',           amount:320000, category:'salario',           date:'2026-03-05', account:'banco' },
  { id:10, type:'expense', desc:'Supermercado',     amount:38000,  category:'comida',            date:'2026-03-10', account:'efectivo' },
  { id:11, type:'expense', desc:'Transporte',       amount:12000,  category:'transporte',        date:'2026-03-15', account:'mercadopago' },
  { id:12, type:'expense', desc:'Servicios',        amount:16000,  category:'servicios',         date:'2026-03-03', account:'banco' },
];

export function fmt(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0
  }).format(Math.abs(n));
}

function App() {
  const [transactions, setTransactions] = useState(() => {
    const s = localStorage.getItem('guardianV1');
    return s ? JSON.parse(s) : DEMO;
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [activeAccount, setActiveAccount] = useState('todas');

  useEffect(() => {
    localStorage.setItem('guardianV1', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const addTransaction    = tx => setTransactions(p => [tx, ...p]);
  const deleteTransaction = id => setTransactions(p => p.filter(t => t.id !== id));
  const clearAll = () => {
    if (confirm('¿Borrar todas las transacciones?')) setTransactions([]);
  };

  const filterAcc  = tx => activeAccount === 'todas' ? true : tx.account === activeAccount;
  const monthTx    = transactions.filter(t => new Date(t.date).getMonth() === selectedMonth && filterAcc(t));
  const prevMonthTx= transactions.filter(t => new Date(t.date).getMonth() === (selectedMonth === 0 ? 11 : selectedMonth - 1) && filterAcc(t));

  const totalIncome  = monthTx.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const totalExpense = monthTx.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;
  const savingsPct   = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const prevIncome   = prevMonthTx.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const prevExpense  = prevMonthTx.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const prevBalance  = prevIncome - prevExpense;

  const pctChange = (cur, prev) => prev === 0 ? null : Math.round(((cur - prev) / prev) * 100);

  const catTotals = {};
  monthTx.filter(t => t.type === 'expense').forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const topCats = Object.entries(catTotals).sort((a,b) => b[1] - a[1]).slice(0, 3);

  const barColor      = savingsPct >= 30 ? 'var(--green)' : savingsPct >= 10 ? 'var(--gold)' : 'var(--red)';
  const savingsStatus = savingsPct >= 30 ? '🟢 Excelente' : savingsPct >= 10 ? '🟡 Moderado' : savingsPct > 0 ? '🔴 Ahorrá más' : '⚠️ Sin ahorro';

  return (
    <>
      <Header
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        balance={balance}
        onClearAll={clearAll}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        activeAccount={activeAccount}
        onAccountChange={setActiveAccount}
      />

      <div className="app-layout">

        {/* KPIs */}
        <div className="balance-grid">
          <BalanceCard title="Balance"  amount={balance}            icon="💼" type="total"
            sub={`${monthTx.length} movimientos`}
            badge={balance >= 0 ? {text:'Positivo', cls:'up'} : {text:'Negativo', cls:'down'}}
            change={pctChange(balance, prevBalance)} />
          <BalanceCard title="Ingresos" amount={totalIncome}        icon="📈" type="income"
            sub={`${monthTx.filter(t=>t.type==='income').length} entradas`}
            badge={{text:`+${fmt(totalIncome)}`, cls:'up'}}
            change={pctChange(totalIncome, prevIncome)} />
          <BalanceCard title="Gastos"   amount={totalExpense}       icon="📉" type="expense"
            sub={`${monthTx.filter(t=>t.type==='expense').length} salidas`}
            badge={{text:`-${fmt(totalExpense)}`, cls:'down'}}
            change={pctChange(totalExpense, prevExpense)} />
          <BalanceCard title="Ahorrado" amount={Math.max(0,balance)} icon="🎯" type="savings"
            sub={`${savingsPct}% del ingreso`}
            badge={{text: savingsPct >= 20 ? '💪 Meta cumplida' : 'Meta: 20%', cls: savingsPct >= 20 ? 'up' : 'neutral'}}
            change={null} />
        </div>

        {/* BARRA SALUD */}
        <div className="savings-section">
          <span className="savings-label">📊 Salud financiera</span>
          <div className="savings-bar-wrap">
            <div className="savings-bar-track">
              <div className="savings-bar-fill"
                style={{ width:`${Math.max(0,Math.min(100,savingsPct))}%`, background: barColor }} />
            </div>
            <div className="savings-bar-labels">
              <span>0%</span><span>Meta 20%</span><span>50%+</span>
            </div>
          </div>
          <span className="savings-status" style={{ color: barColor }}>{savingsStatus}</span>
          {topCats.length > 0 && (
            <div className="top-cats">
              {topCats.map(([cat, amt]) => (
                <div key={cat} className="top-cat-item">
                  <div className="top-cat-dot" style={{ background: CATEGORIES[cat]?.color || '#b2bec3' }} />
                  <div className="top-cat-info">
                    <div className="top-cat-name">{CATEGORIES[cat]?.icon} {CATEGORIES[cat]?.label}</div>
                    <div className="top-cat-amount">{fmt(amt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CHARTS */}
        <Charts allTransactions={transactions} selectedMonth={selectedMonth} />

        {/* FORM */}
        <TransactionForm onAdd={addTransaction} />

        {/* PRESUPUESTOS */}
        <BudgetSection transactions={monthTx} />

        {/* METAS */}
        <SavingsGoals transactions={transactions} selectedMonth={selectedMonth} />

        {/* IA */}
        <AIAdvisor
          income={totalIncome}
          expense={totalExpense}
          balance={balance}
          savingsPct={savingsPct}
          topCats={topCats}
          catTotals={catTotals}
        />

        {/* TRANSACCIONES */}
        <div className="transactions-section">
          <div className="section-header">
            <div className="section-title">
              🧾 Transacciones
              <span style={{ color:'var(--muted)', fontWeight:400, fontSize:'0.76rem' }}>
                {monthTx.length} este mes
              </span>
            </div>
          </div>
          <TransactionList transactions={monthTx} onDelete={deleteTransaction} />
        </div>

      </div>

      <footer className="app-footer">
        <span>🛡️ Guardián Financiero</span>
        <span className="footer-sep">·</span>
        <span>Creado por <strong>Ignacio S.</strong> — City Bell</span>
        <span className="footer-sep">·</span>
        <span>2026</span>
      </footer>
    </>
  );
}

export default App;