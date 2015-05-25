
	$("#animate-button-pause").hide();
	var generationIndex = 0;
	var gnHistory = [];
	var intervalId = null;
	var patternsEx = [];
	patternsEx[0] = []
		patternsEx[0][0] = [false, false, false, false, false];
		patternsEx[0][1] = [false, false, true, false, false];
		patternsEx[0][2] = [false, false, true, false, false];
		patternsEx[0][3] = [false, false, true, false, false];
		patternsEx[0][4] = [false, false, false, false, false];
		
	patternsEx[1] = []
		patternsEx[1][0] = [false, false, false, false, false, false, false, false, false, false]
		patternsEx[1][1] = [false, false, true, false, false, false, false, false, false, false]
		patternsEx[1][2] = [false, false, false, true, true, false, false, false, false, false]
		patternsEx[1][3] = [false, false, true, true, false, false, false, false, false, false]
		patternsEx[1][4] = [false, false, false, false, false, false, false, false, false, false]
		patternsEx[1][5] = [false, false, false, false, false, false, false, false, false, false]
		patternsEx[1][6] = [false, false, false, false, false, false, false, false, false, false]
		patternsEx[1][7] = [false, false, false, false, false, false, false, false, false, false]
		patternsEx[1][8] = [false, false, false, false, false, false, false, false, false, false]
		patternsEx[1][9] = [false, false, false, false, false, false, false, false, false, false];
	patternsEx[2] = []
		patternsEx[2][0] = [false, false, false, false, false, false]
		patternsEx[2][1] = [false, true, true, false, false, false]
		patternsEx[2][2] = [false, true, true, false, false, false]
		patternsEx[2][3] = [false, false, false, true, true, false]
		patternsEx[2][4] = [false, false, false, true, true, false]
		patternsEx[2][5] = [false, false, false, false, false, false];
		

	$(document).ready(function(){
		initNewGeneration($("#row-number").val(), $("#col-number").val());
		presentCellsInHTML(gnHistory[0]);
		
		setExampleSize();
	});
	
	
	function initNewGeneration(rows, cols){
		gnHistory.unshift(null);
		gnHistory[0] = [];
		//rows = (rows == undefined)? gnHistory[1].length : rows;
		//cols = (cols == undefined)? gnHistory[1][0].length : cols;
		for(var i = 0; i < rows; i++)
		{
			gnHistory[0][i] = [];
			for(var j = 0; j < cols; j++)
			{
				gnHistory[0][i][j] = false;
			}
		}
	}
	
	//toggle properties window
	function togglePropertiesWindow(){
		$("#properties-window").toggle(100);
	}

	$("#create-example").click(createExample);
	$("#next-generation").click(nextGn);
	$("#prev-generation").click(prevGn);
	$(".dropdown").click(togglePropertiesWindow);
	//set examples containers margin
	$(".examples .col-md-3").css("margin-bottom", "50px");
	
	//create examples from arrays
	function transformPatternToHtml(patternIndex){
		$("div.examples").append('<div class="col-md-3"><div><div></div></div></div>');
		$("div.examples .col-md-3 > div").last().prepend('<span class="glyphicon glyphicon-remove"></span>');
		$("div.examples .col-md-3 > div > div").last().append("<table></table>");
		var tdClass = "";
		for(i = 0; i < patternsEx[patternIndex].length; i++)
		{
			$(".examples table").last().append("<tr></tr>");
			for(j = 0; j < patternsEx[patternIndex][i].length; j++)
			{
				tdClass = patternsEx[patternIndex][i][j]? '"live"':'"dead"';
				$(".examples tr").last().append('<td class=' + tdClass + '>&nbsp</td>');
			}
		}
		
		setExampleSize();
	}
	
	$(".examples").on("click", "table", function(){
		var patternIndex = $(this).parents(".col-md-3").index();
		exampleToBoard(patternIndex);
	})
	$(".examples").on("click", ".glyphicon-remove", function(){
		$(this).parent().parent().hide(300);
		//remove?
	})
	$("#animate-button-play").click(animateBoard);
	$("#animate-button-pause").click(animateBoard);

	//change board properties
	$("#properties-window button").click(function changeBoardsize(){
		togglePropertiesWindow();
		updateCellsSize($("#row-number").val(), $("#col-number").val());
		presentCellsInHTML(gnHistory[0]);
		$("#row-number").val(gnHistory[0].length);
		$("#col-number").val(gnHistory[0][0].length);
		resizeMainTable();
	})
	//set table size according to col number
	function resizeMainTable(){
		//create two variables for table and container width.
		var tableWidth = $("#main-table").css("width");
		tableWidth = parseInt(tableWidth);
		var containerWidth = $("#main-table").parents(".container-fluid").css("width");
		containerWidth = parseInt(containerWidth);
		var tableMargin = $("#main-table").css("margin");
		tableMargin = parseInt(tableMargin);
		if(tableWidth >= containerWidth-tableMargin){
			var tdHeight = $("#main-table td").css("width");
			$("#main-table td").css("height", tdHeight);
		}
	}
	//clear board
	$("#clear-board").click(function clearBoard(){
		initNewGeneration(gnHistory[0].length, gnHistory[0][0].length);
		deleteHistory();
		presentCellsInHTML(gnHistory[0]);
	})
	
	//close properties window with X icon
	$("#properties-window .glyphicon-remove").click(function(){
		togglePropertiesWindow();
	})
	
	
	// choose "living" squares
	$("#main-table").on("click", "td", toggleLifeAttr);
	
	function toggleLifeAttr(){
		var colIndex = $(this).index();
		var rowIndex = $(this).parent().index();
		gnHistory[0][rowIndex][colIndex] = gnHistory[0][rowIndex][colIndex]? false : true;
		var lifeAttr = $(this).attr("class") == "live" ? "dead":"live";
		$(this).attr("class", lifeAttr);
		deleteHistory();
	}
	
	function updateCellsSize(rows, cols){
		initNewGeneration(rows, cols);
		generationIndex++;
		for(i = 0; i < rows; i++)
		{
			for(j = 0; j < cols; j++)
			{
				if(gnHistory[generationIndex][i] == undefined || gnHistory[generationIndex][i][j] == undefined){
					gnHistory[0][i][j] = false;
				}
				else{
					gnHistory[0][i][j] = gnHistory[generationIndex][i][j];
				}
			}
		}
		deleteHistory();
	}
	
		//delete all history besides [0]
	function deleteHistory(){
		generationIndex = 0;
		var l = gnHistory.length;
		for(i = 1; i < l; i++)
		{
			gnHistory.pop();
		}
	}
	
	function presentCellsInHTML(cellsArray){
		$("#main-table").empty();
		for(var i = 0; i < gnHistory[generationIndex].length; i++)
		{
			$("#main-table").append("<tr></tr>")
			for(var j = 0; j < gnHistory[generationIndex][i].length; j++)
			{
				$("#main-table tbody").children().last().append(cellToTd(cellsArray, i, j));
				
			}
		}
	}
	function cellToTd(array, rowIndex, colIndex){
		return array[rowIndex][colIndex]? '<td class="live"></td>' : '<td class="dead"></td>';
	}
	
	
	function prevGn(){
		if(generationIndex < gnHistory.length-1){
			generationIndex++;
			presentCellsInHTML(gnHistory[generationIndex]);
		}
		else{
			alert("You reached the earliest generation.");
			return;
		}
	}
	
	function nextGn(){	
		if(generationIndex > 0){
			generationIndex--;
			presentCellsInHTML(gnHistory[generationIndex]);
		}
		else if(generationIndex == 0){
			createNextGn();
			isAnimationStopped()? presentCellsInHTML(gnHistory[0]) : stopAnimation();
		}
	}
	
	function createNextGn(){
		gnHistory.unshift([]);
		for(var i = 0; i < gnHistory[1].length; i++)
		{
			gnHistory[0][i] = [];
			for(var j = 0; j < gnHistory[1][i].length; j++)
			{
				gnHistory[0][i][j] = cellToNextGn(i, j);
			}
		}
	}
	function stopAnimation(){
		pauseAnimation();
		alert("Animation stopped because it reached a cyclic period.");
	}

		
	function howManyNeighbors(rowIndex, colIndex){
		var neighborsNum = 0;
		
		rStart = (rowIndex > 0) ? rowIndex - 1 : 0;
		rEnd = (rowIndex +1 < gnHistory[1].length) ? rowIndex +1 : rowIndex;
		cStart = (colIndex > 0) ? colIndex - 1 : 0;
		cEnd = (colIndex +1 < gnHistory[1][rowIndex].length) ? colIndex +1 : colIndex;
		
		for (var r = rStart; r <= rEnd; r++) {
			for (var c = cStart; c <= cEnd; c++) {
				neighborsNum += gnHistory[1][r][c];
			}
		}
		
		neighborsNum -= gnHistory[1][rowIndex][colIndex];
		return neighborsNum;
	}
		
	function cellToNextGn(rowIndex, colIndex){
		var neighborsNum = howManyNeighbors(rowIndex, colIndex);
		if(gnHistory[1][rowIndex][colIndex] && neighborsNum < 2){
			return false;
		}
		else if(gnHistory[1][rowIndex][colIndex] && (neighborsNum == 2 || neighborsNum == 3)){
			return true;
		}
		else if(gnHistory[1][rowIndex][colIndex] && neighborsNum > 3){
			return false;
		}
		else if(!(gnHistory[1][rowIndex][colIndex]) && neighborsNum == 3){
			return true;
		}
		return false;
	}
	 
	//remark for git
	function isAnimationStopped(){
		var isNewArrayDifferent = false;
			for(var i = 0; i < gnHistory[0].length; i++)
			{
				for(var j = 0; j < gnHistory[0][i].length; j++)
				{
					if(gnHistory[0][i][j] != gnHistory[1][i][j]){isNewArrayDifferent = true;}
				}
			}
		return isNewArrayDifferent;
	}
	
	
	function animateBoard(){
		if(intervalId == null){
			$("#animate-button-play").hide(130);
			$("#animate-button-pause").show(130);
			intervalId = setInterval(nextGn, 250);
		}
		else{
			pauseAnimation();
		}
	}
	function pauseAnimation(){
			$("#animate-button-play").show(130);
			$("#animate-button-pause").hide(130);
			clearInterval(intervalId);
			intervalId = null;
	}
	/*
	1. Any live cell with fewer than two live neighbours dies,
	 as if caused by under-population.
	2. Any live cell with two or three live neighbours lives 
	on to the next generation.
	3. Any live cell with more than three live neighbours dies, 
	as if by overcrowding.
	4. Any dead cell with exactly three live neighbours becomes
	 a live cell, as if by reproduction.
	 */
	
	
	//transform from example to cells
	function exampleToBoard(patternIndex){
		//setBoardSizeFromExample(pattenIndex);
		generationIndex = 0;
		gnHistory = [];
		gnHistory[0] = patternsEx[patternIndex];
		presentCellsInHTML(gnHistory[0]);
		$("#row-number").val(patternsEx[patternIndex].length);
		$("#col-number").val(patternsEx[patternIndex][0].length);
	}
	
	function addPatternToArray()
	{
		var l = patternsEx.length;
		patternsEx[l] = [];
		for(i = 0; i < gnHistory[0].length; i++)
		{
			patternsEx[l][i] = [];
			for(j = 0; j < gnHistory[0][i].length; j++)
			{
				patternsEx[l][i][j] = gnHistory[0][i][j];
			}
		}
	}
	
	function createExample(){
		addPatternToArray();
		transformPatternToHtml(patternsEx.length - 1);
	}
	
	function setExampleSize(){
		examplesNum = $(".examples table").size();
		for(i = 0; i < examplesNum; i++)
		{
			if($(".examples table").eq(i).attr("position-setting") == "done"){
				continue;
			}
			var height = $(".examples table").eq(i).css("height");
			var width = $(".examples table").eq(i).css("width");
			
			height = parseInt(height);
			width = parseInt(width);
			
			if(height == width){
				$(".examples table").eq(i).css("height", "150px");
				$(".examples table").eq(i).css("width", "150px");
				$(".examples table").eq(i).attr("position-setting", "done");
			}
			else if(height > width){
				$(".examples table").eq(i).css("height", "150px");
				var h = $(".examples table").eq(i).find("td").eq(0).css("height"); 
				$(".examples table").eq(i).find("td").css("width", h);
				$(".examples table").eq(i).attr("position-setting", "done");
			}
			else{
				$(".examples table").eq(i).css("width", "150px");
				var w = $(".examples table").eq(i).find("td").eq(0).css("width");
				$(".examples table").eq(i).find("td").css("height", w);
				//setExampleTablePadding();
				$(".examples table").eq(i).attr("position-setting", "done");
			}
		}
	}
	/*function setExampleTablePadding(){
		var height = $(".examples table").last().css("height");
		height = parseInt(height);
		var padding = (150 - height)/2 +10;
		$(".examples > div").last().css("padding-top", padding + "px");
	}*/