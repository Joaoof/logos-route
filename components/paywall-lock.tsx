// "use client"

// import { Lock, TrendingUp, ShieldAlert, Target, ArrowRight } from "lucide-react"

// interface PaywallLockProps {
//   featureName: string;
//   description: string;
// }

// export function PaywallLock({ featureName, description }: PaywallLockProps) {
//   return (
//     <div className="w-full max-w-2xl mx-auto mt-8 relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm p-8 text-center">
//       {/* Background de desfoque sugerindo conteúdo atrás */}
//       <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-background/95 backdrop-blur-[2px] z-0 pointer-events-none" />
      
//       <div className="relative z-10 flex flex-col items-center">
//         <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
//           <Lock className="size-8 text-primary" />
//         </div>
        
//         <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
//           {featureName} é exclusivo para o Plano PRO
//         </h2>
//         <p className="text-muted-foreground mb-8 max-w-md">
//           {description}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8 text-left">
//           <div className="bg-secondary p-4 rounded-xl">
//             <TrendingUp className="size-5 text-primary mb-2" />
//             <h3 className="font-bold text-sm mb-1">Relatórios Avançados</h3>
//             <p className="text-xs text-muted-foreground">Descubra os dias e horários mais lucrativos do seu mês.</p>
//           </div>
//           <div className="bg-secondary p-4 rounded-xl">
//             <ShieldAlert className="size-5 text-primary mb-2" />
//             <h3 className="font-bold text-sm mb-1">Cálculo de Manutenção</h3>
//             <p className="text-xs text-muted-foreground">Saiba exatamente quanto guardar para não quebrar a mota.</p>
//           </div>
//           <div className="bg-secondary p-4 rounded-xl">
//             <Target className="size-5 text-primary mb-2" />
//             <h3 className="font-bold text-sm mb-1">Metas de Mordomia</h3>
//             <p className="text-xs text-muted-foreground">Equilibre as suas finanças pessoais com a sua rotina intensa.</p>
//           </div>
//         </div>

//         <button className="bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
//           Desbloquear PRO por R$ 19,99/mês
//           <ArrowRight className="size-5" />
//         </button>
//         <p className="text-[11px] text-muted-foreground mt-4">
//           Cancele a qualquer momento. O investimento paga-se numa corrida.
//         </p>
//       </div>
//     </div>
//   )
// }