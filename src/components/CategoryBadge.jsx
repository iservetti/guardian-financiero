export const CATEGORIES = {
  salario:         { label: 'Salario',        icon: '💼', color: '#4f98ff' },
  freelance:       { label: 'Freelance',       icon: '💻', color: '#9b6dff' },
  inversiones:     { label: 'Inversiones',     icon: '📈', color: '#00d68f' },
  otros_ingresos:  { label: 'Otros ingresos',  icon: '💰', color: '#ffd060' },
  comida:          { label: 'Comida',          icon: '🛒', color: '#ff6b35' },
  transporte:      { label: 'Transporte',      icon: '🚗', color: '#4f98ff' },
  servicios:       { label: 'Servicios',       icon: '💡', color: '#ffd060' },
  entretenimiento: { label: 'Entretenimiento', icon: '🎮', color: '#9b6dff' },
  salud:           { label: 'Salud',           icon: '🏥', color: '#00d68f' },
  ropa:            { label: 'Ropa',            icon: '👕', color: '#ff4d6d' },
  educacion:       { label: 'Educación',       icon: '📚', color: '#4f98ff' },
  otros:           { label: 'Otros',           icon: '📦', color: '#636e72' },
};

function CategoryBadge({ cat }) {
  const c = CATEGORIES[cat] || CATEGORIES['otros'];
  return (
    <span
      className="cat-badge"
      style={{
        background: c.color + '18',
        color: c.color,
        border: `1px solid ${c.color}30`,
      }}
    >
      {c.icon} {c.label}
    </span>
  );
}

export default CategoryBadge;