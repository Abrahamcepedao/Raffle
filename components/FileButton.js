import { useRef } from "react";

export default function FileBtn({uploadFile}) {
  const fileUpload = useRef(null);

  const handleUpload = () => {
    console.log(fileUpload.current.click(), "fileUpload");
  };

  return (
    <>
      <input
        type="file"
        ref={fileUpload}
        onChange={uploadFile}
        style={{ opacity: "0" }}
      />
      <button onClick={() => handleUpload()}
        style={{fontSize: "15px", color: "white", padding: "10px 40px", borderRadius: "25px", backgroundColor: "rgb(14, 51, 127)", border: "none", cursor: "pointer"}}
        >SELECT FILE
      </button>
    </>
  );
}