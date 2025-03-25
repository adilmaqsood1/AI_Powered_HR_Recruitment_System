import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { analyzeResume, streamAnalyzeResume } from '../services/api';
import Head from 'next/head';
import Card from '../components/Card';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import InterviewQuestions from '../components/InterviewQuestions';
import StreamingText from '../components/StreamingText';

type FormData = {
  jobTitle: string;
  jobDescription: string;
  coverLetter: string;
};

type AnalysisResult = {
  match_result: {
    match_score: number;
    is_match: boolean;
  };
  evaluation?: {
    strength_level: string;
    recommendation: string;
  };
  questions?: {
    questions: string[];
  };
};

type StreamingState = {
  isStreaming: boolean;
  matchResult: boolean;
  evaluation: boolean;
  questions: boolean;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    matchResult: false,
    evaluation: false,
    questions: false
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const onSubmit = async (data: FormData) => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    
    // Reset streaming state
    setStreamingState({
      isStreaming: true,
      matchResult: false,
      evaluation: false,
      questions: false
    });

    try {
      const formData = new FormData();
      formData.append('job_title', data.jobTitle);
      formData.append('job_description', data.jobDescription);
      formData.append('resume_file', file);
      
      if (data.coverLetter) {
        formData.append('cover_letter', data.coverLetter);
      }

      // Use streaming API
      await streamAnalyzeResume(formData, (partialData, isComplete) => {
        // Update the result with the partial data
        setResult(prevResult => {
          const newResult = { ...prevResult, ...partialData };
          
          // Update streaming state based on what data we've received
          setStreamingState(prevState => ({
            isStreaming: !isComplete,
            matchResult: !!newResult.match_result,
            evaluation: !!newResult.evaluation,
            questions: !!newResult.questions
          }));
          
          return newResult;
        });
        
        // If complete, set loading to false
        if (isComplete) {
          setIsLoading(false);
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while analyzing the resume. Please try again.');
      }
      console.error(err);
      setIsLoading(false);
      setStreamingState(prev => ({ ...prev, isStreaming: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Head>
        <title>AI-Powered HR Recruitment System</title>
        <meta name="description" content="AI-Powered HR Recruitment System" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI-Powered</span> HR Recruitment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Analyze resumes, evaluate candidates, and generate interview questions with AI</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-8">
          <Card title="Resume Analysis" className="border border-gray-100 transform transition-all duration-300 hover:-translate-y-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  {...register('jobTitle', { required: 'Job title is required' })}
                  className="input-field focus:ring-primary focus:border-primary"
                  placeholder="e.g. Software Engineer"
                />
                {errors.jobTitle && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.jobTitle.message}</p>}
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  {...register('jobDescription', { required: 'Job description is required' })}
                  className="input-field min-h-[120px] focus:ring-primary focus:border-primary"
                  placeholder="Paste the job description here..."
                />
                {errors.jobDescription && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.jobDescription.message}</p>}
              </div>
              
              <FileUpload 
                onFileSelect={handleFileSelect}
                label="Resume"
                helpText="Supported formats: PDF, TXT (Max 5MB)"
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Cover Letter (Optional)</label>
                <textarea
                  {...register('coverLetter')}
                  className="input-field min-h-[120px] focus:ring-primary focus:border-primary"
                  placeholder="Paste the cover letter here..."
                />
              </div>
              
              <Button 
                type="submit" 
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md transition-all duration-200 animate-pulse">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Card>
          
          <Card title="Analysis Results" className="border border-gray-100 transform transition-all duration-300 hover:-translate-y-1">
            {result ? (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-800">
                    <span className="mr-2">🔍</span> Match Result
                  </h3>
                  {result.match_result && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium mr-2">Match Score:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${(result.match_result.match_score * 100).toFixed(1)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-primary font-bold">{(result.match_result.match_score * 100).toFixed(1)}%</span>
                      </div>
                      <p className="font-medium flex items-center">
                        <span className="mr-2">Is a Match?</span>
                        {result.match_result.is_match ? (
                          <span className="text-green-500 flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            No
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                
                {result.evaluation && (
                  <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg border border-green-200 shadow-sm transition-all duration-300 hover:shadow-md">
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-green-800">
                      <span className="mr-2">📊</span> Resume Evaluation
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-700 font-medium">Strength Level:</span>
                        <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium capitalize
                          ${result.evaluation.strength_level === 'strong' ? 'bg-green-100 text-green-800' : 
                            result.evaluation.strength_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}
                        ">
                          {result.evaluation.strength_level}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700 font-medium">Recommendation:</span>
                        <p className="mt-1 text-gray-600 bg-white p-3 rounded border border-gray-100 shadow-sm">
                          <StreamingText 
                            text={result.evaluation.recommendation} 
                            isStreaming={streamingState.isStreaming && streamingState.evaluation} 
                            speed={10}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
                <p className="mt-1 text-sm text-gray-500">Upload a resume and fill in the job details to see the analysis results here.</p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Interview Questions Section - Moved to its own row */}
        {result && result.questions && (
          <div className="max-w-7xl mx-auto">
            <InterviewQuestions 
              questions={result.questions.questions || []} 
              isLoading={streamingState.isStreaming && !streamingState.questions}
              className="transform transition-all duration-300 hover:-translate-y-1"
            />
          </div>
        )}
      </main>
    </div>
  );
}