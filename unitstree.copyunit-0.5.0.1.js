
var UnitsTreeCopyUnitVer = '0.5.0.0';

// ---- Functions ----

function CopyUnit(UnitId, UnitRevId) {
	$('#test-modal').modal().open();

	Widget = $('#widget');
	h = Widget.height() - 80;

	Url = '../Api/CopyUnit.php?IsHtml=true'+
		'&OfferId='+CurOfferId+
		'&OfferRevId='+CurOfferRevId+
		'&ProtUnitId='+UnitId+
		'&ProtUnitRevId='+UnitRevId+
		//'&ApiCmd='+encodeURIComponent('parent.CopyUnit_Recv1')+
		'&ApiUrl='+encodeURIComponent('../Api/CopyUnit.php')+
		'&ControlUrl='+encodeURIComponent('../UnitControl/index.php')+
		'&ReturnCmd='+encodeURIComponent('parent.CopyUnit_Recv2');

	$('#ModalContent').html('<iframe id="frame_modal" width="100%" height="'+h+'" frameborder="0" class="scMenuIframe" src="'+Url+'"></iframe>');
}

function CopyUnit_Recv1(Params) {
	OfferId = Params['OfferId'];
	OfferRevId = Params['OfferRevId'];
	ProtUnitId = Params['ProtUnitId'];
	ProtUnitRevId = Params['ProtUnitRevId'];
	UnitName = Params['UnitName'];
	UnitTypeId = Params['UnitTypeId'];

	alert('CopyUnit_Recv1: OfferId='+OfferId+' OfferRevId='+OfferRevId+' ProtUnitId='+ProtUnitId+' ProtUnitRevId='+ProtUnitRevId+' UnitName='+UnitName+' UnitTypeId='+UnitTypeId);

	/*
	$.ajax({
		type: "POST",
		url: '../Api/CopyUnit.php',
		data: {
			IsHtml:false,
			// xxxx
			UnitId:UnitId,
			UnitRevId:UnitRevId
		},
		success: function(HtmlData) {
			ClearMain();
			$('#log').html(HtmlData);
		}
	});
	*/
}

function CopyUnit_Recv2(Params) {
	OfferId = Params['OfferId'];
	OfferRevId = Params['OfferRevId'];
	ProtUnitId = Params['ProtUnitId'];
	ProtUnitRevId = Params['ProtUnitRevId'];
	NewUnitId = Params['NewUnitId'];
	NewUnitRevId = Params['NewUnitRevId'];
	UnitName = Params['UnitName'];
	UnitTypeId = Params['UnitTypeId'];

	SelectedUnitId = NewUnitId;
	SelectedUnitRevId = NewUnitRevId;
	SelectedUnitRevIsFixed = 0;

	SelectedUnitRevArr = new Array();
	SelectedUnitRevArr.push(NewUnitRevId);

	if (CurOfferId == OfferId && CurOfferRevId == OfferRevId) {
		RefreshTreeContent(function() {
			SetCurBranch(0, NewUnitId, SelectedUnitRevArr, 0);
			$.modal().close();
		});
	}
}
