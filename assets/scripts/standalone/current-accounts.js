$(document).ready(function () {

  if ($("#nameDocs").length) {
      initCheckboxes(2);
      toggleBtn();
  }

  if ($("#addressDocs").length || $("#incomeDocs").length) {
      initRadios();
  }

  //$("#submitBtn, #skipBtn").on("click", function (e) {
  //    e.preventDefault();
  //    if ($("form input:checked").length >= 1) {
  //        if ($(this).attr("id") == "skipBtn") {
  //            $("#stage").val("summary");
  //        }
  //        $("form").submit();
  //    }
  //});
});

function initCheckboxes(maxSelect) {
  lastClicked = null;
  $("form input[type=checkbox]").each(function () {
      if ($(this).is(":checked")) {
          lastClicked = this;
      }
  });
  $("form input[type=checkbox]").on("click", function (e) {
      if ($(this).is(":checked")) {
          if ($("form input:checked").length > maxSelect) {
              $(lastClicked).prop("checked", false);
          }
          lastClicked = this;
      }
      toggleBtn();
  });
}

function initRadios() {
  $("form label.custom-control-label").on("click", function (e) {
      $("#submitBtn, #skipBtn").css({ "cursor": "pointer", "opacity": 1 }).removeAttr('disabled');
  });
}

function toggleBtn() {
  if ($("form input:checked").length > 0 || $("#bypass").length) {
      $("#submitBtn, #skipBtn").css({ "cursor": "pointer", "opacity": 1 }).removeAttr('disabled');
  } else {
      $("#submitBtn, #skipBtn").css({ "cursor": "not-allowed", "opacity": 0.65 }).attr('disabled', 'disabled');
  }
}
