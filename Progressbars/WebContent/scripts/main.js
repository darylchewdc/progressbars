var initdata;
	var initdata_json;
	var initdata_jsonButtons;
	var initdata_jsonBars;
	var initdata_jsonLimit;
	var selectedProgBarId;
	
	var currArrData = [];

	function httpGet()
	{
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() 
	    { 
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	        	getInitData(xmlHttp.responseText);
	    }
	    xmlHttp.open("GET", "http://pb-api.herokuapp.com/bars", false); // true for asynchronous 
	    xmlHttp.send(null);
	}
	
	function getInitData(msg)
	{
		initdata = msg;
		console.log("initdata: " + initdata);
		
		initdata_json 			= JSON.parse(initdata);
		initdata_jsonButtons	= initdata_json.buttons;
		initdata_jsonBars		= initdata_json.bars;
		initdata_jsonLimit		= initdata_json.limit;
		
		console.log("buttons: " 	+ initdata_jsonButtons + 
			  		"\r\nbars: " 	+ initdata_jsonBars +
			  		"\r\nlimit: " 	+ initdata_jsonLimit);
	}

	function getRandomInt(min, max) 
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function loadProgressBarSelect(arrBar) 
	{
		var noOfProgressBar = arrBar.length;
		var optionTxt		= '';
		var optionBar		= '';
		var optHiddenActVal	= '';
		var tempWidth		= 0;
	
		console.log("No. of Progress bars: " + noOfProgressBar);
		
		//generate options
		for (var i = 0; i < noOfProgressBar; i++) 
		{
			tempWidth = Math.floor(arrBar[i]/initdata_jsonLimit * 100);
			
			optionTxt += "<option ";
            optionTxt += " value='" 	+ arrBar[i] 	+ "' ";
            optionTxt += " id='" 		+ "progBarSel" 	+ i + "' ";
            optionTxt += ">";
			optionTxt += "#progress" 	+ (i+1);
			optionTxt += "</option>";
			
			optHiddenActVal += "<input type='hidden' ";
			optHiddenActVal += " id='"  	+ "hidAbsVal" 	+ i + "' ";
			optHiddenActVal += " value='" 	+ arrBar[i]	+ "' ";
			optHiddenActVal += "</input>";
			
			optionBar += "<p>";
			optionBar += "<div class='progBar'";
			optionBar += " id='progBar" + i + "' ";
			optionBar += ">";
			
			optionBar += "<div class='progVal'";
			optionBar += " id='progBarVal" + i + "' ";
			optionBar += " style='width:" + tempWidth + "%' ";
			optionBar += ">"; 
			optionBar += "</div>";
			
			optionBar += "<span class='textInProgVal'";
			optionBar += " id='textInProgVal" + i + "' ";
			optionBar += ">";
			optionBar += tempWidth + "%";
			optionBar += "</span>";
			
			optionBar += "</div>";
			
			optionBar += "</p>";
		}

		document.getElementById("progBarSel").innerHTML = optionTxt;
		document.getElementById("progBarCont").innerHTML = optionBar;
		document.getElementById("hidActualVal").innerHTML = optHiddenActVal;
	}

	function loadButtons(arrBtn)
	{
		var noOfButtons = arrBtn.length;
		var buttonsHTML = "";
		var amt			= 0;
		
		console.log("No. of Buttons: " + noOfButtons);

		for (var i = 0; i < noOfButtons; i++) 
		{
			//generate buttons DOM
			buttonsHTML += "<button ";
			buttonsHTML += " value='" + arrBtn[i] + "' ";
			buttonsHTML += " id='btn" + i + "' ";
			buttonsHTML += " onclick='barButton(this);' ";
			buttonsHTML += ">";
			
			if (arrBtn[i] >= 0)
			{
            	buttonsHTML += "+" + arrBtn[i];
			}
			else
			{
				buttonsHTML += arrBtn[i];	
			}
            buttonsHTML += "</button> &nbsp";
		}
		
		document.getElementById("btnList").innerHTML = buttonsHTML;
	}
	
	function barButton(e)
	{
		//index of progressbar selected
		var elementId			= document.getElementById('progBarSel').selectedIndex;
		
		//progressbar element selected
		var selProgBarElement 	= document.getElementById('progBar' + elementId);
		
		//progressbar inner value rectangle element selected
		var selProgBarEleVal	= document.getElementById('progBarVal' + elementId);
		
		//absolute value of progressbar element selected
		var selHiddenElement	= document.getElementById('hidAbsVal' + elementId);
		
		//absolute value to increase or decrease value of progressbar element by
		var valToIncOrDec		= parseInt(e.value);
		
		//selected text element of the progBar element
		var selProgBarTxtEle	= document.getElementById('textInProgVal' + elementId);
		
		console.log("valToIncOrDec: " + valToIncOrDec);
		
		var oriVal  = parseInt(selHiddenElement.value);
		var newVal	= oriVal + valToIncOrDec;
		
		var bIsPos	= false;
		if (newVal >= oriVal)
		{
			bIsPos = true;
		}
		else
		{
			bIsPos = false;
		}
		console.log("bIsPos: " + bIsPos);
		
		var animate;
		
		if (bIsPos)
		{
			animate = moveBarPos(selHiddenElement, selProgBarEleVal, initdata_jsonLimit, newVal);
			if (newVal > initdata_jsonLimit)
			{
				selProgBarEleVal.style.backgroundColor = "red";
			}
			else
			{
				selProgBarEleVal.style.backgroundColor = "green";
			}
		}
		else
		{
			animate = moveBarNeg(selHiddenElement, selProgBarEleVal, initdata_jsonLimit, newVal);
			if (newVal <= 0)
			{
				newVal = 0;	
			}
			
			if (newVal < initdata_jsonLimit)
			{
				selProgBarEleVal.style.backgroundColor = "green";
			}
		}
	
		selProgBarTxtEle.innerHTML 		= '' + Math.floor(newVal/initdata_jsonLimit*100) + '%';
	}
	
	function moveBarPos(selHiddenElement, progBarEle, initdata_jsonLimit, resval)
	{
		console.log("moveBarPos() ==> START");
		console.log("moveBarPos() ==> progBarEle.style.width: [" + progBarEle.style.width + "]");
		console.log("moveBarPos() ==> selHiddenElement.value: [" + selHiddenElement.value + "]");
		console.log("moveBarPos() ==> resval: [" + resval + "]");
		
		setTimeout(function()
				   {
						console.log("function entered");
						console.log("function entered() ==> selHiddenElement.value: [" + selHiddenElement.value + "]");
						console.log("function entered() ==> resval: [" + resval + "]");
						
				   		if (parseInt(selHiddenElement.value) < parseInt(resval))
						{
				   			console.log("selHiddenElement.value less than resval");

				   			selHiddenElement.value = parseInt(selHiddenElement.value) + 1;
 							progBarEle.style.width = '' + parseInt(Math.floor(selHiddenElement.value/initdata_jsonLimit * 100)) + '%';
							moveBarPos(selHiddenElement, progBarEle, initdata_jsonLimit, resval);
						}
				   },
				   50);
		
		console.log("moveBarPos() ==> END");
	}
	
	function moveBarNeg(selHiddenElement, progBarEle, initdata_jsonLimit, resval)
	{
		console.log("moveBarNeg() ==> START");
		console.log("moveBarNeg() ==> progBarEle.style.width: [" + progBarEle.style.width + "]");
		console.log("moveBarNeg() ==> selHiddenElement.value: [" + selHiddenElement.value + "]");
		console.log("moveBarNeg() ==> resval: [" + resval + "]");
		
		setTimeout(function()
				   {
						if (parseInt(selHiddenElement.value) >= parseInt(resval))
						{
							console.log("selHiddenElement.value more than or equals resval");
							
							selHiddenElement.value = parseInt(selHiddenElement.value) - 1;
							progBarEle.style.width = '' + parseInt(Math.floor(selHiddenElement.value/initdata_jsonLimit * 100)) + '%';
							
							if (parseInt(selHiddenElement.value) > 0)
							{
								moveBarNeg(selHiddenElement, progBarEle, initdata_jsonLimit, resval);
							}
							else
							{
								progBarEle.style.width = '0%';
								selHiddenElement.value = 0;	
								resVal = 0;
							}
						}
				   }, 
				   50);
		
		console.log("moveBarNeg() ==> END");
	}
	
	window.onload = function()
					{
						httpGet();				
						loadButtons(initdata_jsonButtons);
						loadProgressBarSelect(initdata_jsonBars);
					}