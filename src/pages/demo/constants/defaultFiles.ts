export const LOCAL_STORAGE_KEY = 'runbox_demo_workspace';

export const defaultFiles: Record<string, string> = {
  '/package.json': `{
  "name": "acme-dashboard",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "dayjs": "^1.11.10",
    "react-icons": "^5.4.0"
  },
  "scripts": {
    "start": "bun run /index.js"
  }
}`,

  '/index.js': `const http   = require('http');
const React  = require('react');
const Server = require('react-dom/server');
const App    = require('./app.js');

const server = http.createServer((req, res) => {
  const path = (req.url || '/').split('?')[0];
  const html = Server.renderToString(React.createElement(App, { path }));
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(\`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Sede Acme</title>
  <style>*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}a{text-decoration:none}</style>
</head>
<body>\${html}</body>
</html>\`);
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});`,

  '/app.js': `const React = require('react');
const Sidebar   = require('./components/Sidebar.js');
const Dashboard = require('./pages/Dashboard.js');
const Users     = require('./pages/Users.js');
const Settings  = require('./pages/Settings.js');
const e = React.createElement;

const PAGES = {
  '/':         Dashboard,
  '/users':    Users,
  '/settings': Settings,
};

function NotFound() {
  const { muted, accent } = require('./lib/tokens.js');
  return e('div', { style: { textAlign: 'center', padding: '80px 24px', color: muted } },
    e('div', { style: { fontSize: 48, marginBottom: 12 } }, '404'),
    e('p', null, 'Página no encontrada'),
    e('a', { href: '/', style: { color: accent } }, '← Volver al inicio')
  );
}

function App({ path }) {
  const { bg, text } = require('./lib/tokens.js');
  const Page = PAGES[path] || NotFound;
  return e('div', { style: { display: 'flex', minHeight: '100vh', background: bg, color: text } },
    e(Sidebar, { path }),
    e('main', { style: { flex: 1, padding: '32px 36px', overflowY: 'auto' } },
      e(Page)
    )
  );
}

module.exports = App;`,

  '/lib/tokens.js': `module.exports = {
  bg:      '#0f0f11',
  surface: '#18181b',
  border:  '#27272a',
  accent:  '#6d6afe',
  green:   '#22c55e',
  yellow:  '#eab308',
  red:     '#ef4444',
  text:    '#fafafa',
  muted:   '#a1a1aa',
};`,

  '/lib/data.js': `const dayjs = require('dayjs');

const users = [
  { id: 1, name: 'Ana García',   email: 'ana@acme.io',   role: 'Admin',  status: 'active',   joined: '2024-01-12' },
  { id: 2, name: 'Luis Torres',  email: 'luis@acme.io',  role: 'Editor', status: 'active',   joined: '2024-02-08' },
  { id: 3, name: 'Sara Kim',     email: 'sara@acme.io',  role: 'Viewer', status: 'inactive', joined: '2024-03-21' },
  { id: 4, name: 'Tomás Ruiz',   email: 'tomas@acme.io', role: 'Editor', status: 'active',   joined: '2024-04-05' },
  { id: 5, name: 'Elena Romero', email: 'elena@acme.io', role: 'Viewer', status: 'active',   joined: '2024-05-17' },
];

const stats = [
  { label: 'Usuarios Totales',     value: '2,841',  delta: '+12%',  up: true  },
  { label: 'Ingresos Mensuales', value: '$48,290', delta: '+8.2%', up: true  },
  { label: 'Proyectos Activos', value: '134',     delta: '-3%',   up: false },
  { label: 'Tiempo Activo',          value: '99.97%', delta: '+0.1%', up: true  },
];

const activity = [
  { text: 'Ana García desplegó v2.4.1',             time: 'hace 2 min',  type: 'success' },
  { text: 'Luis Torres actualizó /api/users',       time: 'hace 14 min', type: 'info'    },
  { text: 'Fallo en compilación de staging',        time: 'hace 1 h',    type: 'error'   },
  { text: 'Sara Kim se unió al espacio de trabajo', time: 'hace 3 h',    type: 'warning' },
  { text: 'Respaldo de base de datos completado',   time: 'hace 6 h',    type: 'success' },
];

module.exports = { users, stats, activity, dayjs };`,

  '/components/Sidebar.js': `const React = require('react');
const { surface, border, accent, muted, text } = require('../lib/tokens.js');

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 16 }) : React.createElement('span', null, fb);

const e = React.createElement;

const NAV = [
  { href: '/',         label: 'Panel', icon: 'FiGrid',    fb: '⊞' },
  { href: '/users',    label: 'Usuarios',     icon: 'FiUsers',   fb: '👥' },
  { href: '/settings', label: 'Ajustes',  icon: 'FiSettings',fb: '⚙' },
];

function Sidebar({ path }) {
  return e('aside', {
    style: { width: 220, minHeight: '100vh', background: surface, borderRight: '1px solid ' + border,
             padding: '24px 12px', display: 'flex', flexDirection: 'column', flexShrink: 0 }
  },
    // Brand
    e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32 } },
      Icon('FiZap', '⚡'),
      e('span', { style: { fontWeight: 700, fontSize: 16 } }, 'Acme HQ')
    ),
    // Nav links
    e('nav', { style: { flex: 1 } },
      ...NAV.map(({ href, label, icon, fb }) =>
        e('a', {
          key: href, href,
          style: {
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, marginBottom: 2,
            textDecoration: 'none', fontSize: 14,
            color: path === href ? text : muted,
            background: path === href ? accent + '22' : 'transparent',
          }
        }, Icon(icon, fb), label)
      )
    ),
    // Footer
    e('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px', borderTop: '1px solid ' + border } },
      e('div', { style: { width: 32, height: 32, borderRadius: 99, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 } }, 'AH'),
      e('div', null,
        e('div', { style: { fontSize: 13, fontWeight: 600 } }, 'Admin'),
        e('div', { style: { fontSize: 11, color: muted } }, 'admin@acme.io')
      )
    )
  );
}

module.exports = Sidebar;`,

  '/components/StatCard.js': `const React = require('react');
const { surface, border, accent, green, red, muted } = require('../lib/tokens.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 14 }) : React.createElement('span', null, fb);

function StatCard({ label, value, delta, up }) {
  return e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: 20 } },
    e('div', { style: { fontSize: 12, color: muted, fontWeight: 500, marginBottom: 12 } }, label),
    e('div', { style: { fontSize: 28, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 } }, value),
    e('div', { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: up ? green : red } },
      Icon(up ? 'FiTrendingUp' : 'FiTrendingDown', up ? '▲' : '▼'),
      delta + ' vs last month'
    )
  );
}

module.exports = StatCard;`,

  '/components/Badge.js': `const React = require('react');
const { green, red } = require('../lib/tokens.js');
const e = React.createElement;

function Badge({ status }) {
  const color = status === 'active' ? green : red;
  return e('span', {
    style: { background: color + '22', color, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }
  }, status);
}

module.exports = Badge;`,

  '/pages/Dashboard.js': `const React    = require('react');
const StatCard = require('../components/StatCard.js');
const { accent, border, muted, surface, green, yellow, red } = require('../lib/tokens.js');
const { stats, activity, dayjs } = require('../lib/data.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 14 }) : React.createElement('span', null, fb);

const ACTIVITY_COLOR = { success: green, info: accent, error: red, warning: yellow };

function Dashboard() {
  return e('div', null,
    // Header
    e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 } },
      e('div', null,
        e('h1', { style: { fontSize: 22, fontWeight: 700, margin: 0 } }, 'Dashboard'),
        e('p',  { style: { fontSize: 12, color: muted, marginTop: 4 } }, 'Last updated: ' + dayjs().format('MMM D, YYYY · HH:mm'))
      ),
      e('a', { href: '/users', style: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: accent, color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 } },
        Icon('FiUsers', '👥'), 'View Users'
      )
    ),
    // Stat cards
    e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 } },
      ...stats.map(s => e(StatCard, { key: s.label, ...s }))
    ),
    // Two-column section
    e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } },
      // Activity feed
      e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: 20 } },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 16 } },
          e('span', { style: { fontWeight: 600, fontSize: 14 } }, 'Actividad Reciente'),
          e('a', { href: '/users', style: { fontSize: 12, color: accent, textDecoration: 'none' } }, 'Ver todo')
        ),
        e('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } },
          ...activity.map((item, i) =>
            e('li', { key: i, style: { display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid ' + border : 'none' } },
              e('div', { style: { width: 8, height: 8, borderRadius: 99, background: ACTIVITY_COLOR[item.type], marginTop: 4, flexShrink: 0 } }),
              e('div', null,
                e('div', { style: { fontSize: 13 } }, item.text),
                e('div', { style: { fontSize: 11, color: muted, marginTop: 2 } }, item.time)
              )
            )
          )
        )
      ),
      // Progress bars
      e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: 20 } },
        e('div', { style: { fontWeight: 600, fontSize: 14, marginBottom: 20 } }, 'Estado del Sistema'),
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
          ...[
            { label: 'Tiempo activo API',      value: 99, color: green  },
            { label: 'Almacenamiento usado',    value: 62, color: yellow },
            { label: 'Éxito CI/CD',   value: 88, color: accent },
            { label: 'Tasa de error',      value: 3,  color: red    },
          ].map(({ label, value, color }) =>
            e('div', { key: label },
              e('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: muted, marginBottom: 6 } },
                e('span', null, label), e('span', { style: { color: '#fafafa', fontWeight: 600 } }, value + '%')
              ),
              e('div', { style: { height: 6, background: border, borderRadius: 99 } },
                e('div', { style: { height: '100%', width: value + '%', background: color, borderRadius: 99 } })
              )
            )
          )
        )
      )
    )
  );
}

module.exports = Dashboard;`,

  '/pages/Users.js': `const React = require('react');
const Badge = require('../components/Badge.js');
const { accent, border, muted, surface } = require('../lib/tokens.js');
const { users, dayjs } = require('../lib/data.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 14 }) : React.createElement('span', null, fb);

function Users() {
  return e('div', null,
    e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 } },
      e('h1', { style: { fontSize: 22, fontWeight: 700, margin: 0 } }, 'Usuarios'),
      e('button', { style: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 } },
        Icon('FiUserPlus', '+'), 'Invitar Usuario'
      )
    ),
    e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, overflow: 'hidden' } },
      e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
        e('thead', null,
          e('tr', null,
            ...['Nombre', 'Correo', 'Rol', 'Estado', 'Ingresó'].map(h =>
              e('th', { key: h, style: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid ' + border } }, h)
            )
          )
        ),
        e('tbody', null,
          ...users.map((u, i) =>
            e('tr', { key: u.id },
              e('td', { style: { padding: '14px 16px', borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } },
                e('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                  e('div', { style: { width: 30, height: 30, borderRadius: 99, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 } },
                    u.name.split(' ').map(n => n[0]).join('')
                  ),
                  e('span', { style: { fontSize: 13, fontWeight: 500 } }, u.name)
                )
              ),
              e('td', { style: { padding: '14px 16px', fontSize: 13, color: muted, borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } }, u.email),
              e('td', { style: { padding: '14px 16px', fontSize: 13, borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } }, u.role),
              e('td', { style: { padding: '14px 16px', borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } }, e(Badge, { status: u.status })),
              e('td', { style: { padding: '14px 16px', fontSize: 12, color: muted, borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } },
                dayjs(u.joined).format('MMM D, YYYY')
              )
            )
          )
        )
      )
    )
  );
}

module.exports = Users;`,

  '/pages/Settings.js': `const React = require('react');
const { accent, border, muted, surface, text } = require('../lib/tokens.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 16 }) : React.createElement('span', null, fb);

const SECTIONS = [
  { icon: 'FiUser',    fb: '👤', title: 'Perfil',      desc: 'Actualiza tu nombre, avatar e información de contacto.' },
  { icon: 'FiLock',    fb: '🔒', title: 'Seguridad',     desc: 'Autenticación de dos pasos, contraseña y sesiones activas.' },
  { icon: 'FiBell',    fb: '🔔', title: 'Notificaciones', desc: 'Preferencias de correo, push y dentro de la app.' },
  { icon: 'FiGlobe',   fb: '🌐', title: 'Integraciones', desc: 'Conecta GitHub, Slack y servicios de terceros.' },
  { icon: 'FiCreditCard', fb: '💳', title: 'Facturación',   desc: 'Gestiona tu suscripción, facturas y métodos de pago.' },
];

function Settings() {
  return e('div', null,
    e('h1', { style: { fontSize: 22, fontWeight: 700, margin: '0 0 28px' } }, 'Ajustes'),
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      ...SECTIONS.map(({ icon, fb, title, desc }) =>
        e('div', { key: title, style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            e('div', { style: { width: 36, height: 36, borderRadius: 8, background: accent + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent } },
              Icon(icon, fb)
            ),
            e('div', null,
              e('div', { style: { fontWeight: 600, fontSize: 14 } }, title),
              e('div', { style: { fontSize: 12, color: muted, marginTop: 2 } }, desc)
            )
          ),
          e('div', { style: { color: muted } }, Icon('FiChevronRight', '›'))
        )
      )
    )
  );
}

module.exports = Settings;`,
};
