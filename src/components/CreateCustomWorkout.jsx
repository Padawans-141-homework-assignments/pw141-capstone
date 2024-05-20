import * as React from 'react';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useState, useEffect, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormGroup, FormLabel, FormControl } from "react-bootstrap";
import AuthContext from "../context/AuthContext";


export default function CreateCustomWorkout() {

    // grabs token from context
    const { token, refresh, counter } = useContext(AuthContext);

    // state for user selections
    const [userInputs, setUserInputs] = useState({
        "muscle_group": "",
        "equipment": "",
        "rep_range": '',
        "weight_range": '',
        "workout_variation": "",
        "day": ""
    })

    // set state for controlling when a form is on screen
    const [needsForm, setNeedsForm] = useState(false)

    ////////////////////////////////////////////////////////
    // state for workout data from api call
    const [workoutData, setWorkoutData] = useState()

    // state for workout name
    const [variationName, setvariationName] = useState([])

    // set state for the selected users choice
    const [variationChoice, setVariationChoice] = useState()

    //sets state for counter to go through the array choices
    const [variationCounter, setVariationCounter] = useState(0)
    /////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////
    // state for muscle data from api call
    const [muscleData, setMuscleData] = useState()

    // state for muscle group
    const [muscleName, setMuscleName] = useState([])

    // set state for muscle choice
    const [muscleChoice, setMuscleChoice] = useState()

    //set state for muscle counter
    const [muscleCounter, setMuscleCounter] = useState(0)
    /////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////
    // state for equipment data from api call
    const [equipmentData, setEquipmentData] = useState()

    // state for equipment Name
    const [equipmentName, setEquipmentName] = useState()

    // set state for equipment choice
    const [equipmentChoice, setEquipmentChoice] = useState()

    // set state for equipment counter
    const [equipmentCounter, setEqipmentCounter] = useState(0)
    /////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////
    // state for day data from api call
    const [dayData, setDayData] = useState()

    // state for day name
    const [dayName, setDayName] = useState()

    // set state for day choice
    const [dayChoice, setDayChoice] = useState()

    // set state for date counter
    const [dayCounter, setDayCounter] = useState(0)
    /////////////////////////////////////////////////////////

    // calls the functions on initial page render
    useEffect(() => {
        // calls the api that has translations 
        //(or so I thought. I thought it was all english but it wasn't)
        const renderVariations = async () => {
            const res = await fetch('https://wger.de/api/v2/exercise-translation/?limit=50&offset=0')
            if (res.ok) {
                const data = await res.json();
                setWorkoutData(data);
            }
            // if not error out
            else {
                console.error("Couldn't get the products :(")
            }
        }

        // calls the api that has the muscle groups
        const renderMuscles = async () => {
            const res = await fetch('https://wger.de/api/v2/muscle/')
            if (res.ok) {
                const data = await res.json();
                setMuscleData(data);
            }
            // if not error out
            else {
                console.error("Couldn't get the products :(")
            }
        }

        // calls the api that has the workout equipment
        const renderEquipment = async () => {
            const res = await fetch('https://wger.de/api/v2/equipment/')
            if (res.ok) {
                const data = await res.json();
                setEquipmentData(data);
            }
            // if not error out
            else {
                console.error("Couldn't get the products :(")
            }
        }

        // calls the api that has the day data
        const renderDay = async () => {
            const res = await fetch('https://wger.de/api/v2/daysofweek/')
            if (res.ok) {
                const data = await res.json();
                setDayData(data);
            }
            // if not error out
            else {
                console.error("Couldn't get the products :(")
            }
        }

        renderVariations();
        renderMuscles();
        renderEquipment();
        renderDay();
    }, [counter]);

    // calls the function to set arrays and swaps boolean state when called
    // this one is for creating a workout
    const toggleNewWorkoutBox = () => {
        CreateCustomWorkoutBox();
        setNeedsForm(!needsForm)
    }

    // transforms api request data into arrays to look through
    const CreateCustomWorkoutBox = () => {

        //////////WORKOUT VARIATION//////////
        let filter = new Set();
        for (let i = 0; i < workoutData.results.length; i++) {
            if (workoutData.results[i].language === 2) {
                filter.add(workoutData.results[i].name)
            }
        }

        // Convert Set to array before setting state
        const workoutNamesArray = [...filter];
        setvariationName(workoutNamesArray);
        //////////////////////////////////////

        //////////MUSCLE GROUP//////////
        let filter2 = new Set();
        for (let j = 0; j < muscleData.results.length; j++) {
            if (muscleData.results[j].name_en.length === 0) {
                filter2.add(`${muscleData.results[j].name}`)
            }
            else {
                filter2.add(`${muscleData.results[j].name}(${muscleData.results[j].name_en})`)
            }
        }

        // Convert Set to array before setting state
        const workoutNamesArray2 = [...filter2];
        setMuscleName(workoutNamesArray2);
        ////////////////////////////////


        //////////WORKOUT EQUIPMENT//////////
        let filter3 = new Set();
        for (let k = 0; k < equipmentData.results.length; k++) {
            filter3.add(equipmentData.results[k].name)
        }
        // Convert Set to array before setting state
        const workoutNamesArray3 = [...filter3];
        setEquipmentName(workoutNamesArray3);

        //////////DAYS OF THE WEEK////////////
        // holds the data when going through the for loop
        let copy = [];

        // goes through the days of the week api and grabs the days
        for (let i = 0; i < dayData.results.length; i++) {
            copy.push(dayData.results[i].day_of_week)
        }

        // set the array of names to the day state
        setDayName(copy);
        /////////////////////////////////////
    }

    // Handle form submission for adding a workout
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submit behavior
        const response = await fetch('http://127.0.0.1:5000/workouts', {
            method: 'POST', // sets method
            headers: {
                'Content-Type': 'application/json' // Indicates the content 
            },
            body: JSON.stringify({  // uses these values in the body
                "muscle_group": muscleChoice,
                "equipment": equipmentChoice,
                "rep_range": userInputs.rep_range,
                "weight_range": userInputs.weight_range,
                "workout_variation": variationChoice,
                "day": dayChoice
            }) //send data in JSON format
        });
        // if successful
        if (response.ok) {
            refresh();
            setUserInputs({
                "muscle_group": "",
                "equipment": "",
                "rep_range": '',
                "weight_range": '',
                "workout_variation": "",
                "day": ""
            })
        } else {
            // handles the errors
            console.error('Failed to create workout:', response.statusText);
        }
    };

    // has the controls for moving left through the workouts
    const previousWorkoutVariation = () => {

        // make a copy of the array from the api
        let copy = variationName;

        // if the associated counter is 0 return
        if (variationCounter === 0) {
            return;
        }

        // increment the state of the counter by 1
        setVariationCounter(variationCounter - 1);

        // set the choice of the user as the index at the current
        // value of the counter
        setVariationChoice(copy[variationCounter]);
    }

    // has the controls for moving left through the workouts
    const nextWorkoutVariation = () => {

        // make a copy of the array from the api
        let copy = variationName;

        // if the associated counter is at the end of the array return
        if (variationCounter === copy.length - 1) {
            return;
        }

        // decrement the state of the counter by 1
        setVariationCounter(variationCounter + 1);

        // set the choice of the user as the index at the current
        // value of the counter
        setVariationChoice(copy[variationCounter]);
    }

    // controls moving left for equiment
    const previousEquipment = () => {

        // create copy of equipment array contents
        let copy = equipmentName;

        // if start of array return
        if (equipmentCounter === 0) {
            return;
        }

        // decrement counter by 1
        setEqipmentCounter(equipmentCounter - 1);

        // set user choice to index location in copy at counter
        setEquipmentChoice(copy[equipmentCounter]);
    }

    // controls moving right for equipment
    const nextEquipment = () => {

        // create copy of eqipment array
        let copy = equipmentName;

        // if end of array return
        if (equipmentCounter === copy.length - 1) {
            return;
        }

        // increment equipment counter by 1
        setEqipmentCounter(equipmentCounter + 1);

        // set user item to location in copy by equipment ounter
        setEquipmentChoice(copy[equipmentCounter]);
    }

    // controls moving left for muscles
    const previousMuscle = () => {

        // create copy of muscle array
        let copy = muscleName;

        // if start of array return
        if (muscleCounter === 0) {
            return;
        }

        // decrement muscle counter by one
        setMuscleCounter(muscleCounter - 1);

        // set user muscle choice to location of counter in the copy
        setMuscleChoice(copy[muscleCounter]);
    }

    // controls moving right for muscles
    const nextMuscle = () => {
        let copy = muscleName;

        if (muscleCounter === copy.length - 1) {
            return;
        }
        setMuscleCounter(muscleCounter + 1);
        setMuscleChoice(copy[muscleCounter]);
    }

    // controls moving right through days
    const previousDay = () => {

        // create copy of day array
        let copy = dayName;

        //if start of array return
        if (dayCounter === 0) {
            return;
        }

        // decrement day counter by one
        setDayCounter(dayCounter - 1)
        console.log('prev day: ', dayCounter)

        // set user day choice to location of counter in the copy
        setDayChoice(copy[dayCounter])
        console.log('prev day choice: ', dayChoice)
    }

    // controls moving left through days
    const nextDay = () => {
        let copy = dayName;

        if (dayCounter === copy.length) {
            return;
        }

        setDayCounter(dayCounter + 1);
        setDayChoice(copy[dayCounter])

    }

    // Handle changes in form inputs and displays them on screen as they happen
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInputs(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    return (
        <>
            {/* controls the on screen button */}
            <h1>Create A Custom Workout</h1>
            <button onClick={toggleNewWorkoutBox}>
                {needsForm ? 'Hide New Workout' : 'Show New Workout'}
            </button>

            {/* if user is logged in, move to second ternary conditional OR
                if user is not logged in, show nothing */}
            {String(token).length > 4 ? (
                <>

                    {/* if form is designated as open reveal the form to the user OR
                        if the form is designated as closed reveal nothing */}
                    {needsForm ? (
                        <div>

                            {/* if the api calls have successfully loaded reveal the contents of the form OR
                                inform the user of the non-existence of the form */}
                            {(variationName && muscleName && equipmentName && dayName) ? (
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <br />
                                        <FormLabel htmlFor="inputMuscle_Group">Muscle Group</FormLabel>
                                        <br />
                                        <button onClick={previousMuscle}>Previous</button>
                                        {muscleChoice ? (
                                            <>
                                                {muscleChoice}
                                            </>
                                        ) : (
                                            'Please choose a button'
                                        )}
                                        <button onClick={nextMuscle}>Next</button>
                                    </FormGroup>
                                    <br />

                                    <FormGroup>
                                        <FormLabel htmlFor="inputEquipment">Equipment</FormLabel>
                                        <br />
                                        <button onClick={previousEquipment}>Previous</button>
                                        {equipmentChoice ? (
                                            <>
                                                {equipmentChoice}
                                            </>
                                        ) : (
                                            'Please choose a button'
                                        )}
                                        <button onClick={nextEquipment}>Next</button>
                                    </FormGroup>
                                    <br />
                                    <FormGroup>
                                        <FormLabel htmlFor="inputWorkout_Variation">Workout Variation</FormLabel>
                                        <br />
                                        <button onClick={previousWorkoutVariation}>Previous</button>
                                        {variationChoice ? (
                                            <>
                                                {variationChoice}
                                            </>
                                        ) : (
                                            'Please choose a button'
                                        )}
                                        <button onClick={nextWorkoutVariation}>Next</button>
                                    </FormGroup>
                                    <br />
                                    <FormGroup>
                                        <FormLabel htmlFor="inputDay_Of_The_Week">Day Of The Week</FormLabel>
                                        <br />
                                        <button onClick={previousDay}>Previous</button>
                                        {dayChoice ? (
                                            <>
                                                {dayChoice}
                                            </>
                                        ) : (
                                            'Please choose a button'
                                        )}
                                        <button onClick={nextDay}>Next</button>
                                    </FormGroup>

                                    <FormGroup>
                                        <br />
                                        <FormLabel htmlFor="inputWeight_Range">Weight Range</FormLabel>
                                        <FormControl
                                            type="text"
                                            name="weight_range"
                                            value={userInputs.weight_range}
                                            onChange={handleChange}
                                            placeholder="Weight Range"
                                        />
                                    </FormGroup>
                                    <br />
                                    <FormGroup>
                                        <FormLabel htmlFor="inputRep_Range">Rep Range</FormLabel>
                                        <FormControl
                                            type="text"
                                            name="rep_range"
                                            value={userInputs.rep_range}
                                            onChange={handleChange}
                                            placeholder="Rep Range"
                                        />
                                    </FormGroup>
                                    <br />
                                    <Button variant="primary" type="submit">Submit</Button>
                                </Form>
                            ) : (
                                'No Form :('
                            )}
                        </div>
                    ) : (
                        ''
                    )}
                </>
            ) : (
                <>
                </>
            )}
        </>
    );
}