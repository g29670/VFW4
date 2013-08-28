/*
Elijah Moran
VFW 1308
Project 4
*/
// Wait until DOM is ready //
window.addEventListener("DOMContentLoaded", function() {

	// getElementById function //
	function $(x) {
		var elementID = document.getElementById(x);
		return elementID;
	};
	
	// Create Select Element with Options//
	function makeCoinStyle() {
		var formTag = document.getElementsByTagName('form'),
			selectList = $('select'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "styles");
		for(var i=0, j=coinTypes.length; i<j; i++) {
			var makeOption = document.createElement('option');
			var optTxt = coinTypes[i];
			makeOption.setAttribute("value", optTxt);
			makeOption.innerHTML = optTxt;
			makeSelect.appendChild(makeOption);
		}
		selectList.appendChild(makeSelect);
	};
	
	// //
	function getCheckboxValue() {
		if ($('worth').checked) {
			worthValue = "Yes";
		}else{
			worthValue = "No";
		}
	};
	
	// Find Value of selected radio button //
	function getSelectedRadio(){
		var radios = document.forms[0].quality;
		for (var i=0, j=radios.length; i<j; i++) {
			if (radios[i].checked){
				qualityValue = radios[i].value;
			}
		}
	};
	
	// Turn on and off form by use of case during getData() //
	function toggle(x) {
		switch(x) {
			case "on":
				$('coinForm').style.display = "none";
				$('showData').style.display = "none";
				$('clearData').style.display = "inline";
				$('startNew').style.display = "inline";
				$('saveData').style.display = "none";
				break;
			case "off":
				$('coinForm').style.display = "block";
				$('showData').style.display = "inline";
				$('clearData').style.display = "inline";
				$('startNew').style.display = "none";
				$('saveData').style.display = "inline";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
	};
	
	// Gather Form Data & Place it in an Object & Object is an Array for Form Label and Value //
	function saveData(key) {
		// Set Random Key for Stored Data //
		if(!key) {
			var id = Math.floor(Math.random()*10001);
		}else{
			id = key;
		}
		// Call Functions //
		getCheckboxValue();
		getSelectedRadio();
		var item 				= {};
			item.entercoin	    = ["Coin Style: ", $('styles').value];
			item.mdate		    = ["Mint Date: ", $('mdate').value];
			item.mloc           = ["Mint Location:", $('mloc').value];
			item.edate          = ["Date entered into collection: ", $('edate').value];
			item.worth		    = ["Is this coin valuable today? ", worthValue];
			item.coinage	    = ["What is the value of this coin? ", $('coinage').value];
			item.quality	    = ["The coin quality is : ", qualityValue];
			item.comments		= ["Give information about the coin? ", $('comments').value];
			
		// Save Data into Local Storage with JSON.stringify //
		localStorage.setItem(id, JSON.stringify(item));
		alert("Coin Saved!");
	};
	
	// Write Data from Local Storage to Browser //
	function getData() {
		// Call Function //
		toggle("on");
		if(localStorage.length === 0){
			alert("There is no data in Local Storage so \n default data was added.");
			autoFillData();
		}
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv, $('foot'));
		// Set 'items' display //
		$('items').style.display = "block";
		for(var i=0, j=localStorage.length; i<j; i++) {
			var makeLi = document.createElement('li');
		    makeLi.style.fontsize= "25 px";
			var buttonsLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			// Convert string from local storage into value by JSON.parse //
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			getImage(obj.entercoin[1], makeSubList);
			for (var x in obj) {
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubTxt = obj[x][0]+" "+obj[x][1];
				makeSubLi.innerHTML = optSubTxt;
				makeSubList.appendChild(buttonsLi);
			}
			makeButtonsLi(localStorage.key(i), buttonsLi);
		}
	};

	// Get an image for the right category //
	function getImage(imgName, makeSubList) {
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImage = document.createElement('img');
		var setSrc = newImage.setAttribute("src", "images/" + imgName + ".png");
		newImage.style.paddingTop = "10px";
		imageLi.appendChild(newImage);
	};

	// Auto Fill Local Storage from JSON.js loaded from HTML page
	function autoFillData() {
		for(var n in json) {
			var id = Math.floor(Math.random()*10001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	};
	
	// Make Buttons //
	// Create edit and delete buttons for each stored item when displayed //
	function makeButtonsLi(key, buttonsLi) {
		// Add edit single item button //
		var editButton = document.createElement('a');
		editButton.setAttribute("id", "editButton");
		editButton.href = "#";		
		editButton.key = key;
		var editTxt = "Edit Coin";
		editButton.addEventListener("click", editItem);
		editButton.innerHTML = editTxt;
		buttonsLi.appendChild(editButton);
		// Add line break, kept hidden as I prefer them side by side //
/*		var breakTag = document.createElement('br');
		buttonsLi.appendChild(breakTag);*/
		// Add single delete item button //
		var deleteButton = document.createElement('a');
		deleteButton.setAttribute("id", "deleteButton");
		deleteButton.href = "#";
		deleteButton.key = key;
		var deleteTxt = "Delete Coin";
		deleteButton.addEventListener("click", deleteItem);
		deleteButton.innerHTML = deleteTxt;
		buttonsLi.appendChild(deleteButton);
	};
	
	function editItem(key) {
		// Grab data from local storage for item edit //
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		// Turn form back on //
		toggle("off");
		// Populate form fields //
		$('styles').value = item.entercoin[1];
		$('mdate').value = item.mdate[1];
		$('mloc').value = item.mloc[1];
		$('edate').value = item.edate[1];
		$('coinage').value = item.coinage[1];
		if(item.worth[1] == "Yes") {
			$('worth').setAttribute("checked", "checked");
		}
		$('quality').value = item.quality[1];
		var radios = document.forms[0].quality;
		for (var i=0, j=radios.length; i<j; i++) {
			if(radios[i].value == "Excellent" && item.quality[1] == "Excellent") {
				radios[i].setAttribute("checked", "checked");
			}else if (radios[i].value == "Good" && item.quality[1] == "Good") {
				radios[i].setAttribute("checked", "checked");
			}else if (radios[i].value == "Damaged" && item.quality[1] == "Damaged") {
				radios[i].setAttribute("checked", "checked");
			}
		}
		$('comments').value = item.comments[1];
		// Remove event listener for 'save' button //
		submitData.removeEventListener("click", saveData);
		// Change submit button value from Save Coin to Save Changes //
		$('saveData').value = "Save Changes";
		var editSubmit = $('saveData');
		// Save to original key value established for particular values //
		editSubmit.addEventListener("click", validate);
		editSubmit.key = key;
	};
	
	// Delete individual key storage from localStorage //
	function deleteItem() {
		var ask = confirm("Delete this coin?");
		// Confirm with the user to delete individual item //
		if(ask) {
			localStorage.removeItem(this.key);
			window.location.reload();
			alert("The coin has been deleted.");
			return false;
		// If declined, do not delete and alert the user //
		}else{
			alert("The coin was not deleted.");
		}
	};
	
	function clearData() {
		if (localStorage.length === 0) {
			alert("There is nothing to delete.");
		}else{
			var clear = confirm("Are you sure you want to delete your coins?");
			if (clear) {
				localStorage.clear();
				alert("All coins have been deleted.");
				window.location.reload();
				return false;
			}else{
				alert("Your coins have not been deleted.");
			}
		}
	};
	
	function validate(e) {
		// Define elements we want to check //
		var getStyle = $('styles');
		var getMdate = $('mdate');
		var getMloc = $('mloc');
		var getEdate = $('edate');
		var getComments = $('comments');
		// Reset error messages //
		errMsg.innerHTML = "";
		getStyle.style.border = "1px solid black";
		getMdate.style.border = "1px solid black";
		getMloc.style.border = "1px solid black";
		getEdate.style.border = "1px solid black";
		getComments.style.border = "1px solid black";
		// Get error messages //
		var messageAry = [];
		// Style validation //
		if(getStyle.value === "*Choose A Style*") {
			var styleError = "Please choose a style.";
			getStyle.style.border = "1px solid red";
			messageAry.push(styleError);
		}
		// Coin mint validation //
		if(getMdate.value === "") {
			var mDateError = "Please enter year coin minted.";
			getMdate.style.border = "1px solid red";
			messageAry.push(mDateError);
		}
        
        // Mint Location validation //
		if(getMloc.value === "") {
			var mLocError = "Please enter the mint location.";
			getMloc.style.border = "1px solid red";
			messageAry.push(mLocError);
		}

		// Coin Entry Date validation //
		if(getEdate.value === "") {
			var eDateError = "Please enter date coin placed in database.";
			getEdate.style.border = "1px solid red";
			messageAry.push(eDateError);
		}
		
		//Comments validation //
		if(getComments.value === "") {
			var commentsError = "Give information about the coin.";
			getComments.style.border = "1px solid red";
			messageAry.push(commentsError);
		}
		// Display error messages //
		if(messageAry.length >= 1) {
			for (var i=0, j=messageAry.length; i<j; i++) {
				var txt = document.createElement('li');
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			// If errors found, stop the form from submitting and alert the user //
			alert("There are required fields left empty.");
			e.preventDefault();
			return false;
		}else{
			// If there are no errors, save the data //
			saveData(this.key);
		}
	};
	
	// Variable defaults //
	var coinTypes = ["*Choose A Style*", "Penny", "Nickel", "Dime", "Quarter", "Half-Dollar", "Silver-Dollar"],
		worthValue = "No",
		qualityValue,
		confirmClear,
		errMsg = $('errors')
	;
	
	// Set Link & Submit Click Events //
	var displayLink = $('showData');
	displayLink.addEventListener("click", getData);
	var clearButton = $('clearData');
	clearButton.addEventListener("click", clearData);
	var submitData = $('saveData');
	submitData.addEventListener("click", validate);
	
	// Call Functions //
	makeCoinStyle();
});