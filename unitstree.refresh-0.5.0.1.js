
var UnitsTreeRefreshVer = '0.5.0.0';

// ---- Functions ----

function GetReturnUrl() {
	return '../UnitsTree/index.php'+
		'?DebugLevel='+DebugLevel+
		'&OfferId='+CurOfferId+
		'&OfferRevId='+CurOfferRevId+
		'&TopUnitLevel='+CurTopUnitLevel+
		'&UnitTypeId='+CurUnitTypeId+
		'&SelectedOfferId='+SelectedOfferId+
		'&SelectedOfferRevId='+SelectedOfferRevId+
		'&SelectedUnitId='+SelectedUnitId+
		'&SelectedUnitRevId='+SelectedUnitRevId+
		'&ShowLog='+ShowLog;
}

function GetSimpleDatetimeStamp(Datetime) {
	return Datetime.getFullYear()+
		Datetime.getMonth()+
		Datetime.getDate()+
		Datetime.getHours()+
		Datetime.getMinutes()+
		Datetime.getSeconds();
}

function RefreshCurBranch() {
	RefreshTreeSel();
	// Зададим выделение у данной ветви
	SetBranchStyle(SelectedUnitRevArr);
	RefreshLeft2(function () {
		RefreshRight();
	});
}

function RefreshLeft() {
	$('#wLeft').html(
		'<div id="LeftTools">&nbsp;</div>'+
		'<hr id="LeftToolsHr"/>'+
		'<div id="LeftContent"></div>'+
		'</div>'
		);
	$('#LeftToolsHr').css('margin', 0);
}

function RefreshLeft2(OnSuccess) {

	function OnSuccess2(Res) {
		LeftTools.html(Res.ToolsHtml);

		// -- Show iframe --
		if (Res.FrameSrc != '') {
			h = LeftContent.height()-4;
			CurLeftContentFrameName = 'LeftContentFrame'+GetSimpleDatetimeStamp(new Date());
			LeftContent.html('<iframe id="'+CurLeftContentFrameName+'" name="'+CurLeftContentFrameName+'" width="100%" height="'+h+'" frameborder="0" src="'+Res.FrameSrc+'"></iframe>');
		}

		if (typeof OnSuccess != 'undefined')
			OnSuccess();
	}

	// -- Clear --

	LeftContent = $('#LeftContent');
	LeftTools = $('#LeftTools');

	LeftContent.html('');
	LeftTools.html('<img src="../img/none_16.png"/>');

	// -- GetParams --

	UnitId = SelectedUnitId;
	UnitRevId = SelectedUnitRevId;
	UnitRevIsFixed = SelectedUnitRevIsFixed;
	OfferId = SelectedOfferId;
	OfferRevId = SelectedOfferRevId;
	OfferRevIsFixed = SelectedOfferRevIsFixed;
	TopUnitLevel = CurTopUnitLevel;

	// -- Get FrameSrc --

	if (OfferRevId > 0) {
		RefreshLeft_Offer(OfferId, OfferRevId, OfferRevIsFixed, OnSuccess2);
	} else {
		if (UnitId == 0) {
			if (CurOfferId > 0) {
				OnSuccess2({
					LeftTools:'<img src="../img/none_16.png"/>',
					FrameSrc:''
				});
			} else {
				RefreshLeft_Root_Unit(CurUnitTypeId, TopUnitLevel, OnSuccess2);
			}
		} else {
			if (CurOfferId > 0 || CurOfferRevId > 0) {
				RootIsFixed = CurOfferRevIsFixed;
			} else {
				RootIsFixed = false;
			}
			RefreshLeft_Unit(UnitId, UnitRevId, UnitRevIsFixed, SelectedUnitRevArr, RootIsFixed, OnSuccess2);
		}
	}
}

function RefreshLeft_Offer(OfferId, OfferRevId, OfferRevIsFixed, OnSuccess) {
	ShowRevisionsUrl = "javascript:ShowOfferRevisions("+OfferId+","+OfferRevId+")";
	ToolsHtml = '<a href="'+ShowRevisionsUrl+'" title="Просмотреть ревиции"><img src="../img/rev_eye_16.png"/></a> ';
	if (!OfferRevIsFixed) {
		AddNewUnitUrl = "javascript:AddNewUnitToOffer("+OfferId+","+OfferRevId+")";
		ToolsHtml = ToolsHtml+
			'<a href="'+AddNewUnitUrl+'" title="Создать новую сборочную единицу"><img src="../img/package_new_16.png"/></a> '+
			'<a href="../OfferRevisionsGrid/index.php?OfferId='+OfferId+'" title="Просмотреть ревиции"><img src="../img/eye_16.png"/></a> ';
	}
	if (OfferRevIsFixed == 0)
		ToolsHtml = ToolsHtml + '<a href="javascript:LockOffer('+OfferId+','+OfferRevId+')" title="Зафиксировать ривизию"><img src="../img/lock_open_16.png"/></a> '
	else
		ToolsHtml = ToolsHtml + '<a href="javascript:UnLockOffer('+OfferId+','+OfferRevId+')" title="Создать новую ревизию"><img src="../img/lock_16.png"/></a> ';

	FrameSrc = '../OfferContentGrid/index.php?OfferRevId='+CurOfferRevId+'&OfferIsFixed='+OfferRevIsFixed;

	Res = {
		ToolsHtml:ToolsHtml,
		FrameSrc:FrameSrc
	};

	if (typeof OnSuccess != 'undefined')
		OnSuccess(Res);
	return Res;
}

