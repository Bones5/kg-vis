import{j as e}from"./jsx-runtime-DkoXifhC.js";import{r as s}from"./iframe-DDZWOFbJ.js";import{G as S}from"./GraphErrorBoundary-BAZm3mTT.js";import{H as I}from"./HexOverview-Z2Onswrv.js";import{H as M}from"./HexRing-RgWn-6NE.js";import{M as R}from"./Minimap-CGMGpDwR.js";import{l as B,g as m}from"./mockGraph-bn9x33XF.js";import"./preload-helper-C1FmrZbK.js";import"./RoutedEdges-fuh6ZXRd.js";import"./colors-DWNEdmMT.js";import"./HexPill-ub8uhkoV.js";const P=900,D=700,F=P/2,T=D/2;function V({payload:t}){const[o,l]=s.useState("overview"),[a,p]=s.useState(null),u=s.useMemo(()=>B(t),[t]),h=s.useCallback(r=>{p(r),l("cluster-ring")},[]),O=s.useCallback(()=>{l("overview"),p(null)},[]),N=s.useCallback(r=>{p(r),l("cluster-ring")},[]),v=s.useMemo(()=>{var r;return a?((r=u.find(H=>H.id===a))==null?void 0:r.label)??a:null},[a,u]);return e.jsxs("div",{className:"hex-graph-view",children:[e.jsxs("nav",{className:"breadcrumbs","aria-label":"View navigation",children:[e.jsx("button",{className:`breadcrumbs__item${o==="overview"?" breadcrumbs__item--active":""}`,onClick:O,"aria-current":o==="overview"?"page":void 0,children:"All"}),v&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"breadcrumbs__sep","aria-hidden":"true",children:"›"}),e.jsx("span",{className:"breadcrumbs__item breadcrumbs__item--active","aria-current":"page",children:v})]})]}),e.jsx("div",{className:"hex-canvas-wrap",children:e.jsxs(S,{children:[o==="overview"&&e.jsx(I,{payload:t,onClusterClick:h}),(o==="cluster-ring"||o==="node-ring")&&a&&e.jsx(M,{centerId:a,payload:t,onClusterClick:h})]})}),o!=="overview"&&e.jsx(R,{nodes:u.map(r=>({...r,px:r.px+F,py:r.py+T})),activeClusterId:a,onNavigate:N})]})}V.__docgenInfo={description:"",methods:[],displayName:"HexGraphView",props:{payload:{required:!0,tsType:{name:"GraphPayload"},description:""}}};const W=m({clusterCount:8,nodesPerCluster:40,edgeDensity:.25}),ee={title:"Hex/Composed/HexGraphView",component:V,parameters:{layout:"fullscreen"},decorators:[t=>e.jsx("div",{style:{width:"100%",height:"100vh"},children:e.jsx(t,{})})],args:{payload:W}},n={};function A(){throw new Error("Composed view failed")}const i={render:()=>e.jsx("div",{style:{width:"100%",height:"100vh",background:"#0f172a"},children:e.jsx(S,{children:e.jsx(A,{})})})},c={args:{payload:m({clusterCount:2,nodesPerCluster:5,edgeDensity:.2})}},d={args:{payload:m({clusterCount:20,nodesPerCluster:50,edgeDensity:.3})}};var g,x,C;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:"{}",...(C=(x=n.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var w,b,y;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "100%",
    height: "100vh",
    background: "#0f172a"
  }}>
      <GraphErrorBoundary>
        <BrokenGraph />
      </GraphErrorBoundary>
    </div>
}`,...(y=(b=i.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var _,E,j;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    payload: generateMockGraph({
      clusterCount: 2,
      nodesPerCluster: 5,
      edgeDensity: 0.2
    })
  }
}`,...(j=(E=c.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var f,G,k;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    payload: generateMockGraph({
      clusterCount: 20,
      nodesPerCluster: 50,
      edgeDensity: 0.3
    })
  }
}`,...(k=(G=d.parameters)==null?void 0:G.docs)==null?void 0:k.source}}};const re=["OverviewToRingInteractive","ErrorState","SmallGraph","LargeGraph"];export{i as ErrorState,d as LargeGraph,n as OverviewToRingInteractive,c as SmallGraph,re as __namedExportsOrder,ee as default};
