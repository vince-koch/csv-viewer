import React from "react"
import "./FileUploadComponent.css";

export default function FileDropUploadComponent({
  acceptFileTypes = undefined,
  canDropMultiple = false,
  onFiles
}: {
  acceptFileTypes?: string[] | string | undefined,
  canDropMultiple?: boolean
  onFiles: ((files: FileList) => void)
}) {
    const [isDragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const accept = Array.isArray(acceptFileTypes) ? acceptFileTypes.join(",") : acceptFileTypes

    // handle drag events
    const handleDrag = function(e: React.DragEvent<HTMLElement>) {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === "dragenter" || e.type === "dragover" && e.dataTransfer.items) {
        const validItemTypes = accept?.split(",").map(i => i.trim());
        const items = Array.from(e.dataTransfer.items);
        const hasValidItemCount = canDropMultiple ? items.length > 0 : items.length == 1;
        const hasValidFiles = items.every(item => item.kind == "file" 
          && (validItemTypes == undefined || validItemTypes.includes(item.type)));

        if (hasValidItemCount && hasValidFiles) {
          setDragActive(true);
        }
        else {
          console.warn("rejecting file types", items.map(item => item.type));
        }
      }
      else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
    
    // triggers when file is dropped
    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    };
    
    // triggers the input when the button is clicked
    const handleButtonClick = () => {
      inputRef.current?.click();
    };

    // triggers when file is selected with click
    const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    };
    
    // do something when files are uploaded
    const handleFiles = function(files: FileList) {
      if (onFiles != undefined) {
        onFiles(files);
      }
    }

    // render
    return (
      <form className="file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" accept={accept} multiple={canDropMultiple} onChange={handleChange} />
        <label className={isDragActive ? "drag-active" : "" }>
          <div>
            <p>Drop your {canDropMultiple ? "files" : "file"} here or click to <button onClick={handleButtonClick}>Upload</button></p>
          </div> 
        </label>
        { isDragActive && <div className="drop-target" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
      </form>
    );
  };