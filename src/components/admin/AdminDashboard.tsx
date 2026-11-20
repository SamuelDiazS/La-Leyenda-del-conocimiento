'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Activity,
  KeyRound,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Database,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'pedagogy' | 'audit'>('metrics');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, meRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/auth/me'),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.user?.mustChangePassword) {
          setMustChangePassword(true);
        }
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        setAuditLogs(data.auditLogs);
      }

      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) return;

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordChangeSuccess(true);
        setMustChangePassword(false);
        setNewPassword('');
        fetchData();
      }
    } catch (err) {
      console.error('Error changing admin password:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center text-game-gold">
        Cargando Panel de Administración de Aethoria...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-200 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-game-panel border-b border-game-border-gold/60 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold border border-game-gold shadow-gold-glow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-game-gold tracking-wide">
              La Leyenda del Conocimiento - Administración
            </h1>
            <span className="text-xs text-gray-400">
              Panel de Control Central & Métricas Saber 11 (ICFES)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/character-select"
            className="text-xs px-3 py-1.5 rounded bg-game-panel-light hover:bg-game-border text-gray-300 hover:text-white border border-gray-700 transition-colors"
          >
            Volver al Juego
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Mandatory Password Change Alert for Initial Fredy account */}
      {mustChangePassword && (
        <div className="bg-amber-950/90 border-b border-game-gold px-6 py-3 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <KeyRound className="w-4 h-4 text-game-gold" />
            <span>
              <strong>Seguridad requerida:</strong> La cuenta administrativa &lsquo;Fredy&rsquo; fue inicializada con credenciales temporales. Debes establecer una nueva contraseña permanente.
            </span>
          </div>
          <form onSubmit={handleChangePassword} className="flex gap-2 items-center">
            <input
              type="password"
              placeholder="Nueva contraseña (min 8 car.)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-black/60 border border-gray-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-game-gold"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-game-gold text-black rounded text-xs font-bold hover:bg-amber-400"
            >
              Actualizar
            </button>
          </form>
        </div>
      )}

      {passwordChangeSuccess && (
        <div className="bg-emerald-950/80 border-b border-emerald-500 px-6 py-2 text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Contraseña administrativa actualizada de forma segura con hash Argon2/Bcrypt.
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-game-panel border-r border-game-border p-4 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'metrics'
                ? 'bg-game-gold text-black shadow-gold-glow'
                : 'text-gray-300 hover:bg-game-panel-light'
            }`}
          >
            <Activity className="w-4 h-4" />
            Dashboard General
          </button>
          <button
            onClick={() => setActiveTab('pedagogy')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'pedagogy'
                ? 'bg-game-gold text-black shadow-gold-glow'
                : 'text-gray-300 hover:bg-game-panel-light'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Métricas ICFES Saber 11
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'users'
                ? 'bg-game-gold text-black shadow-gold-glow'
                : 'text-gray-300 hover:bg-game-panel-light'
            }`}
          >
            <Users className="w-4 h-4" />
            Gestión de Jugadores
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'audit'
                ? 'bg-game-gold text-black shadow-gold-glow'
                : 'text-gray-300 hover:bg-game-panel-light'
            }`}
          >
            <Database className="w-4 h-4" />
            Auditoría de Eventos
          </button>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* TAB 1: METRICS */}
          {activeTab === 'metrics' && stats && (
            <div className="flex flex-col gap-6">
              {/* Top Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-game-panel border border-game-border rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">Usuarios Registrados</span>
                  <div className="text-2xl font-bold text-game-gold mt-2">{stats.totalUsers}</div>
                  <span className="text-[10px] text-emerald-400 mt-1">Cuentas activas en Neon DB</span>
                </div>
                <div className="bg-game-panel border border-game-border rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">Héroes Creados</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-2">{stats.totalCharacters}</div>
                  <span className="text-[10px] text-gray-400 mt-1">En el mundo de Aethoria</span>
                </div>
                <div className="bg-game-panel border border-game-border rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">Nivel Promedio</span>
                  <div className="text-2xl font-bold text-purple-400 mt-2">Nv. {stats.averageLevel}</div>
                  <span className="text-[10px] text-gray-400 mt-1">Progresión constante</span>
                </div>
                <div className="bg-game-panel border border-game-border rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">Tasa de Acierto ICFES</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-2">
                    {stats.learningAnalytics.accuracyRate}%
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1">
                    {stats.learningAnalytics.correctAttempts} de {stats.learningAnalytics.totalAttempts} intentos correctos
                  </span>
                </div>
              </div>

              {/* Distributions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Race Distribution */}
                <div className="bg-game-panel border border-game-border rounded-xl p-5">
                  <h3 className="text-xs font-bold text-game-gold uppercase tracking-wider mb-4">
                    Distribución por Razas
                  </h3>
                  <div className="flex flex-col gap-3">
                    {Object.entries(stats.raceDistribution).map(([race, count]: any) => (
                      <div key={race} className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between">
                          <span className="capitalize text-gray-300">{race}</span>
                          <span className="font-bold text-game-gold">{count} héroes</span>
                        </div>
                        <div className="w-full h-2 bg-black/60 rounded overflow-hidden">
                          <div
                            className="h-full bg-game-gold rounded"
                            style={{
                              width: `${Math.round((count / Math.max(1, stats.totalCharacters)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class Distribution */}
                <div className="bg-game-panel border border-game-border rounded-xl p-5">
                  <h3 className="text-xs font-bold text-game-gold uppercase tracking-wider mb-4">
                    Distribución por Clases
                  </h3>
                  <div className="flex flex-col gap-3">
                    {Object.entries(stats.classDistribution).map(([cls, count]: any) => (
                      <div key={cls} className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between">
                          <span className="capitalize text-gray-300">{cls}</span>
                          <span className="font-bold text-cyan-400">{count} héroes</span>
                        </div>
                        <div className="w-full h-2 bg-black/60 rounded overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded"
                            style={{
                              width: `${Math.round((count / Math.max(1, stats.totalCharacters)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PEDAGOGY / ICFES SABER 11 METRICS */}
          {activeTab === 'pedagogy' && stats && (
            <div className="flex flex-col gap-6">
              <div className="bg-game-panel border border-game-border rounded-xl p-5">
                <h3 className="text-sm font-bold text-game-gold tracking-wide mb-4">
                  Desempeño Integral por Área ICFES Saber 11
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lectura Crítica */}
                  <div className="bg-black/40 border border-purple-500/50 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
                        <BookOpen className="w-4 h-4" />
                        Lectura Crítica
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Interpretación de fuentes, deducción de contradicciones y evaluación de argumentos.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-baseline">
                      <span className="text-xs text-gray-400">Aciertos:</span>
                      <span className="text-lg font-bold text-purple-300">
                        {stats.learningAnalytics.areaStats.LECTURA_CRITICA.correct} /{' '}
                        {stats.learningAnalytics.areaStats.LECTURA_CRITICA.total}
                      </span>
                    </div>
                  </div>

                  {/* Matemáticas */}
                  <div className="bg-black/40 border border-amber-500/50 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                        <TrendingUp className="w-4 h-4" />
                        Matemáticas
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Interpretación de proporciones, coordenadas, optimización y compuertas rúnicas.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-baseline">
                      <span className="text-xs text-gray-400">Aciertos:</span>
                      <span className="text-lg font-bold text-amber-300">
                        {stats.learningAnalytics.areaStats.MATEMATICAS.correct} /{' '}
                        {stats.learningAnalytics.areaStats.MATEMATICAS.total}
                      </span>
                    </div>
                  </div>

                  {/* Física */}
                  <div className="bg-black/40 border border-cyan-500/50 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                        <Activity className="w-4 h-4" />
                        Ciencias: Física
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Ventaja mecánica en poleas, cinemática parabólica y conservación de energía.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-baseline">
                      <span className="text-xs text-gray-400">Aciertos:</span>
                      <span className="text-lg font-bold text-cyan-300">
                        {stats.learningAnalytics.areaStats.FISICA.correct} /{' '}
                        {stats.learningAnalytics.areaStats.FISICA.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Attempts History Table */}
              <div className="bg-game-panel border border-game-border rounded-xl p-5">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">
                  Registro Reciente de Intentos Pedagógicos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400">
                        <th className="py-2 px-3">Actividad</th>
                        <th className="py-2 px-3">Resultado</th>
                        <th className="py-2 px-3">Tiempo</th>
                        <th className="py-2 px-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {stats.learningAnalytics.recentAttempts.map((att: any) => (
                        <tr key={att.id} className="hover:bg-game-panel-light/40">
                          <td className="py-2 px-3 font-semibold text-gray-200">
                            Actividad #{att.activityId}
                          </td>
                          <td className="py-2 px-3">
                            {att.isCorrect ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                                Acertado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">
                                Fallido
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-gray-400">{att.timeSpentSeconds}s</td>
                          <td className="py-2 px-3 text-gray-500 text-[11px]">{att.createdAt.substring(0, 19).replace('T', ' ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USERS & CHARACTERS */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-6">
              <div className="bg-game-panel border border-game-border rounded-xl p-5">
                <h3 className="text-sm font-bold text-game-gold tracking-wide mb-4">
                  Cuentas Registradas & Personajes Activos
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400">
                        <th className="py-2 px-3">Usuario</th>
                        <th className="py-2 px-3">Correo</th>
                        <th className="py-2 px-3">Rol</th>
                        <th className="py-2 px-3">Personajes</th>
                        <th className="py-2 px-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-game-panel-light/40">
                          <td className="py-2.5 px-3 font-bold text-game-gold">{u.username}</td>
                          <td className="py-2.5 px-3 text-gray-300">{u.email}</td>
                          <td className="py-2.5 px-3">
                            {u.isAdmin ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-game-gold border border-game-gold">
                                Administrador
                              </span>
                            ) : (
                              <span className="text-gray-400">Jugador</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-cyan-400">
                              {u.characters?.length || 0} héroe(s)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="px-2.5 py-1 bg-game-panel-light hover:bg-game-border border border-gray-700 text-game-gold rounded text-xs transition-colors"
                            >
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected User Modal / Detail Drawer */}
              {selectedUser && (
                <div className="bg-game-panel border-2 border-game-border-gold rounded-xl p-5 animate-scale-up">
                  <div className="flex justify-between items-start border-b border-gray-800 pb-3 mb-4">
                    <div>
                      <h4 className="text-base font-bold text-game-gold">
                        Detalles de {selectedUser.username}
                      </h4>
                      <span className="text-xs text-gray-400">{selectedUser.email}</span>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-800"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Héroes Asociados:
                    </h5>
                    {selectedUser.characters?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedUser.characters.map((char: any) => (
                          <div
                            key={char.id}
                            className="bg-black/50 border border-game-border rounded-lg p-3 flex flex-col gap-1.5 text-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-game-gold">{char.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-800 text-amber-300">
                                Nivel {char.level}
                              </span>
                            </div>
                            <span className="text-gray-400 capitalize">
                              {char.race} - {char.class}
                            </span>
                            <div className="flex justify-between text-gray-400 pt-1 border-t border-gray-800 text-[11px]">
                              <span>Oro: {char.gold}</span>
                              <span>HP: {char.health}/{char.maxHealth}</span>
                              <span>Zona: {char.currentZone}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No ha creado personajes aún.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-game-panel border border-game-border rounded-xl p-5">
              <h3 className="text-sm font-bold text-game-gold tracking-wide mb-4">
                Registro de Auditoría de Acciones y Seguridad
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400">
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Administrador</th>
                      <th className="py-2 px-3">Acción</th>
                      <th className="py-2 px-3">Detalles</th>
                      <th className="py-2 px-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-mono text-[11px]">
                    {auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-game-panel-light/40">
                        <td className="py-2 px-3 text-gray-500">#{log.id}</td>
                        <td className="py-2 px-3 font-bold text-game-gold">{log.adminUsername}</td>
                        <td className="py-2 px-3 font-semibold text-cyan-400">{log.action}</td>
                        <td className="py-2 px-3 text-gray-400 truncate max-w-xs">
                          {JSON.stringify(log.details)}
                        </td>
                        <td className="py-2 px-3 text-gray-500">{log.createdAt.substring(0, 19).replace('T', ' ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
