// ---- Vars ----

var UnitsTreeOnLeftVer = '0.5.0.1-0';

// ---- Functions ----

function Items_OnLeft() {
	alert('Items_OnLeft');
}


// Добавляет сборочные единицы в контент выбранной сборочной единицы в заданном количестве.
function Units_OnLeft() {
	RightFrame1 = window.frames['RightFrame'];
	RightFrame2 = RightFrame1.window.frames['nm_iframe_UnitsGrid_forUnitsTree'];
	Elements = RightFrame2.document.getElementsByClassName('myInput');

	var ChildUnits = new Array;

	for (var i = 0; i < Elements.length; i++) {
		E = Elements.item(i);
		Frm = E.children.item(0);
		Elements2 = Frm.children;
		UnitId = Elements2.UnitId.value;
		Num = Elements2.Num.value;
		if (Num != '' && Num >= 0) {
			ChildUnits.push({
				Id: UnitId,
				Num: Num
			});
		}
	}

	var Data = '';

	LeftContentFrame = window.frames[CurLeftContentFrameName];

	if (typeof LeftContentFrame == 'undefined') {
		alert('Элемент не выбран');
		return;
	}

	LeftContentFrameWin = LeftContentFrame.window;
	ObjTr = LeftContentFrameWin.obj_tr;
	if ((typeof ObjTr != 'undefined') && (typeof ObjTr.childNodes != 'undefined')) {
		Kids = ObjTr.childNodes;
		if (Kids.length > 1) {
			DataElement = Kids[1].childNodes[0].childNodes[0];
			if (typeof DataElement != 'undefined') {
				Data = $(DataElement).data();
				/*
				// ---- UnitContent ----
				console.log('uc_id='+Data['uc_id']+' ur_id='+Data['ur_id']);
				console.log('ucu0_id='+Data['ucu0_id']);
				console.log('ucu0_number='+Data['ucu0_number']);
				console.log('ur0_id='+Data['ur0_id']);
				console.log('ur0_revision='+Data['ur0_revision']);
				console.log('u0_id='+Data['u0_id']);
				console.log('typ='+Data['typ']);
				console.log('uc_id='+Data['uc_id']);
				console.log('uc_number='+Data['uc_number']);
				console.log('ur_id='+Data['ur_id']);
				console.log('ur_revision='+Data['ur_revision']);
				console.log('u_i_id='+Data['u_i_id']);
				*/
			}
		}
	}

	if (typeof Data == 'undefined' || Data == '') {
		alert('Элемент не выбран');
		return;
	}

	Typ = Data['typ'];
	if (ChildUnits.length > 0) {

			/*
			console.log('ocu_id='+Data['ocu_id']);
			console.log('offer_rev_id='+Data['offer_rev_id']);
			console.log('ocu_number='+Data['ocu_number']);
			console.log('ur0_id='+Data['ur0_id']);
			console.log('ur0_is_fixed='+Data['ur0_is_fixed']);
			console.log('ur0_revision='+Data['ur0_revision']);
			console.log('u0_id='+Data['u0_id']);
			console.log('typ='+Data['typ']);
			console.log('uc_id='+Data['uc_id']);
			console.log('uc_number='+Data['uc_number']);
			console.log('ur_id='+Data['ur_id']);
			console.log('ur_revision='+Data['ur_revision']);
			console.log('u_i_id='+Data['u_i_id']);
			*/

		// --- Offer ---
		if (Typ == ElementTyp_Offer_Unit_None) {
			if (Data['offer_rev_elements'] == Data['ur0_id']) {
				$.ajax({
					type: "POST",
					url: "../Api/AddUnitsToOfferContent.php",
					data: {
						DebugLevel: DebugLevel_Info,
						OfferRevId: Data['offer_rev_id'],
						ChildUnits: ChildUnits,
						ReturnCmd: "Units_OnLeft_Recv",
						IsHtml: false
					},
					success: function(HtmlData) {
						$("#log").html(HtmlData);
					}
				});
			} else {
				$.ajax({
					type: "POST",
					url: "../Api/AddUnitsToUnitContent.php",
					data: {
						DebugLevel: DebugLevel_Info,
						ChildUnits: ChildUnits,
						ParentUnitRevId: Data['ur0_id'],
						ReturnCmd: "Units_OnLeft_Recv",
						IsHtml: false
					},
					success: function(HtmlData) {
						$("#log").html(HtmlData);
					}
				});
			}
		} else if (Typ == ElementTyp_Offer_Unit_Unit) {
			$.ajax({
				type: "POST",
				url: "../Api/AddUnitsToUnitContent.php",
				data: {
					DebugLevel: DebugLevel_Info,
					ChildUnits: ChildUnits,
					ParentUnitRevId: Data['ur0_id'],
					ReturnCmd: "Units_OnLeft_Recv",
					IsHtml: false
				},
				success: function(HtmlData) {
					$("#log").html(HtmlData);
				}
			});
		} else if (Typ == ElementTyp_Offer_Unit_Item) {
			$.ajax({
				type: "POST",
				url: "../Api/AddUnitsToOfferContent.php",
				data: {
					DebugLevel: DebugLevel_Info,
					OfferRevId: Data['offer_rev_id'],
					ChildUnits: ChildUnits,
					ReturnCmd: "Units_OnLeft_Recv",
					IsHtml: false
				},
				success: function(HtmlData) {
					$("#log").html(HtmlData);
				}
			});
		}

		// ---- Units ----
		else if (Typ == ElementTyp_Unit_Unit_None) {
			alert('is unit none. Typ='+Typ);
			// xxxx
		} else if (Typ == ElementTyp_Unit_Unit_Unit) {
			alert('is unit unit. Typ='+Typ);
			// xxxx
		} else if (Typ == ElementTyp_Unit_Unit_Item) {
			alert('is unit item. Typ='+Typ);
			// xxxx
		}

		// ---- Units root ----
		else if (Typ == ElementTyp_Unit_Root_None) {
			$.ajax({
				type: "POST",
				url: "../Api/AddUnitsToUnitContent.php",
				data: {
					DebugLevel: DebugLevel_Info,
					ChildUnits: ChildUnits,
					ParentUnitRevId: Data['ur0_id'],
					ReturnCmd: "Units_OnLeft_Recv",
					IsHtml: false
				},
				success: function(HtmlData) {
					$("#log").html(HtmlData);
				}
			});
		} else if (Typ == ElementTyp_Unit_Root_Item) {
			$.ajax({
				type: "POST",
				url: "../Api/AddUnitsToUnitContent.php",
				data: {
					DebugLevel: DebugLevel_Info,
					ChildUnits: ChildUnits,
					ParentUnitRevId: Data['ur0_id'],
					ReturnCmd: "Units_OnLeft_Recv",
					IsHtml: false
				},
				success: function(HtmlData) {
					$("#log").html(HtmlData);
				}
			});
		} else {
			alert('Не известный тип записи. Обратитесь к разработчику. Typ='+Typ+' ChildUnits.length='+ChildUnits.length);
		}

		/*
		$.ajax({
			type: "POST",
			url: "../Api/AddUnitToOfferContent.php",
			data: {
				OfferRevId: OfferRevId,
				ChildUnits: ChildUnits,
				IsHtml: false
			},
			success: function(HtmlData) {
				$("#log").html(HtmlData);
			}
		});
		*/

		/*
		// --- Unit ---
		if (ChildUnits.length > 0) {
			$.ajax({
				type: "POST",
				url: "../Api/AddUnitToUnitContent.php",
				data: {
					UnitRevId: UnitRevId,
					ChildUnits: ChildUnits,
					IsHtml: false
				},
				success: function(HtmlData) {
					RefreshTreeContent(function () {
						RefreshLeft2(function () {
							$("#log").html(HtmlData);
						});
					});
				}
			});
		}
		*/
	}
}

function Units_OnLeft_Recv(Params) {
	RefreshTreeContent(function () {
		RefreshLeft2();
	});
}
