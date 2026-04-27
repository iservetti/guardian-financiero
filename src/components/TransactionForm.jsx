import { useState } from 'react';
import { CATEGORIES } from './CategoryBadge';

const INCOME_CATS  = ['salario','freelance','inversiones','otros_ingresos'];
const EXPENSE_CATS = ['comida','transporte','servicios','entretenimiento','salud','ropa','educacion','otros'];

function TransactionForm({ onAdd }) {
  const [type, setType]     = useState('expense');
  const [desc, setDesc]     = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCat]  = useState('comida');
  const [date, setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [shake, setShake]   = useState(false);

  const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const handleTypeChange = (t) => {
    setType(t);
    setCat(t === 'income' ? 'salario' : 'comida');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim() || !amount || isNaN(amount) || Number(amount) <= 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onAdd({
      id: Date.now(),
      type,
      desc: desc.trim(),
      amount: Number(amount),
      category,
      date,
    });
    setDesc('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="form-section">
      <div className="form-title">➕ Nueva transacción</div>

      <div className="type-toggle">
        <button
          className={`type-btn income ${type === 'income' ? 'active' : ''}`}
          onClick={() => handleTypeChange('income')}
          type="button"
        >
          📈 Ingreso
        </button>
        <button
          className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
          onClick={() => handleTypeChange('expense')}
          type="button"
        >
          📉 Gasto
        </button>
      </div>

      <form onSubmit={handleSubmit} style={shake ? {animation:'shake 0.4s ease'} : {}}>
        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            placeholder={type === 'income' ? 'Ej: Sueldo de abril...' : 'Ej: Supermercado...'}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            maxLength={50}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Monto $</label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <select value={category} onChange={e => setCat(e.target.value)}>
            {cats.map(c => (
              <option key={c} value={c}>
                {CATEGORIES[c].icon} {CATEGORIES[c].label}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-add" type="submit">
          {type === 'income' ? '💚 Registrar ingreso' : '🔴 Registrar gasto'}
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
}

export default TransactionForm;