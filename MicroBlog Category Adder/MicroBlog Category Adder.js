let baseURL = "http://micro.blog/micropub"
  
  async function authorizeCredential(credentialName) {
   if (Keychain.contains(credentialName)) {
      var credential = Keychain.get(credentialName);
    }
    else {
        var credAlert = new Alert();
        credAlert.title = credentialName + " Credential";
        credAlert.message = "Please enter the credential for " + credentialName + " below.";
        credAlert.addSecureTextField();
        credAlert.addAction("Done")
        credAlert.addCancelAction("Cancel");
        
        if (await credAlert.present() == 0) {
          let userCred = credAlert.textFieldValue(0);
          var chainSet = await Keychain.set(credentialName, userCred);
          var credential = Keychain.get(credentialName);
        }
        else {
          console.log("User Cancelled Action");
          Script.complete();
        }
    }
    return credential
}

async function updateCategory(url, category) {
    var updateReq = new Request(baseURL)
    updateReq.method = "POST";
    updateReq.headers = {"Authorization": "Bearer " + cred};
    updateReq.body = {
      "action": "update",
      "url": url,
      "add": {"category": [category]}
      }
      
      var success = updateReq.load();
      console.log(updateReq.response);
  }

var cred = await authorizeCredential("Craig McClellan Micro.blog");

let userInput = new Alert();
userInput.title = "Category Properties"
userInput.message = "Input the term you would like to search blog posts for, and the Category name you would like to add.";
userInput.addTextField("Search Term");
userInput.addTextField("Category Name");
userInput.addCancelAction("Cancel");
userInput.addAction("Done");
if (await userInput.present() == -1) {
  Script.complete();
  }
else {
  var searchTerm = userInput.textFieldValue(0);
  var category = userInput.textFieldValue(1);
  }
  


var postReq = new Request(baseURL + "q?=source");
postReq.headers = {"Authorization": "Bearer " + cred}
var postsResponse = await postReq.loadJSON();
var postsList = postsResponse.items;

for (i=0; i < postsList.length; i++) {
  var match = postsList[i].properties.content.match(searchTerm)
  if (match.length > 0) {
    var req = await updateCategory(postsList.properties.url, category);
  }
}

