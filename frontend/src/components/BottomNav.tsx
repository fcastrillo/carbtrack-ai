import { NavLink } from 'react-router-dom'
import { Home, BookOpen, FlaskConical, Upload, User } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Hoy' },
  { to: '/bitacora', icon: BookOpen, label: 'Bitácora' },
  { to: '/laboratorio', icon: FlaskConical, label: 'Laboratorio' },
  { to: '/carga-datos', icon: Upload, label: 'Carga de Datos' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#18181b] border-t border-white/10 flex justify-around items-center py-2 safe-area-pb">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 rounded min-w-[4rem] ${
              isActive ? 'text-white' : 'text-white/60'
            }`
          }
        >
          <Icon size={24} aria-hidden />
          <span className="text-xs">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
