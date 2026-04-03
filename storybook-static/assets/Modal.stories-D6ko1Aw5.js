import{j as e}from"./jsx-runtime-DkoXifhC.js";import"./iframe-DDZWOFbJ.js";import"./preload-helper-C1FmrZbK.js";function b({open:i,onClose:r,children:N,title:d}){return i?e.jsx("div",{className:"modal-backdrop",onClick:r,children:e.jsxs("div",{className:"modal",onClick:q=>q.stopPropagation(),children:[d&&e.jsx("h2",{className:"modal-title",children:d}),e.jsx("button",{className:"modal-close",onClick:r,children:"✕"}),e.jsx("div",{className:"modal-body",children:N})]})}):null}b.__docgenInfo={description:"",methods:[],displayName:"Modal",props:{open:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};const k={title:"Shared/Modal",component:b,parameters:{layout:"fullscreen"},args:{open:!0,onClose:()=>{},children:e.jsx("p",{style:{color:"#e2e8f0"},children:"Modal body content"})}},o={args:{title:"Example Modal"}},t={args:{open:!1}},a={args:{title:"Settings"}},s={},n={args:{title:"Long Content",children:e.jsx("div",{style:{color:"#e2e8f0"},children:Array.from({length:20},(i,r)=>e.jsxs("p",{children:["Paragraph ",r+1,": Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]},r))})}};var l,c,p;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    title: "Example Modal"
  }
}`,...(p=(c=o.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var m,u,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    open: false
  }
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,f,y;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    title: "Settings"
  }
}`,...(y=(f=a.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var x,j,C;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:"{}",...(C=(j=s.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var S,v,T;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    title: "Long Content",
    children: <div style={{
      color: "#e2e8f0"
    }}>
        {Array.from({
        length: 20
      }, (_, i) => <p key={i}>
            Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>)}
      </div>
  }
}`,...(T=(v=n.parameters)==null?void 0:v.docs)==null?void 0:T.source}}};const E=["Open","Closed","WithTitle","WithoutTitle","LongContent"];export{t as Closed,n as LongContent,o as Open,a as WithTitle,s as WithoutTitle,E as __namedExportsOrder,k as default};
