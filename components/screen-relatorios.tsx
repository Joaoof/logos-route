"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"
import { Download, TrendingUp, BarChart3, ReceiptText } from "lucide-react"
import { formatarMoeda } from "@/lib/dashboard-store"
import type { DadosDiariosDto, DadosMensaisDto } from "@/lib/types"

// Cores estratégicas apenas para os dados
const COLOR_REVENUE = "#1ce4d2" // Ciano da marca
const COLOR_COST = "#f43f5e"    // Rosa/Vermelho para custos
const COLOR_PROFIT = "#8b5cf6"  // Violeta para lucro líquido

interface ScreenRelatoriosProps {
  dadosSemanais: DadosDiariosDto[]
  dadosMensais: DadosMensaisDto[]
}

export function ScreenRelatorios({ dadosSemanais, dadosMensais }: ScreenRelatoriosProps) {
  const totalSemana = dadosSemanais.reduce((s, d) => s + d.faturamentoBruto, 0)
  const custoSemana = dadosSemanais.reduce((s, d) => s + d.custoRodagem, 0)
  const lucroSemana = totalSemana - custoSemana
  
  const totalMes = dadosMensais.reduce((s, d) => s + d.faturamentoBruto, 0)
  const lucroMes = dadosMensais.reduce((s, d) => s + d.lucroLiquido, 0)

  // Função para abrir a caixa de diálogo de PDF do sistema
  const handleDownloadPDF = () => {
    window.print()
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        
        /* CSS Específico para forçar o PDF a ficar perfeito e limpo */
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      <div className="w-full flex flex-col items-center pt-2 pb-10 font-outfit">
        
        {/* ========================================= */}
        {/* ÁREA DE IMPRESSÃO (O RELATÓRIO EM SI)     */}
        {/* ========================================= */}
        <div 
          id="print-area"
          className="relative w-full max-w-5xl rounded-[32px] bg-white border border-slate-200 shadow-sm p-6 lg:p-10 print:p-0 print:border-none print:shadow-none"
        >
          
          {/* HEADER DO RELATÓRIO & BOTÃO PDF */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-6 print:pb-4 print:border-slate-300">
            <div className="flex items-center gap-4">
              <div className="size-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center no-print">
                <ReceiptText className="size-7 text-[#1ce4d2]" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-slate-800 font-extrabold tracking-widest text-2xl uppercase">
                  Relatório Geral
                </h2>
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">
                  Análise Financeira de Alta Performance
                </p>
              </div>
            </div>

            {/* BOTÃO PDF - Agora com estilo limpo e profissional */}
            <button 
              onClick={handleDownloadPDF}
              className="no-print bg-white text-slate-600 font-extrabold tracking-widest text-[11px] px-6 py-3.5 rounded-full border-2 border-slate-200 hover:border-slate-800 hover:text-slate-800 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 uppercase"
            >
              <Download className="size-4" strokeWidth={2.5} />
              Baixar PDF
            </button>
          </div>

          {/* ========================================= */}
          {/* GRID DE RESUMO                            */}
          {/* ========================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex flex-col items-center text-center print:bg-white print:border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Receita (Semana)</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-2 tracking-tight">{formatarMoeda(totalSemana)}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex flex-col items-center text-center print:bg-white print:border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#1ce4d2]" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lucro (Semana)</span>
              <span className="text-2xl font-extrabold text-[#129e91] mt-2 tracking-tight">{formatarMoeda(lucroSemana)}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex flex-col items-center text-center print:bg-white print:border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Receita (Mês)</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-2 tracking-tight">{formatarMoeda(totalMes)}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex flex-col items-center text-center print:bg-white print:border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#8b5cf6]" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lucro (Mês)</span>
              <span className="text-2xl font-extrabold text-[#8b5cf6] mt-2 tracking-tight">{formatarMoeda(lucroMes)}</span>
            </div>
          </div>

          {/* ========================================= */}
          {/* GRÁFICOS                                  */}
          {/* ========================================= */}
          <div className="flex flex-col gap-10">
            
            {/* GRÁFICO SEMANAL */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 print:border-slate-200 print:rounded-2xl">
              <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
                <div className="size-8 rounded-full bg-[#1ce4d2]/10 flex items-center justify-center">
                  <TrendingUp className="size-4 text-[#1ce4d2]" strokeWidth={3} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
                  Desempenho Semanal
                </h3>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosSemanais} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="dia" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11, fontFamily: 'Outfit', fontWeight: 700 }} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11, fontFamily: 'Outfit', fontWeight: 700 }} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontFamily: 'Outfit', fontWeight: 'bold' }}
                      formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'Outfit', color: '#64748b', paddingTop: '20px' }} />
                    <Bar dataKey="faturamentoBruto" name="Ganho Bruto" fill={COLOR_REVENUE} radius={[6, 6, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="custoRodagem" name="Custos Operacionais" fill={COLOR_COST} radius={[6, 6, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GRÁFICO MENSAL */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 print:border-slate-200 print:rounded-2xl">
              <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
                <div className="size-8 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                  <BarChart3 className="size-4 text-[#8b5cf6]" strokeWidth={3} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
                  Visão Mensal (Por Semana)
                </h3>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosMensais} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="semana" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11, fontFamily: 'Outfit', fontWeight: 700 }} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11, fontFamily: 'Outfit', fontWeight: 700 }} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontFamily: 'Outfit', fontWeight: 'bold' }}
                      formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'Outfit', color: '#64748b', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="faturamentoBruto" name="Bruto" stroke={COLOR_REVENUE} strokeWidth={3} dot={{ r: 5, fill: COLOR_REVENUE, strokeWidth: 0 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="custoRodagem" name="Custos" stroke={COLOR_COST} strokeWidth={3} dot={{ r: 5, fill: COLOR_COST, strokeWidth: 0 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="lucroLiquido" name="Lucro Real" stroke={COLOR_PROFIT} strokeWidth={4} dot={{ r: 6, fill: COLOR_PROFIT, strokeWidth: 0 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}