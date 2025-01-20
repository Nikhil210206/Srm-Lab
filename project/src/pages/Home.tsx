import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, BarChart, ChevronRight, Laptop, Brain, Target } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Practice.</span>
                  <span className="block text-indigo-600">Prepare.</span>
                  <span className="block">Succeed.</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Elevate your exam preparation with our comprehensive mock test platform. 
                  Designed for both students and teachers to create an engaging learning experience.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Take a Test
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Manage Tests
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="Students studying"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to excel
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Comprehensive tools for both students and teachers
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Laptop className="h-8 w-8" />}
              title="Dynamic Mock Tests"
              description="Access a wide range of practice tests that simulate real exam conditions"
              forRole="For Students"
            />
            <Feature
              icon={<Brain className="h-8 w-8" />}
              title="Real-time Progress"
              description="Track your performance with detailed analytics and insights"
              forRole="For Students"
            />
            <Feature
              icon={<Target className="h-8 w-8" />}
              title="Customized Learning"
              description="Get personalized recommendations based on your performance"
              forRole="For Students"
            />
            <Feature
              icon={<BookOpen className="h-8 w-8" />}
              title="Question Bank"
              description="Create and manage comprehensive question banks for your subjects"
              forRole="For Teachers"
            />
            <Feature
              icon={<Users className="h-8 w-8" />}
              title="Student Management"
              description="Monitor and analyze student performance with detailed reports"
              forRole="For Teachers"
            />
            <Feature
              icon={<BarChart className="h-8 w-8" />}
              title="Analytics Dashboard"
              description="Get insights into student performance and identify areas for improvement"
              forRole="For Teachers"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Create your account today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of students and teachers already using our platform.
          </p>
          <Link
            to="/login"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  forRole: string;
}> = ({ icon, title, description, forRole }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="text-indigo-600">{icon}</div>
      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
        {forRole}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
};