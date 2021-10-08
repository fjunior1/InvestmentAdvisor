// Node Modules
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
//import { UPDATE_PREFS } from '../utils/mutations';
//import Calcs from '../utils/calcs';
import { Doughnut, Line } from 'react-chartjs-2';

// Utilities
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

const AGE = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60+"];
const INCOME = ["<30k", "30k-49k", "50k-69k", "70k-89k", "90k-109k", "110k-129k",
    "130k-149k", "150k-169k", "170k-189k", "190k-209k", "210k-229k", "230k-249k", "250k+"];
const IncomeInt = [30000, 40000, 60000, 80000, 100000, 120000, 140000, 160000, 180000, 200000, 220000, 240000, 300000];
const RISK = ["minimum", "low", "medium", "high", "maximum"];
const RiskInt = [0.04, 0.05, 0.08, 0.1, 0.15]
const BadRiskInt = [0.0, -.01, -.03, -.05, -0.05];
const Savings = ['100', '250', '500', '750', '1000', '1250', '1500', '1750', '2000', '2500', '5000', '10000','15000', '17500', '20000'];
const SavingsInt = [100, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 5000, 10000, 15000, 17500, 20000];
const Percent = ['0.025', '0.03', '0.04', '0.05', '0.06', '0.075', '0.08', '0.09', '0.1', '0.125', '0.15', '0.175', '0.2'];
const PercentInt = [0.025, 0.03, 0.04, 0.05, 0.06, 0.075, 0.08, 0.09, 0.1, 0.125, 0.15, 0.175, 0.2];

// line chart input
const lineData = {
    labels: [],
    //dataset 0- 
    datasets: [
        {
            label: 'Best projection',
            data: [],
            fill: false,
            backgroundColor: 'rgb(0, 200, 0)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'worst projection',
            data: [],
            fill: false,
            backgroundColor: 'rgb(232, 21, 21)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'realistic projection -1',
            data: [],
            fill: false,
            backgroundColor: 'rgb(255, 255, 0)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'realistic projection -2',
            data: [],
            fill: false,
            backgroundColor: 'rgb(155, 255, 50)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'realistic projection - 3',
            data: [],
            fill: false,
            backgroundColor: 'rgb(255, 200, 100)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        }
    ],
};

const lineOptions = {
    plugins: {
        legend: {
            labels: {
                // This more specific font property overrides the global property
                font: {
                    size: 14
                }
            }
        }
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 10
                    }
                },
            },
        ],
    },
};

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


var updating = false;