function RefreshLeft_Root_Unit(CurUnitTypeId, TopUnitLevel, OnSuccess) {
	ToolsHtml = '';
	FrameSrc = '';
	/*
	Url = '../Api/AddNewUnit.php?IsHtml=true'+
		'&ControlUrl='+encodeURIComponent('../UnitControl/index.php')+
		'&ReturnUrl='+encodeURIComponent(GetReturnUrl());
	ToolsHtml = '<a href="'+Url+'" title="Создать новую сборочную единицу"><img src="../img/package_new_16.png"/></a>';
	if (typeof CurUnitTypeId == 'undefined' || CurUnitTypeId <= 0) {
		if (TopUnitLevel == 0) {
			FrameSrcItems = '';
			FrameSrcUnits = '../UnitsGrid_All/index.php';
		} else {
			FrameSrcItems = '';
			FrameSrcUnits = '../UnitsGrid_Level/index.php?Level='+TopUnitLevel;
		}
	} else {
		if (TopUnitLevel == 0) {
			FrameSrcItems = '';
			FrameSrcUnits = '../UnitsGrid_Type/index.php?UnitTypeId='+CurUnitTypeId;
		} else {
			FrameSrcItems = '';
			FrameSrcUnits = '../UnitsGrid_LevelAndType/index.php?Level='+TopUnitLevel+'&UnitTypeId='+CurUnitTypeId;
		}
	}
	*/
	Res = {
		ToolsHtml:ToolsHtml,
		FrameSrc:FrameSrc
	};

	if (typeof OnSuccess != 'undefined')
		OnSuccess(Res);

	return Res;
}

function RefreshLeft_Unit(UnitId, UnitRevId, UnitRevIsFixed, UnitRevArr, RootIsFixed, OnSuccess) {
	ToolsHtml = '<a href="javascript:ShowUnitRevisions('+UnitId+','+UnitRevId+')" title="Просмотреть ревизии сборочной единицы"><img src="../img/rev_eye_16.png"/></a>'+
		' <a href="javascript:CopyUnit('+UnitId+','+UnitRevId+')" title="Копировать сборочную единицу"><img src="../img/element_copy_16.png"/></a>';
	if (!RootIsFixed) {
		A = '';
		if (UnitRevArr.length > 0) {
			for (var i = 0; i < UnitRevArr.length-1; i++) {
				A = A + UnitRevArr[i] + ',';
			}
			A = A + UnitRevArr[UnitRevArr.length-1];
		}
		Url = "javascript:AddNewUnitToUnit("+UnitId+","+UnitRevId+")";
		ToolsHtml += ' <a href="'+Url+'" title="Создать новую сборочную единицу"><img src="../img/package_new_16.png"/></a>';
		if (UnitRevIsFixed == 0)
			ToolsHtml += ' <a href="javascript:LockUnit('+UnitId+','+UnitRevId+')" title="Зафиксировать ривизию"><img src="../img/lock_open_16.png"/></a>'
		else
			ToolsHtml += ' <a href="javascript:UnLockUnit('+UnitId+','+UnitRevId+')" title="Создать новую ревизию"><img src="../img/lock_16.png"/></a>';
	}
	FrameSrc = '../UnitContentGrid/index.php?UnitRevId=' + UnitRevId + '&UnitIsFixed=' + UnitRevIsFixed;
	Res = {
		ToolsHtml:ToolsHtml,
		FrameSrc:FrameSrc
	};

	if (typeof OnSuccess != 'undefined')
		OnSuccess(Res);

	return Res;
}

