import json, urllib.request, sys, re
B="http://localhost:3000"
def api(method, path, data=None, token=None):
    req=urllib.request.Request(B+path, method=method)
    req.add_header("Content-Type","application/json")
    if token: req.add_header("Authorization","JWT "+token)
    body=json.dumps(data).encode("utf-8") if data is not None else None
    with urllib.request.urlopen(req, body, timeout=60) as r:
        return json.load(r)
tok=api("POST","/api/users/login",{"email":"admin@loveitevent.ru","password":"loveit123"})["token"]
docs=api("GET","/api/pages?where[showInHeader][equals]=true&limit=50",token=tok).get("docs",[])
print("header pages:", [ (d.get("navLabel") or d.get("title"), d.get("slug")) for d in docs ])
for d in docs:
    label=(d.get("navLabel") or d.get("title") or "")
    if re.search("координац", label, re.I):
        api("PATCH","/api/pages/%s"%d["id"],{"showInHeader":False},token=tok)
        print("Координация -> showInHeader=False (slug %s)"%d.get("slug"))
for d in docs:
    label=(d.get("navLabel") or d.get("title") or "")
    if re.search("привилег", label, re.I):
        print("privilegii slug:", d.get("slug"), "url /"+str(d.get("slug")))
