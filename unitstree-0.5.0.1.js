// ---- Vars ----

var UnitsTreeVer = '0.5.0.0';
var IsLogin = false;
var DefColor = 'black';
var CurLeftContentFrameName = ''; // Имя текущего левого фрейма
var CurOfferId = 0; // Идентификатор текущего отображаемого заказа (корневой элемент)
var CurOfferRevId = 0; // Идентификатор ревизии текущего отображаемого заказа (корневой элемент)
var CurOfferRevIsFixed = 0; // Текущий заказ зафиксирован (0-нет, 1-зафиксирована) (корневой элемент)
var CurOfferMaxRevId = 0; // Идентификатор максимальной ревизии текущего заказа
var CurOfferMaxRev = 0; // Номер максимальный ревизии текущего заказа
var CurUnitId = 0; // (корневой элемент)
var CurUnitRevId = 0; // (корневой элемент)
var CurUnitRevIsFixed = 0; // Текущая ревизия зафиксирована (0-нет;1-завиксирована)
var CurTopUnitLevel = 0; // Используется для фильтрации в дереве
var CurRightValue = 0; // Положение правого переключателя (0-unknown;1-items;2-units)
var CurUnitTypeId = 0; // Используется для фильтрации в дереве
var DebugLevel = 2; // Уровень вывода сообщений для отладки
var SelectedOfferId = 0; // Выбранная ветвь (заказ)
var SelectedOfferRevId = 0; // Выбранная ветвь (заказ)
var SelectedOfferRevIsFixed = 0; // Выбранный заказ зафиксирован (0-нет, 1-зафиксирована)
var SelectedUnitId = 0; // Выбранная ветвь (сборочная единица)
var SelectedUnitRevArr = new Array();
var SelectedUnitRevId = 0; // Выбранная ветвь (сборочная единица)
var SelectedUnitRevIsFixed = 0; // Выбранная ветвь (сборочная единица) зафиксирована (0-нет;1-завиксирована)
var UserId = 0; // Идентификатор текущего пользователя
var UserName = ''; // Имя текущего пользователя

// ---- Consts ----

var DebugLevel_Error = 1;
var DebugLevel_Warn = 2;
var DebugLevel_Info = 3;
var DebugLevel_Comment = 4;
var DebugLevel_Sql = 5;

var ElementTyp_None = 0;
var ElementTyp_Offer_Unit_None = 10;
var ElementTyp_Offer_Unit_Unit = 11;
var ElementTyp_Offer_Unit_Item = 12;
var ElementTyp_Unit_Unit_None = 20;
var ElementTyp_Unit_Unit_Unit = 21;
var ElementTyp_Unit_Unit_Item = 22;
var ElementTyp_Unit_Root_None = 30;
var ElementTyp_Unit_Root_Item = 32;

// --------

function IsArray(V) {
	return (V instanceof Array);
}

// --------

$(function($) {
	//ResizeBlocks();
});

$(window).resize(function() {
	ResizeBlocks();
});

$(document).ready(function() {
	if (!IsLogin) {
		ResizeBlocks2(false);
		return;
	}
	$('.modal .close').on('click', function(e){
		e.preventDefault();
		$.modal().close();
	});
	RefreshTree(function(){
		RefreshLeft();
		RefreshRight(function() {
			ResizeBlocks(function() {
				$('#TreeToolsHr').css('margin', 0);
				$('#branch_root_ul').treeview({
					animated: "fast",
					collapsed: true,
					// persist – принимает строку. Варианты: «location» или «cookie». Если установлено в «location» – выбирает активный элемент древовидного меню в location.href.
					// Если установлено в «cookie» – сохраняет и восстанавливает состояние выбранного элемента древовидного меню в cookie с именем treeview.
					persist: "cookie",
					// cookieId – по умолчанию «treeview». Определяет имя cookie, используемое в опции persist.
					cookieId: "navigationtree",
					// toggle – функция, которая будет вызвана в момент переключения веток. Аргумент this ссылается на переключаемый UL элемент (точнее на набор элементов LI, принадлежащих этому UL).
					toggle: function() {
						console.log(this + " переключено");
					},
					// control – определяет элемент который будет служить управляющим элементов древовидного меню, чтобы позволить пользователю разворачивать, сворачивать или переключать все меню одним кликом.
					unique: true
				});

				if (SelectedOfferId > 0 || SelectedOfferRevId > 0) {
					SetCurOfferBranch(0, SelectedOfferId, SelectedOfferRevId);
				} else {
					RefreshLeft2();
				}

				$('footer').html(
					' main='+UnitsTreeVer+
					' addnewunit='+UnitsTreeAddNewUnitVer+
					' copyunit='+UnitsTreeCopyUnitVer+
					' delete='+UnitsTreeDeleteVer+
					' onleft='+UnitsTreeOnLeftVer+
					' refresh='+UnitsTreeRefreshVer
				);
			});
		});
	});
});

