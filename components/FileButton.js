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
        style={{margin: 'auto', fontSize: "15px", color: "black", padding: "5px 40px", borderRadius: "25px", backgroundImage: "linear-gradient(90deg, #EB2D5F 0%, #8A374D 98.96%);", border: "none", cursor: "pointer"}}
        ><p style={{mixBlendMode: 'overlay', lineHeight: '5px', fontSize: '22px'}}>SELECT FILES</p>
      </button>
    </div>
  );
}