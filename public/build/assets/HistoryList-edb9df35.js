import{u as D,r as e,b as c,L as T,j as n,T as _,p as b,a as j}from"./app-28883065.js";import{M as A,B as F}from"./ModalFilterTransaction-cf9b6d55.js";import{H}from"./config-1ad264ac.js";const R=()=>{D();const[l,o]=e.useState(!1),[d,u]=e.useState([]),[m,g]=e.useState(0),[h,p]=e.useState(1),[M,f]=e.useState({}),[r,C]=e.useState([]),i=(t="/api/historyAgent",s=10)=>{o(!0),j.post(t,{perpage:s}).then(S=>{const{data:y,total:x,current_page:w}=S.data.data;g(x),p(w);const L=y.map((a,k)=>({key:a.id,id:k+1,name:a.user.name,id_transaksi:a.id_transaksi,created_at:moment(a.created_at).format("DD-MM-YYYY"),nominal:a.nominal}));u(L),o(!1)})};return e.useEffect(()=>{i()},[]),c(T,{rightContent:c("div",{className:"flex justify-between items-center",children:[n(A,{handleOk:t=>{f(t),loadData("/api/transAgent",10,t)}}),n(F,{selectedRowKeys:r})]}),title:"Transaction Agent - History",children:[n(_,{dataSource:d,columns:H,loading:l,pagination:!1,rowKey:"id",rowSelection:{selectedRowKeys:r,onChange:t=>{C(t)}},scroll:{x:"max-content"},tableLayout:"auto"}),n(b,{defaultCurrent:1,current:h,total:m,className:"mt-4 text-center",onChange:(t,s=10)=>{i(`/api/contact/?page=${t}`,s)},pageSizeOptions:["10","20","50","100","200","500"]})]})};export{R as default};