function addItemToUnitContent(unitId, unitRevisionId, itemId, number) {
	alert("addItemToUnitContent(unitId="+unitId+",unitRevisionId="+unitRevisionId+",itemId="+itemId+",number="+number+")");
	$.ajax({
		type: "POST",
		url: "../Api/AddItemToUnitContent.php",
		data: "UnitId="+unitId+"&UnitRevisionId="+unitRevisionId+"&ItemId="+itemId+"&Number="+number+"&IsHtml=true",
		success: function(html) {
			$('#RightTools').html('&nbsp;');
			$('#RightContent').html(html);
		}
	});
	return true;
}

function AddNewUnitRevision(UnitId) {
	$.ajax({
		type: "POST",
		url: '../Api/AddNewUnitRevision.php',
		data: 'IsHtml=false&UnitId='+UnitId,
		success: function(html) {
			ClearSelected();
			RefreshTreeContent(function () {
				$('#log').html(html);
			});
		}
	});
}

function AddUnit(Element, UnitId, UnitRevArr) {
	if (!IsArray(UnitRevArr)) {
		console.error('UnitRevArr is not array in AddUnit()');
		return false;
	}
	if (UnitRevArr.length <= 0) {
		console.error('UnitRevArr.length <= 0 in AddUnit()');
		return false;
	}
	var UnitRevId = UnitRevArr[UnitRevArr.length-1];
	document.location.href = '../UnitContentUnitForm/index.php?UnitRevisionId='+UnitRevId+'&nmgp_opcao=novo';
	//print('<div><a href="../UnitForm/index.php?nmgp_opcao=novo" title="Создать новую сборочную единицу">Создать</a></div>');
}

// Добавляет сборочную единицу в заказ (в offer_content_unit)
function AddUnitToOffer(OfferRevId, UnitId, Num, NumberElement) {
	DataSend = "OfferRevId="+OfferRevId+"&UnitId="+UnitId+"&Number="+Num+"&IsHtml=false";

	j = $.getJSON("../Api/Test1.php", DataSend);
	j.success(function(DataRecv) {
		//alert('Успешное выполнение');
		S = '';
		$.each(DataRecv, function(Key, Val) {
			alert('Key '+Key+' Val '+Val);
			if (Key == 'Result') {
				if (Val == 'Ok') {
					alert('Операция выполнена успешно');
					return;
				}
			}
			S = S + Key + '=' + Val + '; ';
		});
	});
	j.error(function() {
		alert('Ошибка выполнения');
	});
	//j.complete(function() {
		//alert('Завершение выполнения');
	//});

	/*
	$.getJSON("../Api/Test1.php", DataSend, function(DataRecv) {
		S = '';
		$.each(DataRecv, function(Key, Val) {
			if (Key == 'Result') {
				if (Val == 'Ok') {
					alert('Операция выполнена успешно');
					return;
				}
			}
			S = S + key + '=' + val + '; ';
		})
		$('#log').html(DataSend + ' - ' + S);
	});
	*/
	/*
	$.ajax({
		type: "POST",
		url: "../Api/AddUnitToOfferContent.php",
		data: "OfferRevId="+OfferRevId+"&UnitId="+UnitId+"&Number="+Number+"&IsHtml=false",
		success: function(html) {
			$('log').html(S + ' - Ok');
			//$('#wright').html(html);
		}
	});
	*/
	return true;
}

function addUnit_OfferRev(element, offerRevId) {
	$('#LeftContent').html('');
	$('#RightTools').html('&nbsp;');
	$('#RightContent').html('<iframe width="100%" height="99%" frameborder="0" class="scMenuIframe" src="../UnitsGrid_forUnitsTree/index.php?OfferRevId='+offerRevId+'"></iframe>');
	ShowOfferContentUnits(0, offerRevId);
}

