import{r as t,b as i,j as e,am as oe,M as V,ag as C,b4 as me,u as de,F as l,s as ce,L as pe,an as H,I as r,b5 as $,ah as s,aq as ue,U as he,d as X,P as ye,c as be,a as b,as as ge,b6 as _e,a$ as m,g as fe,t as u}from"./app-dfe09891.js";const Ne=({checked:g,data:c,onDisabled:d})=>{const[T,_]=t.useState(!1),[k,I]=t.useState(!1),[p,f]=t.useState(!1),h=t.useRef();return console.log(h.current,"modalref"),i("div",{children:[e(oe,{checked:g,className:"mb-2",onChange:S=>g?f(!0):_(!0),children:g?e("span",{className:"text-danger",children:"Matikan Notifikasi Telegram"}):e("span",{className:"text-primary",children:"Beri Saya Notifikasi Telegram"})}),e(V,{open:T,title:"Tautkan Telegram",width:700,footer:null,onCancel:()=>_(!1),children:i("div",{ref:h,children:[e("p",{children:"Berikut adalah cara untuk menautkan akun telegram anda, untuk mendapatkan realtime notifikasi."}),i("ol",{children:[i("li",{className:"mb-4",children:["1. Klik Tombol"," ",e("span",{onClick:()=>{h.current&&(h.current.scrollIntoView({behavior:"smooth",block:"end"}),setTimeout(()=>{I(!0),setTimeout(()=>{I(!1),h.current.scrollIntoView({behavior:"smooth",block:"start"})},1500)},500))},className:"text-primary cursor-pointer",children:"Tautkan sekarang"})," ","dibagian bawah atau"," ",e("a",{href:"https://t.me/momsy_bot",target:"_blank",className:"text-primary",children:"Klik Disini"})]}),i("li",{className:"mb-4",children:[e("p",{children:"2. Setelah Masuk Ke Chat Kemudian Klik Start"}),e("img",{src:"https://i.ibb.co/6NhXjWP/Screenshot-2023-07-04-at-11-31-44.png",alt:"",className:"h-52 rounded-md mx-auto"})]}),i("li",{className:"mb-4",children:[i("p",{children:[" ","3. Selanjutnya Masukkan dan Kirim Kode Berikut Di Dalam Chat"," ",e("span",{className:"text-primary",children:c==null?void 0:c.uid})]}),e("img",{src:"https://i.ibb.co/JrKrMpK/Screenshot-2023-07-04-at-12-18-55.png",alt:"",className:"h-52 rounded-md mx-auto"})]}),i("li",{className:"mb-4",children:[e("p",{children:"4. Setelah Langkah-Langkah Diatas Selesai, anda akan mendapatkan balasan bahwa penyiapan akun notifikasi telah selesai."}),e("img",{src:"https://i.ibb.co/SRJFSGt/Screenshot-2023-07-04-at-12-21-17.png",alt:"",className:"h-52 rounded-md mx-auto"})]})]}),i("div",{className:"flex justify-end pt-3 border-t-[1px]",children:[e(C,{className:"mr-3",onClick:()=>{_(!1)},children:"Tutup"}),e(me,{placement:"topLeft",open:k,content:e("div",{children:e("p",{children:"Klik disini untuk menautkan"})}),children:e(C,{onClick:()=>{window.open("https://t.me/momsy_bot")},type:"primary",children:"Tautkan Sekarang"})})]})]})}),e(V,{title:"Matikan Notifikasi Telegram",open:p,onOk:()=>{f(!1),d()},cancelText:"Tutup",onCancel:()=>f(!1),okText:"Ya, Matikan",width:700,children:e("div",{children:e("p",{children:"Apakah Kamu Yakin Ingin Menonaktifkan notifikasi Telegram?"})})})]})},Pe=()=>{const g=de(),[c]=l.useForm(),d=ce();localStorage.getItem("role");const[T,_]=t.useState([]),[k,I]=t.useState([]),[p,f]=t.useState([]),[h,S]=t.useState([]),[ke,O]=t.useState(""),[v,z]=t.useState(null),[Q,K]=t.useState(null),[P,M]=t.useState({file_nib:!1}),[w,Z]=t.useState({file_nib:null}),[q,ee]=t.useState({file_nib:null}),ae=()=>{b.get("/api/master/brand").then(n=>{_(n.data.data)})},x=()=>{b.get(`/api/contact/detail/${d==null?void 0:d.user_id}`).then(n=>{var o,y,N,B,D,L,F,R,E,Y,U,j,W,J,A,G;const{data:a}=n.data;f(a),K((o=a==null?void 0:a.role)==null?void 0:o.role_type),c.setFieldsValue({...a,bod:ge(a.bod??new Date,"YYYY-MM-DD"),role_id:(y=a==null?void 0:a.role)==null?void 0:y.id,brand_id:_e(a==null?void 0:a.brands,"id"),company_name:m((N=a==null?void 0:a.company)==null?void 0:N.name),company_email:m((B=a==null?void 0:a.company)==null?void 0:B.email),company_telepon:m((D=a==null?void 0:a.company)==null?void 0:D.phone),business_entity:(F=(L=a==null?void 0:a.company)==null?void 0:L.business_entity)==null?void 0:F.id,owner_name:m((R=a==null?void 0:a.company)==null?void 0:R.owner_name),pic_name:m((E=a==null?void 0:a.company)==null?void 0:E.pic_name),owner_phone:m((Y=a==null?void 0:a.company)==null?void 0:Y.owner_phone),pic_phone:m((U=a==null?void 0:a.company)==null?void 0:U.pic_phone),company_address:m((j=a==null?void 0:a.company)==null?void 0:j.address),layer_type:m((W=a==null?void 0:a.company)==null?void 0:W.layer_type),npwp:m((J=a==null?void 0:a.company)==null?void 0:J.npwp),npwp_name:m((A=a==null?void 0:a.company)==null?void 0:A.npwp_name),nib:m((G=a==null?void 0:a.company)==null?void 0:G.nib)})})},ne=()=>{b.get("/api/master/bussiness-entity").then(n=>{S(n.data.data)})},le=()=>{b.get("/api/master/role").then(n=>{I(n.data.data)})},ie=({fileList:n,field:a})=>{const o=n.pop();M({...P,[a]:!0}),setTimeout(()=>{fe(o.originFileObj,y=>{M({...P,[a]:!1}),Z({...w,[a]:y})}),ee({...n,[a]:o.originFileObj})},1e3)};t.useEffect(()=>{x(),ae(),ne(),le()},[]);const se=n=>{let a=new FormData;q.file_nib&&a.append("file_nib",q.file_nib),d!=null&&d.user_id&&a.append("user_id",d==null?void 0:d.user_id),a.append("bod",n.bod.format("YYYY-MM-DD")),a.append("sales_channel",JSON.stringify(n.sales_channels)),a.append("name",n.name||null),a.append("uid",n.uid||null),a.append("telepon",n.telepon||null),a.append("email",n.email||null),a.append("gender",n.gender||null),a.append("brand_id",n.brand_id||null),a.append("role_id",n.role_id||null),a.append("layer_type",n.layer_type||null),a.append("company_name",n.company_name||null),a.append("company_email",n.company_email||null),a.append("npwp",n.npwp||null),a.append("npwp_name",n.npwp_name||null),a.append("company_telepon",n.company_telepon||null),a.append("business_entity",n.business_entity||null),a.append("owner_name",n.owner_name||null),a.append("owner_phone",n.owner_phone||null),a.append("nib",n.nib||null),a.append("pic_name",n.pic_name||null),a.append("pic_phone",n.pic_phone||null),a.append("company_address",n.company_address||null),v&&a.append("initialName",v),b.post("/api/contact/save-contact",a).then(o=>(O(o.data.message),u.success(o.data.message,{position:u.POSITION.TOP_RIGHT}),g("/contact/list"))).catch(o=>{const{message:y,type:N}=o.response.data;N==="company_email"&&c.setFields([{name:"company_email",errors:["company email has been registered"]}]),N==="company_name"&&c.setFields([{name:"company_name",errors:["company name has been registered"]}]),u.error(y,{position:u.POSITION.TOP_RIGHT})})},te=()=>{b.post("/api/contact/disabled-telegram",{user_id:p==null?void 0:p.id}).then(n=>(O(n.data.message),u.success(n.data.message,{position:u.POSITION.TOP_RIGHT}),x())).catch(n=>{const{message:a,type:o}=n.response.data;u.error(a,{position:u.POSITION.TOP_RIGHT})})},re=!!(p!=null&&p.telegram_chat_id);return e(pe,{title:"Tambah Contact Baru",href:"/contact/list",children:i(l,{form:c,name:"basic",layout:"vertical",onFinish:se,autoComplete:"off",children:[e(H,{title:"User Info",children:i("div",{className:"card-body row",children:[e("div",{className:"col-md-6",children:e(l.Item,{label:"Nama lengkap",name:"name",rules:[{required:!0,message:"Please input your nama lengkap!"}],children:e(r,{placeholder:"Ketik Nama Lengkap",onChange:n=>{const{value:a}=n.target;z($(a)),c.setFieldValue("uid",$(a)+"-23001")}})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"Customer Code",name:"uid",rules:[{required:!0,message:"Please input your Customer Code!"}],children:e(r,{placeholder:"Ketik Customer Code"})})}),i("div",{className:"col-md-6",children:[e(l.Item,{label:"Telepon",name:"telepon",rules:[{required:!0,message:"Please input your Telepon!"}],tooltip:"Untuk menggunakan notifikasi melalui telegram, anda perlu mendaftarkan nomor telepon anda ke telegram terlebih dahulu",className:"mb-2",children:e(r,{placeholder:"Ketik No Telepon"})}),e(Ne,{checked:re,data:p,onDisabled:()=>te()})]}),e("div",{className:"col-md-6",children:e(l.Item,{label:"Email",name:"email",rules:[{required:!0,message:"Please input your password!"}],children:e(r,{placeholder:"Ketik Email"})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"Jenis Kelamin",name:"gender",rules:[{required:!0,message:"Please input your Jenis Kelamin!"}],children:i(s,{placeholder:"Select Jenis Kelamin",children:[e(s.Option,{value:"Laki-Laki",children:"Laki-Laki"}),e(s.Option,{value:"Perempuan",children:"Perempuan"})]})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"Birth of Date",name:"bod",rules:[{required:!0,message:"Please input your Birth of Date!"}],children:e(ue,{className:"w-full"})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"Brand",name:"brand_id",rules:[{required:!0,message:"Please input your Brand!"}],children:e(s,{placeholder:"Select Brand",mode:"multiple",children:T.map(n=>e(s.Option,{value:n.id,children:n.name},n.id))})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"Role",name:"role_id",rules:[{required:!0,message:"Please input your Role!"}],children:e(s,{placeholder:"Select Role",onChange:n=>{const a=k.find(o=>o.id===n);K(a.role_type)},children:k.map(n=>e(s.Option,{value:n.id,children:n.role_name},n.id))})})}),Q==="agent"&&e("div",{className:"col-md-6",children:e(l.Item,{label:"Type Layer",name:"layer_type",rules:[{required:!0,message:"Please input your Type Layer!"}],children:i(s,{placeholder:"Select Type Layer",children:[e(s.Option,{value:"distributor",children:"Main Mitra"}),e(s.Option,{value:"sub-distributor",children:"Sub Mitra"})]})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"Sales Tag",name:"sales_channels",rules:[{required:!0,message:"Please input your Sales Channel!"}],children:i(s,{mode:"multiple",allowClear:!0,className:"w-full mb-2",placeholder:"Select Sales Channel",children:[e(s.Option,{value:"marketplace",children:"Marketplace"}),e(s.Option,{value:"toko-offline",children:"Toko Offline"}),e(s.Option,{value:"whatsapp",children:"Whatsapp"})]})})})]})}),e(H,{title:"Company Info",className:"mt-2",children:i("div",{className:"card-body row",children:[i("div",{className:"col-md-6",children:[e(l.Item,{label:"Company Name",name:"company_name",rules:[{required:!1,message:"Please input your Company Name!"}],children:e(r,{placeholder:"Ketik Company Name"})}),e(l.Item,{label:"Company Email",name:"company_email",rules:[{required:!1,message:"Please input your Company Email!"}],children:e(r,{placeholder:"Ketik Company Email"})})]}),i("div",{className:"col-md-6",children:[e(l.Item,{label:"No. NPWP",name:"npwp",rules:[{required:!1,message:"Please input your NPWP Number!"}],children:e(r,{placeholder:"Ketik No. NPWP"})}),e(l.Item,{label:"Nama NPWP",name:"npwp_name",children:e(r,{placeholder:"Ketik Nama NPWP"})})]}),i("div",{className:"col-md-6",children:[e(l.Item,{label:"Company Telepon",name:"company_telepon",rules:[{required:!1,message:"Please input your Company Telepon!"}],children:e(r,{placeholder:"Ketik Owner Name"})}),e(l.Item,{label:"Business Entity",name:"business_entity",children:e(s,{placeholder:"Select Business Entity",children:h.map(n=>e(s.Option,{value:n.id,children:n.title},n.id))})})]}),i("div",{className:"col-md-6",children:[e(l.Item,{label:"Owner Name",name:"owner_name",rules:[{required:!1,message:"Please input your Owner Name!"}],children:e(r,{placeholder:"Ketik Owner Name"})}),e(l.Item,{label:"Owner Telepon",name:"owner_phone",rules:[{required:!1,message:"Please input your Owner Telepon!"}],children:e(r,{placeholder:"Ketik Owner Telepon"})})]}),e("div",{className:"col-md-6",children:e(l.Item,{label:"NIB",name:"nib",children:e(r,{placeholder:"Ketik NIB"})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"file_nib",name:"file_nib",rules:[{required:!1,message:"Please input file_nib!"}],children:e(he,{name:"file_nib",listType:"picture-card",className:"avatar-uploader w-100",showUploadList:!1,multiple:!1,beforeUpload:()=>!1,onChange:n=>ie({...n,field:"file_nib"}),children:w.file_nib?P.file_nib?e(X,{}):e("img",{src:w.file_nib,alt:"avatar",style:{height:104}}):i("div",{style:{width:"100%"},children:[P.file_nib?e(X,{}):e(ye,{}),e("div",{style:{marginTop:8,width:"100%"},children:"Upload"})]})})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"PIC Name",name:"pic_name",rules:[{required:!1,message:"Please input your PIC Name!"}],children:e(r,{placeholder:"Ketik PIC Name"})})}),e("div",{className:"col-md-6",children:e(l.Item,{label:"PIC Telepon",name:"pic_phone",rules:[{required:!1,message:"Please input your PIC Telepon!"}],children:e(r,{placeholder:"Ketik PIC Telepon"})})}),e("div",{className:"col-md-12",children:e(l.Item,{label:"Company Address",name:"company_address",rules:[{required:!1,message:"Please input your Company Address!"}],children:e(be,{placeholder:"Ketik Company Address"})})}),e("div",{className:"col-md-12 ",children:e("div",{className:"float-right",children:e(l.Item,{children:e(C,{type:"primary",htmlType:"submit",children:"Save Contact"})})})})]})})]})})};export{Pe as default};
