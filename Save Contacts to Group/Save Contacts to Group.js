// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: users;
// When run, this Script will search the notes field for all contacts in the default contacts container (usually iCloud) for a character the user designates in the script (I recommend an emoji). Any contacts that have the emoji will be added to the contact group the user specifies. If that group does not exist yet, it will be created.

// Present an alert to the user asking for the search term (emoji) and the name of the Contact Group to add contacts to.

let alert = new Alert();
alert.title = "Create Contact Group";
alert.addTextField("Note Search Term");
alert.addTextField("Contact Group Name");
alert.addAction("Done");
alert.addCancelAction("Cancel");
if (await alert.present() == 0) {
	let searchTerm = alert.textFieldValue(0);
	let userGroup = alert.textFieldValue(1);
	
	
	// Gather information on contacts, containers, and groups to be used later in the script.
	
	let container = await ContactsContainer.default();
	let allContacts = await Contact.all([container]);
	let allGroups = await ContactsGroup.all([container])
	
	
	// Determine if Contacts Group already exists, and if not, create it
	
	function checkGroupExists() {
	  var a = 0
	  for (i = 0; i < allGroups.length; i++) {
	    if (allGroups[i].name == userGroup) {
	      a = a + 1;
	     }
	   }
	  if (a == 1) {
	    var b = true;
	    }
	  else if (a == 0) {
	    var b = false;
	   }
	  return b;
	}
	
	function createGroup(groupName) {
		var newGroup = new ContactsGroup();
		newGroup.name = groupName;
	 	ContactsGroup.add(newGroup)
	 	Contact.persistChanges();
	}
	
	var groupExists = checkGroupExists();
	
	if (groupExists == false) {
	  createGroup(userGroup);
	  console.log("Group " + userGroup + " created"); 
	}
	else if (groupExists == true) {
	  console.log("Group " + userGroup + " exists");
	}
	
	// Add Contacts with Emoji Search Term to Contact Group
	
	function addToGroup(groupName) {
	   for (i = 0; i < allGroups.length; i++) {
	      if (allGroups[i].name == groupName) {
	        var group = allGroups[i];
	      }
	   }
	  for (i = 0; i < allContacts.length; i++) {
	    if (allContacts[i].note == searchTerm) {
	      var last = allContacts[i].familyName;
	      var first = allContacts[i].givenName;
	      console.log("Contact " + first + " " + last + " added to group " + group.name + ".");
	      group.addMember(allContacts[i])
	      ContactsGroup.update(group);
	      allContacts[i].note = "";
	      Contact.update(allContacts[i]);
	      }
	    }
	}
	
	var success = addToGroup(userGroup);
	Contact.persistChanges();
}
else {
	console.log("Cancelled");
}
