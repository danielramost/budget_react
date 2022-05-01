import React from 'react';
import { utils, writeFileXLSX } from 'xlsx';
import { parseStringDate } from '../utils/utils';

const ExpensesExporter = ({data:allData}) => {
  function exportData(){
    const data = prepareData();
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, "Gastos");
    writeFileXLSX(workbook, "gastos.xlsx");
  }

  function prepareData() {
    const data = allData.map(({date, user, value, group, category, comment}) => {
      return {
        date:parseStringDate(date), user, value, group, category, comment
      };
    });

    return data.sort((a, b) => {
      if (a["date"] < b["date"]) {
        return -1;
      } else if (a["date"] > b["date"]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  return (
    <button className="btn btn-secondary m-2" onClick={exportData}>
      Descargar
    </button>
  );
}
 
export default ExpensesExporter;