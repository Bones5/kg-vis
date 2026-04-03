import{j as L}from"./jsx-runtime-DkoXifhC.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";function S({label:x,onClick:w,disabled:T,variant:q="primary"}){return L.jsx("button",{className:`btn btn-${q}`,onClick:w,disabled:T,children:x})}S.__docgenInfo={description:"",methods:[],displayName:"Button",props:{label:{required:!0,tsType:{name:"string"},description:""},onClick:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "ghost"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"ghost"'}]},description:"",defaultValue:{value:'"primary"',computed:!1}}}};const B={title:"Shared/Button",component:S,parameters:{layout:"centered"},args:{label:"Click me",onClick:()=>{}}},e={},r={args:{variant:"secondary"}},a={args:{variant:"ghost"}},s={args:{disabled:!0}},t={args:{label:"This is a button with an extremely long label that should test overflow behavior"}};var o,n,i;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(i=(n=e.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var c,l,d;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    variant: "secondary"
  }
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var m,u,p;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: "ghost"
  }
}`,...(p=(u=a.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var g,b,y;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...(y=(b=s.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var h,v,f;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "This is a button with an extremely long label that should test overflow behavior"
  }
}`,...(f=(v=t.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};const C=["Primary","Secondary","Ghost","Disabled","LongLabel"];export{s as Disabled,a as Ghost,t as LongLabel,e as Primary,r as Secondary,C as __namedExportsOrder,B as default};
