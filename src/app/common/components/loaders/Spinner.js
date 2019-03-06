import React from 'react'
import PropTypes from 'prop-types'
import { Dimmer, Loader } from 'semantic-ui-react'

function Spinner({ children, dim, inverted, ...spinnerProps }) {
  const loader = (
    <Loader active {...spinnerProps}>
      {children}
    </Loader>
  )
  if (dim)
    return (
      <Dimmer active inverted={inverted}>
        {loader}
      </Dimmer>
    )
  return loader
}

Spinner.propTypes = {
  children: PropTypes.node,
  dim: PropTypes.bool,
  inverted: PropTypes.bool,
}

Spinner.defaultProps = {
  dim: false,
  inverted: true,
  size: 'medium',
}

export default Spinner
