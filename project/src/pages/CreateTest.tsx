import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;
  const testToEdit = location.state?.test;

  const [testTitle, setTestTitle] = useState(testToEdit?.name || '');
  const [subject, setSubject] = useState(testToEdit?.subject || '');
  const [duration, setDuration] = useState(testToEdit?.duration?.toString() || '60');
  const [questions, setQuestions] = useState<Question[]>(testToEdit?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    questions[currentQuestionIndex] || {
      id: 1,
      text: '',
      options: ['', '', '', ''],
      correctAnswer: -1,
    }
  );

  useEffect(() => {
    if (testToEdit) {
      setTestTitle(testToEdit.name);
      setSubject(testToEdit.subject);
      setDuration(testToEdit.duration.toString());
      setQuestions(testToEdit.questions);
      setCurrentQuestion(testToEdit.questions[0] || {
        id: 1,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: -1,
      });
    }
  }, [testToEdit]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleSaveQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = currentQuestion;
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      setQuestions([...questions, currentQuestion]);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1] || {
        id: questions.length + 1,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: -1,
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentQuestion(questions[currentQuestionIndex - 1]);
    }
  };

  const handleDeleteQuestion = () => {
    const updatedQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
    setQuestions(updatedQuestions);
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, updatedQuestions.length - 1));
    }
    if (updatedQuestions.length === 0) {
      setCurrentQuestion({
        id: 1,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: -1,
      });
    } else {
      setCurrentQuestion(updatedQuestions[currentQuestionIndex]);
    }
  };

  const handleSubmitTest = () => {
    if (currentQuestion.text && !questions.includes(currentQuestion)) {
      handleSaveQuestion();
    }

    const test = {
      id: testToEdit?.id || Date.now().toString(),
      name: testTitle,
      subject,
      dateCreated: testToEdit?.dateCreated || new Date().toISOString(),
      status: 'active',
      studentsCompleted: testToEdit?.studentsCompleted || 0,
      totalStudents: testToEdit?.totalStudents || 30,
      averageScore: testToEdit?.averageScore || 0,
      duration: parseInt(duration),
      questions,
    };

    navigate('/teacher-dashboard', {
      state: { test, isEditing },
    });
  };

  const isTestValid = () => {
    return (
      testTitle.trim() !== '' &&
      subject.trim() !== '' &&
      duration !== '' &&
      questions.length > 0 &&
      questions.every(
        (q) =>
          q.text.trim() !== '' &&
          q.options.every((opt) => opt.trim() !== '') &&
          q.correctAnswer !== -1
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Test Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Test' : 'Create New Test'}
            </h1>
            <button
              onClick={handleSubmitTest}
              disabled={!isTestValid()}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isTestValid() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {isEditing ? 'Update Test' : 'Submit Test'}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Title</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter test title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter duration"
              />
            </div>
          </div>
        </div>

        {/* Test Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Test Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-2xl font-semibold text-gray-900">{questions.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Estimated Time</p>
              <p className="text-2xl font-semibold text-gray-900">{duration} minutes</p>
            </div>
          </div>
        </div>

        {/* Question Editor */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Question {currentQuestionIndex + 1} of {Math.max(questions.length, 1)}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteQuestion}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
              <button
                onClick={handleSaveQuestion}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Save & Next
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
            <textarea
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your question here"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Options</label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Question Navigation */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setCurrentQuestion(questions[index]);
                    }}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      currentQuestionIndex === index
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(questions.length);
                    setCurrentQuestion({
                      id: questions.length + 1,
                      text: '',
                      options: ['', '', '', ''],
                      correctAnswer: -1,
                    });
                  }}
                  className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};