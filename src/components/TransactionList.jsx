import CategoryBadge from './CategoryBadge';
import { CATEGORIES } from './CategoryBadge';

function groupByDate(transactions) {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups    = {};

  transactions.forEach(tx => {
    const d   = new Date(tx.date + 'T12:00:00');
    const key = d.toDateString();
    const label = key === today
      ? '📅 Hoy'
      : key === yesterday
      ? '🕐 Ayer'
      : d.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });
  return groups;
}

function TransactionList({ transactions, onDelete }) {
  const fmt = n => new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0
  }).format(n);

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const groups = groupByDate(sorted);

  if (sorted.length === 0) {
    return (
      <div className="empty-tx">
        <div className="emoji">💸</div>
        <p>No hay transacciones este mes.<br />¡Registrá tu primer movimiento!</p>
      </div>
    );
  }

  return (
    <>
      {Object.entries(groups).map(([label, txs]) => (
        <div className="tx-date-group" key={label}>
          <div className="tx-date-label">{label}</div>
          <div className="tx-list">
            {txs.map((tx, i) => {
              const cat = CATEGORIES[tx.category] || CATEGORIES['otros'];
              return (
                <div
                  className="tx-item"
                  key={tx.id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className="tx-icon"
                    style={{ background: cat.color + '18' }}
                  >
                    {cat.icon}
                  </div>
                  <div className="tx-info">
                    <div className="tx-desc">{tx.desc}</div>
                    <div className="tx-meta">
                      <CategoryBadge cat={tx.category} />
                    </div>
                  </div>
                  <div className="tx-right">
                    <span className={`tx-amount ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                    <button
                      className="btn-delete-tx"
                      onClick={() => onDelete(tx.id)}
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

export default TransactionList;