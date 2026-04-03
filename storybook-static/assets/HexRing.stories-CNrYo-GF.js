import{j as n}from"./jsx-runtime-DkoXifhC.js";import{H}from"./HexRing-RgWn-6NE.js";import{g as e}from"./mockGraph-bn9x33XF.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";import"./RoutedEdges-fuh6ZXRd.js";import"./colors-DWNEdmMT.js";import"./HexPill-ub8uhkoV.js";const j=e({clusterCount:8,nodesPerCluster:40,edgeDensity:.25});var i;const R=((i=j.levels[0].nodes[0])==null?void 0:i.id)??"C1",B={title:"Hex/Composed/HexRing",component:H,parameters:{layout:"centered"},decorators:[k=>n.jsx("div",{style:{background:"#0f172a",padding:8},children:n.jsx(k,{})})],args:{centerId:R,payload:j,onClusterClick:()=>{}}},r={},s={args:{payload:e({clusterCount:50,nodesPerCluster:20,edgeDensity:.2})}},d=e({clusterCount:3,nodesPerCluster:10,edgeDensity:.2,interClusterDensity:.3});var p;const o={args:{payload:d,centerId:((p=d.levels[0].nodes[0])==null?void 0:p.id)??"C1"}},l=e({clusterCount:5,nodesPerCluster:15,edgeDensity:.2,interClusterDensity:.5});var u;const a={args:{payload:l,centerId:((u=l.levels[0].nodes[0])==null?void 0:u.id)??"C1"}},c=e({clusterCount:12,nodesPerCluster:20,edgeDensity:.25,interClusterDensity:.6});var g;const t={args:{payload:c,centerId:((g=c.levels[0].nodes[0])==null?void 0:g.id)??"C1"}};var m,y,C;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:"{}",...(C=(y=r.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var f,v,P;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    payload: generateMockGraph({
      clusterCount: 50,
      nodesPerCluster: 20,
      edgeDensity: 0.2
    })
  }
}`,...(P=(v=s.parameters)==null?void 0:v.docs)==null?void 0:P.source}}};var w,b,D;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    payload: singleNeighborPayload,
    centerId: singleNeighborPayload.levels["0"].nodes[0]?.id ?? "C1"
  }
}`,...(D=(b=o.parameters)==null?void 0:b.docs)==null?void 0:D.source}}};var h,x,N;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    payload: fewPayload,
    centerId: fewPayload.levels["0"].nodes[0]?.id ?? "C1"
  }
}`,...(N=(x=a.parameters)==null?void 0:x.docs)==null?void 0:N.source}}};var S,O,I;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    payload: noOverflowPayload,
    centerId: noOverflowPayload.levels["0"].nodes[0]?.id ?? "C1"
  }
}`,...(I=(O=t.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};const J=["Default","OverflowStubs","SingleNeighbor","FewNeighbors","NoOverflow"];export{r as Default,a as FewNeighbors,t as NoOverflow,s as OverflowStubs,o as SingleNeighbor,J as __namedExportsOrder,B as default};
