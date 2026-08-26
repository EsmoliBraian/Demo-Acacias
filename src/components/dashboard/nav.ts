import {
  LayoutDashboard,
  CalendarRange,
  Home,
  Users,
  CreditCard,
  Tag,
  BarChart3,
  MessageSquare,
  Zap,
  History,
  Settings,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/demo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/demo/reservas", label: "Reservas", icon: ClipboardList },
  { href: "/demo/calendario", label: "Calendario", icon: CalendarRange },
  { href: "/demo/cabanas", label: "Cabañas", icon: Home },
  { href: "/demo/huespedes", label: "Huéspedes", icon: Users },
  { href: "/demo/pagos", label: "Pagos", icon: CreditCard },
  { href: "/demo/ofertas", label: "Ofertas", icon: Tag },
  { href: "/demo/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/demo/mensajes", label: "Mensajes", icon: MessageSquare },
  { href: "/demo/automatizaciones", label: "Automatizaciones", icon: Zap },
  { href: "/demo/historial", label: "Historial", icon: History },
  { href: "/demo/configuracion", label: "Configuración", icon: Settings },
];
