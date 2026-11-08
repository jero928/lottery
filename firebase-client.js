// Public Firebase configuration is intentionally separate from all server secrets.
// Fill firebase-config.json only after registering 539lottery-web and App Check.
let connection;
export async function connect(){
 if(connection)return connection;
 connection=(async()=>{
  const response=await fetch('./firebase-config.json',{cache:'no-store'});if(!response.ok)throw new Error('539 小幫手尚未設定完成。');const config=await response.json();
  if(!config.enabled||config.firebase?.projectId!=='lottery-70b54'||!config.recaptchaEnterpriseSiteKey)throw new Error('539 小幫手尚未啟用，網站原有功能仍可使用。');
  const version='12.10.0',base=`https://www.gstatic.com/firebasejs/${version}`;
  const [{initializeApp},{getAuth,signInAnonymously},{initializeAppCheck,ReCaptchaEnterpriseProvider},{getFunctions,httpsCallable}]=await Promise.all([import(`${base}/firebase-app.js`),import(`${base}/firebase-auth.js`),import(`${base}/firebase-app-check.js`),import(`${base}/firebase-functions.js`)]);
  const app=initializeApp(config.firebase,'539-assistant');initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(config.recaptchaEnterpriseSiteKey),isTokenAutoRefreshEnabled:true});
  await signInAnonymously(getAuth(app));const functions=getFunctions(app,'asia-east1');
  return {chat:async payload=>(await httpsCallable(functions,'chatWith539AI',{timeout:120000})(payload)).data,clear:()=>httpsCallable(functions,'deleteMyChats')({}),feedback:payload=>httpsCallable(functions,'submit539Feedback')(payload)};
 })().catch(e=>{connection=null;throw e;});return connection;
}
