import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  navy:'#0A1628', navyMid:'#122040', navyLt:'#1A3058',
  teal:'#0BBFA3', tealDim:'rgba(11,191,163,0.15)',
  amber:'#F5A623', amberDim:'rgba(245,166,35,0.15)',
  red:'#E8455A',   redDim:'rgba(232,69,90,0.15)',
  white:'#F0F6FF', gray:'#8BA5C4',
  grayDim:'rgba(139,165,196,0.12)', border:'rgba(139,165,196,0.15)',
  purple:'#9B6DFF',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.navy};color:${C.white};font-family:'DM Sans',sans-serif;min-height:100vh;}

  /* LOGIN */
  .lw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${C.navy};
    background-image:radial-gradient(ellipse 60% 50% at 10% 0%,rgba(11,191,163,0.12) 0%,transparent 60%);}
  .lc{width:440px;max-width:95vw;background:${C.navyMid};border:1px solid ${C.border};border-radius:20px;padding:40px 36px;}
  .ll{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;color:${C.teal};margin-bottom:4px;}
  .lt{font-size:11px;color:${C.gray};letter-spacing:1.5px;text-transform:uppercase;margin-bottom:32px;}
  .lh{font-family:'Syne',sans-serif;font-weight:700;font-size:20px;margin-bottom:4px;}
  .ls{font-size:13px;color:${C.gray};margin-bottom:28px;}
  .fl{font-size:11px;color:${C.gray};letter-spacing:.6px;text-transform:uppercase;margin-bottom:6px;display:block;}
  .fi{width:100%;padding:12px 14px;border-radius:9px;background:${C.navy};border:1px solid ${C.border};color:${C.white};font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .15s;margin-bottom:16px;}
  .fi:focus{border-color:${C.teal};}
  .fi::placeholder{color:${C.gray};}
  .lb{width:100%;padding:13px;border-radius:10px;border:none;background:${C.teal};color:${C.navy};font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;transition:opacity .15s;margin-top:4px;}
  .lb:hover{opacity:.87;} .lb:disabled{opacity:.45;cursor:not-allowed;}
  .le{background:${C.redDim};border:1px solid rgba(232,69,90,.27);border-radius:8px;padding:10px 14px;font-size:13px;color:${C.red};margin-bottom:16px;}

  /* LAYOUT */
  .app{min-height:100vh;background:${C.navy};}
  .lay{display:flex;min-height:100vh;}
  .sb{width:240px;min-height:100vh;background:${C.navyMid};border-right:1px solid ${C.border};display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;}
  .sbl{padding:24px 24px 18px;border-bottom:1px solid ${C.border};}
  .slm{font-family:'Syne',sans-serif;font-weight:800;font-size:17px;color:${C.teal};}
  .sls{font-size:10px;color:${C.gray};letter-spacing:.8px;text-transform:uppercase;margin-top:2px;}
  .sbn{padding:16px 12px;flex:1;overflow-y:auto;}
  .nl{font-size:10px;font-weight:600;color:${C.gray};letter-spacing:1.5px;text-transform:uppercase;padding:0 12px 8px;}
  .ni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;color:${C.gray};transition:all .15s;margin-bottom:2px;border:none;background:none;width:100%;text-align:left;}
  .ni:hover{background:${C.grayDim};color:${C.white};}
  .ni.act{background:${C.tealDim};color:${C.teal};}
  .nic{font-size:16px;width:20px;text-align:center;}
  .nbg{margin-left:auto;background:${C.red};color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center;}
  .sbf{padding:14px 16px;border-top:1px solid ${C.border};display:flex;align-items:center;gap:10px;}
  .sfa{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,${C.teal},#0A8F7D);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${C.navy};flex-shrink:0;}
  .sfi{flex:1;min-width:0;}
  .sfn{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .sfr{font-size:10px;color:${C.gray};text-transform:uppercase;letter-spacing:.5px;}
  .bso{padding:5px 8px;border-radius:6px;border:1px solid ${C.border};background:transparent;color:${C.gray};font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all .15s;}
  .bso:hover{border-color:${C.red};color:${C.red};}

  /* MAIN */
  .mn{margin-left:240px;flex:1;padding:32px 36px;min-height:100vh;}
  .topb{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;}
  .tt{font-family:'Syne',sans-serif;font-weight:800;font-size:26px;}
  .ts{font-size:13px;color:${C.gray};margin-top:2px;}
  .tr{display:flex;align-items:center;gap:12px;}
  .dp{background:${C.grayDim};border:1px solid ${C.border};padding:6px 14px;border-radius:20px;font-size:12px;color:${C.gray};}
  .tav{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${C.teal},#0A8F7D);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${C.navy};}

  /* STATS */
  .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;}
  .sc{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;padding:20px 22px;}
  .scl{font-size:11px;color:${C.gray};letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px;}
  .scv{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;}
  .scs{font-size:12px;color:${C.gray};margin-top:4px;}
  .stl .scv{color:${C.teal};} .sta .scv{color:${C.amber};} .str .scv{color:${C.red};} .stp .scv{color:${C.purple};}

  /* SECTION HEADER */
  .sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
  .sht{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;}
  .sha{font-size:12px;color:${C.teal};cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;font-weight:500;}

  /* CARD / TABLE */
  .cd{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;overflow:hidden;margin-bottom:28px;}
  .tl{width:100%;border-collapse:collapse;}
  .tl th{padding:12px 16px;text-align:left;font-size:11px;font-weight:600;color:${C.gray};letter-spacing:.8px;text-transform:uppercase;border-bottom:1px solid ${C.border};background:${C.navyLt};}
  .tl td{padding:13px 16px;border-bottom:1px solid ${C.border};font-size:13px;}
  .tl tr:last-child td{border-bottom:none;}
  .tl tr:hover td{background:${C.grayDim};}
  .ap{margin-left:7px;font-size:10px;color:${C.gray};background:${C.grayDim};padding:2px 6px;border-radius:4px;font-weight:600;}
  .bw{display:flex;align-items:center;gap:10px;}
  .br{flex:1;height:6px;background:${C.grayDim};border-radius:3px;overflow:hidden;max-width:100px;}
  .bf{height:100%;border-radius:3px;}
  .chs{display:flex;gap:4px;flex-wrap:wrap;}
  .ch{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,${C.teal},#0A8F7D);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${C.navy};}
  .sp{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;}
  .sok{background:${C.tealDim};color:${C.teal};} .slw{background:${C.amberDim};color:${C.amber};} .sbd{background:${C.redDim};color:${C.red};}
  .lp{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;font-size:10px;font-weight:600;}
  .lky{background:${C.redDim};color:${C.red};} .lkn{background:${C.tealDim};color:${C.teal};}

  /* SWAPS */
  .swl{display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
  .swr{background:${C.navyMid};border:1px solid ${C.border};border-radius:12px;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;}
  .swi{display:flex;align-items:center;gap:14px;}
  .swa{width:38px;height:38px;border-radius:50%;background:${C.amberDim};border:1.5px solid ${C.amber};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${C.amber};}
  .swn{font-weight:600;font-size:14px;margin-bottom:3px;}
  .swd{font-size:12px;color:${C.gray};}
  .swb{display:flex;gap:8px;}
  .bok{padding:7px 14px;border-radius:7px;border:none;background:${C.teal};color:${C.navy};font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .bok:hover{opacity:.85;}
  .bno{padding:7px 14px;border-radius:7px;border:1px solid ${C.border};background:transparent;color:${C.gray};font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .bno:hover{border-color:${C.red};color:${C.red};}

  /* DOCTORS */
  .dg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;}
  .dcd{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;overflow:hidden;}
  .dcb{padding:18px;}
  .dct{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
  .dol{font-size:10px;color:${C.gray};letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;}
  .dos{display:flex;gap:5px;flex-wrap:wrap;}
  .ddt{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:8px;vertical-align:middle;}

  /* ASSISTANTS */
  .ag{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;}
  .ac{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;padding:18px;}
  .at{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
  .aav{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,${C.navyLt},rgba(11,191,163,.13));border:2px solid ${C.border};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${C.teal};}
  .pr{display:flex;align-items:center;justify-content:space-between;}
  .pv{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;color:${C.teal};}
  .pl{font-size:10px;color:${C.gray};margin-top:2px;letter-spacing:.5px;}
  .sk{display:flex;align-items:center;gap:4px;background:${C.amberDim};padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;color:${C.amber};}
  .skn{display:flex;align-items:center;gap:4px;background:${C.grayDim};padding:4px 10px;border-radius:20px;font-size:11px;color:${C.gray};}

  /* CALENDAR */
  .cmw{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start;}
  .cmc{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;overflow:hidden;}
  .cmh{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid ${C.border};}
  .cmt{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;}
  .cnb{width:32px;height:32px;border-radius:8px;border:1px solid ${C.border};background:transparent;color:${C.gray};cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;}
  .cnb:hover{border-color:${C.teal};color:${C.teal};}
  .cdr{display:grid;grid-template-columns:repeat(7,1fr);background:${C.navyLt};border-bottom:1px solid ${C.border};}
  .cdw{padding:9px 0;text-align:center;font-size:10px;font-weight:700;color:${C.gray};letter-spacing:.8px;text-transform:uppercase;}
  .cgr{display:grid;grid-template-columns:repeat(7,1fr);}
  .cdy{min-height:70px;border-right:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:6px;cursor:pointer;transition:background .12s;position:relative;}
  .cdy:nth-child(7n){border-right:none;}
  .cdy:hover{background:${C.grayDim};}
  .cdy.sel{background:${C.tealDim};}
  .cdy.tod{background:rgba(11,191,163,.07);}
  .cdy.om{opacity:.3;} .cdy.we{opacity:.35;cursor:default;}
  .cdn{font-size:12px;font-weight:600;color:${C.gray};margin-bottom:3px;}
  .cdy.sel .cdn{color:${C.teal};} .cdy.tod .cdn{color:${C.teal};font-weight:800;}
  .cdts{display:flex;flex-wrap:wrap;gap:2px;}
  .cdt{width:6px;height:6px;border-radius:50%;background:${C.teal};}
  .coc{position:absolute;bottom:4px;right:5px;font-size:9px;font-weight:700;color:${C.gray};}
  .pnl{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;position:sticky;top:20px;}
  .pnh{padding:18px 20px;border-bottom:1px solid ${C.border};}
  .pnt{font-family:'Syne',sans-serif;font-weight:800;font-size:16px;margin-bottom:2px;}
  .pns{font-size:12px;color:${C.gray};}
  .pnb{padding:16px 20px;display:flex;flex-direction:column;gap:8px;max-height:520px;overflow-y:auto;}
  .odr{background:${C.navy};border:1px solid ${C.border};border-radius:10px;padding:10px 12px;}
  .odt{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .odn{font-size:12px;font-weight:600;}
  .oda{font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;background:${C.grayDim};color:${C.gray};}
  .tgsw{position:relative;width:36px;height:20px;flex-shrink:0;}
  .tgsw input{opacity:0;width:0;height:0;}
  .tgsl{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${C.grayDim};border:1px solid ${C.border};border-radius:20px;transition:.2s;}
  .tgsl:before{position:absolute;content:'';height:14px;width:14px;left:2px;bottom:2px;background:${C.gray};border-radius:50%;transition:.2s;}
  .tgsw input:checked + .tgsl{background:${C.tealDim};border-color:${C.teal};}
  .tgsw input:checked + .tgsl:before{transform:translateX(16px);background:${C.teal};}
  .trow{display:flex;align-items:center;gap:8px;margin-top:6px;}
  .tlab{font-size:10px;color:${C.gray};text-transform:uppercase;width:32px;flex-shrink:0;}
  .tin{background:${C.navyLt};border:1px solid ${C.border};border-radius:6px;color:${C.white};font-family:'DM Sans',sans-serif;font-size:12px;padding:4px 8px;outline:none;width:82px;}
  .tin:focus{border-color:${C.teal};}
  .tsep{color:${C.gray};font-size:12px;}
  .cls{opacity:.4;pointer-events:none;}
  .pnf{padding:14px 20px;border-top:1px solid ${C.border};display:flex;gap:8px;}
  .bsv{flex:1;padding:9px;border-radius:8px;border:none;background:${C.teal};color:${C.navy};font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .bsv:hover{opacity:.85;}
  .boa{padding:9px 12px;border-radius:8px;border:1px solid ${C.border};background:transparent;color:${C.gray};font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .boa:hover{border-color:${C.teal};color:${C.teal};}

  /* PORTAL */
  .hr{background:linear-gradient(135deg,${C.navyMid} 0%,${C.navyLt} 100%);border:1px solid ${C.border};border-radius:16px;padding:28px 32px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;}
  .hgn{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;}
  .hgb{color:${C.gray};font-size:14px;margin-top:4px;}
  .hgs{display:flex;align-items:center;gap:6px;font-size:13px;color:${C.amber};font-weight:600;margin-top:8px;}
  .hpv{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;color:${C.teal};line-height:1;}
  .hpl{font-size:12px;color:${C.gray};margin-top:4px;text-align:right;}
  .tabs{display:flex;gap:8px;margin-bottom:20px;}
  .tab{padding:8px 18px;border-radius:8px;border:1px solid;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .msl{display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
  .msr{background:${C.navyMid};border:1px solid ${C.border};border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:16px;}
  .msd{min-width:50px;text-align:center;background:${C.grayDim};border-radius:8px;padding:8px 6px;}
  .msm{font-size:10px;color:${C.gray};letter-spacing:.5px;text-transform:uppercase;}
  .mdd{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;line-height:1.1;}
  .msi{flex:1;}
  .mso{font-weight:600;font-size:14px;}
  .mst{font-size:12px;color:${C.gray};margin-top:2px;}
  .msa{display:flex;gap:8px;}
  .bsw{padding:6px 12px;border-radius:7px;border:1px solid ${C.border};background:transparent;color:${C.gray};font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .bsw:hover{border-color:${C.amber};color:${C.amber};}
  .stcal{background:${C.navyMid};border:1px solid ${C.border};border-radius:14px;overflow:hidden;margin-bottom:28px;}
  .stch{display:grid;grid-template-columns:100px repeat(5,1fr);background:${C.navyLt};border-bottom:1px solid ${C.border};}
  .stcc{padding:12px 8px;text-align:center;font-size:11px;font-weight:600;color:${C.gray};letter-spacing:.8px;text-transform:uppercase;}
  .stcr{display:grid;grid-template-columns:100px repeat(5,1fr);border-bottom:1px solid ${C.border};}
  .stcr:last-child{border-bottom:none;}
  .stcl{padding:0 10px;font-size:11px;font-weight:700;color:${C.teal};border-right:1px solid ${C.border};display:flex;align-items:center;}
  .stcx{padding:8px 6px;text-align:center;border-right:1px solid ${C.border};display:flex;align-items:center;justify-content:center;min-height:52px;}
  .stcx:last-child{border-right:none;}
  .ssb{width:100%;padding:5px 4px;border-radius:6px;border:none;font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;background:${C.tealDim};color:${C.teal};}
  .ssb:hover{background:${C.teal};color:${C.navy};}
  .ssb.mine{background:${C.teal};color:${C.navy};}
  .ssb.lk{background:${C.grayDim};color:${C.gray};cursor:not-allowed;}
  .ssb.fl{background:transparent;color:${C.gray};border:1px solid ${C.border};cursor:not-allowed;}
  .ptl{display:flex;flex-direction:column;gap:8px;}
  .ptr{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:${C.navyMid};border:1px solid ${C.border};border-radius:10px;}
  .pta{font-family:'Syne',sans-serif;font-weight:800;font-size:16px;color:${C.teal};}
  .ntf{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;background:${C.amberDim};border:1px solid rgba(245,166,35,.13);margin-bottom:16px;font-size:13px;}
  .ovl{position:fixed;inset:0;background:rgba(10,22,40,.85);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;}
  .mdl{background:${C.navyMid};border:1px solid ${C.border};border-radius:16px;padding:28px 32px;width:420px;max-width:95vw;}
  .mdlt{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:6px;}
  .mdls{font-size:13px;color:${C.gray};margin-bottom:20px;}
  .mdll{font-size:11px;color:${C.gray};letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;}
  .mdlx{width:100%;padding:10px 12px;border-radius:8px;background:${C.navy};border:1px solid ${C.border};color:${C.white};font-size:14px;font-family:'DM Sans',sans-serif;margin-bottom:16px;outline:none;}
  .mdlx:focus{border-color:${C.teal};}
  .mdlf{display:flex;gap:10px;margin-top:4px;}
  .bpr{flex:1;padding:11px;border-radius:9px;border:none;background:${C.teal};color:${C.navy};font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .bsc{padding:11px 20px;border-radius:9px;border:1px solid ${C.border};background:transparent;color:${C.gray};font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .load{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${C.navy};font-family:'Syne',sans-serif;font-size:18px;color:${C.teal};}

  @media(max-width:1100px){.cmw{grid-template-columns:1fr;}}
  @media(max-width:768px){
    .sb{display:none;}
    .mn{margin-left:0;padding:16px;padding-bottom:80px;}
    .sg{grid-template-columns:repeat(2,1fr);gap:10px;}
    .ag,.dg{grid-template-columns:repeat(2,1fr);}
    .tt{font-size:20px;}
    .topb{margin-bottom:20px;}
    .dp{display:none;}
    .hr{padding:20px;flex-direction:column;gap:16px;}
    .hpv{font-size:36px;}
    .tabs{overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;}
    .tab{white-space:nowrap;flex-shrink:0;}
    .msr{flex-wrap:wrap;gap:10px;}
    .stcal{overflow-x:auto;}
    .stch,.stcr{min-width:480px;}
    .cmw{grid-template-columns:1fr;}
    .swr{flex-direction:column;align-items:flex-start;gap:12px;}
    .swb{width:100%;justify-content:flex-end;}
    .sc{padding:14px 16px;}
    .scv{font-size:24px;}
    .dg{grid-template-columns:1fr;}
    .cd{overflow-x:auto;}
    .tl{min-width:500px;}
  }
  /* MOBILE BOTTOM NAV */
  .bnav{display:none;}
  @media(max-width:768px){
    .bnav{display:flex;position:fixed;bottom:0;left:0;right:0;background:${C.navyMid};border-top:1px solid ${C.border};z-index:100;padding:8px 0;padding-bottom:calc(8px + env(safe-area-inset-bottom));}
    .bni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 4px;border:none;background:none;color:${C.gray};font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;font-family:'DM Sans',sans-serif;position:relative;}
    .bni.act{color:${C.teal};}
    .bni-ic{font-size:20px;line-height:1;}
    .bni-bd{position:absolute;top:4px;right:calc(50% - 14px);background:${C.red};color:white;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px;min-width:16px;text-align:center;}
  }
`

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DOWS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function fmtDate(ds) {
  const d = new Date(ds + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })
}
function fmtShort(ds) {
  const d = new Date(ds + 'T00:00:00')
  return { month: d.toLocaleDateString('en-US',{month:'short'}), day: d.getDate(), dow: d.toLocaleDateString('en-US',{weekday:'short'}) }
}
function isoToday() {
  return new Date().toISOString().split('T')[0]
}
function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric', year:'numeric' })
}
function initials(name) {
  return (name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Stat({ label, value, sub, v }) {
  return (
    <div className={'sc ' + (v || '')}>
      <div className="scl">{label}</div>
      <div className="scv">{value}</div>
      {sub && <div className="scs">{sub}</div>}
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pw,    setPw]    = useState('')
  const [err,   setErr]   = useState('')
  const [busy,  setBusy]  = useState(false)

  async function go() {
    setErr(''); setBusy(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
    if (error) { setErr(error.message); setBusy(false); return }
    onLogin(data.session)
  }

  return (
    <div className="lw">
      <div className="lc">
        <div className="ll">OrthoShift</div>
        <div className="lt">DSO Scheduling Platform</div>
        <div className="lh">Welcome back</div>
        <div className="ls">Sign in to your account</div>
        {err && <div className="le">⚠ {err}</div>}
        <label className="fl">Email Address</label>
        <input className="fi" type="email" placeholder="you@orthoshift.com" value={email}
          onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} />
        <label className="fl">Password</label>
        <input className="fi" type="password" placeholder="••••••••" value={pw}
          onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} />
        <button className="lb" onClick={go} disabled={busy || !email || !pw}>
          {busy ? 'Signing in…' : 'Sign In →'}
        </button>
      </div>
    </div>
  )
}

// ─── COVERAGE ─────────────────────────────────────────────────────────────────
function Coverage({ offices, profile }) {
  const [swaps,    setSwaps]    = useState([])
  const [shifts,   setShifts]   = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading,  setLoading]  = useState(true)

  const load = useCallback(async () => {
    const today = isoToday()
    const [swapRes, shiftRes, profileRes] = await Promise.all([
      supabase.from('swap_requests').select('*, profiles(name)').eq('status', 'pending'),
      supabase.from('shifts').select('*, profiles(name, initials)').eq('date', today),
      supabase.from('profiles').select('*').eq('role', 'assistant'),
    ])
    setSwaps(swapRes.data || [])
    setShifts(shiftRes.data || [])
    setProfiles(profileRes.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSwap(id, status) {
    await supabase.from('swap_requests').update({ status }).eq('id', id)
    setSwaps(s => s.filter(x => x.id !== id))
  }

  if (loading) return <div style={{ color: C.gray, padding: 40 }}>Loading coverage data…</div>

  const coveredOffices = shifts.reduce((acc, s) => {
    if (!acc[s.office_abbr]) acc[s.office_abbr] = []
    if (s.profiles) acc[s.office_abbr].push(s.profiles)
    return acc
  }, {})

  const uncovered = offices.filter(o => !coveredOffices[o.abbr] || coveredOffices[o.abbr].length < 2).length

  return (
    <div>
      <div className="sg">
        <Stat label="Offices Today" value={offices.length} sub="All locations" />
        <Stat label="Shifts Covered" value={(offices.length - uncovered) + '/' + offices.length} sub="Today" v="stl" />
        <Stat label="Pending Swaps" value={swaps.length} sub="Need approval" v="sta" />
        <Stat label="Uncovered" value={uncovered} sub="Need staff" v="str" />
      </div>

      {swaps.length > 0 && (
        <>
          <div className="sh">
            <div className="sht">⚡ Swap Requests</div>
            <div style={{ fontSize: 12, color: C.gray }}>{swaps.length} pending</div>
          </div>
          <div className="swl">
            {swaps.map(s => (
              <div key={s.id} className="swr">
                <div className="swi">
                  <div className="swa">{initials(s.profiles?.name)}</div>
                  <div>
                    <div className="swn">{s.profiles?.name}</div>
                    <div className="swd">
                      {s.from_office}
                      <span style={{ color: C.teal, margin: '0 6px' }}>→</span>
                      <span style={{ color: C.teal }}>{s.to_office}</span>
                    </div>
                  </div>
                </div>
                <div className="swb">
                  <button className="bok" onClick={() => handleSwap(s.id, 'approved')}>Approve</button>
                  <button className="bno" onClick={() => handleSwap(s.id, 'denied')}>Deny</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="sh"><div className="sht">📍 Office Coverage — Today</div></div>
      <div className="cd">
        <table className="tl">
          <thead>
            <tr><th>Office</th><th>Coverage</th><th>Assigned</th><th>Status</th></tr>
          </thead>
          <tbody>
            {offices.map(o => {
              const assigned = coveredOffices[o.abbr] || []
              const needed = 2
              const ratio = assigned.length / needed
              const pct = Math.round(ratio * 100)
              const fc = ratio >= 1 ? C.teal : ratio >= 0.5 ? C.amber : C.red
              const stCls = ratio >= 1 ? 'sok' : ratio >= 0.5 ? 'slw' : 'sbd'
              const stTxt = ratio >= 1 ? '✓ Covered' : ratio >= 0.5 ? 'Low' : 'Uncovered'
              return (
                <tr key={o.abbr}>
                  <td><span style={{ fontWeight: 500 }}>{o.name}</span><span className="ap">{o.abbr}</span></td>
                  <td>
                    <div className="bw">
                      <div className="br"><div className="bf" style={{ width: pct + '%', background: fc }} /></div>
                      <span style={{ fontSize: 12, color: C.gray }}>{assigned.length}/{needed}</span>
                    </div>
                  </td>
                  <td>
                    <div className="chs">
                      {assigned.map((a, i) => (
                        <div key={i} className="ch" title={a.name}>{a.initials || initials(a.name)}</div>
                      ))}
                    </div>
                  </td>
                  <td><span className={'sp ' + stCls}>{stTxt}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── DOCTORS ──────────────────────────────────────────────────────────────────
function Doctors({ offices }) {
  const [doctors,  setDoctors]  = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const [docRes, schRes] = await Promise.all([
        supabase.from('doctors').select('*, doctor_offices(office_abbr)'),
        supabase.from('doctor_schedule').select('*, doctors(name, color)').order('date'),
      ])
      setDoctors(docRes.data || [])
      setSchedule(schRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ color: C.gray, padding: 40 }}>Loading doctors…</div>

  return (
    <div>
      <div className="sg">
        <Stat label="Doctors" value={doctors.length} sub="On roster" />
        <Stat label="Offices" value={offices.length} sub="All covered" v="stl" />
        <Stat label="Shifts This Week" value={schedule.length} sub="Scheduled" v="sta" />
        <Stat label="Specialty" value="Ortho" sub="All orthodontists" />
      </div>
      <div className="sh">
        <div className="sht">🩺 Doctor Roster</div>
        <button className="sha">+ Add Doctor →</button>
      </div>
      <div className="dg">
        {doctors.map(doc => {
          const docOffices = (doc.doctor_offices || []).map(r => r.office_abbr)
          return (
            <div key={doc.id} className="dcd">
              <div style={{ height: 4, background: doc.color }} />
              <div className="dcb">
                <div className="dct">
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: doc.color + '33', border: '2px solid ' + doc.color, color: doc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{doc.initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>{doc.phone}</div>
                  </div>
                </div>
                <div className="dol">Assigned Offices</div>
                <div className="dos">
                  {docOffices.map(a => (
                    <span key={a} style={{ padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, border: '1px solid ' + doc.color + '44', color: doc.color, background: C.grayDim }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="sh"><div className="sht">📅 Doctor Schedule</div></div>
      <div className="cd">
        <table className="tl">
          <thead><tr><th>Doctor</th><th>Office</th><th>Date</th></tr></thead>
          <tbody>
            {schedule.map((row, i) => {
              const off = offices.find(o => o.abbr === row.office_abbr)
              return (
                <tr key={i}>
                  <td>
                    <span className="ddt" style={{ background: row.doctors?.color || C.gray }} />
                    <strong>{row.doctors?.name}</strong>
                  </td>
                  <td style={{ color: C.gray }}>{off?.name || row.office_abbr}</td>
                  <td style={{ color: C.gray }}>{fmtDate(row.date)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── ASSISTANTS ───────────────────────────────────────────────────────────────
function Assistants() {
  const [assistants, setAssistants] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'assistant').order('points', { ascending: false })
      .then(({ data }) => { setAssistants(data || []); setLoading(false) })
  }, [])

  if (loading) return <div style={{ color: C.gray, padding: 40 }}>Loading assistants…</div>

  const topStreak = assistants.reduce((max, a) => a.streak > max ? a.streak : max, 0)
  const topName   = assistants.find(a => a.streak === topStreak)?.name || '—'
  const avgPts    = assistants.length ? Math.round(assistants.reduce((s, a) => s + a.points, 0) / assistants.length) : 0

  return (
    <div>
      <div className="sg">
        <Stat label="Total Assistants" value={assistants.length} sub="Across all offices" />
        <Stat label="Avg Points" value={avgPts} sub="This period" v="stl" />
        <Stat label="Top Streak" value={topStreak + ' 🔥'} sub={topName} v="sta" />
        <Stat label="Bonus Pool Est." value={'$' + (assistants.reduce((s, a) => s + a.points, 0) * 40).toLocaleString()} sub="Month-to-date" v="stl" />
      </div>
      <div className="sh">
        <div className="sht">🏆 Reliability Board</div>
        <button className="sha">Export CSV →</button>
      </div>
      <div className="ag">
        {assistants.map(a => (
          <div key={a.id} className="ac">
            <div className="at">
              <div className="aav">{a.initials || initials(a.name)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{a.phone || '—'}</div>
              </div>
            </div>
            <div className="pr">
              <div>
                <div className="pv">{a.points}</div>
                <div className="pl">RELIABILITY PTS</div>
              </div>
              {a.streak > 0
                ? <div className="sk">🔥 {a.streak}-day streak</div>
                : <div className="skn">No streak</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CALENDAR MANAGER ────────────────────────────────────────────────────────
function CalendarManager({ offices }) {
  const now  = new Date()
  const [yr,      setYr]      = useState(now.getFullYear())
  const [mo,      setMo]      = useState(now.getMonth())
  const [selDate, setSelDate] = useState(isoToday())
  const [calData, setCalData] = useState({})
  const [draft,   setDraft]   = useState(null)
  const [saved,   setSaved]   = useState(false)
  const [saving,  setSaving]  = useState(false)

  // Load calendar data for current month view
  useEffect(() => {
    const monthKey = yr + '-' + String(mo + 1).padStart(2, '0')
    supabase.from('calendar_days')
      .select('*')
      .gte('date', monthKey + '-01')
      .lte('date', monthKey + '-31')
      .then(({ data }) => {
        const map = {}
        ;(data || []).forEach(row => {
          if (!map[row.date]) map[row.date] = {}
          map[row.date][row.office_abbr] = { open: row.is_open, start: row.start_time?.slice(0,5) || '08:00', end: row.end_time?.slice(0,5) || '17:00', dbId: row.id }
        })
        setCalData(map)
      })
  }, [yr, mo])

  function blankDraft() {
    const b = {}
    offices.forEach(o => { b[o.abbr] = { open: false, start: '08:00', end: '17:00' } })
    return b
  }
  function loadDraft(ds) {
    const ex = calData[ds]
    return ex ? JSON.parse(JSON.stringify(ex)) : blankDraft()
  }
  function pickDate(ds) {
    setSelDate(ds); setDraft(loadDraft(ds)); setSaved(false)
  }
  function toggleOff(abbr) {
    setDraft(prev => ({ ...prev, [abbr]: { ...prev[abbr], open: !prev[abbr].open } }))
    setSaved(false)
  }
  function updateTime(abbr, field, val) {
    setDraft(prev => ({ ...prev, [abbr]: { ...prev[abbr], [field]: val } }))
    setSaved(false)
  }
  function openAll()  { const n = {}; offices.forEach(o => { n[o.abbr] = { open: true,  start: '08:00', end: '17:00' } }); setDraft(n); setSaved(false) }
  function closeAll() { const n = {}; offices.forEach(o => { n[o.abbr] = { open: false, start: '08:00', end: '17:00' } }); setDraft(n); setSaved(false) }

  async function saveDay() {
    setSaving(true)
    const upserts = offices.map(o => ({
      date:        selDate,
      office_abbr: o.abbr,
      is_open:     draft[o.abbr]?.open || false,
      start_time:  draft[o.abbr]?.start || '08:00',
      end_time:    draft[o.abbr]?.end   || '17:00',
    }))
    await supabase.from('calendar_days').upsert(upserts, { onConflict: 'date,office_abbr' })
    // Update local calData
    setCalData(prev => ({ ...prev, [selDate]: draft }))
    setSaving(false); setSaved(true)
  }

  function openCount(ds) {
    const d = calData[ds]; if (!d) return 0
    return Object.keys(d).filter(k => d[k].open).length
  }

  // Build grid
  const firstDay = new Date(yr, mo, 1)
  const lastDay  = new Date(yr, mo + 1, 0)
  const pad = firstDay.getDay()
  const cells = []
  for (let i = 0; i < pad; i++) cells.push({ date: new Date(yr, mo, -(pad - 1 - i)), cur: false })
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push({ date: new Date(yr, mo, d), cur: true })
  const rem = (7 - (cells.length % 7)) % 7
  for (let j = 1; j <= rem; j++) cells.push({ date: new Date(yr, mo + 1, j), cur: false })

  function toISO(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') }

  const today = isoToday()
  const monthKey = yr + '-' + String(mo + 1).padStart(2, '0')
  const monthDays = Object.keys(calData).filter(ds => ds.startsWith(monthKey))
  const totalOpen = monthDays.reduce((acc, ds) => acc + openCount(ds), 0)
  const selObj = new Date(selDate + 'T00:00:00')
  const selLabel = selObj.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })
  const currentDraft = draft || blankDraft()

  function prevMo() { if (mo === 0) { setYr(yr-1); setMo(11) } else setMo(mo-1) }
  function nextMo() { if (mo === 11) { setYr(yr+1); setMo(0) } else setMo(mo+1) }

  return (
    <div>
      <div className="sg">
        <Stat label="Month" value={MONTHS[mo]} sub={String(yr)} />
        <Stat label="Open Office-Days" value={totalOpen} sub={'In ' + MONTHS[mo]} v="stl" />
        <Stat label="Working Days" value={monthDays.length} sub="Weekdays" v="sta" />
        <Stat label="Offices" value={offices.length} sub="Locations" v="stp" />
      </div>
      <div className="cmw">
        <div>
          <div className="cmc">
            <div className="cmh">
              <button className="cnb" onClick={prevMo}>‹</button>
              <div className="cmt">{MONTHS[mo] + ' ' + yr}</div>
              <button className="cnb" onClick={nextMo}>›</button>
            </div>
            <div className="cdr">{DOWS.map(d => <div key={d} className="cdw">{d}</div>)}</div>
            <div className="cgr">
              {cells.map((cell, i) => {
                const ds  = toISO(cell.date)
                const dow = cell.date.getDay()
                const isWe  = dow === 6
                const isTod = ds === today
                const isSel = ds === selDate
                const cnt   = openCount(ds)
                const cls   = 'cdy' + (!cell.cur ? ' om' : '') + (isWe ? ' we' : '') + (isTod ? ' tod' : '') + (isSel ? ' sel' : '')
                return (
                  <div key={i} className={cls} onClick={() => cell.cur && !isWe && pickDate(ds)}>
                    <div className="cdn">{cell.date.getDate()}</div>
                    {cell.cur && !isWe && cnt > 0 && (
                      <>
                        <div className="cdts">{Array.from({length: Math.min(cnt,6)}).map((_,k) => <div key={k} className="cdt"/>)}</div>
                        <div className="coc">{cnt}/{offices.length}</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pnl">
          <div className="pnh">
            <div className="pnt">{selLabel}</div>
            <div className="pns">Set office hours for this day</div>
          </div>
          <div className="pnb">
            {offices.map(o => {
              const od = currentDraft[o.abbr] || { open: false, start: '08:00', end: '17:00' }
              return (
                <div key={o.abbr} className="odr">
                  <div className="odt">
                    <div>
                      <span className="odn">{o.name}</span>
                      <span className="oda" style={{ marginLeft: 6 }}>{o.abbr}</span>
                    </div>
                    <label className="tgsw">
                      <input type="checkbox" checked={od.open} onChange={() => toggleOff(o.abbr)} />
                      <span className="tgsl" />
                    </label>
                  </div>
                  <div className={od.open ? '' : 'cls'}>
                    <div className="trow">
                      <span className="tlab">Open</span>
                      <input className="tin" type="time" value={od.start} disabled={!od.open} onChange={e => updateTime(o.abbr,'start',e.target.value)} />
                      <span className="tsep">–</span>
                      <input className="tin" type="time" value={od.end} disabled={!od.open} onChange={e => updateTime(o.abbr,'end',e.target.value)} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="pnf">
            <button className="boa" onClick={openAll}>Open All</button>
            <button className="boa" onClick={closeAll} style={{ color: C.red, borderColor: 'rgba(232,69,90,.3)' }}>Close All</button>
            <button className="bsv" onClick={saveDay} disabled={saving}>
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Day'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ASSISTANT PORTAL ────────────────────────────────────────────────────────
function Portal({ profile, offices }) {
  const [shifts,  setShifts]  = useState([])
  const [history, setHistory] = useState([])
  const [modal,   setModal]   = useState(null)
  const [tgtOff,  setTgtOff]  = useState('')
  const [tab,     setTab]     = useState('sched')
  const [submitting, setSubmitting] = useState(false)
  const [sentDates,  setSentDates]  = useState([])

  useEffect(() => {
    async function load() {
      const today = isoToday()
      const [shiftRes, histRes] = await Promise.all([
        supabase.from('shifts').select('*').eq('assistant_id', profile.id).gte('date', today).order('date'),
        supabase.from('point_events').select('*').eq('assistant_id', profile.id).order('created_at', { ascending: false }).limit(20),
      ])
      setShifts(shiftRes.data || [])
      setHistory(histRes.data || [])
    }
    load()
  }, [profile.id])

  async function submitSwap() {
    if (!modal || !tgtOff) return
    setSubmitting(true)
    await supabase.from('swap_requests').insert({
      shift_id:    modal.id,
      assistant_id:profile.id,
      from_office: modal.office_abbr,
      to_office:   tgtOff,
      status:      'pending',
    })
    setSentDates(d => [...d, modal.date])
    setModal(null); setSubmitting(false)
  }

  const tabs = [{ id:'sched', lbl:'📅 My Schedule' }, { id:'pick', lbl:'➕ Pick Shifts' }, { id:'pts', lbl:'⭐ My Points' }]
  const today = isoToday()
  // Generate next 5 weekdays for Pick Shifts grid
  const weekDays = []
  const base = new Date()
  while (weekDays.length < 5) {
    const ds = base.toISOString().split('T')[0]
    if (base.getDay() !== 0 && base.getDay() !== 6) weekDays.push({ date: ds, locked: weekDays.length < 3 })
    base.setDate(base.getDate() + 1)
  }

  return (
    <div>
      {modal && (
        <div className="ovl" onClick={() => setModal(null)}>
          <div className="mdl" onClick={e => e.stopPropagation()}>
            <div className="mdlt">Request Office Switch</div>
            <div className="mdls">For {fmtDate(modal.date)} · Currently: {modal.office_abbr}</div>
            <div className="mdll">Preferred Office</div>
            <select className="mdlx" value={tgtOff} onChange={e => setTgtOff(e.target.value)}>
              {offices.filter(o => o.abbr !== modal.office_abbr).map(o => (
                <option key={o.abbr} value={o.abbr}>{o.abbr} — {o.name}</option>
              ))}
            </select>
            <div className="mdll">Reason (optional)</div>
            <select className="mdlx">
              <option>Closer to home</option>
              <option>Carpooling</option>
              <option>Transportation issue</option>
              <option>Other</option>
            </select>
            <div style={{ fontSize: 12, color: C.amber, marginBottom: 16 }}>⚠ Requires admin approval.</div>
            <div className="mdlf">
              <button className="bsc" onClick={() => setModal(null)}>Cancel</button>
              <button className="bpr" onClick={submitSwap} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hr">
        <div>
          <div className="hgn">Good morning, {profile.name?.split(' ')[0]} 👋</div>
          <div className="hgb">You have {shifts.length} upcoming shifts</div>
          {profile.streak > 0 && <div className="hgs">🔥 {profile.streak}-day streak — keep it going!</div>}
        </div>
        <div>
          <div className="hpv">{profile.points}</div>
          <div className="hpl">RELIABILITY POINTS</div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className="tab"
            style={{ borderColor: tab === t.id ? C.teal : C.border, background: tab === t.id ? C.tealDim : 'transparent', color: tab === t.id ? C.teal : C.gray }}
            onClick={() => setTab(t.id)}>{t.lbl}
          </button>
        ))}
      </div>

      {tab === 'sched' && (
        <div>
          {sentDates.length > 0 && (
            <div className="ntf">
              <span>📨</span>
              <div><strong>Swap request sent!</strong> Admin will review within 24 hours.</div>
            </div>
          )}
          <div className="msl">
            {shifts.length === 0
              ? <div style={{ textAlign:'center', padding: 40, color: C.gray }}>No upcoming shifts scheduled.</div>
              : shifts.map(s => {
                const fs = fmtShort(s.date)
                const locked = s.date <= today
                const isSent = sentDates.includes(s.date)
                return (
                  <div key={s.id} className="msr">
                    <div className="msd">
                      <div className="msm">{fs.month}</div>
                      <div className="mdd">{fs.day}</div>
                      <div style={{ fontSize: 10, color: C.gray }}>{fs.dow}</div>
                    </div>
                    <div className="msi">
                      <div className="mso">
                        {offices.find(o => o.abbr === s.office_abbr)?.name || s.office_abbr}
                        <span style={{ marginLeft: 7, fontSize: 10, color: C.teal, background: C.tealDim, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{s.office_abbr}</span>
                      </div>
                      <div className="mst">
                        {s.start_time?.slice(0,5) || '8:00 AM'} – {s.end_time?.slice(0,5) || '5:00 PM'}
                      </div>
                    </div>
                    <div className="msa">
                      {locked
                        ? <span className="lp lky">🔒 Locked</span>
                        : isSent
                          ? <span className="lp" style={{ background: C.amberDim, color: C.amber }}>⏳ Pending</span>
                          : <button className="bsw" onClick={() => { setModal(s); setTgtOff(offices.find(o=>o.abbr!==s.office_abbr)?.abbr || '') }}>Request Switch</button>}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {tab === 'pick' && (
        <div>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>Click an open slot to self-assign. Shifts lock 3 days out.</div>
          <div className="stcal">
            <div className="stch">
              <div className="stcc" style={{ textAlign:'left', paddingLeft:14 }}>Office</div>
              {weekDays.map(d => {
                const fs = fmtShort(d.date)
                return (
                  <div key={d.date} className="stcc">
                    <div>{fs.dow}</div>
                    <div style={{ color: C.white, fontWeight: 800 }}>{fs.day}</div>
                    {d.locked && <div style={{ fontSize: 10 }}>🔒</div>}
                  </div>
                )
              })}
            </div>
            {offices.map(o => (
              <div key={o.abbr} className="stcr">
                <div className="stcl">{o.abbr}</div>
                {weekDays.map(d => {
                  const myShift = shifts.find(s => s.date === d.date && s.office_abbr === o.abbr)
                  return (
                    <div key={d.date} className="stcx">
                      {d.locked
                        ? <button className="ssb lk" disabled>🔒</button>
                        : myShift
                          ? <button className="ssb mine">✓ You</button>
                          : <button className="ssb">+ Claim</button>}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pts' && (
        <div>
          <div className="sg" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
            <Stat label="Total Points" value={profile.points} sub="All time" v="stl" />
            <Stat label="This Month" value={history.filter(p => p.points > 0).length} sub={MONTHS[new Date().getMonth()]} />
            <Stat label="Current Streak" value={profile.streak + ' 🔥'} sub="Consecutive shifts" v="sta" />
          </div>
          <div className="sh"><div className="sht">Point History</div></div>
          <div className="ptl">
            {history.length === 0
              ? <div style={{ textAlign:'center', padding: 30, color: C.gray }}>No point history yet.</div>
              : history.map((p, i) => (
                <div key={i} className="ptr">
                  <div>
                    <div style={{ fontSize: 13, color: p.points === 0 ? C.gray : C.white }}>{p.event}</div>
                    <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{new Date(p.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                  </div>
                  {p.points > 0
                    ? <div className="pta">+{p.points} pt</div>
                    : <div className="pta" style={{ color: C.gray }}>—</div>}
                </div>
              ))}
          </div>
          <div style={{ marginTop: 20, padding: 16, background: C.tealDim, border: '1px solid rgba(11,191,163,.2)', borderRadius: 12, fontSize: 13, color: C.teal }}>
            💡 <strong>How points work:</strong> Earn 1 point every time you show up as scheduled. Points convert to bonus pay monthly. No deductions — just rewards.
          </div>
        </div>
      )}
    </div>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [profile, setProfile] = useState(null)
  const [offices, setOffices] = useState([])
  const [page,    setPage]    = useState('coverage')

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // Load profile + offices when logged in
  useEffect(() => {
    if (!session) { setProfile(null); return }
    Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      supabase.from('offices').select('*').order('id'),
    ]).then(([profRes, offRes]) => {
      setProfile(profRes.data)
      setOffices(offRes.data || [])
    })
  }, [session])

  async function logout() {
    await supabase.auth.signOut()
    setPage('coverage')
  }

  // Loading state
  if (session === undefined) {
    return <div className="load">Loading OrthoShift…</div>
  }

  if (!session) {
    return (
      <>
        <style>{css}</style>
        <Login onLogin={s => setSession(s)} />
      </>
    )
  }

  if (!profile) {
    return <div className="load">Loading profile…</div>
  }

  const isAdmin = profile.role === 'admin'
  const adminNav = [
    { id:'coverage',   icon:'📍', label:'Coverage'   },
    { id:'calendar',   icon:'🗓',  label:'Calendar'   },
    { id:'doctors',    icon:'🩺', label:'Doctors'    },
    { id:'assistants', icon:'👥', label:'Assistants' },
  ]
  const titles = { coverage:'Coverage Overview', calendar:'Calendar Manager', doctors:'Doctor Management', assistants:'Assistant Management' }
  const pageTitle = isAdmin ? (titles[page] || 'Dashboard') : 'My Schedule'
  const staffStyle = isAdmin ? {} : { background: 'linear-gradient(135deg,' + C.amber + ',#C4810A)' }
  const ini = profile.initials || initials(profile.name)

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="lay">
          <aside className="sb">
            <div className="sbl">
              <div className="slm">OrthoShift</div>
              <div className="sls">DSO Scheduling Platform</div>
            </div>
            <nav className="sbn">
              {isAdmin ? (
                <div>
                  <div className="nl" style={{ marginTop: 8 }}>Admin Panel</div>
                  {adminNav.map(n => (
                    <button key={n.id} className={'ni' + (page === n.id ? ' act' : '')} onClick={() => setPage(n.id)}>
                      <span className="nic">{n.icon}</span>
                      {n.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="nl" style={{ marginTop: 8 }}>My Portal</div>
                  <button className="ni act"><span className="nic">📅</span>My Schedule</button>
                </div>
              )}
            </nav>
            <div className="sbf">
              <div className="sfa" style={staffStyle}>{ini}</div>
              <div className="sfi">
                <div className="sfn">{profile.name}</div>
                <div className="sfr">{isAdmin ? 'Administrator' : 'Assistant'}</div>
              </div>
              <button className="bso" onClick={logout}>Sign out</button>
            </div>
          </aside>

          <main className="mn">
            <div className="topb">
              <div>
                <div className="tt">{pageTitle}</div>
                <div className="ts">{isAdmin ? offices.length + ' offices · ' + profile.name : profile.name + ' · OrthoShift'}</div>
              </div>
              <div className="tr">
                <div className="dp">{todayLabel()}</div>
                <div className="tav" style={staffStyle}>{ini}</div>
              </div>
            </div>

            {isAdmin && page === 'coverage'   && <Coverage   offices={offices} profile={profile} />}
            {isAdmin && page === 'calendar'   && <CalendarManager offices={offices} />}
            {isAdmin && page === 'doctors'    && <Doctors    offices={offices} />}
            {isAdmin && page === 'assistants' && <Assistants />}
            {!isAdmin && <Portal profile={profile} offices={offices} />}
          </main>

          {/* MOBILE BOTTOM NAV */}
          <nav className="bnav">
            {isAdmin ? adminNav.map(n => (
              <button key={n.id} className={'bni' + (page === n.id ? ' act' : '')} onClick={() => setPage(n.id)}>
                <span className="bni-ic">{n.icon}</span>
                <span>{n.label}</span>
              </button>
            )) : (
              <>
                <button className="bni act">
                  <span className="bni-ic">📅</span>
                  <span>Schedule</span>
                </button>
                <button className="bni" onClick={logout}>
                  <span className="bni-ic">🚪</span>
                  <span>Sign Out</span>
                </button>
              </>
            )}
            {isAdmin && (
              <button className="bni" onClick={logout}>
                <span className="bni-ic">🚪</span>
                <span>Out</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
