import type { NextPage } from 'next'

/* React */
import React, { useState, useEffect } from 'react'

/* Components */
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Raffle.module.css'
import Image from 'next/image'
//import Logo from '../public/img/mobil_logo.png'
//import Text from '../public/img/texto.png'
//import Logos from '../public/img/logos.png'

/* Redux */
import { selectParticipants, selectIsFinal, selectNumPrize } from "../redux/states/participants/reducer"
import { useAppSelector } from '../redux/hooks'
import { Participant } from '../redux/states/participants/interfaces'

/* Material UI */
import Tooltip from '@mui/material/Tooltip';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';


/* Motion */
import { motion } from "framer-motion"

const Raffle: NextPage = () => {

    /* useState - upload */
    const [state, setState] = useState({
        winnerStatus: 0,
        winnerName: "",
        winnerFinal: 0,
        winners: 0,
        animationIteration: 2,
        numParticipants: 0,
        times: 0,
    });

    const [name, setName] = useState<string>("--");
    //const [folio, setFolio] = useState<string>("--");
    //const [place, setPlace] = useState<number>(0);
    //const [points, setPoints] = useState<number>(0);

    const [intervalID, setIntervalID] = useState<number>(0);
    const [slow, setSlow] = useState<boolean>(false);

    //useState - numPrize
    const [numPrize, setNumPrize] = useState<number>(3);

    //const places = ["5°", "4°", "3°", "2°", "1°"]
    //const places = ["3°", "2°", "1°"]
    const places = ["1°", "2°", "3°"]
    //const points_lst = [215, 425, 765, 1150, 1700]
    //const points_lst = [765, 1150, 1700]
    //const points_lst = ["Ganaste una experiencia + televisión Samsung 85\"", "Ganaste un viaje para 2 personas a hotel Xcaret todo incluido", "Ganaste una moto BMW G310GS"]
    const points_lst = ["Ganaste una moto BMW G310GS", "Ganaste un viaje para 2 personas a hotel Xcaret todo incluido",  "Ganaste una experiencia + televisión Samsung 80\""]

    /* Redux */
    const participants = useAppSelector(selectParticipants) //function that allows to get the Participants from the redux state
    const reduxNumPrize = useAppSelector(selectNumPrize) //function that allows to get the numPrizes from the redux state (1, 2, 3)

    /* Shuffle array */
    function shuffle(array: []) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    let index = 0;
    let num = 0;
    let stop = false;
    //@ts-ignore
    let interval;
    let final = Math.floor(Math.random() * participants.length) + (participants.length > 10 ? participants.length : participants.length * 10)


    const slowInterval = (temp:Participant[], times_temp:number) => {

        //@ts-ignore
        if (interval) {
            //@ts-ignore
            clearInterval(interval)
            interval = null
        }
        stop = false;
        
        interval = setInterval(() => {
            if(!stop){
                
                num = num + 1;
                if(num === final) {
                    index = index === temp.length - 1 ? 0 : index + 1;
                    setName(temp[index].nombre);
                    
                    //cambiar este valor para definir cuantas veces debe girar
                    let num_times = 0;
                    if(times_temp < num_times){
                        setState({...state, numParticipants: temp.length, winnerStatus: 1, winnerFinal: 0, winnerName: temp[index].nombre, times: times_temp + 1});
                    } else {
                        setState({...state, numParticipants: temp.length, winnerStatus: 1, winnerFinal: 1, winnerName: temp[index].nombre, times: times_temp + 1});
                    }
                    console.log("numPrize: ", numPrize);
                    
                    stop = true;
                    clearInterval(intervalID);
                    //@ts-ignore
                    clearInterval(interval);
                    interval = null;
                } else if(index < (temp.length-1)) {
                    
                    setName(temp[index].nombre);
                    index = index + 1;
                } else {
                    
                    setName(temp[index].nombre);
                    index = index + 1;
                    index = 0;
                }
            } else {
                //@ts-ignore
                clearInterval(interval);
            }

        }, 1000)

        //@ts-ignore
        setIntervalID(interval);
    }
    
    const runInterval = (time:number, times_temp:number) => {
        //@ts-ignore
        if (interval) {
            //@ts-ignore
            clearInterval(interval)
            interval = null
        }
        let temp: Participant[] = participants;

        if(localStorage.getItem("deletedNames") !== null) {
            let deletedNames = JSON.parse(localStorage.getItem("deletedNames")!);
            temp = temp.filter((item:Participant) => !deletedNames.includes(item.nombre));
        }  

        
        //@ts-ignore
        temp = shuffle(temp);

        interval = setInterval(() => {
            if(!stop){
                num = num + 1;
                console.log("num y final= ", num, final);
                if(num >= (final - 5))  {
                    setSlow(true);
                    stop = true;

                    clearInterval(intervalID);
                    //@ts-ignore
                    clearInterval(interval);
                    interval = null;
                    slowInterval(temp, times_temp);
                }
                else if(index < (temp.length-1)) {
                    setName(temp[index].nombre);
                    index = index + 1;
                } else {
                    setName(temp[index].nombre);
                    index = index + 1;
                    index = 0;
                }
            } else {
                //@ts-ignore
                clearInterval(interval);
                interval = null;
            }

        }, time)

    }
    

    useEffect(() => {
        //setNumPrize with localstorage
        if (localStorage.getItem("numPrize") !== null) {
            console.log("numPrize", localStorage.getItem("numPrize")!);
            setNumPrize(parseInt(localStorage.getItem("numPrize")!));
        } else {
            setNumPrize(3);
        }

        if (participants.length > 0) {
            setState({...state, numParticipants: participants.length});
            runInterval(100, 0);
        }
    } ,[]);

    /* Handle replay raffle without winner */
    const handleReplayClick = async () => {
        //delete winner from participants

        if(localStorage.getItem("deletedNames") !== null) {
            let temp = JSON.parse(localStorage.getItem("deletedNames")!);
            temp.push(state.winnerName);
            localStorage.setItem("deletedNames", JSON.stringify(temp));
        } else {
            localStorage.setItem("deletedNames", JSON.stringify([state.winnerName]));
        }
        //console.log(state.times)
        setState({...state, winnerStatus: 0, winnerName: "", winnerFinal: 0, numParticipants: state.numParticipants - 1, animationIteration: state.animationIteration + 1});
        setSlow(false);
        runInterval(20, state.times-1);
    }

    /* Handle replay raffle with all participans */
    const handleReplayAllClick = () => {
        if(localStorage.getItem("deletedNames") !== null) {
            let temp = JSON.parse(localStorage.getItem("deletedNames")!);
            temp.push(state.winnerName);
            localStorage.setItem("deletedNames", JSON.stringify(temp));
        } else {
            localStorage.setItem("deletedNames", JSON.stringify([state.winnerName]));
        }

        setState({...state, winnerStatus: 0, winnerName: "", winnerFinal: 0, numParticipants: state.numParticipants - 1, animationIteration: state.animationIteration + 1});
        setSlow(false);
        runInterval(20, state.times);
    }


    const variants = {
        fast: {
            rotate: [0, 360],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                ease: "linear",
            }},
        slow: {
            rotate: [0, 360], 
            transition: {
                duration: 5,
                repeat: 0,
                ease: "linear",
            }},
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
            {/* outer circle */}
            <motion.div className={slow ? styles.outer__circle2 : styles.outer__circle} style={{animationIterationCount: !slow ? 'infinite': state.animationIteration}}
                animate={slow ? "slow" : "fast"}
                variants={variants}
            >
                <div className={styles.ball}></div>
            </motion.div>

            {/* inner circle */}
            <div className={styles.circle}></div>

            {/* Card */}
            <div className={styles.card__container}>
                <div>
                    {/* Winner title */}
                    {/* {state.winnerStatus === 1 && (
                        <h2 className={styles.winner__title}>¡{places[state.times-1]} Lugar!</h2>
                    )} */}
                    {state.winnerStatus === 1 && (
                        <h2 className={styles.winner__title}>¡{places[numPrize-1]} Lugar!</h2>
                    )}

                    {/* name */}
                    <h1 className={styles.name}>{name.toUpperCase()}</h1>

                    {/* Folio */}
                    {state.winnerStatus === 1 && (
                        <>
                            <h2 className={styles.folio2}>{points_lst[numPrize-1]}</h2>
                            {/* <h2 className={styles.folio2}>{points_lst[state.times-1]}</h2> */}
                            {/* <p className={styles.folio2}>MOBIL® coins</p> */}
                        </>
                        
                    )}
                </div>
            </div>

            {/* Participants and buttons */}
            <div className={styles.actions__container}>
                {/* participants number */}
                <div className={styles.icon__container}>
                    <PersonRoundedIcon className={styles.person__icon} />
                    <p className={styles.participants}>{state.numParticipants ? state.numParticipants : "--"}</p>
                </div>

                {/* action buttons */}
                {state.winnerStatus === 1 && (
                    <div className={styles.buttons}>
                        {state.winnerFinal == 0 && (
                            <Tooltip title="Repetir" placement="top">
                                <img onClick={handleReplayClick} className={styles.icon__image} style={{marginRight: '10px'}} src="/img/redo_w.svg" alt="Redo without winner"/>
                            </Tooltip>
                        )}

                        {state.winnerFinal == 0 && (
                            <Tooltip title="Siguiente ganador" placement="top">
                                <img onClick={handleReplayAllClick} className={styles.icon__image} style={{marginRight: '10px'}} src="/img/redo.svg" alt='Redo all'/>
                            </Tooltip>
                        )}
                        

                        {/* Do another raffle */}
                        <Tooltip title="Otra rifa" placement="top">
                            <Link href="/">
                                <img className={styles.icon__image} src="/img/another.svg" alt='Another'/>
                            </Link>
                        </Tooltip>
                    </div>    
                )}
                
            </div>

            {/* Logo image */}
            {/* <div className={styles.logo__container}>
                <Image src={Logo} width={100} height={30}/>
            </div>*/}

            <div className={styles.image__container1}>
                <Image src={'/img/texto.pngs'} width={200} height={40}/>
            </div>

            <div className={styles.image__container2}>
                <Image src={'/img/logos.png'} width={290} height={30}/>
            </div>
            
        </div>

      </main>

    </div>
  )
}

export default Raffle;
