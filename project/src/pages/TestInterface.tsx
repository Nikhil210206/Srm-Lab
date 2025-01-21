import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const TestInterface: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const test = location.state?.test;
  const [answers, setAnswers] = useState<number[]>(Array(test.questions.length).fill(-1));

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const score = test.questions.reduce((acc, question, index) => {
      if (question.correctAnswer === answers[index]) {
        return acc + 1;
      }
      return acc;
    }, 0);
    navigate('/student-dashboard', { state: { score, total: test.questions.length } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h1>
        <div className="space-y-6">
          {test.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900">{question.text}</h2>
              <div className="mt-4 space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      checked={answers[questionIndex] === optionIndex}
                      onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default TestInterface;