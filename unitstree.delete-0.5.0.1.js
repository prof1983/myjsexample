// ---- Vars ----

var UnitsTreeDeleteVer = '0.5.0.0';

// ---- Functions ----

function DeleteOfferContentUnit(OfferId, OfferRevId, ChildUnitId, ChildUnitRevId, OfferContentUnitId) {
	DeleteOfferContentUnit2(OfferId, OfferRevId, ChildUnitId, ChildUnitRevId, function(Html) {
		RefreshTreeContent(function() {
			RefreshLeft2(function () {
				$('#log').html(Html);
			});
		});
	});
}

function DeleteOfferContentUnit2(OfferId, OfferRevId, ChildUnitId, ChildUnitRevId, OnSuccess) {
	$.ajax({
		type: "POST",
		url: '../Api/DeleteOfferContentUnit.php',
		data: {
			DebugLevel: DebugLevel_Info,
			OfferId: OfferId,
			OfferRevId: OfferRevId,
			ChildUnitId: ChildUnitId,
			ChildUnitRevId: ChildUnitRevId
		},
		success: function(Html) {
			if (typeof OnSuccess != 'undefined')
				OnSuccess(Html);
		}
	});
}

function DeleteUnit(Element, UnitId, UnitArr) {
	alert('DeleteUnit: UnitId='+UnitId);
}

function DeleteUnitContentItem(UnitId, UnitRevId, ItemId, UnitContentItemId) {
	alert('DeleteUnitContentItem: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ItemId='+ItemId+' UnitContentItemId='+UnitContentItemId);
}

// Не возвращает ничего
function DeleteUnitContentItem_NoRet(Elem, UnitId, UnitRevId, ItemId, UnitContentItemId) {
	alert('DeleteUnitContentItem_NoRet: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ItemId='+ItemId+' UnitContentItemId='+UnitContentItemId);
}

function DeleteUnitContentUnit(UnitId, UnitRevId, ChildUnitId, ChildUnitRevId, UnitContentUnitId) {
	alert('DeleteUnitContentUnit: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ChildUnitId='+ChildUnitId+' ChildUnitRevId='+ChildUnitRevId+' UnitContentUnitId='+UnitContentUnitId);
}

// deprecated
// Не возвращает ничего
function DeleteUnitContentUnit_NoRet(Elem, UnitId, UnitRevId, ChildUnitId, ChildUnitRevId, UnitContentUnitId) {
	alert('DeleteUnitContentUnit_NoRet: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ChildUnitId='+ChildUnitId+' ChildUnitRevId='+ChildUnitRevId+' UnitContentUnitId='+UnitContentUnitId);
}

// Всегда возвращает False
function DeleteUnitContentUnit_RetFalse(UnitId, UnitRevId, ChildUnitId, ChildUnitRevId, UnitContentUnitId) {
	alert('DeleteUnitContentUnit_RetFalse: UnitId='+UnitId+' UnitRevId='+UnitRevId+' ChildUnitId='+ChildUnitId+' ChildUnitRevId='+ChildUnitRevId+' UnitContentUnitId='+UnitContentUnitId);
}
