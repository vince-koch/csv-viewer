import { LitElement, css, html } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js';
import { parse } from 'csv-parse';

export class MyElement extends LitElement {
  static get properties() {
    return {
      records: { type: Object }
    }
  }

  constructor() {
    super()
    this.records = []
    this.csvFileRef = createRef();
  }

  render() {
    const recs = this.records.map((record, index) => index === 0
      ? html`<tr>${record.map(cell => html`<th>${cell}</th>`)}</tr>`
      : html`<tr>${record.map(cell => html`<td>${cell}</td>`)}</tr>`)

  console.info(`render with ${this.records.length} records`)

    return html`
      <h1>CSV Viewer</h1>
      <a href="https://vitejs.dev/">Vite</a> | <a href="https://lit.dev/">Lit</a> | <a href="https://csv.js.org/parse/">CSV-Parse</a>

      <div class="card">
        <form @submit=${this._submit}>
          <input type="file" accept=".csv" ${ref(this.csvFileRef)} placeholder="CSV File" />
          <input type="submit" value="Parse" />
        </form>
      </div>

      <table>
        ${recs}
      </table>
    `
  }

  _submit(e) {
    // sample csv files
    // https://people.sc.fsu.edu/~jburkardt/data/csv/csv.html

    e.preventDefault();

    const files = this.csvFileRef.value.files
    if (files.length !== 1) {
      alert("Expected exactly 1 CSV file, but found " + files.length)
      return;
    }

    const me = this
    me.records = []
    const parsedRecords = []

    const input = files[0];

    const parser = parse({
      delimiter: ',',
      ltrim: true,
      rtrim: true
    });

    parser.on('readable', function() {
      let record
      while ((record = parser.read()) !== null) {
        console.info("readable = ", { record, me })
        parsedRecords.push(record)
      }
    });

    parser.on('error', function(err) {
      console.error(err.message)
    });

    parser.on('end', function() {
      me.records = parsedRecords
    });

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      parser.write(text);
      parser.end();
    }

    reader.readAsText(input);
  }

  static get styles() {
    return css`
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }

      .card {
        padding: 1em;
      }

      h1 {
        margin: 0px;
        padding: 0px;
      }

      a {
        font-weight: 500;
        color: #646cff;
        text-decoration: inherit;
      }
      a:hover {
        color: #535bf2;
      }

      input {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
      }
      input:hover {
        border-color: #646cff;
      }
      input:focus,
      input:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }

      table {       
        text-align: left;
      }
      table, th, td {
        border: 1px solid #404040;
        border-collapse: collapse;
        padding: 1px 5px;
      }
      table th {
        color: #747bff;
      }

      @media (prefers-color-scheme: light) {
        a:hover {
          color: #747bff;
        }
        button {
          background-color: #f9f9f9;
        }
      }
    `
  }
}

window.customElements.define('my-element', MyElement)
