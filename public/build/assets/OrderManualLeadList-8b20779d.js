import{r as n,b as s,j as e,ao as Z,ap as ee,M as te,aY as j,ah as o,aq as ae,a as G,u as le,bd as ne,d as K,at as se,P as re,L as oe,I as ce,C as ue,o as de,T as ie,p as he,q as me,ak as pe,b4 as fe,t as q}from"./app-884cb360.js";import{s as z,d as B,o as ge}from"./config-ca86f424.js";const{RangePicker:be}=ae,Se=({handleOk:y})=>{var T,_;const N=JSON.parse(localStorage.getItem("user_data")),[F,g]=n.useState(!1),[m,S]=n.useState(!1),[k,L]=n.useState([]),[D,x]=n.useState([]),[P,M]=n.useState([]),[c,p]=n.useState({contact:null,sales:null,status:null,created_at:null,print_status:null,resi_status:null}),[E,I]=n.useState([]),Y=()=>{G.get("/api/master/top").then(t=>{I(t.data.data)})},R=()=>{g(!0)},C=()=>{G.get("/api/master/role").then(t=>{L(t.data.data)})},v=()=>{z(null).then(t=>{const r=t.map(d=>({label:d.nama,value:d.id}));x(r)})},w=()=>{B(null).then(t=>{const r=t.map(d=>({label:d.nama,value:d.id}));M(r)})},i=async t=>z(t).then(r=>r.map(f=>({label:f.nama,value:f.id}))),O=async t=>B(t).then(r=>r.map(f=>({label:f.nama,value:f.id})));n.useEffect(()=>{C(),Y(),v(),w()},[]);const $=()=>{g(!1),S(!1),p({contact:null,sales:null,status:null,created_at:null,print_status:null,resi_status:null})},u=(t,r)=>{if(r==="createdBy")return p({...c,createdBy:t.value});p({...c,[r]:t})};return s("div",{children:[m?s("button",{onClick:()=>R(),className:"text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center",children:[e(Z,{}),e("span",{className:"ml-2",children:"Show Filter"})]}):s("button",{onClick:()=>R(),className:" bg-white border  text-blue-700 hover:text-blue-700/90 delay-100 ease-in-out focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg  text-sm px-4 py-2 text-center inline-flex items-center ",children:[e(ee,{}),e("span",{className:"ml-2",children:"Filter"})]}),e(te,{title:"Filter",open:F,onOk:()=>{y(c),S(!0),g(!1)},cancelText:m?"Clear Filter":"Cancel",onCancel:m?()=>{g(!1),S(!1),p({contact:null,sales:null,status:null,created_at:null,print_status:null,resi_status:null}),y({})}:$,okText:"Apply Filter",children:s("div",{children:[s("div",{children:[e("label",{htmlFor:"",children:"Contact"}),e(j,{defaultOptions:D,showSearch:!0,placeholder:"Cari Contact",fetchOptions:i,filterOption:!1,className:"w-full mb-2",onChange:t=>u(t,"contact"),value:(T=c==null?void 0:c.contact)==null?void 0:T.value})]}),s("div",{children:[e("label",{htmlFor:"",children:"Sales"}),e(j,{defaultOptions:k==="sales"?[{label:N.name,value:N.id}]:P,showSearch:!0,placeholder:"Cari Sales",fetchOptions:O,filterOption:!1,className:"w-full mb-2",onChange:t=>u(t,"sales"),value:(_=c==null?void 0:c.sales)==null?void 0:_.value})]}),s("div",{children:[e("label",{htmlFor:"",children:"Status"}),s(o,{mode:"multiple",allowClear:!0,className:"w-full mb-2",placeholder:"Select Status",onChange:t=>u(t,"status"),children:[e(o.Option,{value:-1,children:"Draft"}),e(o.Option,{value:1,children:"New"}),e(o.Option,{value:2,children:"Open"}),e(o.Option,{value:3,children:"Closed"}),e(o.Option,{value:4,children:"Canceled"})]})]}),s("div",{className:"mb-2",children:[e("label",{htmlFor:"",children:"Tanggal"}),e(be,{className:"w-full",format:"YYYY-MM-DD",onChange:(t,r)=>u(r,"created_at")})]}),s("div",{children:[e("label",{htmlFor:"",children:"Payment Term"}),e(o,{mode:"multiple",allowClear:!0,className:"w-full mb-2",placeholder:"Select Payment Term",onChange:t=>u(t,"payment_term"),children:E.map(t=>e(o.Option,{value:t.id,children:t.name},t.id))})]}),s("div",{children:[e("label",{htmlFor:"",children:"Status Print"}),s(o,{allowClear:!0,className:"w-full mb-2",placeholder:"Select Status Print",onChange:t=>u(t,"print_status"),children:[e(o.Option,{value:"printed",children:"Printed"}),e(o.Option,{value:"not yet",children:"Not Yet"})]})]}),s("div",{children:[e("label",{htmlFor:"",children:"Resi Sudah Diinput"}),s(o,{allowClear:!0,className:"w-full mb-2",placeholder:"Select Resi Sudah Diinput",onChange:t=>u(t,"resi_status"),children:[e(o.Option,{value:"done",children:"Done"}),e(o.Option,{value:"not yet",children:"Not Yet"})]})]})]})})]})},ve=()=>{const y=le(),[N,F]=n.useState(!1),[g,m]=n.useState(!1),[S,k]=n.useState([]),[L,D]=n.useState(0),[x,P]=n.useState(""),[M,c]=n.useState(!1),[p,E]=n.useState(1),[I,Y]=n.useState({}),[R,C]=n.useState(!1),[v,w]=n.useState([]),[i,O]=n.useState(!1),[$,u]=n.useState(!1),b=(l="/api/order-manual",h=10,J={page:p})=>{F(!0),axios.post(l,{perpage:h,type:"manual",account_id:me("account_id"),...J}).then(H=>{const{data:Q,total:V,current_page:W}=H.data.data;D(V),E(W);const X=Q.map(a=>({id:a.uid_lead,title:a.title,contact:(a==null?void 0:a.contact_name)||"-",sales:(a==null?void 0:a.sales_name)||"-",created_by:(a==null?void 0:a.created_by_name)||"-",created_on:a==null?void 0:a.created_at,amount_total:`Rp ${pe(a==null?void 0:a.amount)}`,payment_term:(a==null?void 0:a.payment_term_name)||"-",status:fe(a==null?void 0:a.status),status_submit:a==null?void 0:a.status_submit,print_status:a==null?void 0:a.print_status,resi_status:a==null?void 0:a.resi_status}));k(X),F(!1)})};n.useEffect(()=>{b()},[]);const T=(l,h=10)=>{b(`/api/order-manual/?page=${l}`,h,{search:x,page:l,...I})},_=()=>{c(!0),b("/api/order-manual",10,{search:x})},t=l=>{Y(l),b("/api/order-manual",10,l)},r=()=>{m(!0),axios.get("/api/order-manual/uid/get").then(l=>(m(!1),y("/order/manual/order-lead/form/"+l.data.data))).catch(l=>m(!1))},d=()=>{C(!0),axios.post("/api/order-manual/export/detail/1").then(l=>{const{data:h}=l.data;window.open(h),C(!1)}).catch(l=>C(!1))},f=l=>{u(!0),axios.post("/api/order/order-lead/submit",{ids:v,type:"order-manual",...l}).then(h=>{h.data,q.success("Order Lead berhasil di submit"),O(!1),w([]),u(!1)}).catch(h=>{u(!1),q.error("Error submitting order lead")})},U={selectedRowKeys:v,onChange:l=>w(l),getCheckboxProps:l=>({disabled:l.status!=="Closed"})},A=s("div",{className:"flex justify-between items-center",children:[v.length>0&&e(ne,{handleSubmit:l=>f(l)}),e("button",{onClick:()=>i?(w([]),O(!1)):O(!0),className:`text-white bg-${i?"red":"blue"}-700 hover:bg-${i?"red":"blue"}-800 focus:ring-4 focus:outline-none focus:ring-${i?"red":"blue"}-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2`,children:e("span",{className:"ml-2",children:i?"Cancel Submit":"Ready To Submit"})}),e(Se,{handleOk:t}),s("button",{className:"ml-3 text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2",onClick:()=>d(),children:[R?e(K,{}):e(se,{}),e("span",{className:"ml-2",children:"Export"})]}),s("button",{onClick:()=>r(),className:"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2",children:[g?e(K,{}):e(re,{}),e("span",{className:"ml-2",children:"Tambah Order"})]})]});return s(oe,{rightContent:A,title:"List Order Manual",children:[s("div",{className:"row mb-4",children:[e("div",{className:"col-md-12"}),e("div",{className:"col-md-4 col-sm-6 col-12",children:e(ce,{placeholder:"Cari disini",size:"large",className:"rounded",onPressEnter:()=>_(),suffix:M?e(ue,{onClick:()=>{b(),P(null),c(!1)}}):e(de,{onClick:()=>_()}),value:x,onChange:l=>P(l.target.value)})}),e("div",{className:"col-md-8",children:s("strong",{className:"float-right mt-3 text-red-400",children:["Total Data: ",L]})})]}),e(ie,{dataSource:S,columns:ge,loading:N,pagination:!1,rowKey:"id",scroll:{x:"max-content"},tableLayout:"auto",rowSelection:i?U:null}),e(he,{defaultCurrent:1,current:p,total:L,className:"mt-4 text-center",onChange:T,pageSizeOptions:["10","20","50","100","200","500"]})]})};export{ve as default};