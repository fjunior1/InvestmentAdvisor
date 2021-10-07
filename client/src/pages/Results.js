// Node Modules
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
//import { UPDATE_PREFS } from '../utils/mutations';
import Calcs from '../utils/calcs';
import { Doughnut, Line } from 'react-chartjs-2';

// Utilities
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

const AGE = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60+"];
const INCOME = ["<30k", "30k-49k", "50k-69k", "70k-89k", "90k-109k", "110k-129k",
    "130k-149k", "150k-169k", "170k-189k", "190k-209k", "210k-229k", "230k-249k", "250k+"];
const RISK = ["minimum", "low", "medium", "high", "maximum"];
const RiskInt =    [0.03, 0.05, 0.08, 0.1, 0.12]
const BadRiskInt = [0,    -.01,   -.02,  -.03, -0.04];
// line chart input
const lineData = {
    labels: [],
    //dataset 0- 
    datasets: [
        {
            label: 'Best projection',
            data: [],
            fill: false,
            backgroundColor: 'rgb(57, 215, 45)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'realistic projection',
            data: [],
            fill: false,
            backgroundColor: 'rgb(255, 255, 0)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'worst projection',
            data: [],
            fill: false,
            backgroundColor: 'rgb(232, 21, 21)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        }
    ],
};

const lineOptions = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: false,
                },
            },
        ],
    },
};

var updating = false;

const Results = (props) => {
    const { id } = useParams();
    const [formState, setFormState] = useState({})


    // do calculations here

    const values = {
        labels: ['Food', 'Housing', 'Healthcare', 'savings', 'Leisure', 'Other'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
    };


    // const [updatePrefs, err] = useMutation(UPDATE_PREFS);
    // Get current user
    const { loading, data, error } = useQuery(id ? QUERY_USER : QUERY_ME, {
        variables: { id },
    });

    const user = data?.me || data?.user || {};

    useEffect(() => {
        if (user && !loading) {
            const { name, password, lastName, email, address, phone, ...tmp } = user;
            //console.log("before: " +tmp);
            tmp.lineData = lineData;
            // console.log("after: " + tmp);
            setFormState(tmp);
        }
    }, [user, loading])

    useEffect(() => {
        if (updating && (formState !== undefined)) {

            let lineData = JSON.parse(JSON.stringify(formState.lineData));
            updating = false;

            //lineData = Calcs(lineData);
            // init data arrays
            lineData.labels = [];
            lineData.datasets[0].data = [];

            // get index of age to set the years of savings for retirement
            console.log("age index: " + AGE.indexOf(formState.age))
            const indexAge = AGE.indexOf(formState.age);
            const riskRate = RiskInt[RISK.indexOf(formState.risk)]
            const badRiskRate = BadRiskInt[RISK.indexOf(formState.risk)]
            const savingsRate = 1000;
            // set years
            for (let i = 0, age = (20 + 5 * indexAge); age < 65; age++, i++) {
                lineData.labels[i] = age;

                // calculate best projection
                lineData.datasets[0].data[i] = (i === 0) ? savingsRate :
                    lineData.datasets[0].data[i - 1] * (1 + riskRate);
                
                // calculate realistic projection
                const rate =  /*badRiskRate +*/ (riskRate - badRiskRate)*Math.random() ;
                console.log (rate *100)
                lineData.datasets[1].data[i] = (i === 0) ? savingsRate :
                    lineData.datasets[1].data[i - 1] * (1 + rate/*badRiskRate + Math.random(riskRate-badRiskRate) */);
                
                // calculate worst projection
                lineData.datasets[2].data[i] = (i === 0) ? savingsRate :
                    lineData.datasets[2].data[i - 1] * (1 + badRiskRate);
                
                
            }
            console.log(lineData.datasets[0].data)

            switch (formState.age) {
                case AGE[0]:

                    (lineData.datasets[0].data[0])++;
                    break;

                case AGE[1]:
                    //console.log("mid 20's");
                    lineData.datasets[0].data[1]--;
                    break;
                default:
                    break;
            }
            console.log(formState.lineData);
            console.log(lineData);
            setFormState({
                ...formState,
                income: user.income,
                lineData: lineData,
                // age: user.age,
                risk: formState.risk
            });
        }

    }, [formState, user, loading])

    if (error) console.log(error);

    // redirect to personal profile page if username is yours
    if (Auth.loggedIn() && Auth.getProfile().data._id === id) {
        return <Redirect to="/me" />;
    }

    if (loading) {
        return <h4>Loading...</h4>;
    }

    if (!user?.username) {
        return (
            <h4>
                You need to be logged in to see this. Use the navigation links above to
                sign up or log in!
            </h4>
        );
    }

    // update if changes to income, age or risk
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        }

        );
        updating = true;
        console.log("updating");
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();


        // reset form values
        if (user !== undefined) {
            console.log(formState);
            console.log(user.income);
            setFormState({
                ...formState,
                income: user.income,
                age: user.age,
                risk: user.risk
            });
        }
    };


    const selectStyle = {
        color: 'blue',
        fontsize: '20px',
    };

    const renderCurrentUserInfo = () => {

        if (id) return null;
        return (
            <>
                <form onSubmit={handleFormSubmit}>

                    {/* age  */}
                    <div >
                        Age:<select value={formState.age} style={selectStyle} class="form-input"
                            name="age" id="age"
                            onChange={handleChange}>
                            <option value="18-24"> 18-24</option>
                            <option value="25-29">25-29</option>
                            <option value="30-34">30-34</option>
                            <option value="35-39">35-39</option>
                            <option value="40-44">40-44</option>
                            <option value="45-49">45-49</option>
                            <option value="50-54">50-54</option>
                            <option value="55-59">55-59</option>
                            <option value="60+">60+</option>
                        </select>
                    </div>
                    {/* income */}
                    Income: <select value={formState.income} class="form-input" name="income"
                        onChange={handleChange}>
                        <option value="<30k">&lt;30k</option>
                        <option value="30k-49k" >30k-49k</option>
                        <option value="50k-69k" >50k-69k</option>
                        <option value="70k-89k" >70k-89k</option>
                        <option value="90k-109k">90k-109k</option>
                    </select>

                    {/* risk  */}
                    Risk: <select value={formState.risk} class="form-input" name="risk"
                        onChange={handleChange}>
                        <option value="minimum">minimum</option>
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                        <option value="maximum">maximum</option>
                    </select>

                    <button
                        className="btn btn-block btn-primary"
                        style={{ cursor: 'pointer' }}
                        type="submit"
                    >
                        Reset to user values
                    </button>
                </form>
                {/* <Doughnut data={values} options={options} /> */}
                <Line data={formState.lineData} options={lineOptions} />
            </>
        );
    }
    return (
        <div>
            <div className="flex-row justify-center mb-3">
                <h2 className="col-12 col-md-10 bg-header text-light p-3 mb-5">
                    Viewing {formState.username ? `${formState.username}'s` : 'your'} analysis results.
                </h2>
                {renderCurrentUserInfo()}
                <Doughnut data={values} options={options} />
                <Line data={formState.lineData} options={lineOptions} />

            </div>
        </div>
    );
};

export default Results;