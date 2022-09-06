import { useRef } from "react";

export default function FileBtn({uploadFile}) {
  const fileUpload = useRef(null);

  const handleUpload = () => {
    console.log(fileUpload.current.click(), "fileUpload");
  };

  return (
    <div>
      <input
        type="file"
        ref={fileUpload}
        onChange={uploadFile}
        style={{ opacity: "0", width: '0px' }}
      />
      <button onClick={() => handleUpload()}
        style={{margin: 'auto', fontSize: "15px", color: "black", padding: "10px", borderRadius: "10px", background: "#D92F2B", border: "none", cursor: "pointer"}}
        ><p style={{margin: 'auto', lineHeight: '25px', fontSize: '22px', color: 'white', fontStyle: 'italic'}}>SELECCIONAR ARCHIVO</p>
      </button>
    </div>
  );
}