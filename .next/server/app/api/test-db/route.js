(()=>{var e={};e.id=681,e.ids=[681],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},72317:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>g,routeModule:()=>d,serverHooks:()=>x,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>l});var s={};r.r(s),r.d(s,{GET:()=>p});var a=r(96559),o=r(48088),n=r(37719);let u=new(require("pg")).Pool({user:"malav2364",password:"Msking007",database:"Task_Manager",port:5432,host:"taskmanage.c548geae6ll5.ap-south-1.rds.amazonaws.com"});var i=r(32190);async function p(){try{let e=await u.query("SELECT NOW()");return i.NextResponse.json({success:!0,time:e.rows[0].now})}catch(e){return i.NextResponse.json({success:!1,message:e.message},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/test-db/route",pathname:"/api/test-db",filename:"route",bundlePath:"app/api/test-db/route"},resolvedPagePath:"D:\\Downloads\\Taskoo\\TaskManage\\src\\app\\api\\test-db\\route.js",nextConfigOutput:"",userland:s}),{workAsyncStorage:c,workUnitAsyncStorage:l,serverHooks:x}=d;function g(){return(0,n.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:l})}},78335:()=>{},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[243,580],()=>r(72317));module.exports=s})();