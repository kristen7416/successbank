import{g as M,E as N,w as U,x as W,j as t,b as P,i as Y,S as X,_ as y,y as $,z as q,V as u,e as J,A as G,X as K,B as Q,D as Z,F as ee,G as d,H as c,J as re,K as ne,M as H,N as R,r as C,O as te,P as ae,Q as ie,U as oe,W as se,Y as ue,Z as z,$ as h}from"./vendors.bbda7092.js";import{c as F,P as le,B as x,C as ce,a as de,b as j,d as pe,e as me,t as S,T as he}from"./common.8f57bef7.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();var fe=`
/* H5 端隐藏 TabBar 空图标（只隐藏没有 src 的图标） */
.weui-tabbar__icon:not([src]),
.weui-tabbar__icon[src=''] {
  display: none !important;
}

.weui-tabbar__item:has(.weui-tabbar__icon:not([src])) .weui-tabbar__label,
.weui-tabbar__item:has(.weui-tabbar__icon[src='']) .weui-tabbar__label {
  margin-top: 0 !important;
}

/* Vite 错误覆盖层无法选择文本的问题 */
vite-error-overlay {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text !important;
}

vite-error-overlay::part(window) {
  max-width: 90vw;
  padding: 10px;
}

.taro_page {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* H5 导航栏页面自动添加顶部间距 */
body.h5-navbar-visible .taro_page {
  padding-top: 44px;
}

body.h5-navbar-visible .toaster[data-position^="top"] {
  top: 44px !important;
}

/* Sheet 组件在 H5 导航栏下的位置修正 */
body.h5-navbar-visible .sheet-content:not([data-side="bottom"]) {
    top: 44px !important;
}

/*
 * H5 端 rem 适配：与小程序 rpx 缩放一致
 * 375px 屏幕：1rem = 16px，小程序 32rpx = 16px
 */
html {
    font-size: 4vw !important;
}

/* H5 端组件默认样式修复 */
taro-view-core {
    display: block;
}

taro-text-core {
    display: inline;
}

taro-input-core {
    display: block;
    width: 100%;
}

taro-input-core input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
}

taro-input-core.taro-otp-hidden-input input {
    color: transparent;
    caret-color: transparent;
    -webkit-text-fill-color: transparent;
}

/* 全局按钮样式重置 */
taro-button-core,
button {
    margin: 0 !important;
    padding: 0 !important;
    line-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}

taro-button-core::after,
button::after {
    border: none;
}

