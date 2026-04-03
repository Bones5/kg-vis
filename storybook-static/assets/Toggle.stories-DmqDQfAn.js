import{j as s}from"./jsx-runtime-DkoXifhC.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";function u({checked:h,onChange:k,label:o}){return s.jsxs("label",{className:"toggle",children:[s.jsx("input",{type:"checkbox",checked:h,onChange:b=>k(b.target.checked)}),o&&s.jsx("span",{children:o})]})}u.__docgenInfo={description:"",methods:[],displayName:"Toggle",props:{checked:{required:!0,tsType:{name:"boolean"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(checked: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"checked"}],return:{name:"void"}}},description:""},label:{required:!1,tsType:{name:"string"},description:""}}};const S={title:"Shared/Toggle",component:u,parameters:{layout:"centered"},args:{checked:!1,onChange:()=>{}}},e={},r={args:{checked:!0}},a={args:{label:"Show edges"}};var t,n,c;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:"{}",...(c=(n=e.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var d,i,p;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};var m,g,l;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Show edges"
  }
}`,...(l=(g=a.parameters)==null?void 0:g.docs)==null?void 0:l.source}}};const T=["Unchecked","Checked","WithLabel"];export{r as Checked,e as Unchecked,a as WithLabel,T as __namedExportsOrder,S as default};
