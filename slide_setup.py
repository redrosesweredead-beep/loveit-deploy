# runs ON the server (python3 stdlib + curl for multipart)
import json, subprocess, urllib.request, sys
B="http://localhost:3000"
def api(method, path, data=None, token=None):
    req=urllib.request.Request(B+path, method=method)
    req.add_header("Content-Type","application/json")
    if token: req.add_header("Authorization","JWT "+token)
    body=json.dumps(data).encode("utf-8") if data is not None else None
    with urllib.request.urlopen(req, body, timeout=60) as r:
        return json.load(r)
try:
    tok=api("POST","/api/users/login",{"email":"admin@loveitevent.ru","password":"loveit123"})["token"]
except Exception as e:
    print("LOGIN FAILED:", e); sys.exit(1)
print("login ok")
def upload(path, alt):
    out=subprocess.check_output(["curl","-s","-X","POST",B+"/api/media","-H","Authorization: JWT "+tok,"-F","file=@"+path,"-F","alt="+alt])
    j=json.loads(out); 
    if "doc" not in j: print("UPLOAD ERR:", out[:300]); sys.exit(1)
    return j["doc"]["id"]
D=upload("/tmp/hero-desktop.jpg","Свадьба — Ивент с Любовью")
M=upload("/tmp/hero-mobile.jpg","Свадьба — Ивент с Любовью")
print("media desktop=%s mobile=%s"%(D,M))
docs=api("GET","/api/slides?limit=1&sort=order",token=tok)["docs"]
payload={"title":"Ивент с Любовью",
         "subtitle":"Организуем свадьбы, юбилеи и корпоративы под ключ в Тольятти",
         "buttonText":"Оставить заявку","buttonUrl":"/kontakty",
         "image":D,"imageMobile":M,"order":0}
if docs:
    sid=docs[0]["id"]; r=api("PATCH","/api/slides/%s"%sid,payload,token=tok); print("updated slide",sid)
else:
    r=api("POST","/api/slides",payload,token=tok); print("created slide")
print("saved title:", r.get("doc",{}).get("title"), "| image:", r.get("doc",{}).get("image"))
