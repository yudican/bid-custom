import{u as J,r as a,n as k,q as b,b as o,L as Q,j as e,I as U,C as V,o as W,T as X,p as Z,d as S,at as N,P as ee,D as te,f as p,h as ne,bi as ae,k as oe,v as se,bk as re,bl as ce,t as I}from"./app-b58c37d4.js";import{F as ie}from"./FilterModalProduct-61749018.js";const me=({type:s="received"})=>{const d=J(),[w,_]=a.useState([]),[O,i]=a.useState(!1);a.useState(!1);const[f,P]=a.useState(0),[u,g]=a.useState(""),[D,x]=a.useState(!1),[T,E]=a.useState(1),[L,F]=a.useState({}),[v,r]=a.useState(!1),c=(t="/api/inventory/product/stock",n=10,m={})=>{i(!0),axios.post(t,{perpage:n,account_id:b("account_id"),...m,inventory_type:s}).then(h=>{const{data:G,total:H,current_page:K}=h.data.data;P(H),E(K);const Y=G.map(l=>{var C;return{...l,received_by_name:((C=l==null?void 0:l.selected_po)==null?void 0:C.received_by_name)??"-"}});_(Y),i(!1)})},j=(t,n=10)=>{c(`/api/inventory/product/stock/?page=${t}`,n,{search:u,...L})},y=()=>{x(!0),c("/api/inventory/product/stock",10,{search:u})},A=t=>{F(t),c("/api/inventory/product/stock",10,t)},B=()=>{r(!0),axios.post("/api/inventory/product/stock/export_transfer").then(t=>{const{data:n}=t.data;window.open(n),r(!1)}).catch(t=>r(!1))},R=()=>{r(!0),axios.post("/api/inventory/product/stock/export_received").then(t=>{const{data:n}=t.data;window.open(n),r(!1)}).catch(t=>r(!1))};a.useEffect(()=>{c()},[]);const $=t=>{i(!0),axios.post(`/api/inventory/product/stock/cancel/${t}`).then(n=>{c(),I.success("Data Berhasil Disimpan",{position:I.POSITION.TOP_RIGHT}),i(!1)})},z=!k(b("role"),["adminsales","leadsales"])&&s==="transfer",M=o("div",{className:"flex justify-between items-center",children:[s==="received"&&o("button",{className:"ml-3 text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2",onClick:()=>R(),children:[v?e(S,{}):e(N,{}),e("span",{className:"ml-2",children:"Export"})]}),s==="transfer"&&o("button",{className:"ml-3 text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2",onClick:()=>B(),children:[v?e(S,{}):e(N,{}),e("span",{className:"ml-2",children:"Export"})]}),e(ie,{handleOk:t=>A(t),type:s}),z&&o("button",{onClick:()=>d("form"),className:"text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2",children:[e(ee,{}),e("span",{className:"ml-2",children:"Tambah Produk"})]})]}),q=[{title:"Action",key:"action",fixed:"right",width:100,render:(t,n)=>{const{inventory_status:m,uid_inventory:h}=n;return e(te.Button,{style:{left:-16},overlay:o(p,{itemIcon:e(ne,{}),children:[e(p.Item,{icon:e(ae,{}),onClick:()=>d(`detail/${h}`),children:"Detail"}),k(m,["received"])&&e(oe,{title:"Apaka anda yakin?",onConfirm:()=>$(n.id),okText:"Ya",cancelText:"Batal",children:e(p.Item,{icon:e(se,{}),children:"Cancel"})})]})})}}];return o(Q,{onClick:()=>d(-1),title:"List Inventory Product Transfer",rightContent:M,children:[o("div",{className:"row mb-4",children:[e("div",{className:"col-md-12"}),e("div",{className:"col-md-4 col-sm-6 col-12",children:e(U,{placeholder:"Cari disini",size:"large",className:"rounded",onPressEnter:()=>y(),suffix:D?e(V,{onClick:()=>{c(),g(null),x(!1)}}):e(W,{onClick:()=>y()}),value:u,onChange:t=>g(t.target.value)})}),e("div",{className:"col-md-8",children:o("strong",{className:"float-right mt-3 text-red-400",children:["Total Data: ",f]})})]}),e(X,{scroll:{x:"max-content"},tableLayout:"auto",dataSource:w,columns:[...s==="received"?re:ce,...q],loading:O,pagination:!1,rowKey:"id"}),e(Z,{defaultCurrent:1,current:T,total:f,className:"mt-4 text-center",onChange:j,pageSizeOptions:["10","20","50","100","200","500"]})]})};export{me as default};