import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleReload = () => {
    window.location.reload();
  };

  const getErrorType = (error) => {
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'network';
    }
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'chunk';
    }
    if (error.message.includes('Permission') || error.message.includes('Unauthorized')) {
      return 'auth';
    }
    return 'general';
  };

  const errorType = getErrorType(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="bg-slate-50 rounded-full p-6">
              {errorType === 'network' && (
                <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              )}
              {errorType === 'chunk' && (
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {errorType === 'auth' && (
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {errorType === 'general' && (
                <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {errorType === 'network' && "Network Connection Issue"}
            {errorType === 'chunk' && "Application Update Required"}
            {errorType === 'auth' && "Authentication Error"}
            {errorType === 'general' && "Something Went Wrong"}
          </h1>
          <p className="text-lg text-slate-600 mb-4">
            {errorType === 'network' && "Unable to connect to our servers. Please check your internet connection."}
            {errorType === 'chunk' && "A new version of the application is available."}
            {errorType === 'auth' && "Your session has expired or you don't have permission to access this resource."}
            {errorType === 'general' && "An unexpected error occurred while loading the application."}
          </p>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {errorType === 'network' && "This usually happens when your internet connection is unstable or our servers are temporarily unavailable."}
            {errorType === 'chunk' && "The application needs to reload to fetch the latest updates. This is normal after we deploy improvements."}
            {errorType === 'auth' && "Please sign in again to continue accessing your learning content."}
            {errorType === 'general' && "We've been notified about this issue and are working to fix it."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {errorType === 'chunk' && (
            <button
              onClick={handleReload}
              className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Update Application
            </button>
          )}
          
          {errorType === 'auth' && (
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="group px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In Again
            </button>
          )}

          <button
            onClick={handleGoBack}
            className="group px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-all duration-200 border border-slate-300 hover:border-slate-400 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>

          <button
            onClick={resetErrorBoundary}
            className="group px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center gap-4">
            <a href="mailto:support@play2learn.com" className="text-sm text-blue-600 hover:text-blue-700">
              support@play2learn.com
            </a>
            <span className="text-slate-300">|</span>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Visit Help Center
            </a>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400 font-mono">
            Error ID: {Date.now().toString(36).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  )
};

export default ErrorFallback;