// Создает первую ревизию для сборочной единицы и открывает форму для добавления в неё сборочных единиц (UnitContentUnitForm)
function AddUnit_NoRev(Element, UnitId) {
	alert('AddUnit_NoRev');
	$.ajax({
		url: "../Api/Test1.php",
		cache: false,
		success: function(html){
			$("#content").html(html);
		}
	});

	//var UnitRevId = UnitRevArr[UnitRevArr.length-1];
	//document.location.href = '../UnitContentUnitForm/index.php?UnitRevisionId='+UnitRevId+'&nmgp_opcao=novo';
	//print('<div><a href="../UnitForm/index.php?nmgp_opcao=novo" title="Создать новую сборочную единицу">Создать</a></div>');

	//alert('AddUnit');
}

function ClearMain() {
	$('#witems').html('');
	$('#wunits').html('');
	$('#wRight').html('');
}

function ClearSelected() {
	ClearMain();

	SelectedUnitId = 0;
	SelectedUnitRevId = 0;
	SelectedUnitRevIsFixed = 0;
	SelectedOfferId = 0;
	SelectedOfferRevId = 0;
	SelectedOfferRevIsFixed = 0;

	// Уберем выделение у предыдущей ветви
	UnSetBranchStyle(SelectedUnitRevArr);
}

function EditItem(ItemId) {
	alert('EditItem: ItemId='+ItemId);
}

function EditUnit(Element, UnitId, UnitArr) {
	alert('EditUnit');
}

function EditUnit2(UnitId, UnitRevId, ParentUnitId, ParentUnitRevId, UnitContentUnitId) {
	alert('EditUnit2: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ParentUnitId='+ParentUnitId+' ParentUnitRevId='+ParentUnitRevId+' UnitContentUnitId='+UnitContentUnitId);
}

function EditUnit_NoRet(Element, UnitId, UnitRevId, ParentUnitId, ParentUnitRevId, UnitContentUnitId) {
	alert('EditUnit_NoRet: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ParentUnitId='+ParentUnitId+' ParentUnitRevId='+ParentUnitRevId+' UnitContentUnitId='+UnitContentUnitId);
}

function GetCurUnitRevId() {
	return GetUnitRevId(SelectedUnitRevArr);
}

function GetFrameDoc(e) {
	return (e.contentDocument) ? e.contentDocument : (e.contentWindow) ? e.contentWindow.document : e.document;
}

function GetUnitRevId(UnitRevArr) {
	if (UnitRevArr.length > 0)
		return UnitRevArr[UnitRevArr.length-1]
	else
		return 0;
}

function IsOffer() {
	return (typeof CurOfferId != 'undefined' || typeof CurOfferRevId != 'undefined');
}

function LockOffer(OfferId, OfferRevId) {
	$.ajax({
		type: "POST",
		url: '../Api/FixOfferRevision.php',
		data: {
			OfferId: OfferId,
			OfferRevId: OfferRevId,
			IsHtml: false
		},
		success: function(HtmlData) {
			ClearMain();
			$('#log').html(HtmlData);
		}
	});
}

function LockUnit(UnitId, UnitRevId) {
	//UnitRevId = GetUnitRevId(UnitArr);
	$.ajax({
		type: "POST",
		url: '../Api/FixUnitRevision.php',
		data: {
			IsHtml:false,
			UnitId:UnitId,
			UnitRevId:UnitRevId
		},
		success: function(HtmlData) {
			ClearMain();
			$('#log').html(HtmlData);
		}
	});
}

function Nop() {}

function PrintButton2(Text, Url, IsSelect, OnClick) {
	return '<button style="align:center;vertical-align:middle;margin:0;padding:0;height:20px" type="button" onclick="'+OnClick+'">'+Text+'</button>';
}

function PrintButtonS(Text, Url, IsSelect, OnClick) {
	var S = '<a';
	if (IsSelect) {
		S += ' class="scButton_onmousedown"';
	} else {
		S += ' class="scButton_default"';
	}
	if (typeof OnClick != 'undefined')
		S += ' onclick="'+OnClick+'"';
	S += ' onmouseover="main_style=this.className;this.className=\'scButton_onmouseover\';"';
	S += ' onmouseout="this.className=main_style;"';
	S += ' onmousedown="this.className=\'scButton_onmousedown\';"';
	S += ' onmouseup="this.className=\'scButton_onmouseover\';"';
	S += ' href="'+Url+'">'+Text+'</a>';
	return S;
}

function RepairUnitLevel(Units) {
	$.ajax({
		type: "POST",
		url: '../Api/RepairUnitLevel.php',
		data: {
			Units: Units, // Массив идентификаторов ревизий сб.единиц
			IsHtml: false
		},
		success: function(HtmlData) {
			//ClearMain();
			RefreshTreeContent();
			$('#log').html(HtmlData);
		}
	});
}

