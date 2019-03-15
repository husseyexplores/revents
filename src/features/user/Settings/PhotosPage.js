import React, { useState, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { toastr } from 'react-redux-toastr'
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import {
  Image,
  Segment,
  Header,
  Divider,
  Grid,
  Button,
  Card,
  Icon,
} from 'semantic-ui-react'

import Spinner from '../../../app/common/components/loaders/Spinner'

import { uploadProfileImage, deletePhoto, setMainPhoto } from '../userActions'

const baseStyle = {
  padding: 10,
  textAlign: 'center',
  cursor: 'pointer',
  borderWidth: 2,
  borderColor: '#333',
  borderStyle: 'dashed',
  borderRadius: 3,
}

const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#6c6',
  backgroundColor: '#eee',
}

const acceptStyle = {
  borderStyle: 'solid',
  borderColor: '#00e676',
}

const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#ff1744',
}

function PhotosPage({
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
  photos,
  profile,
  isLoading,
}) {
  const [file, setFile] = useState({})
  const [cropResult, setCropResult] = useState(null)
  const [image, setImage] = useState({})
  const cropperRef = useRef(null)

  function handleCrop() {
    if (typeof cropperRef.current.getCroppedCanvas === 'undefined') return

    cropperRef.current.getCroppedCanvas().toBlob(blob => {
      const imageUrl = URL.createObjectURL(blob)
      setCropResult(imageUrl)
      setImage(blob)
    }, 'image/jpeg')
  }

  function handleOnDrop(fileArr) {
    const file = fileArr[0]

    setFile({ ...file, preview: URL.createObjectURL(file) })
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop: handleOnDrop,
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragAccept, isDragActive, isDragReject]
  )

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(file.preview)
    },
    [file]
  )

  function cancelCrop() {
    setFile({})
    setImage({})
  }

  async function handleUploadImage() {
    try {
      await uploadProfileImage(image)
      cancelCrop()

      toastr.success('Success!', 'Photo has been uploaded')
    } catch (error) {
      toastr.error('Oops', error.message)
    }
  }

  function handlePhotoDelete(photo) {
    return async () => {
      try {
        await deletePhoto(photo)

        toastr.success('Success!', 'Photo has been deleted')
      } catch (error) {
        toastr.error('Oops', error.message)
      }
    }
  }

  function handleSetMainPhoto(photoUrl) {
    return async () => {
      try {
        await setMainPhoto(photoUrl)
        toastr.success('Success!', 'Profile photo has been updated')
      } catch (error) {
        toastr.error('Oops', error.message)
      }
    }
  }

  return (
    <Segment>
      <Header dividing size="large" content="Your Photos" />
      <Grid>
        {isLoading && <Spinner content="Loading..." size="big" dim />}
        <Grid.Row />
        <Grid.Column width={4}>
          <Header
            color="teal"
            sub
            content="Step 1 - Add Photo"
            style={{ marginBottom: 10 }}
          />

          <div {...getRootProps({ style })}>
            <Icon name="upload" size="huge" />
            <input {...getInputProps()} />
            <Header content="Drop image here or click to add" />
          </div>
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {file.preview && (
            <Cropper
              style={{ height: 200, width: '100%' }}
              ref={cropperRef}
              src={file.preview}
              aspectRatio={1}
              viewMode={0}
              dragMode="move"
              guides={false}
              scalable
              cropBoxMovable
              cropBoxResizable
              crop={handleCrop}
            />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview and Upload" />
          {file.preview && (
            <div>
              <Image
                style={{ minHeight: 200, minWidth: 200 }}
                src={cropResult}
              />
              <Button.Group>
                <Button
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={handleUploadImage}
                  style={{ width: 100 }}
                  positive
                  icon="check"
                />
                <Button
                  disabled={isLoading}
                  onClick={cancelCrop}
                  style={{ width: 100 }}
                  icon="close"
                />
              </Button.Group>
            </div>
          )}
        </Grid.Column>
      </Grid>

      <Divider />
      <Header sub color="teal" content="All Photos" />

      <Card.Group itemsPerRow={5}>
        <Card>
          <Image src={profile.photoURL || '/assets/user.png'} />
          <Button positive>Main Photo</Button>
        </Card>

        {Array.isArray(photos) &&
          photos.length > 0 &&
          photos
            .filter(photo => photo.url !== profile.photoURL)
            .map(photo => {
              return (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  <div className="ui two buttons">
                    <Button
                      onClick={handleSetMainPhoto(photo.url)}
                      basic
                      color="green"
                    >
                      Main
                    </Button>
                    <Button
                      onClick={handlePhotoDelete(photo)}
                      basic
                      icon="trash"
                      color="red"
                    />
                  </div>
                </Card>
              )
            })}
      </Card.Group>
    </Segment>
  )
}

PhotosPage.propTypes = {
  uploadProfileImage: PropTypes.func.isRequired,
  deletePhoto: PropTypes.func.isRequired,
  setMainPhoto: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  photos: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
}

function query({ auth }) {
  return [
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'photos' }],
      storeAs: 'photos',
    },
  ]
}

function mapState(state) {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos,
    isLoading: state.async.isLoading,
  }
}

const mapDispatch = {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
}

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  firestoreConnect(props => query(props))
)(PhotosPage)
