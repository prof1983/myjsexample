
var UnitsTreeAddNewUnitVer = '0.5.0.0';

// ---- Functions ---

function AddNewUnit(UnitId, UnitRevId) {
	if (typeof UnitId == 'undefined' && typeof UnitRevId == 'undefined') {
		AddNewUnitToOffer(CurOfferId, CurOfferRevId);
	} else {
		AddNewUnitToUnit(UnitId, UnitRevId);
	}
}

function AddNewUnitToOffer() {
	$('#test-modal').modal().open();

	Widget = $('#widget');
	h = Widget.height() - 80;

	Url = '../Api/AddNewUnit.php?IsHtml=true'+
		'&ParentOfferId='+CurOfferId+
		'&ParentOfferRevId='+CurOfferRevId+
		'&ApiCmd='+encodeURIComponent('parent.AddNewUnitToOffer_Recv1')+
		'&ControlUrl='+encodeURIComponent('../UnitControl/index.php')+
		'&ReturnCmd='+encodeURIComponent('AddNewUnitToOffer_Recv2');
	$('#ModalContent').html('<iframe id="frame_modal" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="'+Url+'"></iframe>');
}

function AddNewUnitToOffer_Recv1(Params) {
	$.modal().close();
	$.ajax({
		type: "POST",
		url: '../Api/AddNewUnit.php',
		data: {
			IsHtml:false,
			DebugLevel:3,
			ParentOfferId:Params['ParentOfferId'],
			ParentOfferRevId:Params['ParentOfferRevId'],
			ParentUnitId:Params['ParentUnitId'],
			ParentUnitRevId:Params['ParentUnitRevId'],
			UnitName:Params['UnitName'],
			UnitTypeId:Params['UnitTypeId'],
			ReturnCmd:Params['ReturnCmd'],
			ReturnUrl:Params['ReturnUrl']
		},
		success: function(html) {
			$('#log').html(html);
		}
	});
}

function AddNewUnitToOffer_Recv2(Params) {
	RefreshTreeContent(function () {
		RefreshLeft2();
	});
}

function AddNewUnitToUnit(UnitId, UnitRevId) {
	$('#test-modal').modal().open();

	Widget = $('#widget');
	h = Widget.height() - 80;

	Url = '../Api/AddNewUnit.php?IsHtml=true'+
		'&ParentUnitId='+UnitId+
		'&ParentUnitRevId='+UnitRevId+
		'&ApiCmd='+encodeURIComponent('parent.AddNewUnitToUnit_Recv1')+
		'&ControlUrl='+encodeURIComponent('../UnitControl/index.php')+
		'&ReturnCmd='+encodeURIComponent('AddNewUnitToUnit_Recv2');
		//'&ReturnUrl='+encodeURIComponent(GetReturnUrl());
	$('#ModalContent').html('<iframe id="frame_modal" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="'+Url+'"></iframe>');
}

function AddNewUnitToUnit_Recv1(Params) {
	$.modal().close();
	$.ajax({
		type: "POST",
		url: '../Api/AddNewUnit.php',
		data: {
			IsHtml:false,
			DebugLevel:3,
			ParentOfferId:Params['ParentOfferId'],
			ParentOfferRevId:Params['ParentOfferRevId'],
			ParentUnitId:Params['ParentUnitId'],
			ParentUnitRevId:Params['ParentUnitRevId'],
			UnitName:Params['UnitName'],
			UnitTypeId:Params['UnitTypeId'],
			ReturnCmd:Params['ReturnCmd'],
			ReturnUrl:Params['ReturnUrl']
		},
		success: function(html) {
			$('#log').html(html);
		}
	});
}

function AddNewUnitToUnit_Recv2(Params) {
	alert('AddNewUnitToUnit_Recv2:');
	RefreshTreeContent(function () {
		RefreshLeft2();
	});
}
