import{j as g}from"./jsx-runtime-DkoXifhC.js";import{R as O,r as n,c as a}from"./RoutedEdges-fuh6ZXRd.js";import{l as c,g as l}from"./mockGraph-bn9x33XF.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";import"./colors-DWNEdmMT.js";const w=l({clusterCount:8,nodesPerCluster:20,edgeDensity:.2}),d=c(w),_=w.levels[0],b=n(d,_.edges,a(d)),K={title:"Hex/Primitives/RoutedEdges",component:O,parameters:{layout:"centered"},decorators:[L=>g.jsx("div",{style:{position:"relative",width:900,height:700,background:"#0f172a"},children:g.jsx(L,{})})],args:{edges:b,hoveredId:null,width:900,height:700,offsetX:450,offsetY:350}},e={};var p;const s={args:{hoveredId:((p=d[0])==null?void 0:p.id)??null}},r={args:{edges:[],hoveredId:null}},H=l({clusterCount:3,nodesPerCluster:5,edgeDensity:.05,interClusterDensity:.5}),u=c(H),G=H.levels[0],M=n(u,G.edges,a(u)),o={args:{edges:M.slice(0,1),hoveredId:null}},k=l({clusterCount:12,nodesPerCluster:10,edgeDensity:.4,interClusterDensity:.8}),i=c(k),X=k.levels[0],Y=n(i,X.edges,a(i)),t={args:{edges:Y,hoveredId:null}};var m,v,h;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:"{}",...(h=(v=e.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var E,f,y;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    hoveredId: nodes[0]?.id ?? null
  }
}`,...(y=(f=s.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var C,D,I;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    edges: [],
    hoveredId: null
  }
}`,...(I=(D=r.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var x,P,S;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    edges: sparseEdges.slice(0, 1),
    hoveredId: null
  }
}`,...(S=(P=o.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};var j,N,R;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    edges: denseEdges,
    hoveredId: null
  }
}`,...(R=(N=t.parameters)==null?void 0:N.docs)==null?void 0:R.source}}};const Q=["Default","HoverConnected","NoEdges","SingleEdge","DenseEdges"];export{e as Default,t as DenseEdges,s as HoverConnected,r as NoEdges,o as SingleEdge,Q as __namedExportsOrder,K as default};
