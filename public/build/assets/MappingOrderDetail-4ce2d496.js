import{u as w,s as S,r as a,j as e,L as p,bt as u,b as r,an as h,T as x,bu as L,bv as g,as as O,b7 as j,a as y}from"./app-eabe49db.js";const{Step:M}=g,P=()=>{w();const{id:k}=S(),[t,f]=a.useState(null),[n,D]=a.useState(null),[c,N]=a.useState([]),[T,l]=a.useState(!1),[_,o]=a.useState(!1),b=()=>{l(!0),y.get(`/api/mapping/order/detail/${k}`).then(s=>{const{data:i,tiktok:d}=s.data;l(!1),f(i),D(d==null?void 0:d.order_list[0]),v(i.tiktok_order_id)}).catch(()=>l(!1))},v=s=>{o(!0),y.get(`/api/mapping/order/track/${s}`).then(i=>{var m;const{data:d}=i.data;o(!1),N(((m=d[0])==null?void 0:m.tracking_info)??[])}).catch(()=>o(!1))};return a.useEffect(()=>{b()},[]),T?e(p,{title:"Order Detail",href:"/mapping/order",children:e("div",{className:"h-96 flex justify-center items-center",children:e(u,{})})}):r(p,{title:"Order Detail",href:"/mapping/order",children:[e(h,{title:"Data Detail",children:e("div",{className:"card-body row",children:e("div",{className:"col-md-12",children:e("table",{className:"w-100",style:{width:"100%"},children:r("tbody",{children:[r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"ID"})}),r("td",{children:[": ",(t==null?void 0:t.id)||"-"]})]}),r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"Order Tiktok ID"})}),r("td",{children:[": ",(t==null?void 0:t.tiktok_order_id)||"-"]})]}),r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"Buyer UID"})}),r("td",{children:[": ",(t==null?void 0:t.buyer_uid)||"-"]})]}),r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"Delivery Option Description"})}),r("td",{children:[": ",(t==null?void 0:t.delivery_option_description)||"-"]})]}),r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"Payment Method"})}),r("td",{children:[": ",(t==null?void 0:t.payment_method)||"-"]})]}),r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"Shipping Provide"})}),r("td",{children:[": ",(t==null?void 0:t.shipping_provider)||"-"]})]}),r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"Tracking Number"})}),r("td",{children:[": ",(t==null?void 0:t.tracking_number)||"-"]})]}),r("tr",{children:[e("td",{style:{width:"30%"},className:"py-2",children:e("strong",{children:"Warehouse Id"})}),r("td",{children:[": ",(t==null?void 0:t.warehouse_id)||"-"]})]})]})})})})}),e(h,{title:"Produk Detail",className:"mt-2",children:e(x,{dataSource:n==null?void 0:n.item_list,columns:L,pagination:!1})}),e(h,{title:"Riwayat Transaksi",className:"mt-2",children:_?e("div",{className:"h-96 flex justify-center items-center",children:e(u,{})}):e("div",{className:"mt-8",children:c&&c.length>0?e(g,{progressDot:!0,direction:"vertical",size:"small",current:0,children:c.map((s,i)=>e(M,{title:O(Number(s.update_time)).format("ddd, DD MMM YYYY - LT"),subTitle:s.description},i))}):e(j,{})})})]})};export{P as default};