function ResizeBlocks(OnSuccess) {
	widget = $('#widget');
	widget.height('100%');
	widget.width('100%');

	Footer = $('footer');
	Footer_h = Footer.outerHeight(true);

	FooterHr = $('#FooterHr');
	FooterHr.css('margin', 0);
	FooterHr_h = FooterHr.outerHeight(true);

	widget.height(widget.height() - Footer_h - FooterHr_h);
	widget_h = widget.outerHeight(true);

	if (ShowLog == 1)
		widget.split({orientation:'horizontal', limit:16}).position(widget_h-32)
	else
		widget.split({orientation:'horizontal', limit:16}).position(widget_h-16);

	wBase = $('#wBase');
	wBase.width('100%').split({orientation:'vertical', limit:200}).position(300);

	wMain = $('#wMain');
	wMain.split({orientation:'vertical', limit:300}).position('50%');
	wMain_h = wMain.outerHeight(true);

	wLeft = $('#wLeft');
	wLeft.height(wMain_h);
	Left_h = wLeft.height();
	LeftTools_h = $('#LeftTools').outerHeight(true);
	LeftToolsHr_h = $('#LeftToolsHr').outerHeight(true);

	wcontent = $('#LeftContent');
	wcontent.height(Left_h - LeftTools_h - LeftToolsHr_h - 4);
	wcontent.width('100%').split({orientation:'horizontal', limit:300}).position('45%');

	if (typeof OnSuccess != 'undefined')
		OnSuccess();
}

function ResizeBlocks2(IsRefreshBase, OnSuccess) {
	widget = $('#widget');
	widget.height('100%');
	widget.width('100%');

	Footer = $('footer');
	Footer_h = Footer.outerHeight(true);

	FooterHr = $('#FooterHr');
	FooterHr.css('margin', 0);
	FooterHr_h = FooterHr.outerHeight(true);

	widget.height(widget.height() - Footer_h - FooterHr_h);
	widget_h = widget.outerHeight(true);

	if (ShowLog == 1)
		widget.split({orientation:'horizontal', limit:16}).position(widget_h-32)
	else
		widget.split({orientation:'horizontal', limit:16}).position(widget_h-16);

	wBase = $('#wBase');
	wBase.width('100%');

	if (IsRefreshBase) {
		wBase.width('100%').split({orientation:'vertical', limit:200}).position(300);

		wMain = $('#wMain');
		wMain.split({orientation:'vertical', limit:300}).position('50%');
		wMain_h = wMain.outerHeight(true);

		wLeft = $('#wLeft');
		wLeft.height(wMain_h);
		Left_h = wLeft.height();
		LeftTools_h = $('#LeftTools').outerHeight(true);
		LeftToolsHr_h = $('#LeftToolsHr').outerHeight(true);

		wcontent = $('#LeftContent');
		wcontent.height(Left_h - LeftTools_h - LeftToolsHr_h - 4);
		wcontent.width('100%').split({orientation:'horizontal', limit:300}).position('45%');
	}

	if (typeof OnSuccess != 'undefined')
		OnSuccess();
}

function SetBranchStyle(UnitRevArr) {
	if (!IsArray(UnitRevArr)) {
		console.error('UnitRevArr is not Array');
		return false;
	}
	for (var j = 0; j < UnitRevArr.length; j++) {
		S = '';
		for (var i = 0; i <= j; i++) {
			S = S + '_' + UnitRevArr[i];
		}
		e = $('#branch'+S+'_a');
		e.css('color', 'red');
		if (j == UnitRevArr.length-1) {
			e.css('border', '1px solid red');
		}
	}
	return true;
}

function SetCurBranch(Element, UnitId, UnitRevArr, UnitRevIsFixed) {
	// Если в первый раз, то узнаем цвет элемента по умолчанию
	if ((UnitRevArr.length == 0) && (UnitRevArr.length > 0) && (UnitRevArr[0] > 0)) {
		DefColor = $('#branch_'+UnitRevArr[0]+'_a').css('color');
	}

	// Очистим
	ClearSelected();

	// -- Временная переменная A --
	var A = '';
	if (UnitRevArr.length > 0) {
		A = UnitRevArr[0];
		for (var i = 0; i < UnitRevArr.length; i++) {
			A = A + ',' + UnitRevArr[i];
		}
	}

	// -- Установим текущие глобальные параметры --

	SelectedUnitRevArr = new Array();
	for (var i = 0; i < UnitRevArr.length; i++) {
		SelectedUnitRevArr.push(UnitRevArr[i]);
	}

	SelectedUnitId = UnitId;
	SelectedUnitRevId = GetCurUnitRevId();
	SelectedUnitRevIsFixed = UnitRevIsFixed;

	RefreshCurBranch();
}

