const scriptURL = "https://script.google.com/macros/s/AKfycbw77hRtnGMHMJp0OFP_JrtgzCKRt2_oMDtao71pZdhUH8obOfCT0sZEJKgMrREH0TTKZA/exec";

async function getSheetData(sheetName, query) {
    const url = `${scriptURL}?sheet=${encodeURIComponent(sheetName)}&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
