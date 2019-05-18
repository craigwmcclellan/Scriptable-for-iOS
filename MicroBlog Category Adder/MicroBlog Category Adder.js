// Script to Utilize Micro.blog's Micropub API to download JSON of most recent 100 posts, analyze for certain characters, and assign a chosen category to posts that contain those characters.

let baseURL = "http://micro.blog/micropub";


// Function to store and access the Micro.blog Authorization Token
async function authorizeCredential(credentialName) {
  if (Keychain.contains(credentialName)) {
    var credential = Keychain.get(credentialName);
    }
  else {
    var credAlert = new Alert();
    credAlert.title = credentialName + " Credential";
    credAlert.message = "Please enter the credential for " + credentialName + " below.";
    credAlert.addSecureTextField();
    credAlert.addAction("Done");
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
//Function to send category information to Micro.blog
async function updateCategory(url, category) {
    var updateReq = new Request(baseURL)
    updateReq.method = "POST";
    updateReq.headers = {"Authorization": "Bearer " + cred};
    updateReq.body = {
      "action": "update",
      "url": url,
      "add": {"category": [category]}
      }
      
      var success = await updateReq.loadString();
      console.log(success)
      if (success) {
      console.log("Post " + url + " added to category: " + category);
      }
      else {
        console.log(success)
        }
  }

var cred = await authorizeCredential("Craig McClellan Micro.blog");
// Prompt user for search term and category name.
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
  


var postReq = new Request(baseURL + "?q=source");
postReq.headers = {"Authorization": "Bearer " + cred}
var postsResponse = await postReq.loadJSON();
var postsList = postsResponse.items;

for (i=0; i < postsList.length; i++) {
  var postURL = postsList[i].properties.url[0]
  var postContent = postsList[i].properties.content[0]
  var match = postContent.match(searchTerm)
  if (match) {
    var req = await updateCategory(postURL, category);
  }
}

