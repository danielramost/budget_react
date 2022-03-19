import React, {Component} from 'react';
import ReactExport from 'react-data-export';
import { getSerialDate, parseStringDate } from './utils';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class Exporter extends Component {
  render() {
    const data = this.props.data.map((record) => {
      return this.props.fields.map((field) => {
        if (field.field === "date") {
          return { value: getSerialDate(parseStringDate(record[field.field])), style: { numFmt: "d-mmm-yy" } };
        } else {
          return { value: record[field.field] };
        }
      });
    });

    const columns = this.props.fields.map((field) => {
      const width = field.field === "date" || field.field === "user" || field.field === "value" ? 80 : 120;
      return { title: ""/*field.label*/, width: { wpx: width } };
    });

    const dataSet = [{
      columns: columns,
      data: data,
    }];

    return (
      <div>
        <ExcelFile filename="gastos" element={<button className="btn btn-link">Descargar</button>}>
          <ExcelSheet dataSet={dataSet} name="Hoja1" />
        </ExcelFile>
      </div>
    );
  }
}

export default Exporter;