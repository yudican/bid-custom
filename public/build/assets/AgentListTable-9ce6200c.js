import{j as e,T as g,n as x,S as b,a as k}from"./app-eabe49db.js";import{s as I,M as p,a as h,b as C,c as N}from"./index-c0933b60.js";const v=I(()=>e(p,{style:{cursor:"grab",color:"#999"}})),f=[{title:"Sort",dataIndex:"sort",width:30,className:"drag-visible"},{title:"Nama",dataIndex:"nama",className:"drag-visible",key:"nama"},{title:"Telepon",dataIndex:"telepon",key:"telepon"},{title:"Alamat",dataIndex:"alamat",key:"alamat"},{title:"Libur",dataIndex:"libur",key:"libur"},{title:"Active",dataIndex:"active",key:"active"}],B=[{title:"No.",dataIndex:"no",key:"no",render:(a,t,n)=>a+1},{title:"Status",dataIndex:"status_agent",key:"status_agent"},{title:"Nama",dataIndex:"nama",className:"drag-visible",key:"nama"},{title:"Telepon",dataIndex:"telepon",key:"telepon"},{title:"Alamat",dataIndex:"alamat",key:"alamat"}],E=[{title:"Nama Domain",dataIndex:"name",key:"name"},{title:"Icon",dataIndex:"icon_url",key:"icon_url",render:a=>e("img",{src:a,style:{height:30},alt:"icon"})},{title:"Url",dataIndex:"url",key:"url"},{title:"Status",dataIndex:"status",key:"status"},{title:"Aksi",dataIndex:"id",key:"id"}],H=[{title:"No.",dataIndex:"id",key:"id",render:(a,t,n)=>n+1},{title:"Nama Provinsi",dataIndex:"nama",key:"nama"}],K=[{title:"No.",dataIndex:"id",key:"id",render:(a,t,n)=>n+1},{title:"Nama Kota/Kabupaten",dataIndex:"nama",key:"nama"}],D=h(a=>e("tr",{...a})),w=C(a=>e("tbody",{...a})),M=({dataSource:a,handleChangeCell:t,loading:n=!1,refetch:s,columns:i=f})=>{const m=i.map(l=>({...l,onCell:d=>({record:d,dataIndex:l.dataIndex,handleChange:r=>t(r)})})),u=({oldIndex:l,newIndex:d})=>{if(l!==d){const r=N(a.slice(),l,d).filter(o=>!!o);console.log("Sorted items: ",r);const c=r.map((o,y)=>({value:y+1,key:o.key}));console.log(c,"sorted"),k.post("/api/agent/re-order",{data:c}).then(o=>{s()})}};return e(g,{components:{body:{cell:A,wrapper:l=>e(w,{useDragHandle:!0,disableAutoscroll:!0,helperClass:"row-dragging",onSortEnd:u,...l}),row:({className:l,style:d,...r})=>{const c=a.findIndex(o=>o.index===r["data-row-key"]);return e(D,{index:c,...r})}}},loading:n,columns:m,dataSource:a,rowKey:"index",pagination:!1,scroll:{x:"max-content"},tableLayout:"auto"})},A=a=>{const{dataIndex:t,handleChange:n,record:s,className:i}=a;return s?x(t,["status_agent","libur","active"])?e("td",{children:e(b,{checked:s[t],onChange:m=>n({value:m,dataIndex:t,key:s.key})})}):t==="sort"?e("td",{className:i,children:e(v,{})}):e("td",{className:i,children:s[t]}):e("td",{colSpan:6,className:"text-center",children:"Tidak Ada Data"})};export{M as A,H as a,K as b,B as c,E as d};
