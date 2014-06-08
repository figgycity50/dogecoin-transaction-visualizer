function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
    (
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"),
        "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [
        []
    ];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
        strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"),
                "\"");

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

google.load("visualization", "1", {
    packages: ["corechart"]
});
//google.setOnLoadCallback(drawChart);
function drawChart(dara, name) {
    console.log("cl", dara);
    var headers = dara[0];
    dara.push(headers);
    dara.splice(0, 1);
    console.log("cls", dara);
    dara = dara.reverse();
    console.log("clr", dara);
    dara[0][1] = "Balance";
    var blnc = 0;
    for (var i = 1; i < dara.length; i++) {
        blnc = blnc + dara[i][1];
        dara[i][1] = blnc;
    }
    for (var i = 1; i < dara.length; i++) {
        dara[i][0] = new Date(dara[i][0]);
    }
    console.log("clb", dara);

    var data = google.visualization.arrayToDataTable(dara);

    var options = {
        width: 800,
        height: 600,
        title: name
    };

    var chtdiv = document.createElement('div');
    chtdiv.className = "chart_div";
    var chart = new google.visualization.LineChart(chtdiv);
    chart.draw(data, options);

    var chtdivs = document.querySelector('#chart_divs');
    chtdivs.appendChild(chtdiv);
}

var f = null;
var reader = null;

var inputElement = document.querySelector("input");

function handleFiles(fss) {
    var fileList = fss; /* now you can work with the file list */
    console.log(fileList);
    for (var i = 0; i < fss.length; i++) {
        f = fss[i];
        reader = new FileReader();
        reader.onload = function (e) {
            console.log(e.target.result);
            var array = CSVToArray(e.target.result);
            array.splice(array.length - 1, 1);
            for (var i = 0; i < array.length; i++) {
                console.log("splicepre", array[i]);
                array[i].splice(0, 1);
                console.log("splice1", array[i]);
                array[i].splice(3, 1);
                console.log("splice2", array[i]);
                array[i].splice(4, 1);
                console.log("splice3", array[i]);
                array[i].splice(5, 1);
                console.log("splice4", array[i]);
                array[i].splice(7, 1);
                console.log("splice5", array[i]);
                array[i].splice(2, 1);
                console.log("splice6", array[i]);
                array[i].splice(1, 1);
                console.log("splice7", array[i]);
                console.log(array[i][1]);
                if (i !== 0) {
                    array[i][1] = replaceAll(",", "", array[i][1])
                    console.log(parseFloat(array[i][1]));
                    array[i][1] = parseFloat(array[i][1]);
                }
            }
            console.log(i, f)
            drawChart(array, f.name);
        };
        reader.readAsText(f);
    }
}