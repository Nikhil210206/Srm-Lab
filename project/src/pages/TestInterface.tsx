import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/api';
import useAuth from '../hooks/useAuth';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Test {
  id: number;
  title: string;
  subject: string;
  duration: number;
  questions: Question[];
}

interface Answer {
  question_id: number;
  selected_option: string;
}

const calculateScore = (answers: Answer[], questions: Question[]): number => {
  const correctAnswers = answers.filter(answer => {
    const question = questions.find(q => q.id === answer.question_id);
    return question?.correctAnswer === answer.selected_option;
  });
  return Math.round((correctAnswers.length / questions.length) * 100);
};

const TestInterface: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { session } = useAuth();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select('*')
          .eq('id', testId)
          .single();
        if (testError) throw testError;
        setTest(testData);
        setTimeLeft(testData.duration * 60); // Convert minutes to seconds
      } catch (err) {
        setError('Failed to load test');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => {
      const existingAnswer = prev.find((a) => a.question_id === questionId);
      if (existingAnswer) {
        return prev.map((a) =>
          a.question_id === questionId ? { ...a, selected_option: option } : a
        );
      }
      return [...prev, { question_id: questionId, selected_option: option }];
    });
  };

  const handleSubmit = async () => {
    if (!test || !session) return;

    try {
      const { error } = await supabase
        .from('test_results')
        .insert({
          test_id: Number(testId),
          user_id: session.user.id,
          answers: JSON.stringify(answers),
          time_spent: test.duration * 60 - timeLeft,
          score: calculateScore(answers, test.questions)
        });
      if (error) throw error;
      navigate(`/test-results/${testId}`);
    } catch (err) {
      setError('Failed to submit test');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!test) return <div>Test not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
      <div className="mb-4">
        Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </div>
      
      {test.questions.map((question, index) => (
        <div key={question.id} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Question {index + 1}: {question.text}
          </h3>
          <div className="space-y-2">
            {question.options.map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  id={`q${question.id}-o${i}`}
                  name={`q${question.id}`}
                  value={option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="mr-2"
                />
                <label htmlFor={`q${question.id}-o${i}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={timeLeft === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Submit Test
      </button>
    </div>
  );
};

export default TestInterface;
