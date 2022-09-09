import type { NextPage } from 'next'

/* React */
import React, { useState } from 'react'

/* Components */
import Head from 'next/head'
import Link from 'next/link'
import FileButton from '../components/FileButton'
import Image from 'next/image'
import Logo from '../public/img/mobil_logo.png'
import Image1 from '../public/img/mobil1.png'
import Image2 from '../public/img/mobil2.png'

/* Redux */
import { 
  setDropDepth, 
  setInDropZone, 
  setReduxParticipants,
} from "../redux/actions"
import { selectDropDepth } from "../redux/states/file/reducer"
import { useAppSelector, useAppDispatch } from '../redux/hooks'

/* Material UI */
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

/* CSS */
import styles from '../styles/Home.module.css'

/* XLSX */
import readXlsxFile from 'read-excel-file'

/* Papaparse */
import Papa from "papaparse";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const Home: NextPage = () => {

  /* useState - upload */
  const [state, setState] = useState({
    fileName: "",
    loading: false,
    error: "",
    severity: "error",
    step: 0,
    open: false,
  });

  const [number, setNumber] = useState<number>(0);
  const [intervalID, setIntervalID] = useState<number>(0);

   /* Redux */
  const dispatch = useAppDispatch(); //function that allows to trigger actions that update the redux state
  /* redux - file */
  const dropDepth = useAppSelector(selectDropDepth) //function that allows to get the dropDepth from the redux state

  /* Functions - handle drag and drop */
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(setDropDepth(dropDepth + 1)); //increase drop depth
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(setDropDepth(dropDepth - 1)); //decrease drop depth
    if(dropDepth > 0) return //if drop depth is greater than 0, do nothing
    dispatch(setInDropZone(false)); //set in drop zone to false
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = 'copy'; //allows drop
    dispatch(setInDropZone(true)); //set in drop zone to true
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let files = e.dataTransfer.files; //get files
  
    if (files && files.length > 0) {
      //const existingFiles = data.fileList.map(f => f.name)
      //files = files.filter(f => !existingFiles.includes(f.name))
      
      var file = files[0];
      console.log('file: ', file);

      //validate file
      if(file.type !== 'text/csv') {
        const schema = {
        'nombre': {
          prop: 'nombre',
          type: String,
          required: true
        },
        'folio': {
          prop: 'folio',
          type: String,
          required: true
        }
      }


      readXlsxFile(file, {schema}).then((rows) => {
        console.log('rows: ', rows);

        setState({
          ...state,
          fileName: file.name,
          error: "Archivo cargado correctamente",
          loading: true,
          open: true,
          severity: "success",
          step: 1
        });

        if(rows.rows.length > 0) {
          //@ts-ignore
          setParticipantsWithoutFile(rows.rows);
        }
        //return rows;
      }).catch((error) => {
        console.log('error: ', error);
        setState({
          ...state,
          error: 'Ocurrió un error al leer el archivo. Tiene que ser de tipo .CSV o .XLSX', 
          loading: false,
          open: true,
          severity: 'error'
        });
        return;
      });
      } else if(files.length > 1) {
        setState({
          ...state,
          error: 'Only one file is allowed',
          loading: false,
          open: true,
          severity: 'error'
        });
        console.log('error: ', 'Only one file is allowed');
        return;
      } else {
        e.dataTransfer.clearData(); //clear data
        dispatch(setDropDepth(0)); //reset drop depth to 0
        dispatch(setInDropZone(false)); //reset in drop zone to false

        setState({
          ...state,
          fileName: file.name,
          error: "",
          loading: true,
          open: false,
          severity: "success",
          step: 1
        });

        setParticipants(file);
      }
    }
  };

  /* Functions - handle file upload */
  const uploadFile = async(e:any) => {
    console.log(e.target.files[0]);

    let files = e.target.files; //get files
    var file = files[0];

    //validate file
    if(file.type !== 'text/csv') {
      const schema = {
        'nombre': {
          prop: 'nombre',
          type: String,
          required: true
        },
        'folio': {
          prop: 'folio',
          type: String,
          required: true
        }
      }


      readXlsxFile(file, {schema}).then((rows) => {
        console.log('rows: ', rows);

        setState({
          ...state,
          fileName: file.name,
          error: "Archivo cargado correctamente",
          loading: true,
          open: true,
          severity: "success",
          step: 1
        });

        if(rows.rows.length > 0) {
          //@ts-ignore
          setParticipantsWithoutFile(rows.rows);
        }
        //return rows;
      }).catch((error) => {
        console.log('error: ', error);
        setState({
          ...state,
          error: 'Ocurrió un error al leer el archivo. Tiene que ser de tipo .CSV o .XLSX', 
          loading: false,
          open: true,
          severity: 'error'
        });
        return;
      });
      

      
    } else {

      setState({
        ...state,
        fileName: file.name,
        error: "Archivo cargado correctamente",
        loading: true,
        open: true,
        severity: "success",
        step: 1
      });

      setParticipants(file);
    }
  };

  /* Set participants data in redux */
  const setParticipants = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      //@ts-ignore
      complete: function (results) {
        console.log(results.data)

        //@ts-ignore
        dispatch(setReduxParticipants(results.data));

        let num = 0;

        const interval: any = setInterval(() => {
            if(num === results.data.length) {
              clearInterval(intervalID);
            } else {
              num = num + 1;
              setNumber(num);
            }

        }, 10)

        setIntervalID(interval);
      },
    });
  }

  /* Set participants without file */
  const setParticipantsWithoutFile = (participants: any) => {
    console.log('participants: ', participants);

    dispatch(setReduxParticipants(participants));

    let num = 0;

    const interval: any = setInterval(() => {
        if(num === participants.length) {
          clearInterval(intervalID);
        } else {
          num = num + 1;
          setNumber(num);
        }

    }, 10)

    setIntervalID(interval);
  }


  /* Alert messages functions */

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setState({
      ...state,
      open: false,
      error: "",
    })
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.overlay}>

          {state.step === 0 ? (
                <div 
                  className={styles.upload__drop}
                  onDrop={e => handleDrop(e)}
                  onDragOver={e => handleDragOver(e)}
                  onDragEnter={e => handleDragEnter(e)}
                  onDragLeave={e => handleDragLeave(e)}
                >

                  {/* title */}
                  <div className={styles.margin__div}>
                    <h1 className={styles.title}>ARRASTRA Y SUELTA</h1>
                    <p className={styles.text}>(.XLSX o .CSV)</p>
                  </div>

                  {/* icon */}
                  <div className={styles.margin__div}>
                    <FileUploadRoundedIcon className={styles.icon} />
                  </div>

                  {/* button */}
                  <div>
                    <FileButton uploadFile={uploadFile}/>
                  </div>

                  {/*  */}
                </div>
            ) : (
              <div className={styles.upload__drop}>

                {/* title */}
                <div className={styles.margin__div}>
                  <h1 className={styles.title}>COMENZAR RIFA</h1>
                </div>

                {/* icon */}
                <div className={styles.icon__container}>
                  <PersonRoundedIcon className={styles.icon} />
                  <p>{number}</p>
                </div>

                {/* button */}
                <div>
                  <Link href="/raffle">
                    <button className={styles.start__button}><p>COMENZAR</p></button>
                  </Link>
                </div>

                {/*  */}
              </div>
          )}


          {/* Logo image */}
          <div className={styles.logo__container}>
              <Image src={Logo} width={100} height={30}/>
          </div>

          {/* Image 1 */}
          <div className={styles.image__container1}>
              <Image src={Image1} width={400} height={200}/>
          </div>

          {/* Image 2 */}
          <div className={styles.image__container2}>
              <Image src={Image2} width={300} height={200}/>
          </div>

        </div>
      </main>

      {/* alerts */}
       <Snackbar open={state.open} autoHideDuration={6000} onClose={handleClose}>

        <Alert onClose={handleClose} severity={state.severity === "error" ? "error" : "success"} sx={{ width: '100%' }}>
          {state.error}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Home