function RefreshRight(OnSuccess) {
	OfferId = SelectedOfferId;
	OfferRevId = SelectedOfferRevId;
	OfferRevIsFixed = SelectedOfferRevIsFixed;
	UnitId = SelectedUnitId;
	UnitRevId = SelectedUnitRevId;
	UnitRevIsFixed = SelectedUnitRevIsFixed;

	wRight = $('#wRight');

	if (OfferId == 0 && OfferRevId == 0 && UnitId == 0 && UnitRevId == 0) {
		wRight.html('');
		if (typeof OnSuccess != 'undefined')
			OnSuccess();
		return;
	}

	if (OfferId > 0 || OfferRevId > 0) {
		if (OfferRevIsFixed) {
			wRight.html('');
			if (typeof OnSuccess != 'undefined')
				OnSuccess();
			return;
		}
	}

	if (CurOfferId > 0 || CurOfferRevId > 0) {
		if (CurOfferRevIsFixed) {
			wRight.html('');
			if (typeof OnSuccess != 'undefined')
				OnSuccess();
			return;
		}
	}

	if (UnitId > 0 || UnitRevId > 0) {
		if (UnitRevIsFixed) {
			wRight.html('');
			if (typeof OnSuccess != 'undefined')
				OnSuccess();
			return;
		}
	}

	wRight.html(
		'<div id="RightTools">'+
		'<a href="javascript:SetCurRightValue(1)" id="RightTools_Items">Элементы</a>'+
		'&nbsp;&nbsp;&nbsp;&nbsp;'+
		'<a href="javascript:SetCurRightValue(2)" id="RightTools_Units">Сборочные единицы</a>'+
		'&nbsp;&nbsp;&nbsp;&nbsp;'+
		'<a href="../UnitForm_Edit/index.php?nmgp_opcao=novo" title="Создать новую сборочную единицу"><img src="../img/package_new_16.png"/></a> '+ // "addNewBranch(); return false;"
		'</div>'+
		'<hr id="RightToolsHr"/>'+
		'<div id="RightContent"></div>'
		);
	$('#RightToolsHr').css('margin', 0);

	if (OfferId == 0 && OfferRevId == 0 && UnitId == 0 && UnitRevId == 0)
		RightValue = 0
	else {
		if (CurRightValue == 0)
			RightValue = 2
		else
			RightValue = CurRightValue;
	}

	RefreshRightContent(RightValue, OnSuccess);
}

function RefreshRightContent(RightValue, OnSuccess) {
	// Если первый раз, то считываем значение цвета по умолчанию
	if (typeof DefMenuColor == 'undefined')
		DefMenuColor = $('#RightTools_Items').css('background-color');

	// -- GetParam --

	OfferId = SelectedOfferId;
	OfferRevId = SelectedOfferRevId;
	UnitId = SelectedUnitId;
	UnitRevId = SelectedUnitRevId;

	if (typeof RightValue == 'undefined') {
		if (OfferId == 0 && OfferRevId == 0 && UnitId == 0 && UnitRevId == 0)
			RightValue = 0
		else {
			if (CurRightValue == 0)
				RightValue = 2
			else
				RightValue = CurRightValue;
		}
	}

	// --

	Right = $('#wRight');
	RightTools = $('#RightTools');
	RightToolsHr = $('#RightToolsHr');
	RightContent = $('#RightContent');
	RightContent.height(Right.height() - RightTools.outerHeight(true) - RightToolsHr.outerHeight() - 4);
	RightContent.html('');

	$('#RightTools_Items').css('background-color', DefMenuColor);
	$('#RightTools_Units').css('background-color', DefMenuColor);

	if (RightValue == 1) {
		$('#RightTools_Items').css('background-color', '#999999');
		RefreshRightContent_Items(UnitId, UnitRevId, OnSuccess);
	} else if (RightValue == 2) {
		$('#RightTools_Units').css('background-color', '#999999');
		RefreshRightContent_Units(UnitId, UnitRevId, OfferId, OfferRevId, OnSuccess);
	} else {
		if (typeof OnSuccess != 'undefined')
			OnSuccess();
	}
}

function RefreshRightContent_Items(UnitId, UnitRevId, OnSuccess) {
	RightContent = $('#RightContent');
	h = RightContent.height();
	RightContent.html(
		'<table width="100%" height="'+h+'" border="0" margin="0" padding="0" cellspacing="0" cellpadding="0"><tr><td width="16">'+
		'<a href="javascript:Items_OnLeft()"><img src="../img/arrow_left_green_16.png"/></a>'+
		'</td><td>'+
		'<iframe id="RightFrame" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="../ItemsGrid_forUnitsTree/index.php?UnitId='+UnitId+'&UnitRevisionId='+UnitRevId+'">'+
		'</iframe>'+
		'</td></tr></table>');
	if (typeof OnSuccess != 'undefined')
		OnSuccess();
	return true;
}

