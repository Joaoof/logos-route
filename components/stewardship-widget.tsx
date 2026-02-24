"use client"

import { useState } from "react"
import { 
  Target, 
  BookOpen, 
  Moon, 
  Settings2, 
  Route, 
  TrendingUp, 
  Plus, 
  CheckCircle2 
} from "lucide-react"

// Cores temáticas do LogosRoute
const THEME = {
  cyan: "#1ce4d2",
  cyanDark: "#129e91",
  violet: "#8b5cf6",
  bg: "#f8fafc", // slate-50
}

export function MetasDashboard() {
  const [periodo, setPeriodo] = useState("Esta Semana")

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />

      <div className="min-h-screen w-full flex flex-col lg:flex-row pb-20 lg:pb-0 font-outfit" style={{ backgroundColor: THEME.bg }}>
        
        {/* ========================================= */}
        {/* SIDEBAR (DESKTOP) - Escondida no Mobile   */}
        {/* ========================================= */}
        <aside className="hidden lg:flex w-[90px] bg-white border-r border-slate-200 flex-col items-center py-8 gap-8 sticky top-0 h-screen shadow-sm z-10">
          <div className="size-12 rounded-2xl bg-[#1ce4d2] flex items-center justify-center shadow-lg mb-4">
            <Target className="text-white size-6" strokeWidth={2.5} />
          </div>
          <Route className="text-slate-300 size-6 cursor-pointer hover:text-[#1ce4d2] transition-colors" strokeWidth={2.5} />
          <TrendingUp className="text-slate-300 size-6 cursor-pointer hover:text-[#1ce4d2] transition-colors" strokeWidth={2.5} />
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Target className="text-[#1ce4d2] size-7 cursor-pointer" strokeWidth={2.5} />
          </div>
        </aside>

        {/* ========================================= */}
        {/* BOTTOM NAVIGATION (MOBILE)                */}
        {/* ========================================= */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <Route size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Corridas</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <TrendingUp size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Lucro</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#1ce4d2]">
            <Target size={22} strokeWidth={3} />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Metas</span>
          </div>
        </nav>

        {/* ========================================= */}
        {/* ÁREA PRINCIPAL - 100% largura no PC       */}
        {/* ========================================= */}
        <main className="flex-1 w-full max-w-full p-4 lg:p-8 space-y-6">
          
          {/* HEADER / FILTRO */}
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <div className="flex rounded-xl overflow-hidden border border-slate-200 shadow-sm h-12 bg-white">
              <div className="bg-slate-50 text-slate-500 px-4 flex items-center text-xs font-extrabold uppercase tracking-widest border-r border-slate-200">
                Período
              </div>
              <select 
                value={periodo} 
                onChange={(e) => setPeriodo(e.target.value)}
                className="bg-white px-4 flex items-center gap-2 text-slate-800 text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-0"
              >
                <option value="Esta Semana">Esta Semana</option>
                <option value="Semana Passada">Semana Passada</option>
                <option value="Este Mês">Este Mês</option>
              </select>
            </div>
            
            {/* Botão de Configurar Metas (Destacado no Mobile e PC) */}
            <button className="bg-[#1ce4d2] hover:bg-[#129e91] text-white p-3 lg:px-6 lg:py-0 lg:h-12 rounded-xl shadow-md lg:shadow-sm transition-all active:scale-95 flex items-center gap-2 font-extrabold uppercase text-xs tracking-widest">
              <Settings2 size={20} strokeWidth={2.5} />
              <span className="hidden lg:inline">Ajustar Metas</span>
            </button>
          </div>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-12 gap-5 lg:gap-8">
            
            {/* GRÁFICO: ESTUDO VS DESCANSO */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-800 text-sm font-extrabold uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="size-4 text-[#1ce4d2]" strokeWidth={3} />
                  Evolução da Rotina
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#1ce4d2]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacitação</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#8b5cf6]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descanso</span>
                  </div>
                </div>
              </div>
              <div className="h-48 lg:h-64 w-full relative">
                {/* SVG Mockup Substituindo o Gráfico Genérico */}
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path d="M0,180 Q100,100 200,140 T400,60 L400,200 L0,200 Z" fill="#1ce4d211" />
                  <path d="M0,180 Q100,100 200,140 T400,60" fill="none" stroke={THEME.cyan} strokeWidth="4" strokeLinecap="round" />
                  <path d="M0,80 Q100,120 200,50 T400,90" fill="none" stroke={THEME.violet} strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
                </svg>
              </div>
            </div>

            {/* CARDS DE RESUMO: AS METAS */}
            <div className="col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              
              {/* Meta: Capacitação */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1ce4d2]" />
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Meta: Capacitação</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-[#1ce4d2]/10 rounded-xl flex items-center justify-center">
                      <BookOpen className="text-[#1ce4d2] size-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-slate-800 leading-none">12h <span className="text-sm text-slate-400">/ 15h</span></span>
                      <span className="text-[10px] font-bold text-[#1ce4d2] uppercase tracking-widest mt-1">80% Concluído</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta: Descanso */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8b5cf6]" />
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Meta: Descanso Físico</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center">
                      <Moon className="text-[#8b5cf6] size-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-slate-800 leading-none">42h <span className="text-sm text-slate-400">/ 56h</span></span>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Abaixo do Ideal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LISTA DE REGISTROS (Últimas Atividades) */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-slate-800 text-xs font-extrabold uppercase tracking-widest">Últimos Registros</span>
                  <Plus size={18} className="text-[#1ce4d2] cursor-pointer hover:scale-110 transition-transform" strokeWidth={3} />
               </div>
               <div className="divide-y divide-slate-50">
                 {[
                   { titulo: "Leitura Técnicas de Pilotagem", tempo: "+ 1h 30m", tipo: "estudo", data: "Hoje, 09:00" },
                   { titulo: "Sono Noturno", tempo: "+ 6h 45m", tipo: "descanso", data: "Hoje, 06:30" },
                   { titulo: "Curso de Gestão Financeira", tempo: "+ 45m", tipo: "estudo", data: "Ontem, 20:00" },
                   { titulo: "Cochilo Pós-Almoço", tempo: "+ 30m", tipo: "descanso", data: "Ontem, 14:00" }
                 ].map((item, i) => (
                   <div key={i} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className={`size-2 rounded-full ${item.tipo === 'estudo' ? 'bg-[#1ce4d2]' : 'bg-[#8b5cf6]'}`} />
                       <div>
                         <p className="text-sm font-bold text-slate-700 tracking-tight">{item.titulo}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.data}</p>
                       </div>
                     </div>
                     <span className={`text-sm font-extrabold ${item.tipo === 'estudo' ? 'text-[#129e91]' : 'text-[#8b5cf6]'}`}>
                       {item.tempo}
                     </span>
                   </div>
                 ))}
               </div>
            </div>

            {/* APROVEITAMENTO DIÁRIO (SCROLL HORIZONTAL NO MOBILE) */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
               <h3 className="text-slate-800 text-sm font-extrabold uppercase tracking-wide mb-6 flex items-center gap-2">
                 <CheckCircle2 className="size-4 text-[#1ce4d2]" strokeWidth={3} />
                 Aproveitamento Diário (Semana)
               </h3>
               <div className="flex lg:grid lg:grid-cols-7 gap-4 lg:gap-6 overflow-x-auto pb-2 scrollbar-none">
                 {[
                   { dia: "SEG", pct: 100 },
                   { dia: "TER", pct: 85 },
                   { dia: "QUA", pct: 60 },
                   { dia: "QUI", pct: 100 },
                   { dia: "SEX", pct: 40 },
                   { dia: "SAB", pct: 0 },
                   { dia: "DOM", pct: 0 }
                 ].map((item) => (
                   <div key={item.dia} className="flex flex-col items-center min-w-[60px]">
                     <div className="relative size-[60px] flex items-center justify-center">
                        <svg className="size-full -rotate-90">
                           <circle cx="30" cy="30" r="26" fill="transparent" stroke="#f1f5f9" strokeWidth="6"/>
                           <circle 
                             cx="30" cy="30" r="26" 
                             fill="transparent" 
                             stroke={item.pct >= 80 ? THEME.cyan : item.pct >= 50 ? "#fbbf24" : "#f87171"} 
                             strokeWidth="6" 
                             strokeDasharray="163.3" 
                             strokeDashoffset={163.3 * (1 - (item.pct / 100))} 
                             strokeLinecap="round"
                             className="transition-all duration-1000 ease-out"
                           />
                        </svg>
                        <span className="absolute text-[11px] font-extrabold text-slate-700">{item.pct}%</span>
                     </div>
                     <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-3">{item.dia}</span>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}