taro-textarea-core > textarea,
.taro-textarea,
textarea.taro-textarea {
    resize: none !important;
}
`,be=`
/* PC 宽屏适配 - 基础布局 */
@media (min-width: 769px) {
  html {
    font-size: 15px !important;
  }

  body {
    background-color: #f3f4f6 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: 100vh !important;
  }
}
`,ge=`
/* PC 宽屏适配 - 手机框样式（有 TabBar 页面） */
@media (min-width: 769px) {
  .taro-tabbar__container {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    transform: translateX(0) !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .taro-tabbar__panel {
    height: 100% !important;
    overflow: auto !important;
  }
}

/* PC 宽屏适配 - Toast 定位到手机框范围内 */
@media (min-width: 769px) {
  body .toaster {
    left: 50% !important;
    right: auto !important;
    width: 375px !important;
    max-width: 375px !important;
    transform: translateX(-50%) !important;
    box-sizing: border-box !important;
  }
}

/* PC 宽屏适配 - 手机框样式（无 TabBar 页面，通过 JS 添加 no-tabbar 类） */
@media (min-width: 769px) {
  body.no-tabbar #app {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
    transform: translateX(0) !important;
  }

  body.no-tabbar #app .taro_router {
    height: 100% !important;
    overflow: auto !important;
  }
}
`;function ve(){var o=document.createElement("style");o.innerHTML=fe+be+ge,document.head.appendChild(o)}function xe(){var o=function(){var n=!!document.querySelector(".taro-tabbar__container");document.body.classList.toggle("no-tabbar",!n)};o();var e=new MutationObserver(o);e.observe(document.body,{childList:!0,subtree:!0})}function we(){ve(),xe()}function ye(){var o=M();if(o===N.WEAPP||o===N.TT)try{var e=U(),r=e.miniProgram.envVersion;console.log("[Debug] envVersion:",r),r!=="release"&&W({enableDebug:!0})}catch(n){console.error("[Debug] 开启调试模式失败:",n)}}var Ee=function(e){var r=e.children;return t.jsx(t.Fragment,{children:r})},Ce=["className","children","orientation"],I=P.forwardRef(function(o,e){var r=o.className,n=o.children,i=o.orientation,a=i===void 0?"vertical":i,s=Y(o,Ce),p=a==="horizontal"||a==="both",l=a==="vertical"||a==="both";return t.jsx(X,y(y({ref:e,className:F("relative",r),scrollY:l,scrollX:p,style:{overflowX:p?"auto":"hidden",overflowY:l?"auto":"hidden"}},s),{},{children:n}))});I.displayName="ScrollArea";var je={error:null,report:"",source:"",visible:!1,open:!1,timestamp:""},A="hsl(360, 100%, 45%)",T=!1,E=je,_=new Set,Fe=function(){_.forEach(function(e){return e()})},_e=function(e){return _.add(e),function(){return _.delete(e)}},B=function(){return E},L=function(e){E=e,Fe()},Pe=function(){var o=d(c().m(function e(r){var n,i,a,s,p;return c().w(function(l){for(;;)switch(l.p=l.n){case 0:if(typeof window!="undefined"){l.n=1;break}return l.a(2,!1);case 1:if(l.p=1,!((n=navigator.clipboard)!==null&&n!==void 0&&n.writeText)){l.n=3;break}return l.n=2,navigator.clipboard.writeText(r);case 2:return l.a(2,!0);case 3:l.n=5;break;case 4:l.p=4,s=l.v,console.warn("[H5ErrorBoundary] Clipboard API copy failed:",s);case 5:return l.p=5,i=document.createElement("textarea"),i.value=r,i.setAttribute("readonly","true"),i.style.position="fixed",i.style.opacity="0",document.body.appendChild(i),i.select(),a=document.execCommand("copy"),document.body.removeChild(i),l.a(2,a);case 6:return l.p=6,p=l.v,console.warn("[H5ErrorBoundary] Fallback copy failed:",p),l.a(2,!1)}},e,null,[[5,6],[1,4]])}));return function(r){return o.apply(this,arguments)}}(),ke=function(e){if(e instanceof Error)return e;if(typeof e=="string")return new Error(e);try{return new Error(JSON.stringify(e))}catch(r){return new Error(String(e))}},Ne=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=["[H5 Runtime Error]","Time: ".concat(new Date().toISOString()),r.source?"Source: ".concat(r.source):"","Name: ".concat(e.name),"Message: ".concat(e.message),e.stack?`Stack:
`.concat(e.stack):"",r.componentStack?`Component Stack:
`.concat(r.componentStack):"",typeof navigator!="undefined"?"User Agent: ".concat(navigator.userAgent):""].filter(Boolean);return n.join(`