const Results = (props) => {
    const { id } = useParams();
    const [formState, setFormState] = useState({})
    // const [checked, setChecked] = React.useState(false);

    // do calculations here



    const options = {
        pieceLabel: {
            mode: 'value'
        }
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
            tmp.percentChecked = false;
            tmp.percent = Percent[0]; // minimum percentage 
            tmp.savings = Savings[0]; // minimum savings
            tmp.income = INCOME[0];
            tmp.highestMoneyLast = 0;
            tmp.lowestMoneyLast = 0;
            tmp.DoughnutData = values;
            tmp.saveRate = '0';
            // console.log("after: " + tmp);
            setFormState(tmp);
        }
    }, [user, loading])

    useEffect(() => {
        if (updating && (formState !== undefined)) {

            let newData = JSON.parse(JSON.stringify(formState));
            updating = false;

            // init data arrays
            newData.lineData.labels = [];
            for (let n = 0; n < newData.lineData.datasets.length; n++) {
                newData.lineData.datasets[n].data = [];
            }
            // get index of age to set the years of savings for retirement
            // console.log("age index: " + AGE.indexOf(formState.age))
            const indexAge = AGE.indexOf(newData.age);
            const riskRate = RiskInt[RISK.indexOf(newData.risk)]
            const badRiskRate = BadRiskInt[RISK.indexOf(newData.risk)]

            console.log("use Effect newData.percentChecked: " + newData.percentChecked + " " + newData.savings);
            //             console.log("newData.percent: " + newData.percent );
            //             console.log("Percent.indexOf(newData.percent): " + Percent.indexOf(newData.percent));
            //             console.log("PercentInt[Percent.indexOf(newData.percent)]: " + PercentInt[Percent.indexOf(newData.percent)]);
            //             // console.log("" + );
            //             console.log("newData.income: " + newData.income );
            //             console.log("INCOME.indexOf(newData.income): " + INCOME.indexOf(newData.income));
            //             console.log("IncomeInt[INCOME.indexOf(newData.income)]: " + IncomeInt[INCOME.indexOf(newData.income)]);
            //             console.log("newData.savings: " + newData.savings );
            //             console.log("Savings.indexOf(newData.savings): " + Savings.indexOf(newData.savings));
            //             console.log("SavingsInt[Savings.indexOf(newData.savings)]: " + SavingsInt[Savings.indexOf(newData.savings)] );
            // console.log(""  );

            // const savingsRate = 1000;
            const income = IncomeInt[INCOME.indexOf(newData.income)];
            const savingsRate = newData.percentChecked ?
                income * PercentInt[Percent.indexOf(newData.percent)] :
                SavingsInt[Savings.indexOf(newData.savings)];
            
            newData.savingsRate = Number(savingsRate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
            // update doughnut data with savings rate and rest of expenses as percentage of income
            const incomeRest = income - savingsRate - .25 * income;
            newData.DoughnutData = JSON.parse(JSON.stringify(values));
            newData.DoughnutData.datasets[0].data = [];
            newData.DoughnutData.datasets[0].data[0]/*food*/ = incomeRest * .10 ;
            newData.DoughnutData.datasets[0].data[1]/*housing*/ = .25 * income;
            newData.DoughnutData.datasets[0].data[2]/*healthcare*/ = incomeRest * .15 ;
            newData.DoughnutData.datasets[0].data[3]/*savings*/ = savingsRate; // this one from savingsRate
            newData.DoughnutData.datasets[0].data[4]/*leisure*/ = incomeRest * .08;
            newData.DoughnutData.datasets[0].data[5]/*Other*/ = incomeRest * .05;


            values.datasets[0].data = newData.DoughnutData;

            console.log("savings rate: " + savingsRate)
            // set years
            for (let i = 0, age = (20 + 5 * indexAge); age < 65; age++, i++) {
                newData.lineData.labels[i] = age;

                // calculate best projection
                newData.lineData.datasets[0].data[i] = (i === 0) ? savingsRate :
                    newData.lineData.datasets[0].data[i - 1] * (1 + riskRate);

                // calculate worst projection
                newData.lineData.datasets[1].data[i] = (i === 0) ? savingsRate :
                    newData.lineData.datasets[1].data[i - 1] * (1 + badRiskRate);



                // calculate realistic projection(s)
                var rate = (riskRate - badRiskRate) * 1.02 * Math.random();
                newData.lineData.datasets[2].data[i] = (i === 0) ? savingsRate :
                    newData.lineData.datasets[2].data[i - 1] * (1 + rate);

                rate = (riskRate - badRiskRate) * 1.02 * Math.random();
                newData.lineData.datasets[3].data[i] = (i === 0) ? savingsRate :
                    newData.lineData.datasets[3].data[i - 1] * (1 + rate);

                rate = (riskRate - badRiskRate) * 1.02 * Math.random();
                newData.lineData.datasets[4].data[i] = (i === 0) ? savingsRate :
                    newData.lineData.datasets[4].data[i - 1] * (1 + rate);



            }
            //console.log(lineData.datasets[0].data)
            // var nf = Intl.NumberFormat();
            newData.highestMoneyLast = Number(newData.lineData.datasets[0].data[newData.lineData.datasets[0].data.length - 1]).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // Mean of 3 realistic projections
            newData.lowestMoneyLast = ( (Number(newData.lineData.datasets[2].data[newData.lineData.datasets[2].data.length - 1]) +
                Number(newData.lineData.datasets[3].data[newData.lineData.datasets[3].data.length - 1]) +
                Number(newData.lineData.datasets[4].data[newData.lineData.datasets[4].data.length - 1])) /3).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // switch (formState.age) {
            //     case AGE[0]:

            //         (newData.lineData.datasets[0].data[0])++;
            //         break;

            //     case AGE[1]:
            //         //console.log("mid 20's");
            //         newData.lineData.datasets[0].data[1]--;
            //         break;
            //     default:
            //         break;
            // }
            //console.log(formState.lineData);
            //console.log(lineData);
            setFormState({
                // ...formState,
                // income: user.income,
                // lineData: lineData,
                // // age: user.age,
                // risk: formState.risk
                ...newData
            });
        }

    }, [values, formState, user, loading])

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

        var val = value;
        console.log(name + ": " + value)
        if (name === "percentChecked") {

            val = event.target.checked

        }
        setFormState({
            ...formState,
            [name]: val,
        });

        updating = true;
        //console.log("updating");
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // reset form values
        if (user !== undefined) {
            //console.log(formState);
            //console.log(user.income);
            let newData = JSON.parse(JSON.stringify(formState));
            newData.income = user.income;
            newData.age = user.age;
            newData.risk = user.risk;

            setFormState({
                ...newData
            });
        }
    };

    const renderCurrentUserInfo = () => {

        if (id) return null;
        return (
            <>
                <form onSubmit={handleFormSubmit}>

                    {/* age  */}
                    <div  >
                        Age:<select value={formState.age} class="form-input form-select"
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

                        {/* income */}
                        Income: <select value={formState.income} class="form-input form-select" name="income"
                            onChange={handleChange}>
                            <option value="<30k">&lt;30k</option>
                            <option value="30k-49k" >30k-49k</option>
                            <option value="50k-69k" >50k-69k</option>
                            <option value="70k-89k" >70k-89k</option>
                            <option value="90k-109k">90k-109k</option>
                        </select>

                        {/* risk  */}
                        Risk: <select value={formState.risk} class="form-input form-select" name="risk"
                            onChange={handleChange}>
                            <option value="minimum">minimum</option>
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                            <option value="maximum">maximum</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            name="percentChecked"
                            checked={formState.percentChecked}
                            onChange={handleChange}
                        /> percentage&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {/* risk  */}
                        save/mth: <select value={formState.savings} class="form-input form-select" name="savings"
                            onChange={handleChange}>
                            <option value="100">100</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                            <option value="1500">1500</option>
                            <option value="2000">2000</option>
                            <option value="2000">2000</option>
                            <option value="2500">2500</option>
                            <option value="5000">5000</option>
                            <option value="10000">10000</option>
                            <option value="15000">15000</option>
                            <option value="17500">17500</option>
                            <option value="20000">20000</option>
                        </select>
                        {/* risk  */}
                        percentage: <select
                            value={formState.percent}
                            class="form-input form-select" name="percent"
                            onChange={handleChange}>
                            <option value="0.025">2.5%</option>
                            <option value="0.03">3%</option>
                            <option value="0.04">4%</option>
                            <option value="0.05">5%</option>
                            <option value="0.06">6%</option>
                            <option value="0.075">7.5%</option>
                            <option value="0.08">8%</option>
                            <option value="0.09">9%</option>
                            <option value="0.1">10%</option>
                            <option value="0.125">12.5%</option>
                            <option value="0.15">15%</option>
                            <option value="0.175">17.5%</option>
                            <option value="0.2">20%</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-block btn-primary"
                        style={{ cursor: 'pointer' }}
                        type="submit"
                    >
                        Reset to user values
                    </button>
                </form>
                <div>
                    <div className="report-txt">Based on your inputs (yearly savings of $
                        <strong className="report-var-txt"> {formState.savingsRate} at { RiskInt[RISK.indexOf(formState.risk)]*100}% </strong>
                        ) you will have:</div>
                <div className ="report-txt">Highest  return <strong className="report-var-txt">$ {formState.highestMoneyLast}</strong>  for retirement</div>
                <div className ="report-txt">realistic return <strong className="report-var-txt">$ {formState.lowestMoneyLast}</strong> for retirement
                </div>
</div>
                <Line data={formState.lineData} options={lineOptions} />
                <Doughnut data={formState.DoughnutData} options={options} />
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
            </div>
        </div>
    );
};

export default Results;