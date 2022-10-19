import React from "react"
import "./TableComponent.css";

export default function TableComponent({
    records = undefined
  }: {
    records: string[][] | undefined
  }) {
    if (!Array.isArray(records) || records.length === 0) {
        return null;
    }

    return (
        <table>
            {
                records.map((record, index) => index === 0
                    ? <tr>{record.map(cell => <th>{cell}</th>)}</tr>
                    : <tr>{record.map(cell => <td>{cell}</td>)}</tr>) 
            }
        </table>);
  };