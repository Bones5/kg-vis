import{M as h}from"./Minimap-CGMGpDwR.js";import{l as d,g as c}from"./mockGraph-bn9x33XF.js";import"./jsx-runtime-DkoXifhC.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";const k=c({clusterCount:8,nodesPerCluster:20,edgeDensity:.2}),n=d(k).map(e=>({...e,px:e.px+450,py:e.py+350}));var p;const B={title:"Hex/Primitives/Minimap",component:h,parameters:{layout:"centered"},args:{nodes:n,activeClusterId:((p=n[0])==null?void 0:p.id)??null,onNavigate:()=>{}}},s={};var u;const r={args:{activeClusterId:((u=n[2])==null?void 0:u.id)??null}},a={args:{nodes:[],activeClusterId:null}},w=c({clusterCount:1,nodesPerCluster:5,edgeDensity:.2}),l=d(w).map(e=>({...e,px:e.px+450,py:e.py+350}));var m;const t={args:{nodes:l,activeClusterId:((m=l[0])==null?void 0:m.id)??null}},G=c({clusterCount:50,nodesPerCluster:2,edgeDensity:.1}),i=d(G).map(e=>({...e,px:e.px+450,py:e.py+350}));var g;const o={args:{nodes:i,activeClusterId:((g=i[0])==null?void 0:g.id)??null}};var y,C,v;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:"{}",...(v=(C=s.parameters)==null?void 0:C.docs)==null?void 0:v.source}}};var N,f,x;r.parameters={...r.parameters,docs:{...(N=r.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    activeClusterId: nodes[2]?.id ?? null
  }
}`,...(x=(f=r.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var I,D,S;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    nodes: [],
    activeClusterId: null
  }
}`,...(S=(D=a.parameters)==null?void 0:D.docs)==null?void 0:S.source}}};var M,P,E;t.parameters={...t.parameters,docs:{...(M=t.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    nodes: singleNodes,
    activeClusterId: singleNodes[0]?.id ?? null
  }
}`,...(E=(P=t.parameters)==null?void 0:P.docs)==null?void 0:E.source}}};var A,O,_;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    nodes: manyNodes,
    activeClusterId: manyNodes[0]?.id ?? null
  }
}`,...(_=(O=o.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};const F=["Default","DifferentActiveCluster","Empty","SingleNode","ManyNodes"];export{s as Default,r as DifferentActiveCluster,a as Empty,o as ManyNodes,t as SingleNode,F as __namedExportsOrder,B as default};
