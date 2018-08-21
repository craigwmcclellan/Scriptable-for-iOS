let req = new Request("https://micro.blog/posts/mentions");
req.headers = {"Authorization": "Token "}; // Insert Token Here
req.method = "GET";


let json = await req.loadJSON();

let table = new UITable()
for (i = 0; i < 5; i++) {
  let row = new UITableRow()
  let bodyHTML = json['items'][i]['content_html']
	let imageURL = json["items"][i]["author"]["avatar"]
  let user = json["items"][i]["author"]["_microblog"]["username"]

  let body = decode(bodyHTML);
  let imageCell = row.addImageAtURL(imageURL)
  let titleCell =row.addText(user, body)
  imageCell.widthWeight = 15
  titleCell.widthWeight = 85
  row.height = 75
  row.cellSpacing = 5
  table.addRow(row)
}
  

function decode(str) {
  let regex = /<[^>]*>/g
  return str.replace(regex, "")
}

QuickLook.present(table)

if (config.runsWithSiri) {
  Speech.speak("Here's what people are saying to you on Micro.blog.")
}
