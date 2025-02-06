import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Image as ImageIcon, Type, Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Question, DifficultyLevel, QuestionType } from '../types';

const availableSubjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography'
];

interface QuestionFormData extends Question {
  id: number;
  text: string;
  type: QuestionType;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  difficultyLevel: DifficultyLevel;
  subject: string;
  explanation?: string;
}

export const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;
  const testToEdit = location.state?.test;

  const [testTitle, setTestTitle] = useState(testToEdit?.name || '');
  const [subject, setSubject] = useState(testToEdit?.subject || '');
  const [duration, setDuration] = useState(testToEdit?.duration?.toString() || '60');
  const [questions, setQuestions] = useState<QuestionFormData[]>(testToEdit?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionFormData>({
    id: 1,
    text: '',
    type: 'text',
    options: ['', '', '', ''],
    correctAnswer: -1,
    difficultyLevel: 'medium',
    subject: subject
  });

  const [targetRatio, setTargetRatio] = useState({
    easy: testToEdit?.targetDifficultyRatio?.easy || 30,
    medium: testToEdit?.targetDifficultyRatio?.medium || 50,
    hard: testToEdit?.targetDifficultyRatio?.hard || 20
  });

  const [difficultyDistribution, setDifficultyDistribution] = useState({
    easy: testToEdit?.difficultyDistribution?.easy || 0,
    medium: testToEdit?.difficultyDistribution?.medium || 0,
    hard: testToEdit?.difficultyDistribution?.hard || 0
  });

  useEffect(() => {
    if (testToEdit) {
      setTestTitle(testToEdit.name);
      setSubject(testToEdit.subject);
      setDuration(testToEdit.duration.toString());
      setQuestions(testToEdit.questions);
      setCurrentQuestion(testToEdit.questions[0] || {
        id: 1,
        text: '',
        type: 'text',
        options: ['', '', '', ''],
        correctAnswer: -1,
        difficultyLevel: 'medium',
        subject: testToEdit.subject
      });
      setDifficultyDistribution(testToEdit.difficultyDistribution);
      setTargetRatio(testToEdit.targetDifficultyRatio || {
        easy: 30,
        medium: 50,
        hard: 20
      });
    }
  }, [testToEdit]);

  useEffect(() => {
    const newDistribution = questions.reduce(
      (acc: { easy: number; medium: number; hard: number }, q) => {
        (acc[q.difficultyLevel as keyof typeof acc])++;
        return acc;
      },
      { easy: 0, medium: 0, hard: 0 }
    );
    setDifficultyDistribution(newDistribution);
  }, [questions]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentQuestion({
          ...currentQuestion,
          imageUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
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
        type: 'text',
        options: ['', '', '', ''],
        correctAnswer: -1,
        difficultyLevel: 'medium',
        subject: subject
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
        type: 'text',
        options: ['', '', '', ''],
        correctAnswer: -1,
        difficultyLevel: 'medium',
        subject: subject
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
      difficultyDistribution,
      targetDifficultyRatio: targetRatio
    };

    navigate('/teacher-dashboard', {
      state: { test, isEditing },
    });
  };

  const handleRatioChange = (level: DifficultyLevel, value: number) => {
    const newRatio = { ...targetRatio, [level]: value };
    const total = Object.values(newRatio).reduce((sum, val) => sum + val, 0);
    
    if (total <= 100) {
      setTargetRatio(newRatio);
    }
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
      ) &&
      Object.values(targetRatio).reduce((sum, val) => sum + val, 0) === 100
    );
  };

  const getRatioStatus = () => {
    const total = Object.values(targetRatio).reduce((sum, val) => sum + val, 0);
    if (total < 100) return `${100 - total}% remaining to allocate`;
    if (total > 100) return `${total - 100}% over allocation`;
    return 'Ratio properly allocated';
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
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a subject</option>
                {availableSubjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
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

        {/* Difficulty Ratio Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Target Difficulty Distribution</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Easy Questions ({targetRatio.easy}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={targetRatio.easy}
                onChange={(e) => handleRatioChange('easy', parseInt(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medium Questions ({targetRatio.medium}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={targetRatio.medium}
                onChange={(e) => handleRatioChange('medium', parseInt(e.target.value))}
                className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hard Questions ({targetRatio.hard}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={targetRatio.hard}
                onChange={(e) => handleRatioChange('hard', parseInt(e.target.value))}
                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {getRatioStatus()}
            </div>
          </div>
        </div>

        {/* Current Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Current Question Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-700">Easy</span>
                <span className="text-lg font-semibold text-green-700">{difficultyDistribution.easy}</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 rounded-full h-2"
                  style={{ width: `${(difficultyDistribution.easy / questions.length) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-yellow-700">Medium</span>
                <span className="text-lg font-semibold text-yellow-700">{difficultyDistribution.medium}</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 rounded-full h-2"
                  style={{ width: `${(difficultyDistribution.medium / questions.length) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-red-700">Hard</span>
                <span className="text-lg font-semibold text-red-700">{difficultyDistribution.hard}</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div
                  className="bg-red-600 rounded-full h-2"
                  style={{ width: `${(difficultyDistribution.hard / questions.length) * 100 || 0}%` }}
                />
              </div>
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

          {/* Question Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentQuestion({ ...currentQuestion, type: 'text' })}
                className={`inline-flex items-center px-4 py-2 rounded-md ${
                  currentQuestion.type === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Type className="h-5 w-5 mr-2" />
                Text Only
              </button>
              <button
                onClick={() => setCurrentQuestion({ ...currentQuestion, type: 'image' })}
                className={`inline-flex items-center px-4 py-2 rounded-md ${
                  currentQuestion.type === 'image'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                Image + Text
              </button>
            </div>
          </div>

          {/* Difficulty Level Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <div className="flex space-x-4">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setCurrentQuestion({ ...currentQuestion, difficultyLevel: level })}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentQuestion.difficultyLevel === level
                      ? level === 'easy'
                        ? 'bg-green-600 text-white'
                        : level === 'medium'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
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

          {/* Image Upload (if image type) */}
          {currentQuestion.type === 'image' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {currentQuestion.imageUrl ? (
                    <div>
                      <img
                        src={currentQuestion.imageUrl}
                        alt="Question"
                        className="mx-auto h-32 w-auto"
                      />
                      <button
                        onClick={() => setCurrentQuestion({ ...currentQuestion, imageUrl: undefined })}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {/* Explanation */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={currentQuestion.explanation || ''}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })
              }
              rows={2}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Explain the correct answer (optional)"
            />
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
                      type: 'text',
                      options: ['', '', '', ''],
                      correctAnswer: -1,
                      difficultyLevel: 'medium',
                      subject: subject
                    });
                  }}
                  className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Distribution Warnings */}
          {questions.length > 0 && (
            <div className="mt-6">
              {Math.abs(difficultyDistribution.easy - difficultyDistribution.hard) > questions.length * 0.4 && (
                <div className="flex items-center space-x-2 text-yellow-700 bg-yellow-50 p-4 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">
                    Consider balancing the difficulty levels for a better assessment
                  </span>
                </div>
              )}
              {Object.values(targetRatio).reduce((sum, val) => sum + val, 0) !== 100 && (
                <div className="mt-2 flex items-center space-x-2 text-red-700 bg-red-50 p-4 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">
                    The difficulty ratio must total 100%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};