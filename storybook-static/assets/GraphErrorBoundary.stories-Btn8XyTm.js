import{j as r}from"./jsx-runtime-DkoXifhC.js";import{G as e}from"./GraphErrorBoundary-BAZm3mTT.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";function f(){throw new Error("Storybook forced render failure")}const k={title:"Graph/GraphErrorBoundary",component:e,parameters:{layout:"centered"},args:{children:r.jsx("div",{})}},o={render:()=>r.jsx(e,{children:r.jsx("div",{style:{color:"#e2e8f0",background:"#0f172a",padding:16},children:"Graph content"})})},n={render:()=>r.jsx(e,{children:r.jsx(f,{})})},a={render:()=>r.jsx(e,{fallback:r.jsxs("div",{style:{color:"#f87171",background:"#0f172a",padding:24,textAlign:"center"},children:[r.jsx("h2",{children:"⚠️ Custom error UI"}),r.jsx("p",{children:"Something went wrong. Please try refreshing the page."})]}),children:r.jsx(f,{})})};function x(){throw new Error("A very long error message that tests how the error boundary handles overflow text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.")}const s={render:()=>r.jsx(e,{children:r.jsx(x,{})})};var t,d,c;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <GraphErrorBoundary>
      <div style={{
      color: "#e2e8f0",
      background: "#0f172a",
      padding: 16
    }}>Graph content</div>
    </GraphErrorBoundary>
}`,...(c=(d=o.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var i,l,p;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <GraphErrorBoundary>
      <ErrorThrower />
    </GraphErrorBoundary>
}`,...(p=(l=n.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var h,u,m;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <GraphErrorBoundary fallback={<div style={{
    color: "#f87171",
    background: "#0f172a",
    padding: 24,
    textAlign: "center"
  }}>
          <h2>⚠️ Custom error UI</h2>
          <p>Something went wrong. Please try refreshing the page.</p>
        </div>}>
      <ErrorThrower />
    </GraphErrorBoundary>
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var g,E,y;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <GraphErrorBoundary>
      <LongErrorThrower />
    </GraphErrorBoundary>
}`,...(y=(E=s.parameters)==null?void 0:E.docs)==null?void 0:y.source}}};const v=["HealthyChild","ErrorFallback","CustomFallback","LongErrorMessage"];export{a as CustomFallback,n as ErrorFallback,o as HealthyChild,s as LongErrorMessage,v as __namedExportsOrder,k as default};
