import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Error</h1>
      <h4>404 Not found</h4>
      <Link to="/events">Go back to Homepage</Link>
    </div>
  )
}

export default NotFound
