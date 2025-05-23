'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log global error details for debugging
    console.error('Global Error Details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest
    })
  }, [error])
 
  return (
    // global-error must include html and body tags
    <html lang="en">
      <head>
        <title>Application Error</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f4f4f4; 
            }
          `
        }} />
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
          <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full border-2 border-red-200">
            <svg 
              className="mx-auto mb-6 h-20 w-20 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h1 className="text-3xl font-bold text-red-700 mb-4">
              Application Error
            </h1>
            <p className="text-gray-700 mb-6 text-lg">
              {error.message || 'A critical error has occurred. Our team has been notified.'}
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => reset()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Reload Application
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Return to Home
              </button>
            </div>
            {error.digest && (
              <p className="mt-6 text-xs text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}