function SetCurOfferBranch(Element, OfferId, OfferRevId, OfferIsFixed) {
	// Очистим
	ClearSelected();

	SelectedOfferId = OfferId;
	SelectedOfferRevId = OfferRevId;
	if (typeof OfferIsFixed == 'undefined')
		SelectedOfferRevIsFixed = CurOfferRevIsFixed
	else
		SelectedOfferRevIsFixed = OfferIsFixed;

	SelectedUnitRevArr = new Array();

	RefreshTreeSel();
	RefreshLeft2(function () {
		RefreshRight();
	});
}

function SetCurRightValue(RightValue) {
	if (typeof RightValue == 'undefined')
		return;
	CurRightValue = RightValue;
	RefreshRightContent();
}

function SetOfferContentUnitNumber(OfferRevId, ChildUnitRevId, Num, OfferContentUnitId) {
	if (typeof OfferContentUnitId == 'undefined') {
		alert('Ошибка в параметрах. Обратитесь к разработчику.');
	} else {
		fr = window.frames[CurLeftContentFrameName];
		if (typeof fr != 'undefined') {
			e = fr.window.document.getElementById('div2_'+OfferContentUnitId);
			if (typeof e != 'undefined')
				$(e.childNodes[0]).css('display', '');

			$.ajax({
				type: "POST",
				url: "../Api/SetOfferContentUnitNumber.php",
				data: {
					DebugLevel:DebugLevel_Info,
					OfferRevId:OfferRevId,
					ChildUnitRevId:ChildUnitRevId,
					Num:Num,
					OfferContentUnitId:OfferContentUnitId
				},
				success: function(Html) {
					$('#log').html(Html);
				}
			});
		}
	}
}

function SetOfferContentUnitNumber_Success(OfferRevId, ChildUnitRevId, Num, OfferContentUnitId) {
	fr = window.frames[CurLeftContentFrameName];
	if (typeof fr != 'undefined') {
		e = fr.window.document.getElementById('div2_'+OfferContentUnitId);
		if (typeof e != 'undefined'){
			$(e.childNodes[0]).css('display', 'none');
			e.childNodes[1].value = Num;
		}
	}
}

function SetUnitContentItemNumber_ByUcu(UcuId, Value) {
	alert('SetUnitContentItemNumber_ByUcu: UcuId='+UcuId+' Value='+Value);
}

function SetUnitContentUnitNumber(Elem, UnitId, UnitRevId, ChildUnitId, ChildUnitRevId, Value) {
	alert('SetUnitContentUnitNumber: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ChildUnitId='+ChildUnitId+' ChildUnitRevId='+ChildUnitRevId+' Value='+Value);
	return false;
}

function SetUnitContentUnitNumber_ByUcu(UcuId, Value) {
	alert('SetUnitContentUnitNumber_ByUcu: UcuId='+UcuId+' Value='+Value);
}

function ShowFromAjax(Url, Params, ComponentName, OnSuccess) {
	$.ajax({
		type: "POST",
		url: Url,
		data: Params,
		success: function(HtmlData) {
			$(ComponentName).html(HtmlData);
			if (typeof OnSuccess != 'undefined')
				OnSuccess();
		}
	});
}

function ShowOfferContentUnits(OfferId, OfferRevId) {
	ShowFromAjax('../OfferContentUnitByOfferRevId/index.php', 'OfferRevId='+OfferRevId, '#wunits');
}

function ShowOfferRevisions(OfferId, OfferRevId) {
	$('#test-modal').modal().open();

	Widget = $('#widget');
	h = Widget.height() - 80;

	Url = '../OfferRevisionsGrid/index.php'+
		'?OfferId='+OfferId+
		'&ReturnCmd='+encodeURIComponent('parent.ShowOfferRevisions_Recv');

	$('#ModalContent').html('<iframe id="frame_modal" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="'+Url+'"></iframe>');
}

function ShowOfferRevisions_Recv(Params) {
	CurOfferId = Params['OfferId'];
	CurOfferRevId = Params['OfferRevId'];
	CurOfferRevIsFixed = Params['OfferRevIsFixed'];
	CurOfferMaxRevId = Params['OfferMaxRevId'];
	CurOfferMaxRev = Params['OfferMaxRev'];
	RefreshTreeContent(function() {
		SetCurOfferBranch(0, CurOfferId, CurOfferRevId);
		$.modal().close();
	});
}

