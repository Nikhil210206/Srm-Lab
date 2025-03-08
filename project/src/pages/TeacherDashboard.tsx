import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/api';


interface Test {
  id: number;
  title: string;
  subject: string;
  duration: number;
}

const TeacherDashboard: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data: tests, error } = await supabase
          .from('tests')
          .select('*');
        if (error) throw error;

        setTests(tests);
      } catch (err) {
        setError('Failed to fetch tests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleCreateTest = async () => {
    const newTest = {
      title: 'New Test',
      subject: 'Math',
      duration: 60
    };
    try {
      const { data: createdTest, error } = await supabase
        .from('tests')
        .insert(newTest)
        .single();
      if (error) throw error;

      setTests([...tests, createdTest]);
    } catch (err) {
      console.error('Failed to create test:', err);
    }
  };

  const handleDeleteTest = async (testId: number) => {
    try {
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId);
      if (error) throw error;

      setTests(tests.filter(test => test.id !== testId));
    } catch (err) {
      console.error('Failed to delete test:', err);
    }
  };

  const handleViewResults = (testId: number) => {
    navigate(`/test-results/${testId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      
      <button 
        onClick={handleCreateTest} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Create New Test
      </button>

      <div className="grid gap-4">
        {tests.map((test) => (
          <div key={test.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{test.title}</h2>
            <p className="text-gray-600">{test.subject}</p>
            <p className="text-gray-600">Duration: {test.duration} minutes</p>
            
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleViewResults(test.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                View Results
              </button>
              <button
                onClick={() => handleDeleteTest(test.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
