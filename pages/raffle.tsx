import type { NextPage } from 'next'

/* React */
import React, { useState, useEffect } from 'react'

/* Components */
import Head from 'next/head'
import styles from '../styles/Raffle.module.css'
import Image from 'next/image'
import Logo from '../public/img/mobil_logo.png'
import Image1 from '../public/img/mobil1.png'
import Image2 from '../public/img/mobil2.png'


/* Redux */
import { 
  setReduxParticipants,
} from "../redux/actions"
import { selectParticipants } from "../redux/states/participants/reducer"
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { Participant } from '../redux/states/participants/interfaces'

/* Material UI */
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ReplayCircleFilledRoundedIcon from '@mui/icons-material/ReplayCircleFilledRounded';


/* Motion */
import { motion } from "framer-motion"

const Raffle: NextPage = () => {

    /* useState - upload */
    const [state, setState] = useState({
        winnerStatus: 0,
        winnerFolio: "",
        winners: 0,
        animationIteration: 2,
        numParticipants: 0,
    });

    const [deletedFolios, setDeletedFolios] = useState<Array<string>>([]);
    const [name, setName] = useState<string>("--");
    const [folio, setFolio] = useState<string>("--");

    const [intervalID, setIntervalID] = useState<number>(0);
    const [slow, setSlow] = useState<boolean>(false);

    /* Redux */
    const dispatch = useAppDispatch(); //function that allows to trigger actions that update the redux state
    const participants = useAppSelector(selectParticipants) //function that allows to get the Participants from the redux state


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
    let final = Math.floor(Math.random() * participants.length) + (participants.length * 3);


    const slowInterval = (temp:Participant[]) => {

        //@ts-ignore
        if (interval) {
            clearInterval(interval)
            interval = null
        }
        stop = false;
        
        interval = setInterval(() => {
            if(!stop){
                console.log('numm: ', num, " index: ", index);
                num = num + 1;
                if(num === final) {
                    console.log("stop");
                    console.log("winners: ", state.winners);
                    setState({...state, numParticipants: temp.length, winnerStatus: 1, winnerFolio: temp[index].folio});
                    stop = true;
                    clearInterval(intervalID);
                    //@ts-ignore
                    clearInterval(interval);
                    interval = null;
                } else if(index < (temp.length-2)) {
                    index = index + 1;
                    setName(temp[index].nombre);
                    setFolio(temp[index].folio);
                } else {
                    index = index + 1;
                    setName(temp[index].nombre);
                    setFolio(temp[index].folio);
                    index = 0;
                }
            } else {
                //@ts-ignore
                clearInterval(interval);
            }

        }, 2000)

        //@ts-ignore
        setIntervalID(interval);
    }
    
    const runInterval = (time:number) => {
        //@ts-ignore
        if (interval) {
            clearInterval(interval)
            interval = null
        }
        console.log("final: " + final);

        let temp: Participant[] = participants;

        if(localStorage.getItem("deletedFolios") !== null) {
            let deletedFolios = JSON.parse(localStorage.getItem("deletedFolios")!);
            temp = temp.filter((item:Participant) => !deletedFolios.includes(item.folio));
            console.log(temp);
        }  
        
        

        //@ts-ignore
        temp = shuffle(temp);
        //let temp: Participant[] = participants;
        console.log("time: ", time);
       

        interval = setInterval(() => {
            if(!stop){
                console.log('num: ', num, " index: ", index);
                num = num + 1;
                if(num === (final - 5))  {
                    console.log("slow");
                    /* 
                    index = index + 1;
                    setName(temp[index].nombre);
                    setFolio(temp[index].folio); */
                    setSlow(true);
                    stop = true;

                    clearInterval(intervalID);
                    //@ts-ignore
                    clearInterval(interval);
                    interval = null;
                    slowInterval(temp);
                }
                else if(index < (temp.length-2)) {
                    index = index + 1;
                    setName(temp[index].nombre);
                    setFolio(temp[index].folio);
                } else {
                    index = index + 1;
                    setName(temp[index].nombre);
                    setFolio(temp[index].folio);
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

        if (participants.length > 0) {
            localStorage.setItem("deletedFolios", JSON.stringify([]));
            setState({...state, numParticipants: participants.length});
            runInterval(100);
        }

    } ,[]);

    /* Handle replay raffle without winner */
    const handleReplayClick = async () => {
        //delete winner from participants

        //let temp = participants.filter((participant: Participant) => participant.folio !== state.winnerFolio);
        if(localStorage.getItem("deletedFolios") !== null) {
            let temp = JSON.parse(localStorage.getItem("deletedFolios")!);
            temp.push(state.winnerFolio);
            localStorage.setItem("deletedFolios", JSON.stringify(temp));
        } else {
            localStorage.setItem("deletedFolios", JSON.stringify([state.winnerFolio]));
        }
        
        setState({...state, winnerStatus: 0, winnerFolio: "", numParticipants: state.numParticipants - 1, animationIteration: state.animationIteration + 3});
        setSlow(false);
        runInterval(100);
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
                duration: 10,
                repeat: 0,
                ease: "linear",
            }},
    }
  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.overlay}>
            {/* outer circle */}
            <motion.div className={slow ? styles.outer__circle2 : styles.outer__circle} style={{animationIterationCount: !slow ? 'infinite': state.animationIteration}}
                /* animate={{
                    //scale: [1, 2, 2, 1, 1],
                    rotate: [0, 360],
                    //borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                }} */
                animate={slow ? "slow" : "fast"}
                variants={variants}
                //infinite durationn


            >
                <div className={styles.ball}></div>
            </motion.div>

            {/* inner circle */}
            <div className={styles.circle}></div>

            {/* Card */}
            <div className={styles.card__container}>
                <div>
                    {/* Winner title */}
                    {state.winnerStatus === 1 && (
                        <h2 className={styles.winner__title}>¡Ganador!</h2>
                    )}

                    {/* name */}
                    <h1 className={styles.name}>{name.toUpperCase()}</h1>

                    {/* Folio */}
                    <h2 className={styles.folio}>{folio}</h2>
                    <p className={styles.folio2}>FOLIO</p>
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

                        {/* Replay deleting winner */}
                        <Tooltip title="Replay without winner" placement="top">
                            <IconButton onClick={handleReplayClick}>
                                <ReplayCircleFilledRoundedIcon className={styles.icon} />
                            </IconButton>
                        </Tooltip>

                        {/* Do anothe raffle */}
                        <Tooltip title="Do another" placement="top">
                            <IconButton>
                                <ReplayCircleFilledRoundedIcon className={styles.icon} />
                            </IconButton>
                        </Tooltip>
                    </div>    
                )}
                
            </div>

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

    </div>
  )
}

export default Raffle;
