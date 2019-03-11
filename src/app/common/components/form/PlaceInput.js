import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Message, List, Loader } from 'semantic-ui-react'
import Script from 'react-load-script'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'

import { googleMapsSecrets } from '../../../../secret'

class PlaceInput extends Component {
  state = {
    isGoogleScriptsLoaded: false,
    isLoading: true,
    address: '',
    latLng: {},
    error: null,
  }

  handleScriptsLoaded = () =>
    this.setState({ isGoogleScriptsLoaded: true, isLoading: false })

  handleSelect = address => {
    const {
      input: { onChange },
      onCoords,
      onSelect,
      onError,
    } = this.props

    if (typeof onSelect === 'function') onSelect(address)

    // refux forms onChange?
    onChange(address)

    this.setState({ address, latLng: {}, error: null })
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        if (typeof onCoords === 'function') onCoords(latLng, address)
        this.setState({ latLng: latLng })
      })
      .catch(error => {
        if (typeof onError === 'function') onError(error)
        this.setState({ error: error })
      })
  }

  handleChange = address => {
    const { input, onCoords } = this.props
    try {
      input.onChange(address)
      if (!address || !address.length) onCoords({})
      /* eslint-disable no-empty */
    } catch (error) {}
    this.setState({ address, latLng: {} })
  }

  renderPlaces() {
    /* eslint-disable no-unused-vars */
    // prevent input.onChange to merge into `restInputProps`
    // `getInputProps` doesn't accept onChange handler

    const {
      input: { value, onChange: _, ...restInputProps },
      placeholder,
      searchOptions,
      width,
      disabled,
      meta: { touched, error },
    } = this.props

    return (
      <Form.Field error={touched && !!error} width={width} disabled={disabled}>
        <PlacesAutocomplete
          value={value}
          onChange={this.handleChange}
          searchOptions={searchOptions}
          onSelect={this.handleSelect}
        >
          {({
            getInputProps,
            getSuggestionItemProps,
            suggestions,
            loading,
          }) => (
            <>
              <input {...getInputProps({ ...restInputProps, placeholder })} />
              <div className="autocomplete-dropdown-container">
                <List>
                  {loading && <Loader active inline="centered" />}
                  {suggestions.map((suggestion, i) => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item'
                    // inline style for demonstration purpose
                    const baseStyle = {
                      cursor: 'pointer',
                      padding: '10px 8px',
                    }

                    const styleWithBg = suggestion.active
                      ? { ...baseStyle, backgroundColor: '#eaeaea' }
                      : { ...baseStyle, backgroundColor: '#ffffff' }
                    return (
                      <List.Item
                        key={i}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style: styleWithBg,
                        })}
                        as="a"
                      >
                        <List.Icon name="map marker alternate" />
                        <List.Content>{suggestion.description}</List.Content>
                      </List.Item>
                    )
                  })}
                </List>
              </div>
            </>
          )}
        </PlacesAutocomplete>
        {touched && !!error && <Message error content={error} />}
      </Form.Field>
    )
  }

  render() {
    const { isGoogleScriptsLoaded } = this.state

    return (
      <>
        {!isGoogleScriptsLoaded && (
          <Script
            url={`https://maps.googleapis.com/maps/api/js?key=${
              googleMapsSecrets.API_KEY
            }&libraries=places`}
            onLoad={this.handleScriptsLoaded}
            onError={e => console.log('Error loading script', e)}
          />
        )}
        {isGoogleScriptsLoaded && this.renderPlaces()}
      </>
    )
  }
}

PlaceInput.propTypes = {
  input: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
    PropTypes.object,
  ]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  searchOptions: PropTypes.object,
  onCoords: PropTypes.func,
  onSelect: PropTypes.func,
  onError: PropTypes.func,
  meta: PropTypes.object,
  disabled: PropTypes.bool,
}

PlaceInput.defaultProps = {}

export default PlaceInput