function ShowUnit(UnitId, UnitRevId) {
	alert('ShowUnit: UnitId='+UnitId+' UnitRevId='+UnitRevId);
}

function ShowUnitRevisions(UnitId, UnitRevId) {
	$('#test-modal').modal().open();

	Widget = $('#widget');
	h = Widget.height() - 80;

	Url = '../UnitRevisionsGrid/index.php?UnitId='+UnitId+
		'&ReturnCmd='+encodeURIComponent('parent.ShowUnitRevisions_Recv');

	$('#ModalContent').html('<iframe id="frame_modal" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="'+Url+'"></iframe>');
}

function ShowUnitRevisions_Recv(Params) {
	CurUnitId = Params['UnitId']; // (корневой элемент)
	CurUnitRevId = Params['UnitRevId']; // (корневой элемент)
	CurUnitRevIsFixed = Params['UnitRevIsFixed']; // Текущая ревизия зафиксирована (0-нет;1-завиксирована)
	RefreshTreeContent(function() {
		alert(2);
		SelectedUnitId = CurUnitId; // Выбранная ветвь (сборочная единица)
		SelectedUnitRevArr = new Array();
		SelectedUnitRevId = CurUnitRevId; // Выбранная ветвь (сборочная единица)
		SelectedUnitRevIsFixed = CurUnitRevIsFixed; // Выбранная ветвь (сборочная единица) зафиксирована (0-нет;1-завиксирована)
		RefreshCurBranch();
		//SetCurBranch(0, CurUnitId, SelectedUnitRevArr, CurUnitRevIsFixed);
		$.modal().close();
	});
}

// deprecated
// Не возвращает ничего
function ShowUnit_NoRet(UnitId, UnitRevId) {
	alert('ShowUnit_NoRet: UnitId='+UnitId+' UnitRevId='+UnitRevId);
}

function UnitTypeIdChange() {
	v = $('#UnitTypeIdBox').val();
	CurUnitTypeId = v;
	RefreshTreeContent();
}

function UnLockOffer(OfferId, OfferRevId) {
	if (typeof OfferId == 'undefined')
		OfferId = 0;
	if (typeof OfferRevId == 'undefined')
		OfferRevId = 0;
	$.ajax({
		type: "POST",
		url: '../Api/AddNewOfferRevision.php',
		data: {
			OfferId: OfferId,
			OfferRevId: OfferRevId,
			UserId: UserId,
			IsHtml: false
		},
		success: function(HtmlData) {
			ClearMain();
			$('#log').html(HtmlData);
		}
	});
}

function UnLockUnit(UnitId, UnitRevId) {
	$.ajax({
		type: "POST",
		url: '../Api/AddNewUnitRevision.php',
		data: {
			UnitId: UnitId,
			IsHtml: false
		},
		success: function(HtmlData) {
			ClearMain();
			$('#log').html(HtmlData);
		}
	});
}

function UnSetBranchStyle(UnitRevArr) {
	if (!IsArray(UnitRevArr)) {
		console.error('UnitRevArr is not Array');
		return false;
	}
	for (var j = 0; j < UnitRevArr.length; j++) {
		S = '';
		for (var i = 0; i <= j; i++) {
			S = S + '_' + UnitRevArr[i];
		}
		e = $('#branch'+S+'_a');
		e.css('color', DefColor);
		e.css('border', '0px');
	}
}

function UpdateOfferContentUnit(ContainerOfferRevId, UnitId, UnitRevId, MaxRevId) {
	$.ajax({
		type: "POST",
		url: '../Api/UpdateOfferContentUnit.php',
		data: {
			ContainerOfferRevId:ContainerOfferRevId,
			UnitId:UnitId,
			IsHtml:false
		},
		success: function(HtmlData) {
			ClearMain();
			$('#log').html(HtmlData);
		}
	});
}

function UpdateUnitContentUnit(ContainerUnitRevId, UnitId, UnitRevId, MaxRevId) {
	$.ajax({
		type: "POST",
		url: '../Api/UpdateUnitContentUnit.php',
		data: {
			ContainerUnitRevId:ContainerUnitRevId,
			UnitId:UnitId,
			IsHtml:false
		},
		success: function(HtmlData) {
			ClearMain();
			$('#log').html(HtmlData);
		}
	});
}
