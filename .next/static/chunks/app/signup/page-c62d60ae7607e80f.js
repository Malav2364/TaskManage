(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[879],{5792:(e,s,t)=>{Promise.resolve().then(t.bind(t,7567))},7567:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>o});var a=t(5155),n=t(2115),i=t(226),r=t(5695),l=t(3568);function o(){let[e,s]=(0,n.useState)(""),[t,o]=(0,n.useState)(""),[c,u]=(0,n.useState)(!1),d=(0,r.useRouter)(),p=async s=>{s.preventDefault(),u(!0);let a=l.Ay.loading("Creating your account...");try{let s=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),n=await s.json();s.ok?(l.Ay.dismiss(a),l.Ay.success("Account created successfully! Please sign in.",{duration:5e3,icon:"\uD83C\uDF89",style:{border:"1px solid #48BB78",padding:"16px"}}),d.push("/login")):(l.Ay.dismiss(a),l.Ay.error(n.error||"Registration failed",{duration:4e3,icon:"❌",style:{border:"1px solid #E53E3E",padding:"16px"}}))}catch(e){l.Ay.dismiss(a),l.Ay.error("An unexpected error occurred. Please try again.",{duration:4e3})}finally{u(!1)}};return(0,a.jsx)("div",{className:"flex h-screen items-center justify-center bg-gray-100",children:(0,a.jsxs)(i.P.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{duration:.5},className:"bg-white p-8 rounded-2xl shadow-lg w-96",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold text-center mb-4",children:"Sign Up"}),(0,a.jsxs)("form",{onSubmit:p,className:"space-y-4",children:[(0,a.jsx)("input",{type:"email",placeholder:"Email",value:e,onChange:e=>s(e.target.value),className:"w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,a.jsx)("input",{type:"password",placeholder:"Password",value:t,onChange:e=>o(e.target.value),className:"w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,a.jsx)("button",{type:"submit",className:"w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition",children:"Sign Up"})]}),(0,a.jsxs)("p",{className:"mt-4 text-center text-sm",children:["Already have an account? ",(0,a.jsx)("a",{href:"/login",className:"text-blue-500",children:"Sign In"})]})]})})}}},e=>{var s=s=>e(e.s=s);e.O(0,[568,104,441,684,358],()=>s(5792)),_N_E=e.O()}]);