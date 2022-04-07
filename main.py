import requests
url = 'https://coictbot2.herokuapp.com/webhooks/rest/webhook' ##change rasablog with your app name
myobj = {
"message": "hi",
"sender": "User",
}
x = requests.post(url, json = myobj)
print(x.text)
