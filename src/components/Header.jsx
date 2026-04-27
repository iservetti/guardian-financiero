const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const ACCOUNTS = [
  { key:'todas',       label:'🏦 Todas' },
  { key:'banco',       label:'🏛 Banco' },
  { key:'mercadopago', label:'💙 Mercado Pago' },
  { key:'efectivo',    label:'💵 Efectivo' },
];

function Header({ selectedMonth, onMonthChange, balance, onClearAll,
                  darkMode, onToggleDark, activeAccount, onAccountChange }) {
  const fmt = n => new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0
  }).format(n);

  return (
    <header className="header">

      {/* FILA 1: logo + balance + acciones */}
      <div className="header-row header-row-top">
        <div className="logo">🛡️ Guardián</div>

        <div className="header-balance">
          <span>Balance</span>
          <strong style={{ color: balance >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {fmt(balance)}
          </strong>
        </div>

        <div className="header-actions">
          <button className="btn-theme-toggle" onClick={onToggleDark} title="Cambiar tema">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="btn-clear-all" onClick={onClearAll} title="Limpiar todo">
            🗑
          </button>
        </div>
      </div>

      {/* FILA 2: filtros */}
      <div className="header-row header-row-bottom">
        <select className="header-select" value={activeAccount}
          onChange={e => onAccountChange(e.target.value)}>
          {ACCOUNTS.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>

        <select className="header-select" value={selectedMonth}
          onChange={e => onMonthChange(Number(e.target.value))}>
          {MONTHS.map((m, i) => <option key={i} value={i}>{m} 2026</option>)}
        </select>
      </div>

    </header>
  );
}

export default Header;