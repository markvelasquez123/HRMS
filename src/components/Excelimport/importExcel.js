import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const ImportExcel = (laman, pangalan ) => {
    if(!laman){
        alert("Walang laman");
        return;
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(laman);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //pag wala tong line 15 hindi siya downloadable
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${pangalan}.xlsx`);
}

export default ImportExcel;