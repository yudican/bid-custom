import{r as d,b as u,j as e,I as F,M as ce,C as Ne,o as ee,T as ue,p as Oe,ah as h,v as Pe,P as we,bs as ke,be as Ie,u as Te,F as _,s as De,L as re,x as Le,an as le,aY as de,c as Fe,a as x,t as M}from"./app-884cb360.js";import{o as qe,a as Re}from"./config-6e30389c.js";const Ve=({handleSelected:m,url:s="/api/order-lead",type:p="b2b",form:o,getDueDate:n})=>{const[S,y]=d.useState(!1),[v,r]=d.useState([]),w=()=>{y(!0)},[O,D]=d.useState(!1),[i,q]=d.useState(0),[N,R]=d.useState(""),[z,W]=d.useState(!1),[K,U]=d.useState(1),V=(b,C=10,k={})=>{D(!0),axios.post(b,{perpage:C,...k}).then(j=>{const{data:I,total:X,current_page:$}=j.data.data;if(q(X),U($),p==="b2c"){const A=I.map(g=>{const G=(g==null?void 0:g.user)||"-";return{id:g.uid_lead,value:g.trx_id,label:G}});r(A)}else{const A=I.map(g=>{var E;const G=((E=g==null?void 0:g.contact_user)==null?void 0:E.name)||"-";return{id:g.uid_lead,value:g.order_number,label:G}});r(A)}D(!1)})},J=(b,C=10)=>{V(`${s}/?page=${b}`,C,{search:N})},L=()=>{W(!0),V(`${s}`,10,{search:N})},Y=b=>{axios.post("/api/order/sales-return/data-order",{order_number:b}).then(C=>{const{data:k}=C.data;console.log(k,o),o.setFieldsValue(k),n(k)})},Q=[{title:"Action",dataIndex:"label",key:"label",render:(b,C)=>{const I=o.getFieldValue("order_number")===C.value?"green":"blue";return e("button",{onClick:()=>{o.setFieldsValue({order_number:C.value}),y(!1),Y(C.value)},className:`text-white bg-${I}-700 hover:bg-${I}-800 focus:ring-4 focus:outline-none focus:ring-${I}-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`,children:e("span",{className:"ml-2",children:"Pilih"})})}}];return u("div",{children:[e(F.Search,{value:o.getFieldValue("order_number"),placeholder:"Input Order Number",onSearch:()=>{w(),V(s)}}),u(ce,{title:"Pilih Order Number",open:S,onOk:()=>{m(selectedValue)},cancelText:"Tutup",onCancel:()=>y(!1),width:1e3,okButtonProps:{style:{display:"none"}},children:[u("div",{className:"row mb-4",children:[e("div",{className:"col-md-12"}),e("div",{className:"col-md-4 col-sm-6 col-12",children:e(F,{placeholder:"Cari disini",size:"large",className:"rounded",onPressEnter:()=>L(),suffix:z?e(Ne,{onClick:()=>{V(s),R(null),W(!1)}}):e(ee,{onClick:()=>L()}),value:N,onChange:b=>R(b.target.value)})})]}),e(ue,{dataSource:v,columns:[...qe,...Q],loading:O,pagination:!1,rowKey:"id",scroll:{x:"max-content"},tableLayout:"auto"}),e(Oe,{defaultCurrent:1,current:K,total:i,className:"mt-4 text-center",onChange:J})]})]})},Be=({products:m=[],handleChange:s,handleClick:p,data:o=[],taxs:n=[],discounts:S=[],loading:y=!1})=>{const v=Re.map(r=>({...r,onCell:w=>({record:w,dataIndex:r.dataIndex,products:m,taxs:n,discounts:S,handleChange:O=>s(O),handleClick:O=>p(O)})}));return e("div",{children:e(ue,{components:{body:{cell:Me}},dataSource:o,columns:v,loading:y,pagination:!1,rowKey:"id",scroll:{x:"max-content"},tableLayout:"auto"})})},Me=m=>{const{dataIndex:s,handleChange:p,handleClick:o,record:n,products:S,taxs:y,discounts:v}=m;return s==="product_id"?e("td",{children:e($e,{products:S,handleChange:r=>p({value:r,dataIndex:s,key:n.id,uid_retur:n.uid_retur}),value:n==null?void 0:n.product_id})}):s==="tax_id"?e("td",{children:e(h,{placeholder:"Select Tax",value:n.tax_id,onChange:r=>p({value:r,dataIndex:s,key:n.id,uid_retur:n.uid_retur}),children:y.map(r=>e(h.Option,{value:r.id,children:r.tax_code},r.id))})}):s==="discount_id"?e("td",{children:e(h,{placeholder:"Select Discount",value:n.discount_id,onChange:r=>p({value:r,dataIndex:s,key:n.id,uid_retur:n.uid_retur}),children:v.map(r=>e(h.Option,{value:r.id,children:r.title},r.id))})}):s==="qty"?e("td",{children:u("div",{className:"input-group input-spinner mr-3",children:[e("button",{className:"btn btn-light btn-xs border",type:"button",onClick:()=>o({key:n.id,type:"remove-qty",uid_retur:n.uid_retur}),children:e("i",{className:"fas fa-minus"})}),e(F,{value:n[s],onChange:r=>r.target.value>-1?p({value:r.target.value,dataIndex:s,key:n.id,uid_retur:n.uid_retur}):null,style:{width:"100px"},controls:!1}),e("button",{className:"btn btn-light btn-xs border",type:"button",onClick:()=>o({key:n.id,type:"add-qty",uid_retur:n.uid_retur}),children:e("i",{className:"fas fa-plus"})})]})}):s==="action"?n.key>0?e("td",{children:e("button",{onClick:()=>o({key:n.id,type:"delete",uid_retur:n.uid_retur}),className:"text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center",children:e(Pe,{})})}):e("td",{children:e("button",{onClick:()=>o({key:n.id,type:"add",uid_retur:n.uid_retur}),className:"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center",children:e(we,{})})}):e("td",{children:e(F,{value:n[s],readOnly:!0})})},$e=({products:m,handleChange:s,value:p})=>{var D;const[o,n]=d.useState(!1),[S,y]=d.useState(null),[v,r]=d.useState(""),w=(D=m==null?void 0:m.find(i=>(i==null?void 0:i.id)===p))==null?void 0:D.name,O=m.filter(i=>i.name.toLowerCase().includes(v))||m;return u("div",{children:[e(ke,{title:w,children:u("div",{className:"w-96 flex items-center border py-1 px-2 rounded-sm line-clamp-1 cursor-pointer",onClick:()=>n(!0),children:[e(ee,{className:"mr-2"}),e("span",{children:p?w:"Select Product"})]})}),e(ce,{title:"List Product",open:o,cancelText:"Batal",okText:"Pilih",onOk:()=>{s(S),n(!1)},onCancel:()=>n(!1),width:900,children:u("div",{children:[e(F,{placeholder:"Cari produk disini..",size:"large",className:"rounded mb-4",suffix:e(ee,{}),value:v,onChange:i=>r(i.target.value)}),O.map(i=>{var q;return e("div",{className:`
                mb-4 shadow-none rounded-md p-2 cursor-pointer bg-white
                ${S==i.id?"border-[1px] border-blue-400 drop-shadow-md ring-blue-500":"border border-gray-400"}
              `,onClick:()=>{y(i.id)},children:u("div",{className:"flex max-w-[800px] justify-between items-center",children:[u("div",{className:"flex items-center",children:[e("img",{src:i.image_url,alt:"product_photo",className:"mr-4 w-20 h-20 rounded-md border"}),u("div",{children:[u("div",{className:"block text-lg line-clamp-1 font-medium max-w-2xl",children:[i.name," "]}),e("br",{}),u("div",{className:"block",children:["Tersedia di :"," ",(q=i==null?void 0:i.sales_channels)==null?void 0:q.map((N,R)=>e(Ie,{color:"lime",children:N},R))]})]})]}),u("div",{className:"block text-red-500",children:["Stock Tersedia: ",i.stock_off_market]})]})},i.id)})]})})]})},oe=m=>axios.post("/api/general/search-contact",{search:m}).then(s=>s.data.data),ie=m=>axios.post("/api/general/search-sales",{search:m}).then(s=>s.data.data),We=()=>{const m=Te(),s=JSON.parse(localStorage.getItem("user_data")),p=localStorage.getItem("role"),[o]=_.useForm(),{uid_return:n}=De(),S=[{product_id:null,price:null,qty:1,tax_id:null,discount_id:null,total:null,uid_retur:n,id:0,key:0}],[y,v]=d.useState([]),[r,w]=d.useState([]),[O,D]=d.useState([]),[i,q]=d.useState([]),[N,R]=d.useState("b2b"),[z,W]=d.useState([]),[K,U]=d.useState([]),[V,J]=d.useState([]),[L,Y]=d.useState(S),[Q,b]=d.useState(!1),[C,k]=d.useState([]),[j,I]=d.useState([]),[X,$]=d.useState(!1),A=()=>{x.get("/api/master/brand").then(t=>{D(t.data.data)})},g=()=>{x.get("/api/master/warehouse").then(t=>{v(t.data.data)})},G=()=>{x.get("/api/master/top").then(t=>{w(t.data.data)})},E=t=>{x.get("/api/general/address-user/"+t).then(l=>{q(l.data.data)})},me=t=>{x.get("/api/master/products").then(l=>{const{data:a}=l.data,c=a.map(f=>{const P=f.stock_warehouse&&f.stock_warehouse.length>0&&(f==null?void 0:f.stock_warehouse)||[],B=P==null?void 0:P.find(H=>H.id==t);return{...f,stock_off_market:(B==null?void 0:B.stock)||0}});console.log(c,"newData"),W(c)})},he=()=>{x.get("/api/master/taxs").then(t=>{U(t.data.data)})},pe=()=>{x.get("/api/master/discounts").then(t=>{J(t.data.data)})},Z=(t=!1)=>{$(!0),x.get("/api/order/sales-return/detail/"+n).then(l=>{var f,P,B,H,ne,se;const{data:a}=l.data,c={...a,contact:{label:(f=a==null?void 0:a.contact_user)==null?void 0:f.name,value:(P=a==null?void 0:a.contact_user)==null?void 0:P.id},sales:{label:(B=a==null?void 0:a.sales_user)==null?void 0:B.name,value:(H=a==null?void 0:a.sales_user)==null?void 0:H.id}};if(a!=null&&a.return_items&&((ne=a==null?void 0:a.return_items)==null?void 0:ne.length)>0){const Ce=(se=a==null?void 0:a.return_items)==null?void 0:se.map((T,ve)=>({product_id:T.product_id,price:T.price,qty:T.qty,tax_id:T.tax_id,discount_id:T.discount_id,total:T.total,uid_retur:T.uid_retur,id:T.id,key:ve}));Y(Ce)}t&&o.setFieldsValue(c),$(!1)}).catch(l=>$(!1))};d.useEffect(()=>{A(),g(),G(),he(),pe(),Z(!0),be(),ge()},[]);const be=()=>{oe(null).then(t=>{const l=t.map(a=>({label:a.nama,value:a.id}));k(l)})},ge=()=>{ie(null).then(t=>{const l=t.map(a=>({label:a.nama,value:a.id}));I(l)})},fe=async t=>oe(t).then(l=>l.map(c=>({label:c.nama,value:c.id}))),_e=async t=>ie(t).then(l=>l.map(c=>({label:c.nama,value:c.id}))),xe=({dataIndex:t,value:l,uid_retur:a,key:c})=>{const f=L.find(P=>P.id===c)||{};b(!0),x.post("/api/order/sales-return/product-items",{...f,[t]:l,uid_retur:a,key:c,item_id:c>0?c:null}).then(P=>{b(!1),Z()})},te=t=>{const l=t.type==="add"?S[0]:{};b(!0),x.post(`/api/order/sales-return/product-items/${t.type}`,{...t,...l,item_id:t.key}).then(a=>{const{message:c}=a.data;b(!1),M.success(c,{position:M.POSITION.TOP_RIGHT}),Z()})},Se=t=>{te({...t,newData:!1}),L.length===1&&L[0].id===0&&te({...t,newData:!0})},ae=(t={})=>{const l=o.getFieldValue("order_number")||(t==null?void 0:t.order_number),a=o.getFieldValue("payment_terms")||(t==null?void 0:t.payment_terms);x.post("/api/order/sales-return/due-date",{order_number:l,payment_terms:a}).then(c=>{const f=c.data;o.setFieldsValue({due_date:f.due_date})})},ye=t=>{x.post("/api/order/sales-return/save",{...t,uid_retur:n,contact:t.contact.value,sales:t.sales.value,account_id:getItem("account_id")}).then(l=>(M.success(l.data.message,{position:M.POSITION.TOP_RIGHT}),m("/order/sales-return"))).catch(l=>{const{message:a}=l.response.data;console.log(l.response,"err.response"),M.error(a,{position:M.POSITION.TOP_RIGHT})})};return X?e(re,{title:"Detail",href:"/order/sales-return",children:e(Le,{})}):u(re,{title:"Sales Return",href:"/order/sales-return",children:[e(_,{form:o,name:"basic",layout:"vertical",onFinish:ye,autoComplete:"off",children:e(le,{title:"Form Return",children:u("div",{className:"card-body row",children:[u("div",{className:"col-md-4",children:[e(_.Item,{label:"Type Order",name:"type",rules:[{required:!0,message:"Please input Type Order!"}],children:u(h,{placeholder:"Select Type Order",onChange:t=>{R(t)},children:[e(h.Option,{value:"b2b",children:"B2B"},"b2b"),e(h.Option,{value:"b2c",children:"B2C"},"b2c"),e(h.Option,{value:"manual",children:"Manual"},"manual")]})}),e(_.Item,{label:"Payment Term",name:"payment_terms",rules:[{required:!0,message:"Please input your Payment Term!"}],children:e(h,{placeholder:"Select Payment Term",onChange:t=>ae({payment_terms:t}),children:r.map(t=>e(h.Option,{value:t.id,children:t.name},t.id))})}),e(_.Item,{label:"Sales",name:"sales",rules:[{required:!0,message:"Please input Sales!"}],children:e(de,{defaultOptions:p==="sales"?[{label:s.name,value:s.id}]:j,showSearch:!0,placeholder:"Cari Sales",fetchOptions:_e,filterOption:!1,className:"w-full"})})]}),u("div",{className:"col-md-4",children:[N!=="manual"&&e(_.Item,{label:"Order Number",name:"order_number",rules:[{required:!0,message:"Please input Order Number!"}],children:e(Ve,{url:N==="b2c"?"/api/genie/order/list":"/api/order-lead",form:o,type:N,getDueDate:ae})}),N==="manual"&&e(_.Item,{label:"Order Number",name:"order_number",rules:[{required:!0,message:"Please input Order Number!"}],children:e(F,{})}),e(_.Item,{label:"Due Date",name:"due_date",children:e(F,{readOnly:!0})}),e(_.Item,{label:"Address",name:"address_id",children:e(h,{placeholder:"Select Address",children:i.map(t=>e(h.Option,{value:t.id,children:t.alamat_detail},t.id))})})]}),u("div",{className:"col-md-4",children:[e(_.Item,{label:"Brand",name:"brand_id",rules:[{required:!0,message:"Please input your Brand!"}],children:e(h,{placeholder:"Select Brand",children:O.map(t=>e(h.Option,{value:t.id,children:t.name},t.id))})}),e(_.Item,{label:"Contact",name:"contact",rules:[{required:!0,message:"Please input Contact!"}],children:e(de,{defaultOptions:C,showSearch:!0,placeholder:"Cari Contact",fetchOptions:fe,filterOption:!1,className:"w-full",onChange:t=>{E(t==null?void 0:t.value)}})}),e(_.Item,{label:"Warehouse",name:"warehouse_id",rules:[{required:!0,message:"Please input your Warehouse!"}],children:e(h,{placeholder:"Select Warehouse",onChange:t=>me(t),children:y.map(t=>e(h.Option,{value:t.id,children:t.name},t.id))})})]}),e("div",{className:"col-md-12",children:e(_.Item,{label:"Notes",name:"notes",children:e(Fe,{})})})]})})}),e(le,{title:"Detail Product",className:"mt-4",children:e(Be,{data:L,products:z,taxs:K,discounts:V,handleChange:xe,handleClick:Se,loading:Q})}),e("div",{className:"float-right mt-6",children:e("button",{onClick:()=>{o.submit()},className:"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center",children:e("span",{className:"ml-2",children:"Save Return"})})})]})};export{We as default};