function RefreshRightContent_Units(UnitId, UnitRevId, OfferId, OfferRevId, OnSuccess) {
	RightContent = $('#RightContent');
	h = RightContent.height();
	S = 'UnitId=' + UnitId + '&UnitRevId=' + UnitRevId + '&OfferId=' + OfferId + '&OfferRevId=' + OfferRevId;

	if (UnitId == 0 && UnitRevId == 0 && OfferId == 0 && OfferRevId == 0) {
		RightContent.html(
			'<table width="100%" height="'+h+'" border="0" margin="0" padding="0" cellspacing="0" cellpadding="0"><tr><td width="16">'+
			'&nbsp;'+
			'</td><td>'+
			'<iframe id="RightFrame" name="RightFrame" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="../UnitsGrid_forUnitsTree/index.php?'+S+'">'+
			'</iframe>'+
			'</td></tr></table>');
	} else if (OfferId != 0 || OfferRevId != 0) {
		RightContent.html(
			'<table width="100%" height="'+h+'" border="0" margin="0" padding="0" cellspacing="0" cellpadding="0"><tr><td width="16">'+
			'<a href="javascript:Units_OnLeft()"><img src="../img/arrow_left_green_16.png"/></a>'+
			'</td><td>'+
			'<iframe id="RightFrame" name="RightFrame" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="../UnitsGrid_forUnitsTree/index.php?'+S+'">'+
			'</iframe>'+
			'</td></tr></table>');
	} else {
		RightContent.html(
			'<table width="100%" height="'+h+'" border="0" margin="0" padding="0" cellspacing="0" cellpadding="0"><tr><td width="16">'+
			'<a href="javascript:Units_OnLeft()"><img src="../img/arrow_left_green_16.png"/></a>'+
			'</td><td>'+
			'<iframe id="RightFrame" name="RightFrame" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="../UnitsGrid_forUnitsTree/index.php?'+S+'">'+
			'</iframe>'+
			'</td></tr></table>');
	}

	if (typeof OnSuccess != 'undefined')
		OnSuccess();

	return true;
}

function RefreshTree(OnSuccess) {
	$('#wTree').html(
		'<div id="TreeTools"></div>'+
		'<hr id="TreeToolsHr"/>'+
		'<div id="TreeContent">'+

		'<nobr>'+
		'<div id="branch_root"></div>'+
		'<ul id="branch_root_ul" class="treeview-red">'+
		'</ul>'+
		'</nobr>'+
		'<div id="TreeContentTemp"></div>'+

		'</div>'
		);
	RefreshTreeContent(OnSuccess);
}

function RefreshTreeContent(OnSuccess) {

	function OnSuccess2() {
		RefreshTreeSel();
		if (typeof OnSuccess != 'undefined')
			OnSuccess();
	}

	if (typeof CurOfferId == 'undefined')
		OfferId = 0
	else
		OfferId = CurOfferId;
	if (typeof CurOfferRevId == 'undefined')
		OfferRevId = 0
	else
		OfferRevId = CurOfferRevId;

	$('#branch_root_ul').html('');
	$('#TreeContentTemp').html('');

	if (OfferId > 0 || OfferRevId > 0) {
		ShowFromAjax('../Api/GetOfferTreeJs.php', 'OfferId=' + OfferId + '&OfferRevId=' + OfferRevId, '#TreeContentTemp', OnSuccess2);
	} else if (CurUnitId > 0 || CurUnitRevId > 0)  {
		if (typeof CurTopUnitLevel == 'undefined')
			TopUnitLevel = 0
		else
			TopUnitLevel = CurTopUnitLevel;
		if (typeof CurUnitTypeId == 'undefined')
			UnitTypeId = 0
		else
			UnitTypeId = CurUnitTypeId;
		ShowFromAjax('../Api/GetUnitTreeJs.php', 'TopUnitLevel=' + TopUnitLevel + '&UnitTypeId=' + UnitTypeId, '#TreeContentTemp', OnSuccess2);
	} else {
		if (typeof CurTopUnitLevel == 'undefined')
			TopUnitLevel = 0
		else
			TopUnitLevel = CurTopUnitLevel;
		if (typeof CurUnitTypeId == 'undefined')
			UnitTypeId = 0
		else
			UnitTypeId = CurUnitTypeId;
		ShowFromAjax('../Api/GetUnitsTreeJs.php', 'TopUnitLevel=' + TopUnitLevel + '&UnitTypeId=' + UnitTypeId, '#TreeContentTemp', OnSuccess2);
	}
}

function RefreshTreeSel() {
	if (CurUnitId != 0)
		$('#branch_root_span').css('border', '0');

	if (SelectedOfferId > 0 || SelectedOfferRevId > 0) {
		$('#branch_root_span').css('border', '1px solid red');
	}
}

/*
function RefreshUnitContentItems(UnitId, UnitRevId, UnitIsFixed) {
	ShowFromAjax('../UnitContentItemsGridByUnitRevisionId/index.php', 'UnitId=' + UnitId + '&UnitRevisionId=' + UnitRevId + '&UnitIsFixed=' + UnitIsFixed, '#witems');
}
*/
