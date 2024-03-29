import type { NextPage } from 'next'

/* React */
import React, { useState, useEffect } from 'react'

/* Components */
import Head from 'next/head'
import Link from 'next/link'
import FileButton from '../components/FileButton'
import Image from 'next/image'
import { useRouter } from 'next/router'
//import Logo from '../public/img/mobil_logo.png'
//import Text from '/img/texto.png'
//import Logos from '/img/logos.png'

/* Redux */
import { 
  setDropDepth, 
  setInDropZone, 
  setReduxParticipants,
  setReduxNumPrize
} from "../redux/actions"
import { selectDropDepth } from "../redux/states/file/reducer"
import { useAppSelector, useAppDispatch } from '../redux/hooks'

/* Material UI */
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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
  //router
  const router = useRouter();

  /* useState - upload */
  const [state, setState] = useState({
    fileName: "",
    loading: false,
    error: "",
    severity: "error",
    step: 0,
    open: false,
    isFinal: false
  });

  const [number, setNumber] = useState<number>(0);
  const [intervalID, setIntervalID] = useState<number>(0);

  //useState - input number
  const [inputNumber, setInputNumber] = useState<number | string>('');

   /* Redux */
  const dispatch = useAppDispatch(); //function that allows to trigger actions that update the redux state
  /* redux - file */
  const dropDepth = useAppSelector(selectDropDepth) //function that allows to get the dropDepth from the redux state

  useEffect(() => {
    localStorage.setItem("deletedNames", JSON.stringify([]));
  },[])

  //handle input number change
  const handleInputNumberChange = (e: any) => {
    let val = e.target.value;
    //verify if the input is a number between 1 and 3
    if(isNaN(val)) return;
    if((val > 3 || val < 1) && val !== '') return;
    console.log('val: ', val);
    setInputNumber(val);
    dispatch(setReduxNumPrize(val));
    localStorage.setItem("numPrize", val);
  }

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
      }


      readXlsxFile(file, {schema}).then((rows) => {
        console.log('rows: ', rows);

        setState({
          ...state,
          fileName: file.name,
          loading: true,
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
      }


      readXlsxFile(file, {schema}).then((rows) => {

        setState({
          ...state,
          fileName: file.name,
          loading: true,
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

        //@ts-ignore
        dispatch(setReduxParticipants(results.data));

        let num = 0;
        setNumber(results.data.length);

        /* const interval: any = setInterval(() => {
            console.log('num: ', num, results.data.length);
            if(num === results.data.length) {
              clearInterval(intervalID);
            } else {
              num = num + 1;
              setNumber(num);
            }

        }, 10)

        setIntervalID(interval); */
      },
    });
  }

  /* Set participants without file */
  const setParticipantsWithoutFile = (participants: any) => {

    dispatch(setReduxParticipants(participants));

    let num = 0;
    setNumber(participants.length);

    /* const interval: any = setInterval(() => {
        console.log('num: ', num, participants.length);
        if(num === participants.length) {
          clearInterval(intervalID);
        } else {
          num = num + 1;
          setNumber(num);
        }

    }, 10)

    setIntervalID(interval); */
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


  //handle play click
  const handlePlayClick = () => {
    //verify the input number is valid (1-3) and it exists in local storage
    //verify that inputNumber is a number
    if(isNaN(inputNumber as number)) {
      setState({
        ...state,
        open: true,
        error: "El número de premios tiene que ser un número",
        severity: "error"
      });
      return;
    } else if((inputNumber as number) < 1 || (inputNumber as number) > 3) {
      setState({
        ...state,
        open: true,
        error: "El número de premios tiene que estar entre 1 y 3",
        severity: "error"
      });
      return;
    }

    //verify that the input number exists in local storage
    if(localStorage.getItem("numPrize") === null) {
      localStorage.setItem("numPrize", inputNumber as string);
    }

    router.push('/raffle');
    
  }

  return (
    <div>
      <Head>
        <title>Mobil Store</title>
        <meta name="description" content="Mobil Store" />
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
                    <h1 className={styles.title}>Mobil® Store</h1>
                    <p className={styles.text}>(.XLSX)</p>
                  </div>

                  {/* icon */}
                  <div className={styles.margin__div}>
                    <img className={styles.icon__image} src="/img/upload.png" alt='Another'/>
                    {/* <FileUploadRoundedIcon className={styles.icon} /> */}
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
                  <h1 className={styles.title}>Mobil® Store y tú, un dúo ganador</h1>
                </div>

                {/* icon */}
                <div className={styles.icon__container}>
                  <PersonRoundedIcon className={styles.icon} />
                  <p>{number}</p>
                </div>

                {/* input of type text */}
                <div className={styles.margin__div}>
                    <input
                      type='text'
                      value={inputNumber}
                      onChange={handleInputNumberChange}
                      className={styles.input__number}
                      placeholder='1/2/3'
                    />
                </div>

                {/* button */}
                <div>
                  {/* <Link href="/raffle">
                    <button className={styles.start__button}><p>COMENZAR</p></button>
                  </Link> */}
                  <button className={styles.start__button} onClick={handlePlayClick}><p>COMENZAR</p></button>
                </div>
              </div>
          )}

          {/* Logo image */}
          {/* <div className={styles.logo__container}>
              <Image src={Logo} width={100} height={30}/>
          </div> */}

          <div className={styles.image__container1}>
              <Image src={'/img/texto.png'} width={200} height={40}/>
          </div>

          <div className={styles.image__container2}>
              <Image src={'/img/logos.png'} width={290} height={30}/>
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
