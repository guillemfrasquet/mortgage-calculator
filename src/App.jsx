import { useEffect, useState } from 'react';
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

  const [hasSubmitted, setHasSubmitted] = useState(false);

  function handleCalculateRepayments(e) {
    //e.preventDefault();
    setResults(calculateMortgagePayments(mortgageAmount, interestRate, mortgageTerm, mortgageType));
  }

  function resetAll() {
    clearAllFields();
    setResults('');
    setHasSubmitted(false);
  }

  function clearAllFields() {
    setMortgageAmount("");
    setMortgageTerm("");
    setInterestRate("");
    setMortgageType("");
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
      }} onCalculateRepayments={handleCalculateRepayments} onClearAll={resetAll} hasSubmitted={hasSubmitted} setHasSubmitted={setHasSubmitted} />
      <Results results={results}/>

    </div>
  );
}

function Calculator({formData, onCalculateRepayments, onClearAll, hasSubmitted, setHasSubmitted}) {
  return (
    <div className="calculator">
      <div className="head-line">
        <h1>Mortgage Calculator</h1>
        <span className="clear-all" onClick={onClearAll}>Clear all</span>
      </div>
      
      <Form {...formData} onCalculateRepayments={onCalculateRepayments} hasSubmitted={hasSubmitted} setHasSubmitted={setHasSubmitted}/>
    </div>
  );
}

function Form({mortgageAmount, setMortgageAmount, mortgageTerm, setMortgageTerm, interestRate, setInterestRate, mortgageType, setMortgageType, onCalculateRepayments, hasSubmitted, setHasSubmitted}) {
  const [errors, setErrors] = useState({
    mortgageAmount: false,
    mortgageTerm: false,
    interestRate: false,
    mortgageType: false
  });

  

  const validateForm = () => {
    const newErrors = {
      mortgageAmount: !(mortgageAmount > 0),
      mortgageTerm: !(mortgageTerm > 0),
      interestRate: !(interestRate > 0),
      mortgageType: mortgageType === ""
    }

    setErrors(newErrors);
    return newErrors;
  }

  useEffect(() => {
    if (hasSubmitted) {
      validateForm();
    }
  }, [mortgageAmount, mortgageTerm, interestRate, mortgageType, hasSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = validateForm();

    if(Object.values(validationErrors).some(error => error)) {
      return;   // if errors, exit without calculate
    }

    onCalculateRepayments();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={`form-field ${hasSubmitted && errors.mortgageAmount ? 'error' : ''}`}>
      <label htmlFor="mortgage-amount">Mortgage amount</label>
      <div className="input-wrapper">
        <span className="unit unit-left">€</span>
        <input 
          type="number" 
          id="mortgage-amount"
          className="input-right"
          value={mortgageAmount}
          min={1}
          onChange={(e) => setMortgageAmount(e.target.value)}
        />
      </div>
      {hasSubmitted && errors.mortgageAmount && <p className="error-message">This field is required</p>}
      </div>

      <div className='two-columns'>
      <div className={`form-field ${hasSubmitted && errors.mortgageTerm ? 'error' : ''}`}>
        <label htmlFor="mortgage-term">Mortgage term</label>
        <div className="input-wrapper">
          <input 
            type="number" 
            id="mortgage-term"
            className="input-left"
            value={mortgageTerm}
            min={0}
            step="any"
            onChange={(e) => setMortgageTerm(e.target.value)}
          />
          <span className="unit unit-right">years</span>
        </div>
        {hasSubmitted && errors.mortgageTerm && <p className="error-message">This field is required</p>}
      </div>

      <div className={`form-field ${hasSubmitted && errors.interestRate ? 'error' : ''}`}>
        <label htmlFor="interest-rate">Interest rate</label>
        <div className="input-wrapper">
          <input 
            type="number" 
            id="interest-rate"
            className="input-left"
            value={interestRate}
            min={0}
            step="any"
            onChange={(e) => setInterestRate(e.target.value)}
          />
          <span className="unit unit-right">%</span>
        </div>
        {hasSubmitted && errors.interestRate && <p className="error-message">This field is required</p>}
        </div>
      </div>

      <div className='form-field'>
        <label htmlFor="mortgage-type">Mortgage type</label>
        <div className="radio-group-wrapper">
          <div className={`radio-wrapper ${mortgageType === 'repayment' ? 'selected' : ''}`}>
            <input 
              type="radio" 
              id="repayment" 
              className="input-radio"
              name="mortgage-type"
              value="repayment" 
              checked={mortgageType === 'repayment'}
              onChange={() => setMortgageType('repayment')}
            />
            <label htmlFor="repayment">Repayment</label>
          </div>
          <div className={`radio-wrapper ${mortgageType === 'interest-only' ? 'selected' : ''}`}>
            <input 
              type="radio" 
              id="interest-only" 
              className="input-radio"
              name="mortgage-type" 
              value="interest-only" 
              checked={mortgageType === 'interest-only'}
              onChange={() => setMortgageType('interest-only')}
            />
            <label htmlFor="interest-only">Interest only</label>
          </div>
        </div>
        {hasSubmitted && errors.mortgageType && <p className="error-message">This field is required</p>}
      </div>

      <button class="calculate-button" type="submit"><img src="./assets/images/icon-calculator.svg" alt="Calculator"/>Calculate Repayments</button>
    </form>
  );
}

function Results({results}) {
  if(!results || !results.monthlyPayment) {
    return (
    <div className="results waiting-results">
      <img src='./assets/images/illustration-empty.svg' alt="Results will be shown here"/>
      <p className='title'>Results shown here</p>
      <p className='text'>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
    </div>
    )
  } else {
  return (
    <div className="results">
      <h2>Your results</h2>
      <p className='text'>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "Calculate repayments" again.</p>
          <div className='results-box'>
            <div>
              <p className='text'>Your monthly repayments</p>
              <span className="monthly-repayment-value">€ {results.monthlyPayment}</span>
            </div>
            <hr/>
            <div>
              <p className='text'>Total you'll repay over the term</p>
              <span className="total-repay-value">€ {results.totalRepay}</span>
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
