import React from 'react';
import Card from './Card';
import StreamingText from './StreamingText';

type InterviewQuestionsProps = {
  questions: string[];
  isLoading?: boolean;
  className?: string;
};

const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({
  questions = [],
  isLoading = false,
  className = '',
}) => {
  return (
    <Card 
      title="Interview Questions" 
      className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 ${className}`}
    >
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-3 rounded border border-gray-100 shadow-sm flex">
              <div className="h-4 w-4 bg-primary/30 rounded mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
          <p className="text-sm text-purple-600 italic">Generating questions...</p>
        </div>
      ) : questions.length > 0 ? (
        <ol className="space-y-2">
          {questions.map((question, index) => (
            <li 
              key={index} 
              className="bg-white p-3 rounded border border-gray-100 shadow-sm flex items-start hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
            >
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 group-hover:bg-secondary transition-colors duration-200">{index + 1}</span>
              <StreamingText 
                text={question} 
                className="group-hover:text-gray-800 transition-colors duration-200" 
                isStreaming={isLoading} 
                speed={15}
              />
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No interview questions generated yet.</p>
        </div>
      )}
    </Card>
  );
};

export default InterviewQuestions;