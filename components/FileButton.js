import { useRef } from "react";

/* CSS */
import styles from '../styles/Components.module.css'

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
        className={styles.input}
      />
      <button onClick={() => handleUpload()} className={styles.button}>
          <p className={styles.text}>
            SELECCIONAR ARCHIVO
          </p>
      </button>
    </div>
  );
}