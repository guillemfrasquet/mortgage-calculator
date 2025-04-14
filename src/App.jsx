import { useState } from 'react';
import './App.css';

function App() {
  return (
    <Container />
  );
}

function Container() {
  const [mortgageAmount, setMortgageAmount] = useState('');
  const [mortgageTerm, setMortgageTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [mortgageType, setMortgageType] = useState('');

  const [results, setResults] = useState('');

  function handleCalculateRepayments(e) {
    e.preventDefault();
    setResults(calculateMortgagePayments(mortgageAmount, interestRate, mortgageTerm, mortgageType));
  }

  return (
    <div className="container">
      <Calculator formData={{ 
        mortgageAmount, 
        setMortgageAmount, 
        mortgageTerm, 
        setMortgageTerm, 
        interestRate, 
        setInterestRate, 
        mortgageType, 
        setMortgageType 
      }} onCalculateRepayments={handleCalculateRepayments} />
      <Results results={results}/>

    </div>
  );
}

function Calculator({formData, onCalculateRepayments}) {
  return (
    <div className="calculator">
      <div className="head-line">
        <h1>Mortgage Calculator</h1>
        <span>Clear all</span>
      </div>
      
      <Form {...formData} onCalculateRepayments={onCalculateRepayments}/>
    </div>
  );
}

function Form({mortgageAmount, setMortgageAmount, mortgageTerm, setMortgageTerm, interestRate, setInterestRate, mortgageType, setMortgageType, onCalculateRepayments}) {
  return (
    <form onSubmit={onCalculateRepayments}>
      <label htmlFor="mortgage-amount">Mortgage amount</label>
      <div className="input-wrapper">
        <span className="unit">€</span>
        <input 
          type="number" 
          id="mortgage-amount"
          value={mortgageAmount}
          onChange={(e) => setMortgageAmount(e.target.value)}
        />
      </div>

      <label htmlFor="mortgage-term">Mortgage term</label>
      <div className="input-wrapper">
        <input 
          type="number" 
          id="mortgage-term"
          value={mortgageTerm}
          onChange={(e) => setMortgageTerm(e.target.value)}
        />
        <span className="unit">years</span>
      </div>

      <label htmlFor="interest-rate">Interest rate</label>
      <div className="input-wrapper">
        <input 
          type="number" 
          id="interest-rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <span className="unit">%</span>
      </div>

      <label htmlFor="mortgage-type">Mortgage type</label>
      <div className="input-wrapper">
        <div>
          <input 
            type="radio" 
            id="repayment" 
            name="mortgage-type" 
            value="repayment" 
            checked={mortgageType === 'repayment'}
            onChange={() => setMortgageType('repayment')}
          />
          <label htmlFor="repayment">Repayment</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="interest-only" 
            name="mortgage-type" 
            value="interest-only" 
            checked={mortgageType === 'interest-only'}
            onChange={() => setMortgageType('interest-only')}
          />
          <label htmlFor="interest-only">Interest only</label>
        </div>
      </div>

      <button type="submit">Calculate Repayments</button>
    </form>
  );
}

function Results({results}) {
  if(!results || !results.monthlyPayment) {
    return (
    <div className="results">
      <p>Results shown here</p>
    </div>
    )
  } else {
  return (
    <div className="results">
      <h2>Your results</h2>
      <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and clic "calculate repayments" again.</p>
          <div>
            <div>
              <p>Your monthly repayments</p>
              € {results.monthlyPayment}
            </div>
            <div>
              <p>Total you'll repay over the term</p>
              € {results.totalRepay}
            </div>
          </div>
    </div>
  );
  }
}


function calculateMortgagePayments(mortgageAmount, interestRate, termYears, mortgageType) {
  const monthlyRate = (interestRate / 100) / 12; // Convertir la tasa anual a mensual
  const totalPayments = termYears * 12; // Número total de pagos

  let monthlyPayment;

  if (mortgageType === 'interest-only') {
    // Solo se pagan los intereses cada mes
    monthlyPayment = mortgageAmount * monthlyRate;
  } else {
    // Repayment: se pagan intereses + capital (fórmula estándar)
    monthlyPayment = mortgageAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }
  // Total a devolver (monthlyPayment * totalPayments)
  const totalRepay = monthlyPayment * totalPayments;

  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    totalRepay: totalRepay.toFixed(2)
  };
}

export default App;
