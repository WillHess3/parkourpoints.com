// sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
const sheetID = "1qBEYFoz6WATXI8ZubHUMZBz-To-UAkTA6IU6QXcx3qc";

async function getSheetData(sheetName, query){
    const base = `https://corsproxy.io/?https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
    const url = `${base}&sheet=${encodeURIComponent(sheetName)}&tq=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        return responseToObjects(text); 
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; 
    }

    function responseToObjects(res) {
        // credit to Laurence Svekis https://www.udemy.com/course/sheet-data-ajax/
        const jsData = JSON.parse(res.substring(47).slice(0, -2));
        //console.log(jsData);
        let data = [];
        const columns = jsData.table.cols;
        const rows = jsData.table.rows;

        let rStart = 1;
        let row0Data = []
        if (columns[0]["label"] === "") { //row 0 is the header info
            for (let i = 0; i < columns.length; i++) {
                row0Data.push(rows[0]["c"][i]["v"]);
            }
        } else { //row 0 is the first row of data
            rStart = 0;
            for (let i = 0; i < columns.length; i++) {
                row0Data.push(columns[i]["label"]);
                columns[i]["label"] = "";
            }
        }

        for (let r = rStart, rowMax = rows.length; r < rowMax; r++) {
            let rowObject = {};
            for (let c = 0, colMax = columns.length; c < colMax; c++) {
                let cellData = rows[r]["c"][c];
                let propertyName = row0Data[c];
                if (cellData === null) {
                    rowObject[propertyName] = "";
                } else {
                    rowObject[propertyName] = cellData["v"];
                }
            }
            data.push(rowObject);
        }
        return data;
    }
};