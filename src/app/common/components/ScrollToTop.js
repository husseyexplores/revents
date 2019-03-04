import { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scroll(0, 0)
    }
  }
  render() {
    return this.props.children
  }
}

ScrollToTop.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
}

export default withRouter(ScrollToTop)