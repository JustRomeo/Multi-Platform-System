import requests

Connected = False

try:
    r = requests.post("http://localhost:6660/connection/sign_up", json={"Username":"Romeo", "password":"zbeub", "mail":"test"}).json()
    print(r)
except:
    print("Fail")

try:
    r = requests.post("http://localhost:6660/connection/sign_in", json={"Username":"Romeo", "password":"zbeub"}).json()
    print(r)
    if r['connect'] == "SUCCESS":
        Connected = True
except:
    print("Fail")

if Connected:
    try:
        r = requests.post("http://localhost:6660/connection/getUser", json={"Username":"Romeo"}).json()
        print(r)
    except:
        print("Fail")
