import{j as t}from"./jsx-runtime-DkoXifhC.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";function j({min:q,max:T,value:E,onChange:L,label:o}){return t.jsxs("label",{className:"slider",children:[o&&t.jsx("span",{children:o}),t.jsx("input",{type:"range",min:q,max:T,value:E,onChange:M=>L(Number(M.target.value))})]})}j.__docgenInfo={description:"",methods:[],displayName:"Slider",props:{min:{required:!0,tsType:{name:"number"},description:""},max:{required:!0,tsType:{name:"number"},description:""},value:{required:!0,tsType:{name:"number"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: number) => void",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"void"}}},description:""},label:{required:!1,tsType:{name:"string"},description:""}}};const C={title:"Shared/Slider",component:j,parameters:{layout:"centered"},args:{min:0,max:100,value:50,onChange:()=>{}}},e={},r={args:{value:0}},a={args:{value:100}},s={args:{label:"Edge density"}},n={args:{label:void 0}};var i,u,c;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:"{}",...(c=(u=e.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};var m,d,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    value: 0
  }
}`,...(p=(d=r.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var l,g,b;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    value: 100
  }
}`,...(b=(g=a.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var v,y,h;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    label: "Edge density"
  }
}`,...(h=(y=s.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var x,f,S;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: undefined
  }
}`,...(S=(f=n.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};const N=["Default","MinValue","MaxValue","WithLabel","WithoutLabel"];export{e as Default,a as MaxValue,r as MinValue,s as WithLabel,n as WithoutLabel,N as __namedExportsOrder,C as default};
