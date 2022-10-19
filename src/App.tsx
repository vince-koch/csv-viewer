import { useState } from "react";
import FileUploadComponent from "./FileUploadComponent";
import TableComponent from "./TableComponent";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [ records, setRecords ] = useState<string[][]>();

  const handleFiles = (files: FileList) => {
    console.info("handleFiles ==> ", files);

    Papa.parse<string[]>(
      files[0], 
      {
        delimiter: ",",
        beforeFirstChunk: function(chunk) {
          var rows = chunk.trim().replace(/\s*,\s*/g, ',');
          return rows;
        },
        complete: function(results) {
            console.log("csv parsed ==> ", results.data);
            setRecords(results.data);
        }
      });
  } 

  return (
    <div className="App">
      <h1>CSV Viewer</h1>
      <div>
        <a style={{color: "#bd34fe"}} href="https://vitejs.dev" target="_blank">Vite</a>
        <span> | </span>
        <a style={{color: "#61dafb"}} href="https://reactjs.org" target="_blank">React</a>
        <span> | </span>
        <a style={{color: "#1D80AB"}} href="https://www.papaparse.com/" target="_blank">Papa Parse</a>
      </div>
      <br/>
      <FileUploadComponent onFiles={handleFiles} acceptFileTypes={["text/csv", "text/comma-separated-values"]} />
      <br/>
      <TableComponent records={records} />       
    </div>
  )
}

export default App
