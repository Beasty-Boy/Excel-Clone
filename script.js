let defualtProperties = {
    text: "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Noto Sans",
    "font-size": 16,
};

let cellData = {
    Sheet1: {},
};

let selectedSheet = "Sheet1";
let totalSheets = 1;

$(document).ready(function () {
    let cellContainer = $(".input-cell-container");

    for (let i = 1; i <= 50; i++) {
        let ans = "";
        let n = i;
        while (n > 0) {
            let rem = n % 26;
            if (rem == 0) {
                ans = "Z" + ans;
                n = Math.floor(n / 26) - 1;
            } else {
                ans = String.fromCharCode(rem - 1 + 65) + ans;
                n = Math.floor(n / 26);
            }
        }

        let column = $(
            `<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`
        );
        $(".column-name-container").append(column);
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }

    for (let i = 1; i <= 50; i++) {
        let row = $(`<div class="cell-row"></div>`);
        for (let j = 1; j <= 50; j++) {
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(
                `<div class="input-cell" id="row-${i}-col-${j}" data="code-${colCode}"></div>`
            );
            row.append(column);
        }
        $(".input-cell-container").append(row);
    }
    //  console.log(ans);

    $(".align-icon").click(function () {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".style-icon").click(function () {
        $(this).toggleClass("selected");
    });

    $(".input-cell").click(function (e) {
        if (e.ctrlKey) {
            let [rowId, colId] = getRowCol(this);
            if (rowId > 1) {
                let topCellSelected = $(
                    `#row-${rowId - 1}-col-${colId}`
                ).hasClass("selected");
                if (topCellSelected) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId - 1}-col-${colId}`).addClass(
                        "bottom-cell-selected"
                    );
                }
            }
            if (rowId < 50) {
                let bottomCellSelected = $(
                    `#row-${rowId + 1}-col-${colId}`
                ).hasClass("selected");
                if (bottomCellSelected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId + 1}-col-${colId}`).addClass(
                        "top-cell-selected"
                    );
                }
            }
            if (colId > 1) {
                let leftCellSelected = $(
                    `#row-${rowId}-col-${colId - 1}`
                ).hasClass("selected");
                if (leftCellSelected) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId - 1}`).addClass(
                        "right-cell-selected"
                    );
                }
            }
            if (colId < 50) {
                let rightCellSelected = $(
                    `#row-${rowId}-col-${colId + 1}`
                ).hasClass("selected");
                if (rightCellSelected) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId + 1}`).addClass(
                        "left-cell-selected"
                    );
                }
            }
            $(this).addClass("selected");
        } else {
            $(".input-cell.left-cell-selected").removeClass(
                "left-cell-selected"
            );
            $(".input-cell.right-cell-selected").removeClass(
                "right-cell-selected"
            );
            $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
            $(".input-cell.bottom-cell-selected").removeClass(
                "bottom-cell-selected"
            );
            $(".input-cell.selected").removeClass("selected");
            $(this).addClass("selected");
        }
        changeHeader(this);
    });

    function changeHeader(ele) {
        let [rowId, colId] = getRowCol(ele);
        let cellInfo = defualtProperties;
        if(cellData[selectedSheet][rowId]&&cellData[selectedSheet][rowId][colId]){
            cellInfo = cellData[selectedSheet][rowId][colId];
        }
        cellInfo["font-weight"]?$(".icon-bold").addClass("selected"):$(".icon-bold").removeClass("selected");
        cellInfo["font-style"]?$(".icon-italic").addClass("selected"):$(".icon-italic").removeClass("selected");
        cellInfo["font-decoration"]?$(".icon-underline").addClass("selected"):$(".icon-underline").removeClass("selected");
        let alignment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-"+alignment).addClass("selected");
        $(".background-color-picker").val(cellInfo["background-color"]);
        $(".text-color-picker").val(cellInfo["color"]);
        $(".font-family-selector").val(cellInfo["font-family"]);
        $(".font-family-selector").css("font-family",cellInfo["font-family"]);
        $(".font-size-selector").val(cellInfo["font-size"]);
    }

    $(".input-cell").dblclick(function () {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();
    });

    $(".input-cell").blur(function () {
        $(".input-cell.selected").attr("contenteditable", "false");
    });

    $(".input-cell-container").scroll(function () {
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    });
});

function getRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
    // console.log($(ele).attr("id"));
}

function updateCell(prop, val, defaultPossible) {
    $(".input-cell.selected").each(function () {
        $(this).css(prop, val);
        let [rowId, colId] = getRowCol(this);
        if (cellData[selectedSheet][rowId]) {
            if (cellData[selectedSheet][rowId][colId]) {
                cellData[selectedSheet][rowId][colId][prop] = val;
            } else {
                cellData[selectedSheet][rowId][colId] = {
                    ...defualtProperties,
                };
                cellData[selectedSheet][rowId][colId][prop] = val;
            }
        } else {
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = { ...defualtProperties };
            cellData[selectedSheet][rowId][colId][prop] = val;
        }
        if (
            defaultPossible &&
            JSON.stringify(cellData[selectedSheet][rowId][colId]) ===
                JSON.stringify(defualtProperties)
        ) {
            delete cellData[selectedSheet][rowId][colId];
            if (Object.keys(cellData[selectedSheet][rowId]).length === 0) {
                delete cellData[selectedSheet][rowId];
            }
        }
    });
    // $(ele).css(prop,val);
}

$(".icon-bold").click(function () {
    // console.log(eve);
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "", true);
    } else {
        updateCell("font-weight", "bold", false);
    }
});

$(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "", true);
    } else {
        updateCell("font-style", "italic", false);
    }
});

$(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "", true);
    } else {
        updateCell("text-decoration", "underline", false);
    }
});

$(".icon-align-left").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "left", false);
    }
});

$(".icon-align-right").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "right", false);
    }
});

$(".icon-align-center").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "center", false);
    }
});

$(".font-family-selector").change(function(){
    updateCell("font-family",$(this).val());
    $(".font-family-selector").css("font-family",$(this).val());
});

$(".font-size-selector").change(function(){
    // console.log(typeof $(this).val());
    updateCell("font-size",parseInt($(this).val()));
});

// $(".selector option").click(function () {
//     console.log("hello");
//     if ($(this).hasClass("selected")) {
//         updateCell("font-size", $(this).val(), true);
//     } else {
//         updateCell("font-size", 14, true);
//     }
// });

$(".color-fill-icon").click(function(){
    $(".background-color-picker").click();
});

$(".color-fill-text").click(function(){
    $(".text-color-picker").click();
});

$(".background-color-picker").change(function(){
    updateCell("background-color",$(this).val(),false);
});

$(".text-color-picker").change(function(){
    updateCell("color",$(this).val(),false);
});

