import React from 'react'
// import PropTypes from 'prop-types';

function HomePage({ history }) {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment homepage">
        <div className="ui text container">
          <h1 className="ui inverted stackable header">
            <img
              className="ui image massive"
              src="/assets/logo.png"
              alt="logo"
            />
            <div className="content">Re-vents</div>
          </h1>
          <h2>Do whatever you want to do</h2>
          <button
            onClick={() => {
              history.push('/events')
            }}
            className="ui huge white inverted button"
          >
            Get Started
            <i className="right arrow icon" />
          </button>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '12px' }}>
        Icons made by{' '}
        <a href="http://www.freepik.com" title="Freepik">
          Freepik
        </a>{' '}
        from{' '}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>{' '}
        is licensed by{' '}
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          title="Creative Commons BY 3.0"
        >
          CC 3.0 BY
        </a>
      </div>
    </div>
  )
}

HomePage.propTypes = {}

HomePage.defaultProps = {}

export default HomePage
