import { mkdir, writeFile } from 'node:fs/promises'; import path from 'node:path';
const API='https://api.heygen.com';
export async function renderLive(request,profile,outDir,{apiKey=process.env.HEYGEN_API_KEY}={}){
 if(!apiKey)throw new Error('HEYGEN_API_KEY is required for live mode');
 const avatarId=process.env[profile.avatarIdEnv]; const voiceId=process.env[profile.voiceIdEnv];
 if(!avatarId)throw new Error(`${profile.avatarIdEnv} is required`); if(!voiceId)throw new Error(`${profile.voiceIdEnv} is required`);
 await mkdir(outDir,{recursive:true}); const results=[];
 for(const segment of request.segments){
  const response=await fetch(`${API}/v2/video/generate`,{method:'POST',headers:{'x-api-key':apiKey,'content-type':'application/json'},body:JSON.stringify({video_inputs:[{character:{type:'avatar',avatar_id:avatarId},voice:{type:'text',voice_id:voiceId,input_text:segment.script}}],dimension:request.aspectRatio==='9:16'?{width:1080,height:1920}:{width:1920,height:1080}})});
  if(!response.ok)throw new Error(`HeyGen generate failed ${response.status}: ${await response.text()}`); const body=await response.json(); results.push({id:segment.id,videoId:body?.data?.video_id,status:'submitted'});
 }
 const manifest={version:'1.0',projectId:request.projectId,mode:'live',status:'SUBMITTED',segments:results}; await writeFile(path.join(outDir,'presenter-manifest.json'),JSON.stringify(manifest,null,2)); return manifest;
}