`)},D=function(e){E.visible&&L(y(y({},E),{},{open:e}))},k=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(typeof window!="undefined"){var n=ke(e),i=Ne(n,r),a=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});L({error:n,report:i,source:r.source||"runtime",timestamp:a,visible:!0,open:!1}),console.error("[H5ErrorOverlay] Showing error overlay:",n,r)}},Se=function(e){var r=e.error||new Error(e.message||"Unknown H5 runtime error");k(r,{source:"window.error"})},Ae=function(e){k(e.reason,{source:"window.unhandledrejection"})},Te=function(){typeof window=="undefined"||T||(T=!0,window.addEventListener("error",Se),window.addEventListener("unhandledrejection",Ae))},Be=function(){var e,r,n=P.useSyncExternalStore(_e,B,B);if(!n.visible)return null;var i=((e=n.error)===null||e===void 0?void 0:e.name)||"Error";return t.jsx(le,{children:t.jsxs(u,{className:"pointer-events-none fixed inset-0 z-[2147483646]",children:[t.jsx(u,{className:"pointer-events-auto fixed bottom-5 left-5",children:t.jsx(x,{variant:"outline",size:"icon",className:F("h-11 w-11 rounded-full shadow-md transition-transform"),style:{backgroundColor:"hsl(359, 100%, 97%)",borderColor:"hsl(359, 100%, 94%)",color:A},onClick:function(){return D(!n.open)},children:t.jsx(J,{size:22,color:A})})}),n.open&&t.jsx(u,{className:"pointer-events-none fixed inset-0 bg-white bg-opacity-15 supports-[backdrop-filter]:backdrop-blur-md",children:t.jsx(u,{className:"absolute inset-0 flex items-center justify-center px-4 py-4",children:t.jsx(u,{className:"w-full max-w-md",style:{width:"min(calc(100vw - 32px), var(--h5-phone-width, 390px))",height:"min(calc(100vh - 32px), 900px)"},children:t.jsx(ce,{className:F("pointer-events-auto h-full rounded-2xl border border-border bg-background text-foreground shadow-2xl"),children:t.jsxs(u,{className:"relative flex h-full flex-col",children:[t.jsxs(de,{className:"gap-2 p-4 pb-2",children:[t.jsxs(u,{className:"flex items-start justify-between gap-3",children:[t.jsxs(u,{className:"flex flex-wrap items-center gap-2",children:[t.jsx(j,{variant:"destructive",className:"border-none bg-red-500 px-3 py-1 text-xs font-medium text-white",children:"Runtime Error"}),t.jsx(j,{variant:"outline",className:"px-3 py-1 text-xs",children:n.source})]}),t.jsxs(u,{className:"flex shrink-0 items-center gap-1",children:[t.jsx(x,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return window.location.reload()},children:t.jsx(G,{size:15,color:"inherit"})}),t.jsx(x,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return D(!1)},children:t.jsx(K,{size:17,color:"inherit"})})]})]}),t.jsxs(u,{className:"flex items-center justify-between gap-3",children:[t.jsx(pe,{className:"text-left text-lg",children:i}),t.jsxs(x,{variant:"outline",size:"sm",className:"shrink-0 rounded-lg",onClick:function(){var a=d(c().m(function p(){var l;return c().w(function(m){for(;;)switch(m.n){case 0:return m.n=1,Pe(n.report);case 1:if(l=m.v,!l){m.n=2;break}return S.success("已复制错误信息",{description:"可发送给 Agent 进行自动修复",position:"top-center"}),m.a(2);case 2:S.warning("复制失败",{description:"请直接选中文本后手动复制。",position:"top-center"});case 3:return m.a(2)}},p)}));function s(){return a.apply(this,arguments)}return s}(),children:[t.jsx(Q,{size:15,color:"inherit"}),t.jsx(u,{children:"复制错误"})]})]})]}),t.jsx(me,{className:"min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2",children:t.jsxs(u,{className:"flex h-full min-h-0 flex-col gap-2",children:[t.jsxs(u,{className:"flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border px-3 py-2 text-sm",children:[t.jsxs(u,{className:"flex items-center gap-2",children:[t.jsx(u,{className:"text-muted-foreground",children:"Error"}),t.jsx(u,{className:"font-medium text-foreground",children:((r=n.error)===null||r===void 0?void 0:r.name)||"Error"})]}),t.jsx(u,{className:"h-4 w-px bg-border"}),t.jsxs(u,{className:"flex items-center gap-2",children:[t.jsx(u,{className:"text-muted-foreground",children:"Source"}),t.jsx(u,{className:"font-medium text-foreground",children:n.source})]})]}),t.jsxs(u,{className:"min-h-0 flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-black text-white",children:[t.jsxs(u,{className:"flex items-center justify-between border-b border-white border-opacity-10 px-3 py-3",children:[t.jsx(u,{className:"text-xs font-medium uppercase tracking-wide text-zinc-400",children:"Full Report"}),t.jsx(j,{variant:"outline",className:"border-zinc-700 bg-transparent px-2 py-1 text-xs text-zinc-400",children:n.timestamp})]}),t.jsx(I,{className:"min-h-0 flex-1 w-full",orientation:"both",children:t.jsx(u,{className:"inline-block min-w-full whitespace-pre px-3 py-3 pb-8 font-mono text-xs leading-6 text-zinc-200",children:n.report})})]})]})})]})})})})})]})})},De=function(o){function e(){var r;Z(this,e);for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];return r=ee(this,e,[].concat(i)),r.state={error:null},r}return $(e,o),q(e,[{key:"componentDidUpdate",value:function(n){this.state.error&&n.children!==this.props.children&&this.setState({error:null})}},{key:"componentDidCatch",value:function(n,i){k(n,{source:"React Error Boundary",componentStack:i.componentStack||""})}},{key:"render",value:function(){return t.jsxs(t.Fragment,{children:[t.jsx(Be,{}),this.state.error?null:this.props.children]})}}],[{key:"getDerivedStateFromError",value:function(n){return{error:n}}}])}(P.Component),Oe=function(e){var r=e.children;return t.jsx(De,{children:r})},He=function(e){var r=e.children;return Te(),re.useLaunch(function(){ye(),we()}),t.jsx(Oe,{children:t.jsx(Ee,{children:r})})},Re=function(e){var r=e.children;return t.jsxs(ne,{defaultColor:"#000",defaultSize:24,children:[t.jsx(He,{children:r}),t.jsx(he,{})]})},v=H.__taroAppConfig={router:{mode:"hash"},pages:["pages/index/index","pages/deposit/index","pages/tasks/index","pages/toolbox/index","pages/profile/index","pages/garden/index"],lazyCodeLoading:"requiredComponents",window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#fffbeb",navigationBarTitleText:"成功银行",navigationBarTextStyle:"black",navigationStyle:"custom"},tabBar:{color:"#94a3b8",selectedColor:"#2dd4bf",backgroundColor:"#fffbeb",borderStyle:"black",list:[{pagePath:"pages/index/index",text:"首页",iconPath:"./assets/tabbar/home.png",selectedIconPath:"./assets/tabbar/home-active.png"},{pagePath:"pages/deposit/index",text:"存款",iconPath:"./assets/tabbar/circle-plus.png",selectedIconPath:"./assets/tabbar/circle-plus-active.png"},{pagePath:"pages/tasks/index",text:"任务",iconPath:"./assets/tabbar/target.png",selectedIconPath:"./assets/tabbar/target-active.png"},{pagePath:"pages/toolbox/index",text:"工具箱",iconPath:"./assets/tabbar/wrench.png",selectedIconPath:"./assets/tabbar/wrench-active.png"},{pagePath:"pages/profile/index",text:"我的",iconPath:"./assets/tabbar/user.png",selectedIconPath:"./assets/tabbar/user-active.png"}]}},f=[],b=[];f[0]="./static/images/home.png";b[0]="./static/images/home-active.png";f[1]="./static/images/circle-plus.png";b[1]="./static/images/circle-plus-active.png";f[2]="./static/images/target.png";b[2]="./static/images/target-active.png";f[3]="./static/images/wrench.png";b[3]="./static/images/wrench-active.png";f[4]="./static/images/user.png";b[4]="./static/images/user-active.png";var O=v.tabBar.list;for(var g=0;g<O.length;g++){var w=O[g];w.iconPath&&(w.iconPath=f[g]),w.selectedIconPath&&(w.selectedIconPath=b[g])}v.routes=[Object.assign({path:"pages/index/index",load:function(){var o=d(c().m(function r(n,i){var a;return c().w(function(s){for(;;)switch(s.n){case 0:return s.n=1,h(()=>import("./index.7d2b2c1c.js"),["./index.7d2b2c1c.js","./vendors.bbda7092.js","../css/vendors.8886af03.css","./common.8f57bef7.js"],import.meta.url);case 1:return a=s.v,s.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"成功银行"}),Object.assign({path:"pages/deposit/index",load:function(){var o=d(c().m(function r(n,i){var a;return c().w(function(s){for(;;)switch(s.n){case 0:return s.n=1,h(()=>import("./index.2da8be09.js"),["./index.2da8be09.js","./vendors.bbda7092.js","../css/vendors.8886af03.css","./common.8f57bef7.js"],import.meta.url);case 1:return a=s.v,s.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"成功银行"}),Object.assign({path:"pages/tasks/index",load:function(){var o=d(c().m(function r(n,i){var a;return c().w(function(s){for(;;)switch(s.n){case 0:return s.n=1,h(()=>import("./index.2800e4f2.js"),["./index.2800e4f2.js","./vendors.bbda7092.js","../css/vendors.8886af03.css","./common.8f57bef7.js"],import.meta.url);case 1:return a=s.v,s.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"21天计划"}),Object.assign({path:"pages/toolbox/index",load:function(){var o=d(c().m(function r(n,i){var a;return c().w(function(s){for(;;)switch(s.n){case 0:return s.n=1,h(()=>import("./index.2bd762d6.js"),["./index.2bd762d6.js","./vendors.bbda7092.js","../css/vendors.8886af03.css","./common.8f57bef7.js"],import.meta.url);case 1:return a=s.v,s.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"心理工具箱"}),Object.assign({path:"pages/profile/index",load:function(){var o=d(c().m(function r(n,i){var a;return c().w(function(s){for(;;)switch(s.n){case 0:return s.n=1,h(()=>import("./index.4f53d761.js"),["./index.4f53d761.js","./vendors.bbda7092.js","../css/vendors.8886af03.css","./common.8f57bef7.js"],import.meta.url);case 1:return a=s.v,s.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"我的"}),Object.assign({path:"pages/garden/index",load:function(){var o=d(c().m(function r(n,i){var a;return c().w(function(s){for(;;)switch(s.n){case 0:return s.n=1,h(()=>import("./index.ada3bf91.js"),["./index.ada3bf91.js","./vendors.bbda7092.js","../css/vendors.8886af03.css","./common.8f57bef7.js"],import.meta.url);case 1:return a=s.v,s.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"成功花园"})];Object.assign(R,{findDOMNode:C.findDOMNode,render:C.render,unstable_batchedUpdates:C.unstable_batchedUpdates});te();var ze=ae(Re,z,R,v),V=ie({window:H});oe(v,V);se(V,ze,v,z);ue({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905},baseFontSize:20,unitPrecision:void 0,targetUnit:void 0});
