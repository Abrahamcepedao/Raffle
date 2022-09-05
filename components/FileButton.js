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
        style={{margin: 'auto', fontSize: "15px", color: "black", padding: "10px 40px", borderRadius: "10px", backgroundImage: "linear-gradient(90deg, #EB2D5F 0%, #8A374D 98.96%)", border: "none", cursor: "pointer"}}
        ><p style={{margin: 'auto', mixBlendMode: 'overlay', lineHeight: '25px', fontSize: '22px'}}>SELECCIONAR ARCHIVO</p>
      </button>
    </div>
  );
}